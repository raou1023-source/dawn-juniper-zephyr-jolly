export type NewsItem = {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: number;
  symbols: string[];
  impact: "up" | "down" | "none";
};

export type DeskAlert = {
  id: string;
  kind: "move" | "news";
  title: string;
  body: string;
  symbol?: string;
  at: number;
  read: boolean;
};

const UP =
  /急騰|急上昇|大幅高|最高値|急伸|高騰|大幅反発|買い優勢|surge|soar|record high|gap ?up/i;
const DOWN =
  /急落|暴落|大幅安|最安値|急反落|下落加速|売り優勢|plunge|slump|tumble|sell[- ]?off|gap ?down/i;
const WEAK_MOVE = /\brally\b|\bjumps?\b|\bdrops?\b|\bfalls?\b|\bgains?\b/i;
const FINANCE =
  /株|市場|指数|決算|為替|金利|日経|ダウ|東証|投信|配当|増資|自社株|時価総額|半導体|金融|economy|stock|shares|earnings|nasdaq|nikkei|s&p|dow|fed|etf|ipo|dividend|revenue|guidance|sec /i;
const NOISE =
  /premier league|football|soccer|nfl|nba|mlb|ワールドカップ|優勝監督|transfer window|arrest warrant|governor|flood rescue|whatsapp group|recipe|celebrity|box office|oscars|grammy/i;

export function newsImpact(title: string): NewsItem["impact"] {
  if (NOISE.test(title)) return "none";
  if (UP.test(title)) return "up";
  if (DOWN.test(title)) return "down";
  if (WEAK_MOVE.test(title) && FINANCE.test(title)) {
    if (/\b(drop|fall|falls|slump)\b/i.test(title)) return "down";
    return "up";
  }
  return "none";
}

export function isBigMoveNews(item: NewsItem) {
  return item.impact !== "none";
}

export function isNoiseTitle(title: string) {
  return NOISE.test(title);
}

export function isFinanceTitle(title: string) {
  return FINANCE.test(title);
}
