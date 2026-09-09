import type { AssetKind, SearchHit } from "./types";

export type { AssetKind };

export type CatalogItem = SearchHit & {
  kind: AssetKind;
  aliases?: string[];
};

export const KIND_LABEL: Record<AssetKind, string> = {
  jp: "日本株",
  overseas: "海外株",
  etf: "ETF",
  fund: "投信",
  index: "指数",
  commodity: "商品",
  fx: "為替",
  crypto: "暗号資産",
  bond: "債券",
};

export const CATALOG: CatalogItem[] = [
  { symbol: "7203.T", name: "トヨタ自動車", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "6758.T", name: "ソニーグループ", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "9984.T", name: "ソフトバンクグループ", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "7974.T", name: "任天堂", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "8306.T", name: "三菱UFJフィナンシャル・グループ", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "6501.T", name: "日立製作所", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "6861.T", name: "キーエンス", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "6098.T", name: "リクルートホールディングス", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "9983.T", name: "ファーストリテイリング", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "8035.T", name: "東京エレクトロン", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "4063.T", name: "信越化学工業", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "4519.T", name: "中外製薬", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "4568.T", name: "第一三共", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "9432.T", name: "日本電信電話", exchange: "東証", kind: "jp", type: "株式" },
  { symbol: "9433.T", name: "KDDI", exchange: "東証", kind: "jp", type: "株式", aliases: ["ケイディーディーアイ"] },

  { symbol: "AAPL", name: "Apple", exchange: "NASDAQ", kind: "overseas", type: "株式", aliases: ["アップル"] },
  { symbol: "NVDA", name: "NVIDIA", exchange: "NASDAQ", kind: "overseas", type: "株式", aliases: ["エヌビディア"] },
  { symbol: "MSFT", name: "Microsoft", exchange: "NASDAQ", kind: "overseas", type: "株式", aliases: ["マイクロソフト"] },
  { symbol: "GOOGL", name: "Alphabet", exchange: "NASDAQ", kind: "overseas", type: "株式", aliases: ["グーグル", "google"] },
  { symbol: "AMZN", name: "Amazon", exchange: "NASDAQ", kind: "overseas", type: "株式", aliases: ["アマゾン"] },
  { symbol: "META", name: "Meta Platforms", exchange: "NASDAQ", kind: "overseas", type: "株式", aliases: ["メタ", "facebook"] },
  { symbol: "TSLA", name: "Tesla", exchange: "NASDAQ", kind: "overseas", type: "株式", aliases: ["テスラ"] },
  { symbol: "BRK-B", name: "Berkshire Hathaway", exchange: "NYSE", kind: "overseas", type: "株式", aliases: ["バークシャー"] },
  { symbol: "LLY", name: "Eli Lilly", exchange: "NYSE", kind: "overseas", type: "株式" },
  { symbol: "AVGO", name: "Broadcom", exchange: "NASDAQ", kind: "overseas", type: "株式" },
  { symbol: "JPM", name: "JPMorgan Chase", exchange: "NYSE", kind: "overseas", type: "株式" },
  { symbol: "V", name: "Visa", exchange: "NYSE", kind: "overseas", type: "株式" },
  { symbol: "UNH", name: "UnitedHealth", exchange: "NYSE", kind: "overseas", type: "株式" },
  { symbol: "BABA", name: "Alibaba", exchange: "NYSE", kind: "overseas", type: "株式", aliases: ["アリババ"] },
  { symbol: "TSM", name: "TSMC", exchange: "NYSE", kind: "overseas", type: "株式", aliases: ["台積電", "台湾セミコン"] },
  { symbol: "0700.HK", name: "Tencent", exchange: "香港", kind: "overseas", type: "株式", aliases: ["テンセント", "騰訊"] },
  { symbol: "9988.HK", name: "Alibaba (HK)", exchange: "香港", kind: "overseas", type: "株式" },
  { symbol: "3690.HK", name: "Meituan", exchange: "香港", kind: "overseas", type: "株式", aliases: ["美団"] },
  { symbol: "005930.KS", name: "Samsung Electronics", exchange: "韓国", kind: "overseas", type: "株式", aliases: ["サムスン"] },
  { symbol: "2330.TW", name: "TSMC (台湾)", exchange: "台湾", kind: "overseas", type: "株式" },
  { symbol: "ASML.AS", name: "ASML", exchange: "アムステルダム", kind: "overseas", type: "株式" },
  { symbol: "MC.PA", name: "LVMH", exchange: "パリ", kind: "overseas", type: "株式" },
  { symbol: "NESN.SW", name: "Nestlé", exchange: "スイス", kind: "overseas", type: "株式", aliases: ["ネスレ"] },
  { symbol: "SAP.DE", name: "SAP", exchange: "フランクフルト", kind: "overseas", type: "株式" },
  { symbol: "SHEL.L", name: "Shell", exchange: "ロンドン", kind: "overseas", type: "株式" },
  { symbol: "AZN.L", name: "AstraZeneca", exchange: "ロンドン", kind: "overseas", type: "株式" },
  { symbol: "OR.PA", name: "L'Oréal", exchange: "パリ", kind: "overseas", type: "株式" },
  { symbol: "RELIANCE.NS", name: "Reliance Industries", exchange: "NSE", kind: "overseas", type: "株式" },
  { symbol: "BHP.AX", name: "BHP Group", exchange: "オーストラリア", kind: "overseas", type: "株式" },

  { symbol: "SPY", name: "SPDR S&P 500 ETF", exchange: "ARCA", kind: "etf", type: "ETF" },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", exchange: "ARCA", kind: "etf", type: "ETF" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", exchange: "NASDAQ", kind: "etf", type: "ETF" },
  { symbol: "VTI", name: "Vanguard Total Stock Market", exchange: "ARCA", kind: "etf", type: "ETF" },
  { symbol: "VWO", name: "Vanguard Emerging Markets", exchange: "ARCA", kind: "etf", type: "ETF" },
  { symbol: "VEA", name: "Vanguard FTSE Developed Markets", exchange: "ARCA", kind: "etf", type: "ETF" },
  { symbol: "GLD", name: "SPDR Gold Shares", exchange: "ARCA", kind: "etf", type: "ETF", aliases: ["金"] },
  { symbol: "TLT", name: "iShares 20+ Year Treasury", exchange: "NASDAQ", kind: "bond", type: "ETF" },
  { symbol: "SCHD", name: "Schwab US Dividend Equity", exchange: "ARCA", kind: "etf", type: "ETF" },
  { symbol: "VWRL.L", name: "Vanguard FTSE All-World", exchange: "LSE", kind: "etf", type: "ETF" },
  { symbol: "CSPX.L", name: "iShares Core S&P 500", exchange: "LSE", kind: "etf", type: "ETF" },
  { symbol: "1306.T", name: "NEXT FUNDS TOPIX連動型", exchange: "東証", kind: "etf", type: "ETF" },
  { symbol: "1321.T", name: "NEXT FUNDS 日経225連動型", exchange: "東証", kind: "etf", type: "ETF" },
  { symbol: "1343.T", name: "NEXT FUNDS 東証REIT指数", exchange: "東証", kind: "etf", type: "ETF", aliases: ["リート"] },
  { symbol: "1655.T", name: "iFreeETF S&P500", exchange: "東証", kind: "etf", type: "ETF" },
  { symbol: "2558.T", name: "MAXIS 米国株式(S&P500)", exchange: "東証", kind: "etf", type: "ETF" },
  { symbol: "2631.T", name: "MAXIS 全世界株式", exchange: "東証", kind: "etf", type: "ETF" },
  { symbol: "1540.T", name: "純金上場信託", exchange: "東証", kind: "etf", type: "ETF" },

  { symbol: "03311187", name: "eMAXIS Slim 米国株式(S&P500)", exchange: "投信", kind: "fund", type: "投信", aliases: ["スリム", "emaxis"] },
  { symbol: "0331118A", name: "eMAXIS Slim 全世界株式(オール・カントリー)", exchange: "投信", kind: "fund", type: "投信", aliases: ["オルカン"] },
  { symbol: "0331818A", name: "eMAXIS Slim 先進国株式インデックス", exchange: "投信", kind: "fund", type: "投信" },
  { symbol: "9C31116A", name: "ひふみプラス", exchange: "投信", kind: "fund", type: "投信", aliases: ["ひふみ"] },
  { symbol: "4731118A", name: "SBI・V・S&P500インデックス・ファンド", exchange: "投信", kind: "fund", type: "投信" },
  { symbol: "9I31117A", name: "楽天・全米株式インデックス・ファンド", exchange: "投信", kind: "fund", type: "投信", aliases: ["楽天vti"] },
  { symbol: "03312187", name: "eMAXIS Slim 国内株式(日経平均)", exchange: "投信", kind: "fund", type: "投信" },
  { symbol: "0331418A", name: "eMAXIS Slim 新興国株式インデックス", exchange: "投信", kind: "fund", type: "投信" },
  { symbol: "VTSAX", name: "Vanguard Total Stock Market Admiral", exchange: "投信", kind: "fund", type: "投信" },
  { symbol: "FXAIX", name: "Fidelity 500 Index Fund", exchange: "投信", kind: "fund", type: "投信" },
  { symbol: "SWPPX", name: "Schwab S&P 500 Index", exchange: "投信", kind: "fund", type: "投信" },

  { symbol: "^N225", name: "日経平均株価", exchange: "大阪", kind: "index", type: "指数" },
  { symbol: "^GSPC", name: "S&P 500", exchange: "SNP", kind: "index", type: "指数" },
  { symbol: "^IXIC", name: "NASDAQ Composite", exchange: "NASDAQ", kind: "index", type: "指数" },
  { symbol: "^DJI", name: "ダウ平均", exchange: "DJI", kind: "index", type: "指数" },
  { symbol: "^FTSE", name: "FTSE 100", exchange: "FTSE", kind: "index", type: "指数" },
  { symbol: "^GDAXI", name: "DAX", exchange: "XETRA", kind: "index", type: "指数" },
  { symbol: "^HSI", name: "ハンセン指数", exchange: "香港", kind: "index", type: "指数" },

  { symbol: "GC=F", name: "金先物", exchange: "COMEX", kind: "commodity", type: "商品", aliases: ["ゴールド", "gold"] },
  { symbol: "SI=F", name: "銀先物", exchange: "COMEX", kind: "commodity", type: "商品", aliases: ["シルバー", "silver"] },
  { symbol: "PL=F", name: "プラチナ先物", exchange: "NYMEX", kind: "commodity", type: "商品", aliases: ["白金", "platinum"] },
  { symbol: "PA=F", name: "パラジウム先物", exchange: "NYMEX", kind: "commodity", type: "商品" },
  { symbol: "CL=F", name: "WTI原油先物", exchange: "NYMEX", kind: "commodity", type: "商品", aliases: ["原油", "oil", "WTI"] },
  { symbol: "BZ=F", name: "ブレント原油先物", exchange: "ICE", kind: "commodity", type: "商品", aliases: ["brent"] },
  { symbol: "NG=F", name: "天然ガス先物", exchange: "NYMEX", kind: "commodity", type: "商品", aliases: ["ガス"] },
  { symbol: "HG=F", name: "銅先物", exchange: "COMEX", kind: "commodity", type: "商品", aliases: ["カッパー"] },
  { symbol: "ZW=F", name: "小麦先物", exchange: "CBOT", kind: "commodity", type: "商品" },
  { symbol: "ZC=F", name: "とうもろこし先物", exchange: "CBOT", kind: "commodity", type: "商品" },
  { symbol: "PPLT", name: "アバディーン物理的プラチナ", exchange: "ARCA", kind: "etf", type: "ETF", aliases: ["プラチナETF"] },

  { symbol: "USDJPY=X", name: "ドル円", exchange: "FX", kind: "fx", type: "為替", aliases: ["ドル円", "為替"] },
  { symbol: "EURJPY=X", name: "ユーロ円", exchange: "FX", kind: "fx", type: "為替" },
  { symbol: "GBPJPY=X", name: "ポンド円", exchange: "FX", kind: "fx", type: "為替" },
  { symbol: "AUDJPY=X", name: "豪ドル円", exchange: "FX", kind: "fx", type: "為替" },
  { symbol: "EURUSD=X", name: "ユーロドル", exchange: "FX", kind: "fx", type: "為替" },
  { symbol: "GBPUSD=X", name: "ポンドドル", exchange: "FX", kind: "fx", type: "為替" },
  { symbol: "CNYJPY=X", name: "人民元円", exchange: "FX", kind: "fx", type: "為替" },
  { symbol: "DX-Y.NYB", name: "米ドル指数", exchange: "ICE", kind: "fx", type: "為替", aliases: ["ドル指数", "DXY"] },

  { symbol: "BTC-USD", name: "ビットコイン", exchange: "CRYPTO", kind: "crypto", type: "暗号資産", aliases: ["BTC", "ビットコイン"] },
  { symbol: "BTC-JPY", name: "ビットコイン/円", exchange: "CRYPTO", kind: "crypto", type: "暗号資産" },
  { symbol: "ETH-USD", name: "イーサリアム", exchange: "CRYPTO", kind: "crypto", type: "暗号資産", aliases: ["ETH"] },
  { symbol: "SOL-USD", name: "ソラナ", exchange: "CRYPTO", kind: "crypto", type: "暗号資産", aliases: ["SOL"] },
  { symbol: "XRP-USD", name: "XRP", exchange: "CRYPTO", kind: "crypto", type: "暗号資産" },

  { symbol: "^TNX", name: "米10年国債利回り", exchange: "TNX", kind: "bond", type: "債券", aliases: ["米国債", "10年債"] },
  { symbol: "^TYX", name: "米30年国債利回り", exchange: "TYX", kind: "bond", type: "債券" },
  { symbol: "^FVX", name: "米5年国債利回り", exchange: "FVX", kind: "bond", type: "債券" },
  { symbol: "^IRX", name: "米13週Tビル", exchange: "TNX", kind: "bond", type: "債券" },
  { symbol: "IEF", name: "iShares 7-10年米国債", exchange: "NASDAQ", kind: "bond", type: "ETF", aliases: ["米国債ETF"] },
  { symbol: "BND", name: "Vanguard 米国トータル債券", exchange: "NASDAQ", kind: "bond", type: "ETF" },
  { symbol: "2510.T", name: "NEXT FUNDS 国内債券・NOMURA-BPI", exchange: "東証", kind: "bond", type: "ETF", aliases: ["国債", "日本債券"] },
  { symbol: "2511.T", name: "NEXT FUNDS 外国債券・FTSE世界国債", exchange: "東証", kind: "bond", type: "ETF" },
];

