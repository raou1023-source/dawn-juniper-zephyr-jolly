import { CATALOG, type CatalogItem } from "./catalog";
import { safeHttpUrl, stripTags } from "@/lib/safe";
import {
  isFinanceTitle,
  isNoiseTitle,
  newsImpact,
  type NewsItem,
} from "./news";

const UA =
  "Mozilla/5.0 (compatible; KabuDesk/1.0; +https://grok.com) AppleWebKit/537.36";

type YahooSearchNews = {
  news?: Array<{
    uuid?: string;
    title?: string;
    publisher?: string;
    link?: string;
    providerPublishTime?: number;
    relatedTickers?: string[];
  }>;
};

const MARKET_TICKERS = ["^N225", "^GSPC", "USDJPY=X", "GC=F", "BTC-USD", "CL=F"];

const RELATED: Record<string, string[]> = {
  "0331118A": ["VT", "ACWI", "2631.T"],
  "03311187": ["SPY", "VOO", "^GSPC"],
  "0331818A": ["VEA", "EFA"],
  "0331418A": ["VWO", "EEM"],
  "03312187": ["^N225", "1321.T"],
  "4731118A": ["SPY", "VOO", "^GSPC"],
  "9I31117A": ["VTI", "ITOT"],
  "9C31116A": ["7203.T", "6758.T", "^N225"],
  VTSAX: ["VTI", "^GSPC"],
  FXAIX: ["SPY", "^GSPC"],
  SWPPX: ["SPY", "^GSPC"],
  "1306.T": ["^N225", "7203.T"],
  "1321.T": ["^N225"],
  "1655.T": ["SPY", "^GSPC"],
  "2558.T": ["SPY", "^GSPC"],
  "2631.T": ["VT", "ACWI"],
  "2510.T": ["^TNX", "TLT"],
  TLT: ["^TNX"],
  IEF: ["^TNX"],
  "GC=F": ["GLD", "SI=F"],
  "PL=F": ["GC=F", "PPLT"],
  "CL=F": ["BZ=F"],
  "USDJPY=X": ["EURJPY=X", "DX-Y.NYB"],
  "BTC-USD": ["ETH-USD", "BTC-JPY"],
};

export async function fetchNews(symbol?: string): Promise<NewsItem[]> {
  const focus = symbol ? resolveFocus(symbol) : null;
  const tickers = focus
    ? unique([focus.item.symbol, ...(RELATED[focus.item.symbol] ?? [])]).slice(0, 4)
    : MARKET_TICKERS;

  const jobs: Promise<NewsItem[]>[] = [
    ...tickers.map((t) => rssHeadlines(t).catch(() => [] as NewsItem[])),
    ...tickers.slice(0, 3).map((t) => searchNews(t).catch(() => [] as NewsItem[])),
  ];
  if (!symbol) {
    jobs.push(rssBusinessJp().catch(() => [] as NewsItem[]));
  } else if (focus) {
    const short = shortName(focus.item);
    if (short && short.length >= 2) {
      jobs.push(searchNews(`${short} 株`).catch(() => [] as NewsItem[]));
    }
  }

  const batches = await Promise.all(jobs);
  const map = new Map<string, NewsItem>();
  for (const row of batches.flat()) {
    if (!row.title || isNoiseTitle(row.title)) continue;
    const prev = map.get(row.id);
    if (!prev) map.set(row.id, row);
    else if (row.symbols.length > prev.symbols.length) map.set(row.id, row);
  }

  const names = focus
    ? [focus.item.name, ...(focus.item.aliases ?? []), shortName(focus.item)].filter(
        (n): n is string => Boolean(n),
      )
    : ["日経", "S&P", "ダウ", "Nasdaq", "株式", "市場", "決算"];
  const wanted = new Set(tickers.map((t) => t.toUpperCase()));
  if (focus) wanted.add(focus.item.symbol.toUpperCase());

  const scored = [...map.values()]
    .map((item) => ({ item, score: scoreNews(item, wanted, names, Boolean(symbol)) }))
    .filter((row) => row.score >= (symbol ? 4 : 3))
    .sort((a, b) => b.score - a.score || b.item.publishedAt - a.item.publishedAt)
    .map((row) => row.item);

  if (scored.length) return scored.slice(0, symbol ? 8 : 12);
  return sampleNews(symbol);
}

function resolveFocus(symbol: string) {
  const item = CATALOG.find((i) => i.symbol.toUpperCase() === symbol.toUpperCase());
  if (item) return { item };
  const fallback: CatalogItem = {
    symbol,
    name: symbol,
    kind: "overseas",
  };
  return { item: fallback };
}

function shortName(item: CatalogItem) {
  const alias = item.aliases?.[0];
  if (alias) return alias;
  return item.name
    .replace(/ホールディングス|グループ|フィナンシャル・グループ/g, "")
    .replace(/\(.*\)/g, "")
    .replace(/eMAXIS Slim|インデックス・ファンド|インデックスファンド/g, "")
    .trim()
    .split(/\s+/)[0];
}

