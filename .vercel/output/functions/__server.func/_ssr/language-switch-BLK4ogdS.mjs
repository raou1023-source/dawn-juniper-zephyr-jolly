import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as safeSymbol, t as safeHexColor } from "./safe-BMATx3RK.mjs";
import { i as lookupCatalog, n as classify, o as normalizeSymbol } from "./catalog-V-Nx7IgK.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/language-switch-BLK4ogdS.js
var import_jsx_runtime = require_jsx_runtime();
var LOCALES = [
	{
		id: "ja",
		label: "日本語"
	},
	{
		id: "en",
		label: "English"
	},
	{
		id: "zh",
		label: "中文"
	},
	{
		id: "ko",
		label: "한국어"
	}
];
var LOCALE_BCP = {
	ja: "ja-JP",
	en: "en-US",
	zh: "zh-CN",
	ko: "ko-KR"
};
var TABLES = {
	ja: {
		tagline: "株・投信・商品・為替・暗号",
		tabChart: "チャート",
		tabNews: "ニュース",
		tabWatch: "ウォッチ",
		watch: "ウォッチ",
		watchHint: "{n} 銘柄 · 下のバーから追加",
		watchEmpty: "下部の検索バーから銘柄を追加できます。",
		pickSymbol: "銘柄を選択",
		addWatchFirst: "ウォッチリストに銘柄を追加してください",
		chartLoading: "チャートを読み込み中…",
		chartEmpty: "データを取得できませんでした",
		sampleData: "サンプルデータ",
		company: "企業情報",
		statPer: "PER",
		statPbr: "PBR",
		statEps: "EPS",
		statDiv: "配当",
		statYield: "配当利回り",
		statPayout: "配当性向",
		statRoe: "ROE",
		statCap: "時価総額",
		statHigh: "52週高値",
		statLow: "52週安値",
		custom: "足のカスタム",
		reset: "初期化",
		candle: "ローソク",
		bar: "バー",
		line: "ライン",
		area: "エリア",
		ink: "インク",
		paper: "ペーパー",
		colorUp: "上昇",
		colorDown: "下落",
		wick: "ヒゲ",
		grid: "グリッド",
		volume: "出来高",
		crosshair: "十字",
		lastPrice: "最終値",
		log: "対数",
		notify: "通知",
		notifyTitle: "値動き通知",
		notifyPct: "{n}%以上",
		browserOn: "ブラウザ通知は許可済み",
		browserOff: "ブラウザ通知を許可",
		noAlerts: "まだ通知はありません",
		login: "ログイン",
		install: "インストール",
		iosInstall: "共有ボタンから「ホーム画面に追加」を選んでください。",
		liveOn: "LIVE",
		liveOff: "停止",
		liveAlways: "常時LIVE",
		live3s: "3秒更新",
		updating: "更新中",
		search: "検索",
		searchPh: "銘柄・金・ドル円・BTC・国債を検索",
		searching: "検索中…",
		noHits: "該当なし。Enter でコード追加できます。",
		added: "追加済",
		add: "追加",
		all: "すべて",
		save: "保存",
		savedLocal: "この端末に保存",
		saveHint: "ログインすると別の端末でも同じリストを開けます。",
		saving: "保存中…",
		savedCloud: "クラウドに保存済み",
		saveFail: "保存に失敗 · 端末には残しています",
		saveAs: "別名保存",
		newName: "新しい名前",
		delete: "削除",
		news: "ニュース",
		newsOnly: "銘柄に関連する記事のみ",
		market: "マーケット",
		newsLoading: "読み込み中…",
		noNews: "記事がありません",
		justNow: "たった今",
		minutesAgo: "{n}分前",
		hoursAgo: "{n}時間前",
		open: "始値",
		high: "高値",
		low: "安値",
		close: "終値",
		dismiss: "閉じる",
		loginTitle: "ウォッチリストを保存する",
		loginBody: "Google または X で入ると、リストがアカウントに保存されます。証券口座には接続しません。",
		continueWith: "{p} で続ける",
		loginOff: "ログインは現在使えません。",
		skipLogin: "保存せずチャートを見る",
		moveUp: "{s} が上昇",
		moveDown: "{s} が下落",
		moveBody: "{name} {pct}%（閾値 {n}%）",
		newsUp: "急騰ニュース",
		newsDown: "急落ニュース",
		p1d: "1日",
		p5d: "5日",
		p1mo: "1ヶ月",
		p3mo: "3ヶ月",
		p6mo: "6ヶ月",
		p1y: "1年",
		p5y: "5年",
		pmax: "全期間",
		s5: "5秒",
		s15: "15秒",
		s30: "30秒",
		kind_jp: "日本株",
		kind_overseas: "海外株",
		kind_etf: "ETF",
		kind_fund: "投信",
		kind_index: "指数",
		kind_commodity: "商品",
		kind_fx: "為替",
		kind_crypto: "暗号",
		kind_bond: "債券"
	},
	en: {
		tagline: "Stocks, funds, commodities, FX, crypto",
		tabChart: "Chart",
		tabNews: "News",
		tabWatch: "Watchlist",
		watch: "Watchlist",
		watchHint: "{n} symbols · add from the bar below",
		watchEmpty: "Add symbols from the search bar at the bottom.",
		pickSymbol: "Select a symbol",
		addWatchFirst: "Add a symbol to your watchlist",
		chartLoading: "Loading chart…",
		chartEmpty: "Could not load data",
		sampleData: "Sample data",
		company: "Company",
		statPer: "P/E",
		statPbr: "P/B",
		statEps: "EPS",
		statDiv: "Dividend",
		statYield: "Div. yield",
		statPayout: "Payout",
		statRoe: "ROE",
		statCap: "Market cap",
		statHigh: "52w high",
		statLow: "52w low",
		custom: "Candle style",
		reset: "Reset",
		candle: "Candle",
		bar: "Bar",
		line: "Line",
		area: "Area",
		ink: "Ink",
		paper: "Paper",
		colorUp: "Up",
		colorDown: "Down",
		wick: "Wick",
		grid: "Grid",
		volume: "Volume",
		crosshair: "Crosshair",
		lastPrice: "Last",
		log: "Log",
		notify: "Alerts",
		notifyTitle: "Move alerts",
		notifyPct: "{n}%+",
		browserOn: "Browser alerts allowed",
		browserOff: "Allow browser alerts",
		noAlerts: "No alerts yet",
		login: "Log in",
		install: "Install",
		iosInstall: "Open Share and tap Add to Home Screen.",
		liveOn: "LIVE",
		liveOff: "Paused",
		liveAlways: "Always LIVE",
		live3s: "3s refresh",
		updating: "Updating",
		search: "Search",
		searchPh: "Search stocks, gold, USD/JPY, BTC, bonds",
		searching: "Searching…",
		noHits: "No matches. Press Enter to add the code.",
		added: "Added",
		add: "Add",
		all: "All",
		save: "Save",
		savedLocal: "Saved on this device",
		saveHint: "Log in to open the same list on other devices.",
		saving: "Saving…",
		savedCloud: "Saved to cloud",
		saveFail: "Cloud save failed · kept on this device",
		saveAs: "Save as",
		newName: "New name",
		delete: "Delete",
		news: "News",
		newsOnly: "Stories related to the symbol",
		market: "Market",
		newsLoading: "Loading…",
		noNews: "No articles",
		justNow: "just now",
		minutesAgo: "{n}m ago",
		hoursAgo: "{n}h ago",
		open: "Open",
		high: "High",
		low: "Low",
		close: "Close",
		dismiss: "Close",
		loginTitle: "Save your watchlist",
		loginBody: "Sign in with Google or X to save lists to your account. We never connect to a brokerage.",
		continueWith: "Continue with {p}",
		loginOff: "Sign-in is unavailable right now.",
		skipLogin: "View charts without saving",
		moveUp: "{s} up",
		moveDown: "{s} down",
		moveBody: "{name} {pct}% (threshold {n}%)",
		newsUp: "Surge news",
		newsDown: "Drop news",
		p1d: "1D",
		p5d: "5D",
		p1mo: "1M",
		p3mo: "3M",
		p6mo: "6M",
		p1y: "1Y",
		p5y: "5Y",
		pmax: "Max",
		s5: "5s",
		s15: "15s",
		s30: "30s",
		kind_jp: "Japan",
		kind_overseas: "Intl",
		kind_etf: "ETF",
		kind_fund: "Fund",
		kind_index: "Index",
		kind_commodity: "Commodity",
		kind_fx: "FX",
		kind_crypto: "Crypto",
		kind_bond: "Bond"
	},
	zh: {
		tagline: "股票、基金、商品、外汇、加密",
		tabChart: "图表",
		tabNews: "新闻",
		tabWatch: "自选",
		watch: "自选",
		watchHint: "{n} 只 · 用底部栏添加",
		watchEmpty: "请用底部搜索栏添加标的。",
		pickSymbol: "请选择标的",
		addWatchFirst: "请先将标的加入自选",
		chartLoading: "正在加载图表…",
		chartEmpty: "无法获取数据",
		sampleData: "示例数据",
		company: "公司信息",
		statPer: "PER",
		statPbr: "PBR",
		statEps: "EPS",
		statDiv: "股息",
		statYield: "股息率",
		statPayout: "派息率",
		statRoe: "ROE",
		statCap: "市值",
		statHigh: "52周高",
		statLow: "52周低",
		custom: "K线样式",
		reset: "重置",
		candle: "K线",
		bar: "美国线",
		line: "折线",
		area: "面积",
		ink: "暗色",
		paper: "浅色",
		colorUp: "涨",
		colorDown: "跌",
		wick: "影线",
		grid: "网格",
		volume: "成交量",
		crosshair: "十字光标",
		lastPrice: "最新",
		log: "对数",
		notify: "提醒",
		notifyTitle: "波动提醒",
		notifyPct: "{n}%以上",
		browserOn: "已允许浏览器通知",
		browserOff: "允许浏览器通知",
		noAlerts: "暂无提醒",
		login: "登录",
		install: "安装",
		iosInstall: "点分享，然后选择“添加到主屏幕”。",
		liveOn: "LIVE",
		liveOff: "暂停",
		liveAlways: "持续LIVE",
		live3s: "3秒刷新",
		updating: "更新中",
		search: "搜索",
		searchPh: "搜索股票、黄金、美元日元、BTC、国债",
		searching: "搜索中…",
		noHits: "无结果。按 Enter 可直接添加代码。",
		added: "已添加",
		add: "添加",
		all: "全部",
		save: "保存",
		savedLocal: "已保存在本机",
		saveHint: "登录后可在其他设备打开同一列表。",
		saving: "保存中…",
		savedCloud: "已保存到云端",
		saveFail: "云端保存失败 · 本机仍保留",
		saveAs: "另存为",
		newName: "新名称",
		delete: "删除",
		news: "新闻",
		newsOnly: "仅显示相关报道",
		market: "市场",
		newsLoading: "加载中…",
		noNews: "暂无文章",
		justNow: "刚刚",
		minutesAgo: "{n}分钟前",
		hoursAgo: "{n}小时前",
		open: "开盘",
		high: "最高",
		low: "最低",
		close: "收盘",
		dismiss: "关闭",
		loginTitle: "保存自选列表",
		loginBody: "使用 Google 或 X 登录后，列表会保存到账户。不会连接证券公司。",
		continueWith: "使用 {p} 继续",
		loginOff: "当前无法登录。",
		skipLogin: "不保存，先看图表",
		moveUp: "{s} 上涨",
		moveDown: "{s} 下跌",
		moveBody: "{name} {pct}%（阈值 {n}%）",
		newsUp: "急涨新闻",
		newsDown: "急跌新闻",
		p1d: "1日",
		p5d: "5日",
		p1mo: "1月",
		p3mo: "3月",
		p6mo: "6月",
		p1y: "1年",
		p5y: "5年",
		pmax: "全部",
		s5: "5秒",
		s15: "15秒",
		s30: "30秒",
		kind_jp: "日本股",
		kind_overseas: "海外股",
		kind_etf: "ETF",
		kind_fund: "基金",
		kind_index: "指数",
		kind_commodity: "商品",
		kind_fx: "外汇",
		kind_crypto: "加密",
		kind_bond: "债券"
	},
	ko: {
		tagline: "주식·펀드·원자재·환율·암호화폐",
		tabChart: "차트",
		tabNews: "뉴스",
		tabWatch: "관심",
		watch: "관심종목",
		watchHint: "{n}종 · 아래 바에서 추가",
		watchEmpty: "아래 검색바로 종목을 추가하세요.",
		pickSymbol: "종목을 선택하세요",
		addWatchFirst: "관심종목에 종목을 추가하세요",
		chartLoading: "차트를 불러오는 중…",
		chartEmpty: "데이터를 가져올 수 없습니다",
		sampleData: "샘플 데이터",
		company: "기업 정보",
		statPer: "PER",
		statPbr: "PBR",
		statEps: "EPS",
		statDiv: "배당",
		statYield: "배당수익률",
		statPayout: "배당성향",
		statRoe: "ROE",
		statCap: "시가총액",
		statHigh: "52주 최고",
		statLow: "52주 최저",
		custom: "봉 스타일",
		reset: "초기화",
		candle: "캔들",
		bar: "바",
		line: "라인",
		area: "영역",
		ink: "잉크",
		paper: "페이퍼",
		colorUp: "상승",
		colorDown: "하락",
		wick: "꼬리",
		grid: "그리드",
		volume: "거래량",
		crosshair: "십자선",
		lastPrice: "현재가",
		log: "로그",
		notify: "알림",
		notifyTitle: "변동 알림",
		notifyPct: "{n}% 이상",
		browserOn: "브라우저 알림 허용됨",
		browserOff: "브라우저 알림 허용",
		noAlerts: "아직 알림이 없습니다",
		login: "로그인",
		install: "설치",
		iosInstall: "공유에서 '홈 화면에 추가'를 선택하세요.",
		liveOn: "LIVE",
		liveOff: "중지",
		liveAlways: "항상 LIVE",
		live3s: "3초 갱신",
		updating: "갱신 중",
		search: "검색",
		searchPh: "종목·금·달러엔·BTC·국채 검색",
		searching: "검색 중…",
		noHits: "결과 없음. Enter로 코드를 추가할 수 있습니다.",
		added: "추가됨",
		add: "추가",
		all: "전체",
		save: "저장",
		savedLocal: "이 기기에 저장",
		saveHint: "로그인하면 다른 기기에서도 같은 목록을 열 수 있습니다.",
		saving: "저장 중…",
		savedCloud: "클라우드에 저장됨",
		saveFail: "클라우드 저장 실패 · 기기에는 남아 있습니다",
		saveAs: "다른 이름으로",
		newName: "새 이름",
		delete: "삭제",
		news: "뉴스",
		newsOnly: "종목 관련 기사만",
		market: "마켓",
		newsLoading: "불러오는 중…",
		noNews: "기사가 없습니다",
		justNow: "방금",
		minutesAgo: "{n}분 전",
		hoursAgo: "{n}시간 전",
		open: "시가",
		high: "고가",
		low: "저가",
		close: "종가",
		dismiss: "닫기",
		loginTitle: "관심종목 저장",
		loginBody: "Google 또는 X로 로그인하면 목록이 계정에 저장됩니다. 증권 계좌에는 연결하지 않습니다.",
		continueWith: "{p}로 계속",
		loginOff: "지금은 로그인할 수 없습니다.",
		skipLogin: "저장하지 않고 차트 보기",
		moveUp: "{s} 상승",
		moveDown: "{s} 하락",
		moveBody: "{name} {pct}% (기준 {n}%)",
		newsUp: "급등 뉴스",
		newsDown: "급락 뉴스",
		p1d: "1일",
		p5d: "5일",
		p1mo: "1개월",
		p3mo: "3개월",
		p6mo: "6개월",
		p1y: "1년",
		p5y: "5년",
		pmax: "전체",
		s5: "5초",
		s15: "15초",
		s30: "30초",
		kind_jp: "일본주",
		kind_overseas: "해외주",
		kind_etf: "ETF",
		kind_fund: "펀드",
		kind_index: "지수",
		kind_commodity: "원자재",
		kind_fx: "환율",
		kind_crypto: "암호",
		kind_bond: "채권"
	}
};
function translate(locale, key, vars) {
	let text = TABLES[locale]?.[key] ?? TABLES.ja[key] ?? String(key);
	if (vars) for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v));
	return text;
}
function kindKey(kind) {
	const key = `kind_${kind}`;
	return key in TABLES.ja ? key : "kind_overseas";
}
function periodKey(key) {
	return {
		"1d": "p1d",
		"5d": "p5d",
		"1mo": "p1mo",
		"3mo": "p3mo",
		"6mo": "p6mo",
		"1y": "p1y",
		"5y": "p5y",
		max: "pmax"
	}[key] ?? "p1y";
}
var PERIODS = [
	{
		key: "1d",
		label: "1日",
		range: "1d",
		interval: "1m"
	},
	{
		key: "5d",
		label: "5日",
		range: "5d",
		interval: "5m"
	},
	{
		key: "1mo",
		label: "1ヶ月",
		range: "1mo",
		interval: "1d"
	},
	{
		key: "3mo",
		label: "3ヶ月",
		range: "3mo",
		interval: "1d"
	},
	{
		key: "6mo",
		label: "6ヶ月",
		range: "6mo",
		interval: "1d"
	},
	{
		key: "1y",
		label: "1年",
		range: "1y",
		interval: "1d"
	},
	{
		key: "5y",
		label: "5年",
		range: "5y",
		interval: "1wk"
	},
	{
		key: "max",
		label: "全期間",
		range: "max",
		interval: "1mo"
	}
];
function isIntraday(period) {
	return period === "1d" || period === "5d";
}
var DEFAULT_SETTINGS = {
	kind: "candle",
	upColor: "#3dba8b",
	downColor: "#e05d5d",
	wickColor: "#8b909a",
	lineColor: "#c5cdd8",
	areaTop: "rgba(197, 205, 216, 0.28)",
	areaBottom: "rgba(197, 205, 216, 0.02)",
	background: "ink",
	showGrid: true,
	showVolume: true,
	showCrosshair: true,
	showLastPrice: true,
	sma20: true,
	sma50: false,
	sma200: false,
	ema12: false,
	ema26: false,
	bollinger: false,
	logScale: false
};
var DEFAULT_WATCHLIST = [
	{
		symbol: "7203.T",
		name: "トヨタ自動車",
		exchange: "TYO"
	},
	{
		symbol: "6758.T",
		name: "ソニーグループ",
		exchange: "TYO"
	},
	{
		symbol: "9984.T",
		name: "ソフトバンクG",
		exchange: "TYO"
	},
	{
		symbol: "7974.T",
		name: "任天堂",
		exchange: "TYO"
	},
	{
		symbol: "AAPL",
		name: "Apple",
		exchange: "NMS"
	},
	{
		symbol: "NVDA",
		name: "NVIDIA",
		exchange: "NMS"
	},
	{
		symbol: "MSFT",
		name: "Microsoft",
		exchange: "NMS"
	},
	{
		symbol: "^N225",
		name: "日経平均",
		exchange: "Osaka"
	}
];
var useDesk = create()(persist((set, get) => ({
	watchlist: DEFAULT_WATCHLIST,
	selected: DEFAULT_WATCHLIST[0].symbol,
	period: "1y",
	settings: DEFAULT_SETTINGS,
	live: true,
	liveMs: 5e3,
	notifyEnabled: true,
	notifyThreshold: 5,
	browserNotify: false,
	alerts: [],
	listId: null,
	listName: "メイン",
	locale: "ja",
	addItem: (item) => {
		const symbol = safeSymbol(normalizeSymbol(item.symbol));
		if (!symbol) return;
		const list = get().watchlist;
		if (list.length >= 200) return;
		if (list.some((w) => w.symbol.toUpperCase() === symbol)) {
			set({ selected: symbol });
			return;
		}
		const catalog = lookupCatalog(symbol);
		const rawName = item.name.replace(/[<>]/g, "").slice(0, 80);
		const name = catalog?.name || (rawName && rawName.toUpperCase() !== symbol && rawName.toUpperCase() !== item.symbol.toUpperCase() ? rawName : symbol);
		set({
			watchlist: [{
				...item,
				symbol,
				name,
				exchange: item.exchange || catalog?.exchange,
				kind: item.kind ?? catalog?.kind ?? classify(symbol, void 0, item.exchange)
			}, ...list],
			selected: symbol
		});
	},
	renameItem: (symbol, name) => {
		get().renameMany([{
			symbol,
			name
		}]);
	},
	renameMany: (rows) => {
		if (!rows.length) return;
		const map = new Map(rows.map((r) => [r.symbol, r.name.replace(/[<>]/g, "").slice(0, 80).trim()]));
		let changed = false;
		const watchlist = get().watchlist.map((w) => {
			const name = map.get(w.symbol);
			if (!name || name === w.name) return w;
			changed = true;
			return {
				...w,
				name
			};
		});
		if (changed) set({ watchlist });
	},
	removeItem: (symbol) => {
		const list = get().watchlist.filter((w) => w.symbol !== symbol);
		set({
			watchlist: list,
			selected: get().selected === symbol ? list[0]?.symbol ?? "" : get().selected
		});
	},
	select: (symbol) => set({ selected: symbol }),
	setPeriod: (period) => set({ period }),
	patchSettings: (patch) => {
		const next = { ...patch };
		if (next.upColor) next.upColor = safeHexColor(next.upColor) ?? get().settings.upColor;
		if (next.downColor) next.downColor = safeHexColor(next.downColor) ?? get().settings.downColor;
		if (next.wickColor) next.wickColor = safeHexColor(next.wickColor) ?? get().settings.wickColor;
		if (next.lineColor) next.lineColor = safeHexColor(next.lineColor) ?? get().settings.lineColor;
		set({ settings: {
			...get().settings,
			...next
		} });
	},
	resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
	moveItem: (from, to) => {
		const list = [...get().watchlist];
		const [item] = list.splice(from, 1);
		if (!item) return;
		list.splice(to, 0, item);
		set({ watchlist: list });
	},
	setLive: (live) => set({ live }),
	setLiveMs: (liveMs) => set({ liveMs }),
	setNotifyEnabled: (notifyEnabled) => set({ notifyEnabled }),
	setNotifyThreshold: (notifyThreshold) => set({ notifyThreshold }),
	setBrowserNotify: (browserNotify) => set({ browserNotify }),
	pushAlert: (alert) => {
		const list = get().alerts ?? [];
		if (list.some((a) => a.id === alert.id)) return;
		set({ alerts: [{
			...alert,
			read: false
		}, ...list].slice(0, 40) });
	},
	markAlertsRead: () => set({ alerts: (get().alerts ?? []).map((a) => ({
		...a,
		read: true
	})) }),
	replaceWatchlist: (items, selected) => {
		const next = items.length ? items : [];
		set({
			watchlist: next,
			selected: selected && next.some((w) => w.symbol === selected) ? selected : next[0]?.symbol ?? ""
		});
	},
	setListMeta: (listId, listName) => set({
		listId,
		listName
	}),
	setLocale: (locale) => set({ locale })
}), {
	name: "kabu-desk-v2",
	skipHydration: true
}));
function useT() {
	const locale = useDesk((s) => s.locale ?? "ja");
	return (key, vars) => translate(locale, key, vars);
}
function useLocale() {
	return useDesk((s) => s.locale ?? "ja");
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function LanguageSwitch() {
	const locale = useDesk((s) => s.locale ?? "ja");
	const setLocale = useDesk((s) => s.setLocale);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-0.5 rounded-md bg-elevated p-0.5",
		children: LOCALES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setLocale(item.id),
			className: cn("h-7 rounded px-1.5 text-[10px] tracking-wide", locale === item.id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
			"aria-pressed": locale === item.id,
			children: item.id === "ja" ? "JP" : item.id === "en" ? "EN" : item.id === "zh" ? "中" : "한"
		}, item.id))
	});
}
//#endregion
export { isIntraday as a, translate as c, useT as d, cn as i, useDesk as l, LanguageSwitch as n, kindKey as o, PERIODS as r, periodKey as s, LOCALE_BCP as t, useLocale as u };