export function classify(symbol: string, type?: string, exchange?: string): AssetKind {
  const t = (type ?? "").toLowerCase();
  const s = symbol.toUpperCase();
  const x = (exchange ?? "").toLowerCase();
  if (t.includes("fund") || t.includes("投信") || t.includes("mutual")) return "fund";
  if (/^[0-9A-Z]{8}$/.test(s) && !s.includes(".")) return "fund";
  if (x.includes("投信")) return "fund";
  if (
    t.includes("crypto") ||
    t.includes("cryptocurrency") ||
    /-(USD|JPY|EUR)$/.test(s) ||
    /^(BTC|ETH|SOL|XRP|DOGE)/.test(s)
  ) {
    return "crypto";
  }
  if (t.includes("currency") || t.includes("fx") || t.includes("為替") || s.endsWith("=X") || s === "DX-Y.NYB") {
    return "fx";
  }
  if (
    t.includes("future") ||
    t.includes("commodity") ||
    s.endsWith("=F") ||
    t.includes("商品")
  ) {
    return "commodity";
  }
  if (
    t.includes("bond") ||
    t.includes("treasury") ||
    t.includes("債券") ||
    t.includes("国債") ||
    /^\^(TNX|TYX|FVX|IRX)$/.test(s) ||
    ["TLT", "IEF", "BND", "BNDX", "AGG"].includes(s)
  ) {
    return "bond";
  }
  if (t.includes("etf") || t.includes("上場投信")) return "etf";
  if (t.includes("index") || t.includes("指数") || s.startsWith("^")) return "index";
  if (s.endsWith(".T") && /^\d{4}\.T$/.test(s)) {
    const n = Number(s.slice(0, 4));
    if (n === 2510 || n === 2511) return "bond";
    if (n >= 1300 && n < 2600) return "etf";
    return "jp";
  }
  if (
    s.includes(".HK") ||
    s.includes(".KS") ||
    s.includes(".TW") ||
    s.includes(".L") ||
    s.includes(".PA") ||
    s.includes(".DE") ||
    s.includes(".AS") ||
    s.includes(".SW") ||
    s.includes(".NS") ||
    s.includes(".AX") ||
    s.includes(".BO")
  ) {
    return "overseas";
  }
  return "overseas";
}

