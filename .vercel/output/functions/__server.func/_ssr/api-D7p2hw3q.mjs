import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as safeSymbol } from "./safe-BMATx3RK.mjs";
import { cn as _enum, gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-D7p2hw3q.js
var RANGE = _enum([
	"1d",
	"5d",
	"1mo",
	"3mo",
	"6mo",
	"1y",
	"5y",
	"max"
]);
var INTERVAL = _enum([
	"1m",
	"5m",
	"15m",
	"1d",
	"1wk",
	"1mo"
]);
var getChart_createServerFn_handler = createServerRpc({
	id: "8a39ad0927f9f32f6df01b399d78c677c818cf89d228207b9786a5856492cee8",
	name: "getChart",
	filename: "src/lib/stocks/api.ts"
}, (opts) => getChart.__executeServer(opts));
var getChart = createServerFn({ method: "GET" }).validator(object({
	symbol: string().min(1).max(32).regex(/^[A-Za-z0-9.^%=_/-]+$/),
	range: RANGE,
	interval: INTERVAL
})).handler(getChart_createServerFn_handler, async ({ data }) => {
	const { fetchYahooChart } = await import("./yahoo.server-BYXyj9Ei.mjs");
	return fetchYahooChart(data.symbol, data.range, data.interval);
});
var searchSymbols_createServerFn_handler = createServerRpc({
	id: "9c82990dab2849d74dad22bf16fad01dc184d7d546cf39559e0fed03baf07304",
	name: "searchSymbols",
	filename: "src/lib/stocks/api.ts"
}, (opts) => searchSymbols.__executeServer(opts));
var searchSymbols = createServerFn({ method: "GET" }).validator(object({ q: string().max(48) })).handler(searchSymbols_createServerFn_handler, async ({ data }) => {
	const { localSearch, searchYahoo } = await import("./yahoo.server-BYXyj9Ei.mjs");
	const q = data.q.replace(/[\u0000-\u001F]/g, "").trim();
	if (!q) return localSearch("");
	const live = await searchYahoo(q);
	return live.length ? live : localSearch(q);
});
var getQuotes_createServerFn_handler = createServerRpc({
	id: "14c19c7f2d3dae54f052cf6027cd45dd86f7beff1e5122644fc484e1673cf4ce",
	name: "getQuotes",
	filename: "src/lib/stocks/api.ts"
}, (opts) => getQuotes.__executeServer(opts));
var getQuotes = createServerFn({ method: "GET" }).validator(object({ symbols: string().max(800) })).handler(getQuotes_createServerFn_handler, async ({ data }) => {
	const { fetchYahooQuotes } = await import("./yahoo.server-BYXyj9Ei.mjs");
	return fetchYahooQuotes(data.symbols.split(",").map((s) => safeSymbol(s)).filter((s) => Boolean(s)));
});
var getNews_createServerFn_handler = createServerRpc({
	id: "0d90211aed90cb465a40e7120eb2e41c2a6b2bdb209cb691fee7a5211e526a69",
	name: "getNews",
	filename: "src/lib/stocks/api.ts"
}, (opts) => getNews.__executeServer(opts));
var getNews = createServerFn({ method: "GET" }).validator(object({
	symbol: string().max(32).regex(/^[A-Za-z0-9.^%=_/-]+$/).optional(),
	locale: _enum([
		"ja",
		"en",
		"zh",
		"ko"
	]).optional()
})).handler(getNews_createServerFn_handler, async ({ data }) => {
	const { fetchNews } = await import("./news.server-CbGMgYBY.mjs");
	const rows = await fetchNews(data.symbol || void 0);
	const locale = data.locale ?? "ja";
	if (locale === "ja" || rows.length === 0) return rows;
	const { translateTitles } = await import("./translate.server-bnN6yqs6.mjs");
	const titles = await translateTitles(rows.map((row) => row.title), locale);
	return rows.map((row, i) => ({
		...row,
		title: titles[i] || row.title
	}));
});
var getFundamentals_createServerFn_handler = createServerRpc({
	id: "efe8593ebb2a40d1d139cc4f78a4a98df07e480f2b2846cd6e44bceee7710270",
	name: "getFundamentals",
	filename: "src/lib/stocks/api.ts"
}, (opts) => getFundamentals.__executeServer(opts));
var getFundamentals = createServerFn({ method: "GET" }).validator(object({ symbol: string().min(1).max(32).regex(/^[A-Za-z0-9.^%=_/-]+$/) })).handler(getFundamentals_createServerFn_handler, async ({ data }) => {
	const { fetchFundamentals } = await import("./yahoo.server-BYXyj9Ei.mjs");
	return fetchFundamentals(data.symbol);
});
//#endregion
export { getChart_createServerFn_handler, getFundamentals_createServerFn_handler, getNews_createServerFn_handler, getQuotes_createServerFn_handler, searchSymbols_createServerFn_handler };
