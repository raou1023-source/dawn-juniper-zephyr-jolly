import { a as mergeHits, c as searchCatalog, n as classify } from "./catalog-V-Nx7IgK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/yahoo.server-BYXyj9Ei.js
function hash(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function mulberry32(seed) {
	let a = seed || 1;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
var BASES = {
	"7203.T": 3117,
	"6758.T": 4300,
	"9984.T": 15e3,
	"7974.T": 12800,
	"8306.T": 1650,
	"6501.T": 3650,
	AAPL: 228,
	NVDA: 132,
	MSFT: 428,
	GOOGL: 168,
	AMZN: 198,
	META: 572,
	TSLA: 248,
	"^N225": 38600,
	"^GSPC": 5600,
	VOO: 512,
	QQQ: 478,
	SPY: 560,
	"1655.T": 3500,
	"0331118A": 26800,
	"0700.HK": 380,
	"ASML.AS": 820,
	"GC=F": 2650,
	"SI=F": 31,
	"PL=F": 980,
	"CL=F": 78,
	"BZ=F": 82,
	"NG=F": 3.2,
	"USDJPY=X": 148.2,
	"EURUSD=X": 1.08,
	"BTC-USD": 64e3,
	"ETH-USD": 3400,
	"^TNX": 4.2,
	TLT: 92,
	"2510.T": 98e3
};
function barsFor(interval, range) {
	if (interval === "1m") return {
		count: 120,
		step: 60
	};
	if (interval === "5m") return {
		count: range === "5d" ? 160 : 78,
		step: 300
	};
	if (interval === "15m") return {
		count: 130,
		step: 900
	};
	if (interval === "1d") {
		if (range === "1mo") return {
			count: 22,
			step: 86400
		};
		if (range === "3mo") return {
			count: 66,
			step: 86400
		};
		if (range === "6mo") return {
			count: 130,
			step: 86400
		};
		return {
			count: 252,
			step: 86400
		};
	}
	if (interval === "1wk") return {
		count: 260,
		step: 604800
	};
	return {
		count: 180,
		step: 2592e3
	};
}
function sampleChart(symbol, name, range, interval) {
	const rnd = mulberry32(hash(symbol + ":" + range + ":" + interval));
	const { count, step } = barsFor(interval, range);
	let price = (BASES[symbol] ?? 80 + hash(symbol) % 900) * (.82 + rnd() * .2);
	const start = Math.floor(Date.now() / 1e3) - count * step;
	const candles = [];
	for (let i = 0; i < count; i++) {
		const drift = (rnd() - .48) * price * .018;
		const shock = rnd() < .04 ? (rnd() - .5) * price * .06 : 0;
		const open = price;
		const close = Math.max(.5, open + drift + shock);
		const hi = Math.max(open, close) * (1 + rnd() * .012);
		const lo = Math.min(open, close) * (1 - rnd() * .012);
		const volume = Math.floor((.4 + rnd()) * 12e5 * (1 + Math.abs(close - open) / open));
		candles.push({
			time: start + i * step,
			open: round(open),
			high: round(hi),
			low: round(lo),
			close: round(close),
			volume
		});
		price = close;
	}
	const last = candles[candles.length - 1];
	const prev = candles[candles.length - 2] ?? last;
	applyDrift(last, symbol);
	const change = last.close - prev.close;
	return {
		meta: {
			symbol,
			name,
			currency: guessCurrency(symbol),
			exchange: symbol.endsWith(".T") ? "TYO" : "NMS",
			price: last.close,
			previousClose: prev.close,
			change,
			changePercent: prev.close ? change / prev.close * 100 : 0,
			dayHigh: last.high,
			dayLow: last.low,
			volume: last.volume,
			source: "sample"
		},
		candles,
		source: "sample"
	};
}
function round(n) {
	return Math.round(n * 100) / 100;
}
function applyDrift(candle, symbol) {
	const t = Math.floor(Date.now() / 1e3);
	const phase = hash(symbol) % 360 / 57.3;
	const drift = Math.sin(t / 9 + phase) * candle.close * .0024;
	const close = Math.max(.5, candle.close + drift);
	candle.close = round(close);
	candle.high = round(Math.max(candle.high, close));
	candle.low = round(Math.min(candle.low, close));
}
function guessCurrency(symbol) {
	const s = symbol.toUpperCase();
	if (s.endsWith(".T") || s === "^N225" || /^[0-9A-Z]{8}$/.test(s)) return "JPY";
	if (s.endsWith(".HK")) return "HKD";
	if (s.endsWith(".KS")) return "KRW";
	if (s.endsWith(".TW")) return "TWD";
	if (s.endsWith(".L")) return "GBP";
	if (s.endsWith(".PA") || s.endsWith(".AS") || s.endsWith(".DE")) return "EUR";
	if (s.endsWith(".SW")) return "CHF";
	if (s.endsWith(".AX")) return "AUD";
	if (s.endsWith(".NS") || s.endsWith(".BO")) return "INR";
	return "USD";
}
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
async function yahooJson(url) {
	const res = await fetch(url, {
		headers: {
			"User-Agent": UA,
			Accept: "application/json"
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) throw new Error(`yahoo ${res.status}`);
	return res.json();
}
var chartCache = /* @__PURE__ */ new Map();
var quoteCache = /* @__PURE__ */ new Map();
async function fetchYahooChart(symbol, range, interval) {
	const key = `${symbol}|${range}|${interval}`;
	const candidates = fundAliases(symbol);
	for (const code of candidates) {
		const hit = await fetchYahooChartOnce(code, range, interval);
		if (hit) {
			chartCache.set(key, hit);
			return hit;
		}
	}
	return chartCache.get(key) ?? sampleChart(symbol, symbol, range, interval);
}
function fundAliases(symbol) {
	const out = [symbol];
	if (/^[0-9A-Za-z]{8}$/.test(symbol)) out.push(`${symbol}.F`, `${symbol}.T`);
	return [...new Set(out)];
}
async function fetchYahooChartOnce(symbol, range, interval) {
	const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}&includePrePost=false&events=div%2Csplit`;
	try {
		const result = (await yahooJson(url)).chart?.result?.[0];
		if (!result?.timestamp?.length) throw new Error("empty");
		const quote = result.indicators?.quote?.[0];
		if (!quote) throw new Error("no quote");
		const candles = [];
		for (let i = 0; i < result.timestamp.length; i++) {
			const open = quote.open?.[i];
			const high = quote.high?.[i];
			const low = quote.low?.[i];
			const close = quote.close?.[i];
			const volume = quote.volume?.[i] ?? 0;
			if (open == null || high == null || low == null || close == null || !Number.isFinite(open) || !Number.isFinite(close)) continue;
			candles.push({
				time: result.timestamp[i],
				open,
				high,
				low,
				close,
				volume: volume ?? 0
			});
		}
		if (candles.length < 2) throw new Error("sparse");
		const last = candles[candles.length - 1];
		const metaRaw = result.meta ?? {};
		const price = metaRaw.regularMarketPrice ?? last.close;
		const previousClose = metaRaw.previousClose ?? metaRaw.chartPreviousClose ?? candles[0].close;
		const change = price - previousClose;
		if (Number.isFinite(price)) {
			last.close = price;
			last.high = Math.max(last.high, price);
			last.low = Math.min(last.low, price);
		}
		return {
			meta: {
				symbol: metaRaw.symbol ?? symbol,
				name: metaRaw.shortName || metaRaw.longName || symbol,
				currency: metaRaw.currency ?? "USD",
				exchange: metaRaw.exchangeName ?? "",
				price,
				previousClose,
				change,
				changePercent: previousClose ? change / previousClose * 100 : 0,
				dayHigh: last.high,
				dayLow: last.low,
				volume: last.volume,
				week52High: metaRaw.fiftyTwoWeekHigh,
				week52Low: metaRaw.fiftyTwoWeekLow,
				source: "live"
			},
			candles,
			source: "live"
		};
	} catch {
		return null;
	}
}
function isSupportedType(type) {
	if (!type) return true;
	const t = type.toLowerCase();
	if (/(option|warrant)/.test(t)) return false;
	return true;
}
async function searchYahoo(query) {
	const q = query.trim();
	if (!q) return [];
	const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=20&newsCount=0&listsCount=0`;
	try {
		const json = await yahooJson(url);
		const hits = [];
		for (const row of json.quotes ?? []) {
			if (!row.symbol) continue;
			const type = row.typeDisp || row.quoteType;
			if (!isSupportedType(type)) continue;
			hits.push({
				symbol: row.symbol,
				name: row.shortname || row.longname || row.symbol,
				exchange: row.exchDisp || row.exchange,
				type,
				kind: classify(row.symbol, type, row.exchDisp || row.exchange)
			});
		}
		return mergeHits(hits, searchCatalog(q));
	} catch {
		return localSearch(q);
	}
}
async function fetchYahooQuotes(symbols) {
	const unique = [...new Set(symbols.map((s) => s.trim()).filter(Boolean))].slice(0, 80);
	if (unique.length === 0) return [];
	const mapped = /* @__PURE__ */ new Map();
	const chunks = [];
	for (let i = 0; i < unique.length; i += 15) chunks.push(unique.slice(i, i + 15));
	await Promise.all(chunks.map(async (chunk) => {
		const url = "https://query1.finance.yahoo.com/v7/finance/spark?range=1d&interval=1d&symbols=" + [...new Set(chunk.flatMap(fundAliases))].map(encodeURIComponent).join(",");
		try {
			const json = await yahooJson(url);
			for (const row of json.spark?.result ?? []) {
				const meta = row.response?.[0]?.meta;
				const price = meta?.regularMarketPrice;
				const symbol = meta?.symbol || row.symbol;
				if (!symbol || price == null || !Number.isFinite(price)) continue;
				const previousClose = meta?.previousClose ?? meta?.chartPreviousClose ?? price;
				const change = meta?.fulldayChange ?? price - previousClose;
				const quote = {
					symbol,
					name: meta?.shortName || meta?.longName || symbol,
					currency: meta?.currency ?? "USD",
					exchange: meta?.exchangeName ?? "",
					price,
					previousClose,
					change,
					changePercent: meta?.regularMarketChangePercent ?? (previousClose ? change / previousClose * 100 : 0),
					dayHigh: meta?.regularMarketDayHigh,
					dayLow: meta?.regularMarketDayLow,
					volume: meta?.regularMarketVolume,
					week52High: meta?.fiftyTwoWeekHigh,
					week52Low: meta?.fiftyTwoWeekLow,
					source: "live"
				};
				mapped.set(symbol.toUpperCase(), quote);
				quoteCache.set(symbol.toUpperCase(), quote);
			}
		} catch {}
	}));
	return unique.map((symbol) => {
		for (const code of fundAliases(symbol)) {
			const hit = mapped.get(code.toUpperCase()) ?? quoteCache.get(code.toUpperCase());
			if (hit) return {
				...hit,
				symbol
			};
		}
	}).filter((row) => Boolean(row));
}
function localSearch(query) {
	return searchCatalog(query);
}
var fundCache = /* @__PURE__ */ new Map();
var session = null;
function cookieFrom(res, prev = "") {
	const jar = /* @__PURE__ */ new Map();
	for (const part of prev.split(";").map((s) => s.trim()).filter(Boolean)) {
		const i = part.indexOf("=");
		if (i > 0) jar.set(part.slice(0, i), part.slice(i + 1));
	}
	const raw = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : res.headers.get("set-cookie") ? [res.headers.get("set-cookie")] : [];
	for (const line of raw) {
		const pair = line.split(";")[0] ?? "";
		const i = pair.indexOf("=");
		if (i > 0) jar.set(pair.slice(0, i), pair.slice(i + 1));
	}
	return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}
async function yahooSession() {
	if (session && Date.now() - session.at < 15e5) return session;
	let cookie = cookieFrom(await fetch("https://finance.yahoo.com/quote/AAPL", {
		headers: {
			"User-Agent": UA,
			Accept: "text/html"
		},
		signal: AbortSignal.timeout(1e4)
	}));
	const crumbRes = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
		headers: {
			"User-Agent": UA,
			Accept: "text/plain",
			Cookie: cookie
		},
		signal: AbortSignal.timeout(8e3)
	});
	cookie = cookieFrom(crumbRes, cookie);
	const crumb = (await crumbRes.text()).trim();
	if (!crumb || crumb.startsWith("{") || crumb.length > 80) throw new Error("crumb");
	session = {
		cookie,
		crumb,
		at: Date.now()
	};
	return session;
}
async function yahooAuthedJson(url) {
	const auth = await yahooSession();
	const joined = url + (url.includes("?") ? "&" : "?") + "crumb=" + encodeURIComponent(auth.crumb);
	const res = await fetch(joined, {
		headers: {
			"User-Agent": UA,
			Accept: "*/*",
			Cookie: auth.cookie
		},
		signal: AbortSignal.timeout(1e4)
	});
	if (res.status === 401) {
		session = null;
		throw new Error("yahoo 401");
	}
	if (!res.ok) throw new Error(`yahoo ${res.status}`);
	return res.json();
}
function num(stat) {
	const n = stat?.raw;
	return typeof n === "number" && Number.isFinite(n) ? n : void 0;
}
async function fetchFundamentals(symbol) {
	const key = symbol.toUpperCase();
	const hit = fundCache.get(key);
	if (hit && Date.now() - hit.at < 9e5) return hit.data;
	try {
		const row = (await yahooAuthedJson(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=defaultKeyStatistics,summaryDetail,financialData`)).quoteSummary?.result?.[0];
		const ks = row?.defaultKeyStatistics;
		const sd = row?.summaryDetail;
		const fd = row?.financialData;
		const chart = [...chartCache.values()].find((c) => c.meta.symbol.toUpperCase() === key);
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
			week52High: num(sd?.fiftyTwoWeekHigh) ?? chart?.meta.dayHigh,
			week52Low: num(sd?.fiftyTwoWeekLow) ?? chart?.meta.dayLow
		};
		if ([
			data.per,
			data.pbr,
			data.eps,
			data.dividendRate,
			data.marketCap
		].some((n) => n != null)) fundCache.set(key, {
			at: Date.now(),
			data
		});
		return data;
	} catch {
		return hit?.data ?? { symbol };
	}
}
//#endregion
export { fetchFundamentals, fetchYahooChart, fetchYahooQuotes, localSearch, searchYahoo };