export function quoteAliases(symbol: string): string[] {
  const s = symbol.trim().toUpperCase();
  const out = [s];
  if (/^[0-9A-Za-z]{8}$/.test(s)) {
    out.push(`${s}.F`, `${s}.T`);
  }
  const usdQuote = s.match(/^USD([A-Z]{3})=X$/);
  if (usdQuote) out.push(`${usdQuote[1]}=X`);
  const usdBase = s.match(/^([A-Z]{3})=X$/);
  if (usdBase) out.push(`USD${usdBase[1]}=X`);
  const vsUsd = s.match(/^([A-Z]{3})USD=X$/);
  if (vsUsd) out.push(`${vsUsd[1]}=X`);
  const crypto = s.match(/^([A-Z]{2,5})-(USD|JPY|EUR)$/);
  if (crypto) {
    out.push(`${crypto[1]}${crypto[2]}`, `${crypto[1]}${crypto[2]}=X`);
  }
  return [...new Set(out)];
}

export function liveKind(symbol: string) {
  const s = symbol.toUpperCase();
  if (s.endsWith("=X") || s === "DX-Y.NYB") return "fx" as const;
  if (/-(USD|JPY|EUR)$/.test(s)) return "crypto" as const;
  if (s.endsWith("=F")) return "future" as const;
  if (s.startsWith("^")) return "index" as const;
  return "spot" as const;
}