async function searchNews(query: string): Promise<NewsItem[]> {
  const url =
    `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}` +
    `&quotesCount=0&newsCount=12&listsCount=0&enableFuzzyQuery=false`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`news ${res.status}`);
  const json = (await res.json()) as YahooSearchNews;
  const out: NewsItem[] = [];
  for (const row of json.news ?? []) {
    if (!row.title || !row.link) continue;
    const url = safeHttpUrl(row.link);
    if (!url) continue;
    out.push({
      id: row.uuid || url,
      title: cleanTitle(row.title),
      source: stripTags(row.publisher || "Yahoo Finance").slice(0, 40),
      url,
      publishedAt: (row.providerPublishTime ?? 0) * 1000 || Date.now(),
      symbols: (row.relatedTickers ?? []).map((s) => s.toUpperCase()),
      impact: newsImpact(row.title),
    });
  }
  return out;
}

async function rssHeadlines(symbol: string): Promise<NewsItem[]> {
  const url =
    `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}` +
    `&region=US&lang=en-US`;
  const xml = await fetchText(url);
  return parseRss(xml, "Yahoo Finance", [symbol]);
}

async function rssBusinessJp(): Promise<NewsItem[]> {
  const xml = await fetchText("https://news.yahoo.co.jp/rss/topics/business.xml");
  return parseRss(xml, "Yahoo!ニュース 経済", []).filter(
    (row) => isFinanceTitle(row.title) && !isNoiseTitle(row.title),
  );
}

async function fetchText(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`rss ${res.status}`);
  return res.text();
}

function parseRss(xml: string, source: string, symbols: string[]): NewsItem[] {
  const blocks = xml.split(/<item[\s>]/i).slice(1);
  const out: NewsItem[] = [];
  for (const block of blocks) {
    const title = cleanTitle(decode(tag(block, "title")));
    const link = safeHttpUrl(decode(tag(block, "link") || tag(block, "guid")));
    if (!title || !link) continue;
    const pub = tag(block, "pubDate");
    const publishedAt = pub ? Date.parse(pub) || Date.now() : Date.now();
    out.push({
      id: link,
      title: cleanTitle(title),
      source,
      url: link,
      publishedAt,
      symbols: symbols.map((s) => s.toUpperCase()),
      impact: newsImpact(title),
    });
  }
  return out;
}

function tag(block: string, name: string) {
  const match = block.match(new RegExp(`<${name}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${name}>`, "i"))
    ?? block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match?.[1]?.trim() ?? "";
}

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/'/g, "'")
    .trim();
}

function cleanTitle(title: string) {
  return stripTags(title).replace(/\s+/g, " ").trim().slice(0, 180);
}

function scoreNews(
  item: NewsItem,
  wanted: Set<string>,
  names: string[],
  focused: boolean,
) {
  let score = 0;
  const title = item.title;
  const titleLow = title.toLowerCase();
  if (item.symbols.some((s) => wanted.has(s.toUpperCase()))) score += 8;
  for (const name of names) {
    if (name.length >= 2 && titleLow.includes(name.toLowerCase())) score += 6;
  }
  for (const ticker of wanted) {
    const bare = ticker.replace(/\.[A-Z]+$/i, "").replace("^", "");
    if (bare.length >= 2 && new RegExp(`\\b${escapeRe(bare)}\\b`, "i").test(title)) score += 5;
  }
  if (isFinanceTitle(title)) score += 3;
  if (item.impact !== "none") score += 1;
  if (/Yahoo Finance|Reuters|Bloomberg|日経|CNBC|MarketWatch/i.test(item.source)) score += 1;
  const ageH = (Date.now() - item.publishedAt) / 3_600_000;
  if (ageH < 24) score += 2;
  else if (ageH > 14 * 24) score -= 4;
  if (isNoiseTitle(title)) score -= 12;
  if (focused && score < 4 && !isFinanceTitle(title)) score -= 3;
  return score;
}

function escapeRe(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function sampleNews(symbol?: string): NewsItem[] {
  const now = Date.now();
  const item = CATALOG.find((i) => i.symbol.toUpperCase() === (symbol ?? "").toUpperCase());
  const name = item?.name || symbol || "市場";
  return [
    {
      id: "s1",
      title: `${name}、取引時間中の値動きは限定的 材料待ち`,
      source: "KABU 通信",
      url: "https://finance.yahoo.com",
      publishedAt: now - 18 * 60_000,
      symbols: symbol ? [symbol] : ["^N225"],
      impact: "none",
    },
    {
      id: "s2",
      title: "米半導体株が急伸、AI向け需要の見通しが支えに",
      source: "KABU 通信",
      url: "https://finance.yahoo.com",
      publishedAt: now - 42 * 60_000,
      symbols: ["NVDA", "AVGO", "TSM"],
      impact: "up",
    },
    {
      id: "s3",
      title: "日経平均が急落、円高進行で輸出株が売られる",
      source: "KABU 通信",
      url: "https://finance.yahoo.co.jp",
      publishedAt: now - 70 * 60_000,
      symbols: ["^N225", "7203.T"],
      impact: "down",
    },
  ];
}
