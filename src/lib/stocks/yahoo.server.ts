import { sampleChart } from "./sample";
import { chartTimezone, classify, mergeHits, quoteAliases, searchCatalog } from "./catalog";
import { sanitizeCandles } from "./ohlc";
import { outbound } from "./outbound";
import type { Candle, ChartPayload, Fundamentals, QuoteMeta, SearchHit } from "./types";

const COOKIE_VAL = /^[\w.~+/=&%-]{1,512}$/;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const YAHOO_HOSTS = new Set([
  "query1.finance.yahoo.com",
  "query2.finance.yahoo.com",
  "finance.yahoo.com",
]);

async function yahooJson(url: string): Promise<unknown> {
  const res = await outbound(url, YAHOO_HOSTS, {
    headers: {
      "User-Agent": UA,
      Accept: "application/json",
    },
    timeout: 8000,
  });
  if (!res.ok) throw new Error(`yahoo ${res.status}`);
  return res.json();
}

type YahooChart = {
  chart?: {
    result?: Array<{
      meta?: {
        symbol?: string;
        shortName?: string;
        longName?: string;
        currency?: string;
        exchangeName?: string;
        regularMarketPrice?: number;
        previousClose?: number;
        chartPreviousClose?: number;
        fiftyTwoWeekHigh?: number;
        fiftyTwoWeekLow?: number;
        exchangeTimezoneName?: string;
        gmtoffset?: number;
      };
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open?: Array<number | null>;
          high?: Array<number | null>;
          low?: Array<number | null>;
          close?: Array<number | null>;
          volume?: Array<number | null>;
        }>;
      };
    }>;
    error?: { description?: string } | null;
  };
};

const chartCache = new Map<string, ChartPayload>();
const quoteCache = new Map<string, QuoteMeta>();

export async function fetchYahooChart(
  symbol: string,
  range: string,
  interval: string,
): Promise<ChartPayload> {
  const key = `${symbol}|${range}|${interval}`;
  const candidates = fundAliases(symbol);
  for (const code of candidates) {
    for (const [rng, iv] of chartPlans(range, interval)) {
      const hit = await fetchYahooChartOnce(code, rng, iv);
      if (!hit) continue;
      const candles = clipToRange(hit.candles, range);
      if (candles.length < 2) continue;
      const payload = { ...hit, candles };
      chartCache.set(key, payload);
      return payload;
    }
  }
  const alt = await import("./alt.server").then((m) => m.fetchAltChart(symbol, range)).catch(() => null);
  return alt ?? chartCache.get(key) ?? sampleChart(symbol, symbol, range, interval);
}

function chartPlans(range: string, interval: string): Array<[string, string]> {
  const plans: Array<[string, string]> = [
    [range, interval],
    ["5d", "5m"],
    ["5d", "15m"],
    ["1mo", "1d"],
    ["3mo", "1d"],
    ["1y", "1d"],
  ];
  const seen = new Set<string>();
  const out: Array<[string, string]> = [];
  for (const pair of plans) {
    const id = pair.join("|");
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(pair);
  }
  return out;
}

function clipToRange(candles: Candle[], range: string) {
  if (range !== "1d" || candles.length < 4) return candles;
  const cut = candles[candles.length - 1]!.time - 36 * 3600;
  const sliced = candles.filter((c) => c.time >= cut);
  return sliced.length >= 2 ? sliced : candles;
}

function fundAliases(symbol: string): string[] {
  return quoteAliases(symbol);
}

function isRoundClock(symbol: string) {
  return /(=X|=F|-USD|-JPY|-EUR)$/i.test(symbol) || symbol.startsWith("^");
}

function shouldPaintLive(last: Candle, candles: Candle[], price: number) {
  const prev = candles.length >= 2 ? candles[candles.length - 2]!.time : last.time;
  const barSec = Math.max(60, last.time - prev);
  const ageSec = Date.now() / 1000 - last.time;
  if (barSec < 3 * 3600 && ageSec > 3 * 3600) return false;
  if (barSec >= 3 * 3600 && ageSec > 4 * 86400) return false;
  const drift = Math.abs(price - last.close) / Math.max(Math.abs(last.close), 1e-9);
  const cap = last.close < 5 ? 0.2 : last.close < 50 ? 0.12 : 0.06;
  return drift <= cap;
}

