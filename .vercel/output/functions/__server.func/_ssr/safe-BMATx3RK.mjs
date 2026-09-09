//#region node_modules/.nitro/vite/services/ssr/assets/safe-BMATx3RK.js
var SYMBOL_OK = /^[A-Za-z0-9.^%=_/-]{1,32}$/;
var HEX = /^#[0-9A-Fa-f]{6}$/;
function safeSymbol(raw) {
	const s = raw.trim().toUpperCase();
	if (!SYMBOL_OK.test(s)) return null;
	return s;
}
function safeHttpUrl(raw) {
	try {
		const url = new URL(raw.trim());
		if (url.protocol !== "https:" && url.protocol !== "http:") return null;
		if (url.username || url.password) return null;
		return url.href;
	} catch {
		return null;
	}
}
function safeHexColor(raw) {
	if (!raw) return void 0;
	return HEX.test(raw) ? raw : void 0;
}
function stripTags(raw) {
	return raw.replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
}
//#endregion
export { stripTags as i, safeHttpUrl as n, safeSymbol as r, safeHexColor as t };