export function chartTimezone(symbol: string, exchange?: string, _reported?: string) {
  const s = symbol.toUpperCase();
  const x = (exchange ?? "").toUpperCase();

  if (
    s.endsWith(".T") ||
    s === "^N225" ||
    s === "^TPX" ||
    x.includes("TOKYO") ||
    x.includes("大阪") ||
    x.includes("東証") ||
    x.includes("JPX") ||
    x.includes("OSAKA")
  ) {
    return "Asia/Tokyo";
  }
  if (s.endsWith(".HK") || s === "^HSI" || x.includes("HONG")) return "Asia/Hong_Kong";
  if (s.endsWith(".KS") || s.endsWith(".KQ") || x.includes("SEOUL") || x.includes("KSE") || x.includes("KOSDAQ")) {
    return "Asia/Seoul";
  }
  if (s.endsWith(".TW") || s.endsWith(".TWO") || x.includes("TAIWAN")) return "Asia/Taipei";
  if (s.endsWith(".SS") || s.endsWith(".SZ") || x.includes("SHANGHAI") || x.includes("SHENZHEN")) {
    return "Asia/Shanghai";
  }
  if (s.endsWith(".SI") || x.includes("SINGAPORE")) return "Asia/Singapore";
  if (s.endsWith(".TO") || s.endsWith(".V") || x.includes("TORONTO") || x.includes("TSX")) {
    return "America/Toronto";
  }
  if (s.endsWith(".SA") || x.includes("SAO PAULO") || x.includes("BOVESPA")) return "America/Sao_Paulo";
  if (s.endsWith(".MI") || x.includes("MILAN")) return "Europe/Rome";
  if (s.endsWith(".MC") || x.includes("MADRID")) return "Europe/Madrid";
  if (s.endsWith(".NS") || s.endsWith(".BO") || x.includes("NSE") || x.includes("BSE") || x.includes("INDIA")) {
    return "Asia/Kolkata";
  }
  if (s.endsWith(".L") || s === "^FTSE" || x.includes("LONDON") || x.includes("LSE")) return "Europe/London";
  if (s.endsWith(".PA") || x.includes("PARIS") || x.includes("EPA")) return "Europe/Paris";
  if (s.endsWith(".DE") || s.endsWith(".F") || s.endsWith(".DU") || s.endsWith(".HA") || s === "^GDAXI" || x.includes("FRANKFURT") || x.includes("XETRA") || x.includes("GERMANY")) {
    return "Europe/Berlin";
  }
  if (s.endsWith(".AS") || x.includes("AMSTERDAM")) return "Europe/Amsterdam";
  if (s.endsWith(".SW") || x.includes("SWISS") || x.includes("ZURICH")) return "Europe/Zurich";
  if (s.endsWith("=X") || x.includes("CCY")) return "Asia/Tokyo";
  if (/-(USD|JPY|EUR)$/.test(s) || x.includes("CRYPTO") || x.includes("CCC")) return "Asia/Tokyo";
  if (s.endsWith("=F") || x.includes("NYMEX") || x.includes("COMEX") || x.includes("CBOT")) return "America/New_York";
  if (
    s.startsWith("^") ||
    x.includes("NASDAQ") ||
    x.includes("NYSE") ||
    x.includes("ARCA") ||
    x.includes("AMEX") ||
    x.includes("NYQ") ||
    x.includes("NMS")
  ) {
    return "America/New_York";
  }
  return "America/New_York";
}