async function fetchYahooChartOnce(
  symbol: string,
  range: string,
  interval: string,
): Promise<ChartPayload | null> {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}` +
    `&includePrePost=true&events=div%2Csplit`;

  try {
    const json = (await yahooJson(url)) as YahooChart;
    const result = json.chart?.result?.[0];
    if (!result?.timestamp?.length) throw new Error("empty");
    const quote = result.indicators?.quote?.[0];
    if (!quote) throw new Error("no quote");

    const candles: Candle[] = [];
    for (let i = 0; i < result.timestamp.length; i++) {
      const open = quote.open?.[i];
      const high = quote.high?.[i];
      const low = quote.low?.[i];
      const close = quote.close?.[i];
      const volume = quote.volume?.[i] ?? 0;
      if (
        open == null ||
        high == null ||
        low == null ||
        close == null ||
        !Number.isFinite(open) ||
        !Number.isFinite(close)
      ) {
        continue;
      }
      candles.push({
        time: result.timestamp[i]!,
        open,
        high,
        low,
        close,
        volume: volume ?? 0,
      });
    }
    if (candles.length < 2) throw new Error("sparse");
    const fixed = sanitizeCandles(candles);
    if (fixed.length < 2) throw new Error("sparse");
    candles.length = 0;
    candles.push(...fixed);

    const last = candles[candles.length - 1]!;
    const metaRaw = result.meta ?? {};
    const price = metaRaw.regularMarketPrice ?? last.close;
    const previousClose =
      metaRaw.previousClose ?? metaRaw.chartPreviousClose ?? candles[0]!.close;
    const change = price - previousClose;
    if (Number.isFinite(price) && shouldPaintLive(last, candles, price)) {
      last.close = price;
      last.high = Math.max(last.high, price);
      last.low = Math.min(last.low, price);
    }
    const meta: QuoteMeta = {
      symbol,
      name: metaRaw.shortName || metaRaw.longName || symbol,
      currency: metaRaw.currency ?? "USD",
      exchange: metaRaw.exchangeName ?? "",
      price: Number.isFinite(price) ? price : last.close,
      previousClose,
      change,
      changePercent: previousClose ? (change / previousClose) * 100 : 0,
      dayHigh: last.high,
      dayLow: last.low,
      volume: last.volume,
      week52High: metaRaw.fiftyTwoWeekHigh,
      week52Low: metaRaw.fiftyTwoWeekLow,
      timezone: chartTimezone(symbol, metaRaw.exchangeName),
      source: "live",
    };
    return { meta, candles, source: "live" };
  } catch {
    return null;
  }
}

function isSupportedType(type?: string) {
  if (!type) return true;
  const t = type.toLowerCase();
  if (/(option|warrant)/.test(t)) return false;
  return true;
}

type YahooSearch = {
  quotes?: Array<{
    symbol?: string;
    shortname?: string;
    longname?: string;
    exchDisp?: string;
    exchange?: string;
    quoteType?: string;
    typeDisp?: string;
  }>;
};

export async function searchYahoo(query: string): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];
  const url =
    `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}` +
    `&quotesCount=20&newsCount=0&listsCount=0`;
  try {
    const json = (await yahooJson(url)) as YahooSearch;
    const hits: SearchHit[] = [];
    for (const row of json.quotes ?? []) {
      if (!row.symbol) continue;
      const type = row.typeDisp || row.quoteType;
      if (!isSupportedType(type)) continue;
      hits.push({
        symbol: row.symbol,
        name: row.shortname || row.longname || row.symbol,
        exchange: row.exchDisp || row.exchange,
        type,
        kind: classify(row.symbol, type, row.exchDisp || row.exchange),
      });
    }
    return mergeHits(hits, searchCatalog(q), q);
  } catch {
    return localSearch(q);
  }
}

type SparkResponse = {
  spark?: {
    result?: Array<{
      symbol?: string;
      response?: Array<{
        meta?: {
          symbol?: string;
          shortName?: string;
          longName?: string;
          currency?: string;
          exchangeName?: string;
          regularMarketPrice?: number;
          regularMarketChangePercent?: number;
          chartPreviousClose?: number;
          previousClose?: number;
          regularMarketDayHigh?: number;
          regularMarketDayLow?: number;
          regularMarketVolume?: number;
          fiftyTwoWeekHigh?: number;
          fiftyTwoWeekLow?: number;
          fulldayChange?: number;
        };
      }>;
    }>;
  };
};

export async function fetchYahooQuotes(symbols: string[]): Promise<QuoteMeta[]> {
  const unique = [...new Set(symbols.map((s) => s.trim()).filter(Boolean))].slice(0, 80);
  if (unique.length === 0) return [];

  const mapped = new Map<string, QuoteMeta>();
  const chunks: string[][] = [];
  for (let i = 0; i < unique.length; i += 15) chunks.push(unique.slice(i, i + 15));

  await Promise.all(
    chunks.map(async (chunk) => {
      const expanded = [...new Set(chunk.flatMap(quoteAliases))];
      const clock = chunk.some(isRoundClock);
      const url =
        "https://query1.finance.yahoo.com/v7/finance/spark?" +
        (clock ? "range=1d&interval=1m&symbols=" : "range=1d&interval=1d&symbols=") +
        expanded.map(encodeURIComponent).join(",");
      try {
        const json = (await yahooJson(url)) as SparkResponse;
        for (const row of json.spark?.result ?? []) {
          const meta = row.response?.[0]?.meta;
          const price = meta?.regularMarketPrice;
          const symbol = meta?.symbol || row.symbol;
          if (!symbol || price == null || !Number.isFinite(price)) continue;
          const previousClose = meta?.previousClose ?? meta?.chartPreviousClose ?? price;
          const change = meta?.fulldayChange ?? price - previousClose;
          const quote: QuoteMeta = {
            symbol,
            name: meta?.shortName || meta?.longName || symbol,
            currency: meta?.currency ?? "USD",
            exchange: meta?.exchangeName ?? "",
            price,
            previousClose,
            change,
            changePercent:
              meta?.regularMarketChangePercent ??
              (previousClose ? (change / previousClose) * 100 : 0),
            dayHigh: meta?.regularMarketDayHigh,
            dayLow: meta?.regularMarketDayLow,
            volume: meta?.regularMarketVolume,
            week52High: meta?.fiftyTwoWeekHigh,
            week52Low: meta?.fiftyTwoWeekLow,
            timezone: chartTimezone(symbol, meta?.exchangeName),
            source: "live",
          };
          mapped.set(symbol.toUpperCase(), quote);
          quoteCache.set(symbol.toUpperCase(), quote);
          for (const alias of quoteAliases(symbol)) {
            mapped.set(alias, quote);
            quoteCache.set(alias, quote);
          }
        }
      } catch {
        /* next chunk / cache */
      }
    }),
  );

  const missing = unique.filter((symbol) => {
    return !quoteAliases(symbol).some((code) => mapped.has(code) || quoteCache.has(code));
  });
  if (missing.length) {
    try {
      const { fetchAltQuotes } = await import("./alt.server");
      const extra = await fetchAltQuotes(missing);
      for (const quote of extra) {
        mapped.set(quote.symbol.toUpperCase(), quote);
        quoteCache.set(quote.symbol.toUpperCase(), quote);
        for (const alias of quoteAliases(quote.symbol)) {
          mapped.set(alias, quote);
          quoteCache.set(alias, quote);
        }
      }
    } catch {
      /* keep yahoo-only */
    }
  }

  return unique
    .map((symbol) => {
      for (const code of quoteAliases(symbol)) {
        const hit = mapped.get(code.toUpperCase()) ?? quoteCache.get(code.toUpperCase());
        if (hit) return { ...hit, symbol };
      }
      return undefined;
    })
    .filter((row): row is QuoteMeta => Boolean(row));
}

export function localSearch(query: string): SearchHit[] {
  return searchCatalog(query);
}

type RawStat = { raw?: number };

type QuoteSummary = {
  quoteSummary?: {
    result?: Array<{
      defaultKeyStatistics?: {
        trailingPE?: RawStat;
        priceToBook?: RawStat;
        trailingEps?: RawStat;
      };
      summaryDetail?: {
        trailingPE?: RawStat;
        priceToBook?: RawStat;
        dividendRate?: RawStat;
        dividendYield?: RawStat;
        trailingAnnualDividendRate?: RawStat;
        trailingAnnualDividendYield?: RawStat;
        payoutRatio?: RawStat;
        marketCap?: RawStat;
        fiftyTwoWeekHigh?: RawStat;
        fiftyTwoWeekLow?: RawStat;
      };
      financialData?: {
        returnOnEquity?: RawStat;
      };
    }>;
  };
};

const fundCache = new Map<string, { at: number; data: import("./types").Fundamentals }>();

type YahooSession = { cookie: string; crumb: string; at: number };
let session: YahooSession | null = null;

function cookieFrom(res: Response, prev = "") {
  const keep = new Set(["A1", "A3", "A1S", "GUC"]);
  const jar = new Map<string, string>();
  for (const part of prev.split(";").map((s) => s.trim()).filter(Boolean)) {
    const i = part.indexOf("=");
    if (i > 0) {
      const k = part.slice(0, i);
      const v = part.slice(i + 1);
      if (keep.has(k) && COOKIE_VAL.test(v)) jar.set(k, v);
    }
  }
  const raw =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : res.headers.get("set-cookie")
        ? [res.headers.get("set-cookie")!]
        : [];
  for (const line of raw) {
    const pair = line.split(";")[0] ?? "";
    if (/[\r\n]/.test(pair)) continue;
    const i = pair.indexOf("=");
    if (i <= 0) continue;
    const k = pair.slice(0, i);
    if (!keep.has(k) || !COOKIE_VAL.test(pair.slice(i + 1))) continue;
    jar.set(k, pair.slice(i + 1));
  }
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

const SESSION_HOSTS = new Set(["fc.yahoo.com", "query1.finance.yahoo.com", "query2.finance.yahoo.com"]);

async function yahooSession(): Promise<YahooSession> {
  if (session && Date.now() - session.at < 25 * 60_000) return session;
  let cookie = "";
  try {
    const boot = await outbound("https://fc.yahoo.com/", SESSION_HOSTS, {
      headers: { "User-Agent": UA, Accept: "*/*" },
      timeout: 8000,
      redirect: "manual",
    });
    cookie = cookieFrom(boot);
  } catch {
    /* crumb may still work */
  }
  const crumbRes = await outbound("https://query1.finance.yahoo.com/v1/test/getcrumb", SESSION_HOSTS, {
    headers: {
      "User-Agent": UA,
      Accept: "text/plain",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    timeout: 8000,
  });
  cookie = cookieFrom(crumbRes, cookie);
  const crumb = (await crumbRes.text()).trim();
  if (!crumb || crumb.startsWith("{") || crumb.length > 80 || /too many/i.test(crumb)) {
    throw new Error("crumb");
  }
  session = { cookie, crumb, at: Date.now() };
  return session;
}

async function yahooAuthedJson(pathAndQuery: string): Promise<unknown> {
  if (!pathAndQuery.startsWith("/v10/finance/quoteSummary/")) {
    throw new Error("blocked");
  }
  const auth = await yahooSession();
  const url = new URL("https://query1.finance.yahoo.com" + pathAndQuery);
  if (url.hostname !== "query1.finance.yahoo.com") throw new Error("blocked");
  if (url.username || url.password) throw new Error("blocked");
  if (!url.pathname.startsWith("/v10/finance/quoteSummary/")) throw new Error("blocked");
  url.searchParams.set("crumb", auth.crumb);
  const res = await outbound(url.href, YAHOO_HOSTS, {
    headers: {
      "User-Agent": UA,
      Accept: "application/json",
      Cookie: auth.cookie,
    },
    timeout: 10000,
  });
  if (res.status === 401) {
    session = null;
    throw new Error("yahoo 401");
  }
  if (!res.ok) throw new Error(`yahoo ${res.status}`);
  return res.json();
}

function num(stat?: RawStat) {
  const n = stat?.raw;
  return typeof n === "number" && Number.isFinite(n) ? n : undefined;
}

export async function fetchFundamentals(symbol: string) {
  const key = symbol.toUpperCase();
  const hit = fundCache.get(key);
  if (hit && Date.now() - hit.at < 15 * 60_000) return hit.data;
  const quote = quoteCache.get(key);
  const chart = [...chartCache.values()].find((c) => c.meta.symbol.toUpperCase() === key);
  const fallback: Fundamentals = {
    symbol,
    week52High: quote?.week52High ?? chart?.meta.week52High,
    week52Low: quote?.week52Low ?? chart?.meta.week52Low,
  };
  try {
    const json = (await yahooAuthedJson(
      `/v10/finance/quoteSummary/${encodeURIComponent(symbol)}` +
        `?modules=defaultKeyStatistics,summaryDetail,financialData`,
    )) as QuoteSummary;
    const row = json.quoteSummary?.result?.[0];
    const ks = row?.defaultKeyStatistics;
    const sd = row?.summaryDetail;
    const fd = row?.financialData;
    const data = {
      symbol,
      per: num(ks?.trailingPE) ?? num(sd?.trailingPE),
      pbr: num(ks?.priceToBook) ?? num(sd?.priceToBook),
      eps: num(ks?.trailingEps),
      dividendRate: num(sd?.trailingAnnualDividendRate) ?? num(sd?.dividendRate),
      dividendYield: num(sd?.trailingAnnualDividendYield) ?? num(sd?.dividendYield),
      payout: num(sd?.payoutRatio),
      marketCap: num(sd?.marketCap),
      roe: num(fd?.returnOnEquity),
      week52High: num(sd?.fiftyTwoWeekHigh) ?? fallback.week52High,
      week52Low: num(sd?.fiftyTwoWeekLow) ?? fallback.week52Low,
    };
    fundCache.set(key, { at: Date.now(), data });
    return data;
  } catch {
    fundCache.set(key, { at: Date.now(), data: fallback });
    return fallback;
  }
}



