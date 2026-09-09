//#region node_modules/.nitro/vite/services/ssr/assets/translate.server-bnN6yqs6.js
var cache = /* @__PURE__ */ new Map();
var TARGET = {
	ja: "ja",
	en: "en",
	zh: "zh-CN",
	ko: "ko"
};
async function translateTitles(titles, locale) {
	const tl = TARGET[locale] ?? "en";
	if (locale === "ja") return titles;
	return await Promise.all(titles.map((title) => translateOne(title, tl)));
}
async function translateOne(text, tl) {
	const key = `${tl}:${text}`;
	const hit = cache.get(key);
	if (hit) return hit;
	const clipped = text.slice(0, 200);
	const translated = await viaGoogle(clipped, tl) || await viaMemory(clipped, tl) || text;
	cache.set(key, translated);
	if (cache.size > 400) {
		const first = cache.keys().next().value;
		if (first) cache.delete(first);
	}
	return translated;
}
async function viaGoogle(text, tl) {
	const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" + encodeURIComponent(tl) + "&dt=t&q=" + encodeURIComponent(text);
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(5e3) });
		if (!res.ok) return null;
		const json = await res.json();
		if (!Array.isArray(json) || !Array.isArray(json[0])) return null;
		return json[0].map((part) => Array.isArray(part) ? part[0] : "").join("").trim() || null;
	} catch {
		return null;
	}
}
async function viaMemory(text, tl) {
	const pair = `autodetect|${tl === "zh-CN" ? "zh-CN" : tl}`;
	const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=" + encodeURIComponent(pair);
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(5e3) });
		if (!res.ok) return null;
		return (await res.json()).responseData?.translatedText?.trim() || null;
	} catch {
		return null;
	}
}
//#endregion
export { translateTitles };