export function zoneLabelKey(
  zone: string,
): "tzTokyo" | "tzNewYork" | "tzLondon" | "tzUtc" | "tzHongKong" | "tzSeoul" | "tzTaipei" | "tzSydney" | "tzParis" | "tzBerlin" | "tzIndia" | "tzChina" | "tzSingapore" {
  if (zone === "Asia/Tokyo") return "tzTokyo";
  if (zone === "Europe/London") return "tzLondon";
  if (zone === "UTC") return "tzUtc";
  if (zone === "Asia/Hong_Kong") return "tzHongKong";
  if (zone === "Asia/Seoul") return "tzSeoul";
  if (zone === "Asia/Taipei") return "tzTaipei";
  if (zone === "Australia/Sydney") return "tzSydney";
  if (zone === "Asia/Shanghai") return "tzChina";
  if (zone === "Asia/Singapore") return "tzSingapore";
  if (zone === "Europe/Paris" || zone === "Europe/Amsterdam" || zone === "Europe/Zurich" || zone === "Europe/Rome" || zone === "Europe/Madrid") {
    return "tzParis";
  }
  if (zone === "Europe/Berlin") return "tzBerlin";
  if (zone === "Asia/Kolkata") return "tzIndia";
  return "tzNewYork";
}

export function normalizeSymbol(raw: string) {
  const s = raw.trim().toUpperCase();
  if (/^\d{4}$/.test(s)) return `${s}.T`;
  if (/^\d{3,4}\.T$/.test(s)) return s;
  return s;
}

