import { i as stripTags, n as safeHttpUrl } from "./safe-BMATx3RK.mjs";
import { t as CATALOG } from "./catalog-V-Nx7IgK.mjs";
import { i as newsImpact, n as isFinanceTitle, r as isNoiseTitle } from "./news-o1u9YgPd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/news.server-CbGMgYBY.js
var UA = "Mozilla/5.0 (compatible; KabuDesk/1.0; +https://grok.com) AppleWebKit/537.36";
var MARKET_TICKERS = [
	"^N225",
	"^GSPC",
	"USDJPY=X",
	"GC=F",
	"BTC-USD",
	"CL=F"
];
var RELATED = {
	"0331118A": [
		"VT",
		"ACWI",
		"2631.T"
	],
	"03311187": [
		"SPY",
		"VOO",
		"^GSPC"
	],
	"0331818A": ["VEA", "EFA"],
	"0331418A": ["VWO", "EEM"],
	"03312187": ["^N225", "1321.T"],
	"4731118A": [
		"SPY",
		"VOO",
		"^GSPC"
	],
	"9I31117A": ["VTI", "ITOT"],
	"9C31116A": [
		"7203.T",
		"6758.T",
		"^N225"
	],
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
	"BTC-USD": ["ETH-USD", "BTC-JPY"]
};
async function fetchNews(symbol) {
	const focus = symbol ? resolveFocus(symbol) : null;
	const tickers = focus ? unique([focus.item.symbol, ...RELATED[focus.item.symbol] ?? []]).slice(0, 4) : MARKET_TICKERS;
	const jobs = [...tickers.map((t) => rssHeadlines(t).catch(() => [])), ...tickers.slice(0, 3).map((t) => searchNews(t).catch(() => []))];
	if (!symbol) jobs.push(rssBusinessJp().catch(() => []));
	else if (focus) {
		const short = shortName(focus.item);
		if (short && short.length >= 2) jobs.push(searchNews(`${short} 株`).catch(() => []));
	}
	const batches = await Promise.all(jobs);
	const map = /* @__PURE__ */ new Map();
	for (const row of batches.flat()) {
		if (!row.title || isNoiseTitle(row.title)) continue;
		const prev = map.get(row.id);
		if (!prev) map.set(row.id, row);
		else if (row.symbols.length > prev.symbols.length) map.set(row.id, row);
	}
	const names = focus ? [
		focus.item.name,
		...focus.item.aliases ?? [],
		shortName(focus.item)
	].filter((n) => Boolean(n)) : [
		"日経",
		"S&P",
		"ダウ",
		"Nasdaq",
		"株式",
		"市場",
		"決算"
	];
	const wanted = new Set(tickers.map((t) => t.toUpperCase()));
	if (focus) wanted.add(focus.item.symbol.toUpperCase());
	const scored = [...map.values()].map((item) => ({
		item,
		score: scoreNews(item, wanted, names, Boolean(symbol))
	})).filter((row) => row.score >= (symbol ? 4 : 3)).sort((a, b) => b.score - a.score || b.item.publishedAt - a.item.publishedAt).map((row) => row.item);
	if (scored.length) return scored.slice(0, symbol ? 8 : 12);
	return sampleNews(symbol);
}
function resolveFocus(symbol) {
	const item = CATALOG.find((i) => i.symbol.toUpperCase() === symbol.toUpperCase());
	if (item) return { item };
	return { item: {
		symbol,
		name: symbol,
		kind: "overseas"
	} };
}
function shortName(item) {
	const alias = item.aliases?.[0];
	if (alias) return alias;
	return item.name.replace(/ホールディングス|グループ|フィナンシャル・グループ/g, "").replace(/\(.*\)/g, "").replace(/eMAXIS Slim|インデックス・ファンド|インデックスファンド/g, "").trim().split(/\s+/)[0];
}
async function searchNews(query) {
	const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=0&newsCount=12&listsCount=0&enableFuzzyQuery=false`;
	const res = await fetch(url, {
		headers: {
			"User-Agent": UA,
			Accept: "application/json"
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) throw new Error(`news ${res.status}`);
	const json = await res.json();
	const out = [];
	for (const row of json.news ?? []) {
		if (!row.title || !row.link) continue;
		const url = safeHttpUrl(row.link);
		if (!url) continue;
		out.push({
			id: row.uuid || url,
			title: cleanTitle(row.title),
			source: stripTags(row.publisher || "Yahoo Finance").slice(0, 40),
			url,
			publishedAt: (row.providerPublishTime ?? 0) * 1e3 || Date.now(),
			symbols: (row.relatedTickers ?? []).map((s) => s.toUpperCase()),
			impact: newsImpact(row.title)
		});
	}
	return out;
}
async function rssHeadlines(symbol) {
	return parseRss(await fetchText(`https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}&region=US&lang=en-US`), "Yahoo Finance", [symbol]);
}
async function rssBusinessJp() {
	return parseRss(await fetchText("https://news.yahoo.co.jp/rss/topics/business.xml"), "Yahoo!ニュース 経済", []).filter((row) => isFinanceTitle(row.title) && !isNoiseTitle(row.title));
}
async function fetchText(url) {
	const res = await fetch(url, {
		headers: {
			"User-Agent": UA,
			Accept: "application/rss+xml, application/xml, text/xml"
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) throw new Error(`rss ${res.status}`);
	return res.text();
}
function parseRss(xml, source, symbols) {
	const blocks = xml.split(/<item[\s>]/i).slice(1);
	const out = [];
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
			impact: newsImpact(title)
		});
	}
	return out;
}
function tag(block, name) {
	return (block.match(new RegExp(`<${name}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${name}>`, "i")) ?? block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i")))?.[1]?.trim() ?? "";
}
function decode(value) {
	return value.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/&#39;/g, "'").replace(/'/g, "'").trim();
}
function cleanTitle(title) {
	return stripTags(title).replace(/\s+/g, " ").trim().slice(0, 180);
}
function scoreNews(item, wanted, names, focused) {
	let score = 0;
	const title = item.title;
	const titleLow = title.toLowerCase();
	if (item.symbols.some((s) => wanted.has(s.toUpperCase()))) score += 8;
	for (const name of names) if (name.length >= 2 && titleLow.includes(name.toLowerCase())) score += 6;
	for (const ticker of wanted) {
		const bare = ticker.replace(/\.[A-Z]+$/i, "").replace("^", "");
		if (bare.length >= 2 && new RegExp(`\\b${escapeRe(bare)}\\b`, "i").test(title)) score += 5;
	}
	if (isFinanceTitle(title)) score += 3;
	if (item.impact !== "none") score += 1;
	if (/Yahoo Finance|Reuters|Bloomberg|日経|CNBC|MarketWatch/i.test(item.source)) score += 1;
	const ageH = (Date.now() - item.publishedAt) / 36e5;
	if (ageH < 24) score += 2;
	else if (ageH > 336) score -= 4;
	if (isNoiseTitle(title)) score -= 12;
	if (focused && score < 4 && !isFinanceTitle(title)) score -= 3;
	return score;
}
function escapeRe(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function unique(values) {
	return [...new Set(values.filter(Boolean))];
}
function sampleNews(symbol) {
	const now = Date.now();
	return [
		{
			id: "s1",
			title: `${CATALOG.find((i) => i.symbol.toUpperCase() === (symbol ?? "").toUpperCase())?.name || symbol || "市場"}、取引時間中の値動きは限定的 材料待ち`,
			source: "KABU 通信",
			url: "https://finance.yahoo.com",
			publishedAt: now - 108e4,
			symbols: symbol ? [symbol] : ["^N225"],
			impact: "none"
		},
		{
			id: "s2",
			title: "米半導体株が急伸、AI向け需要の見通しが支えに",
			source: "KABU 通信",
			url: "https://finance.yahoo.com",
			publishedAt: now - 252e4,
			symbols: [
				"NVDA",
				"AVGO",
				"TSM"
			],
			impact: "up"
		},
		{
			id: "s3",
			title: "日経平均が急落、円高進行で輸出株が売られる",
			source: "KABU 通信",
			url: "https://finance.yahoo.co.jp",
			publishedAt: now - 42e5,
			symbols: ["^N225", "7203.T"],
			impact: "down"
		}
	];
}
//#endregion
export { fetchNews };
