//#region node_modules/.nitro/vite/services/ssr/assets/news-o1u9YgPd.js
var UP = /急騰|急上昇|大幅高|最高値|急伸|高騰|大幅反発|買い優勢|surge|soar|record high|gap ?up/i;
var DOWN = /急落|暴落|大幅安|最安値|急反落|下落加速|売り優勢|plunge|slump|tumble|sell[- ]?off|gap ?down/i;
var WEAK_MOVE = /\brally\b|\bjumps?\b|\bdrops?\b|\bfalls?\b|\bgains?\b/i;
var FINANCE = /株|市場|指数|決算|為替|金利|日経|ダウ|東証|投信|配当|増資|自社株|時価総額|半導体|金融|economy|stock|shares|earnings|nasdaq|nikkei|s&p|dow|fed|etf|ipo|dividend|revenue|guidance|sec /i;
var NOISE = /premier league|football|soccer|nfl|nba|mlb|ワールドカップ|優勝監督|transfer window|arrest warrant|governor|flood rescue|whatsapp group|recipe|celebrity|box office|oscars|grammy/i;
function newsImpact(title) {
	if (NOISE.test(title)) return "none";
	if (UP.test(title)) return "up";
	if (DOWN.test(title)) return "down";
	if (WEAK_MOVE.test(title) && FINANCE.test(title)) {
		if (/\b(drop|fall|falls|slump)\b/i.test(title)) return "down";
		return "up";
	}
	return "none";
}
function isBigMoveNews(item) {
	return item.impact !== "none";
}
function isNoiseTitle(title) {
	return NOISE.test(title);
}
function isFinanceTitle(title) {
	return FINANCE.test(title);
}
//#endregion
export { newsImpact as i, isFinanceTitle as n, isNoiseTitle as r, isBigMoveNews as t };