export function lookupCatalog(symbol: string) {
  const code = normalizeSymbol(symbol);
  const bare = code.replace(/\.T$/, "");
  return (
    CATALOG.find((i) => i.symbol.toUpperCase() === code) ??
    CATALOG.find((i) => i.symbol.toUpperCase().replace(/\.T$/, "") === bare) ??
    null
  );
}

export function isCodeName(name: string, symbol: string) {
  const n = name.trim().toUpperCase();
  const s = symbol.trim().toUpperCase();
  if (!n || n === s) return true;
  if (n === s.replace(/\.T$/, "") || `${n}.T` === s) return true;
  return /^\d{3,5}(\.T)?$/.test(n);
}

export function prettyName(symbol: string, ...names: Array<string | undefined>) {
  const catalog = lookupCatalog(symbol)?.name;
  for (const name of [catalog, ...names]) {
    if (name && !isCodeName(name, symbol)) return name;
  }
  return lookupCatalog(symbol)?.name || names.find(Boolean) || symbol;
}

export function searchCatalog(query: string, kind?: AssetKind | "all"): CatalogItem[] {
  const q = query.trim().toLowerCase();
  const pool = kind && kind !== "all" ? CATALOG.filter((i) => i.kind === kind) : CATALOG;
  if (!q) return pool;
  return pool
    .filter((i) => {
      if (i.symbol.toLowerCase().includes(q)) return true;
      if (i.name.toLowerCase().includes(q)) return true;
      if (i.exchange?.toLowerCase().includes(q)) return true;
      return i.aliases?.some((a) => a.toLowerCase().includes(q)) ?? false;
    })
    .slice(0, 24);
}

export function mergeHits(live: SearchHit[], local: CatalogItem[]): SearchHit[] {
  const map = new Map<string, SearchHit>();
  for (const row of local) map.set(row.symbol.toUpperCase(), row);
  for (const row of live) {
    const key = row.symbol.toUpperCase();
    const prev = map.get(key);
    map.set(key, {
      ...prev,
      ...row,
      kind: row.kind ?? prev?.kind ?? classify(row.symbol, row.type, row.exchange),
      name: prev?.name && /[ぁ-んァ-ン一-龥]/.test(prev.name) ? prev.name : row.name,
    });
  }
  return [...map.values()]
    .sort((a, b) => searchRank(a) - searchRank(b))
    .slice(0, 24);
}

function searchRank(hit: SearchHit) {
  const s = hit.symbol.toUpperCase();
  const x = (hit.exchange ?? "").toLowerCase();
  if (s.endsWith(".T") || x.includes("東京") || x.includes("tokyo") || x.includes("jpx")) return 0;
  if (!s.includes(".") && (x.includes("nasdaq") || x.includes("nyse") || x.includes("arca"))) return 1;
  if (s.endsWith(".HK")) return 2;
  return 4;
}
