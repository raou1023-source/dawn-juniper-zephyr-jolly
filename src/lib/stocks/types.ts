export type ChartKind = "candle" | "line" | "area" | "bar";

export type PeriodKey =
  | "1d"
  | "5d"
  | "1mo"
  | "3mo"
  | "6mo"
  | "1y"
  | "5y"
  | "max";

export type PeriodDef = {
  key: PeriodKey;
  label: string;
  range: string;
  interval: string;
};

export const PERIODS: PeriodDef[] = [
  { key: "1d", label: "1日", range: "1d", interval: "1m" },
  { key: "5d", label: "5日", range: "5d", interval: "5m" },
  { key: "1mo", label: "1ヶ月", range: "1mo", interval: "1d" },
  { key: "3mo", label: "3ヶ月", range: "3mo", interval: "1d" },
  { key: "6mo", label: "6ヶ月", range: "6mo", interval: "1d" },
  { key: "1y", label: "1年", range: "1y", interval: "1d" },
  { key: "5y", label: "5年", range: "5y", interval: "1wk" },
  { key: "max", label: "全期間", range: "max", interval: "1mo" },
];

export function isIntraday(period: PeriodKey) {
  return period === "1d" || period === "5d";
}

export type AssetKind =
  | "jp"
  | "overseas"
  | "etf"
  | "fund"
  | "index"
  | "commodity"
  | "fx"
  | "crypto"
  | "bond";

export type WatchItem = {
  symbol: string;
  name: string;
  exchange?: string;
  kind?: AssetKind;
};

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type QuoteMeta = {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh?: number;
  dayLow?: number;
  volume?: number;
  week52High?: number;
  week52Low?: number;
  timezone?: string;
  source?: "live" | "sample";
};

export type ChartPayload = {
  meta: QuoteMeta;
  candles: Candle[];
  source: "live" | "sample";
};

export type Fundamentals = {
  symbol: string;
  per?: number;
  pbr?: number;
  eps?: number;
  dividendRate?: number;
  dividendYield?: number;
  payout?: number;
  marketCap?: number;
  roe?: number;
  week52High?: number;
  week52Low?: number;
};

export type SearchHit = {
  symbol: string;
  name: string;
  exchange?: string;
  type?: string;
  kind?: AssetKind;
};

export type ChartSettings = {
  kind: ChartKind;
  upColor: string;
  downColor: string;
  wickColor: string;
  lineColor: string;
  areaTop: string;
  areaBottom: string;
  background: "ink" | "paper";
  showGrid: boolean;
  showVolume: boolean;
  showCrosshair: boolean;
  showLastPrice: boolean;
  sma20: boolean;
  sma50: boolean;
  sma200: boolean;
  ema12: boolean;
  ema26: boolean;
  bollinger: boolean;
  logScale: boolean;
};

export const DEFAULT_SETTINGS: ChartSettings = {
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
  sma20: false,
  sma50: false,
  sma200: false,
  ema12: false,
  ema26: false,
  bollinger: false,
  logScale: false,
};

export const DEFAULT_WATCHLIST: WatchItem[] = [
  { symbol: "7203.T", name: "トヨタ自動車", exchange: "TYO" },
  { symbol: "6758.T", name: "ソニーグループ", exchange: "TYO" },
  { symbol: "9984.T", name: "ソフトバンクG", exchange: "TYO" },
  { symbol: "7974.T", name: "任天堂", exchange: "TYO" },
  { symbol: "AAPL", name: "Apple", exchange: "NMS" },
  { symbol: "NVDA", name: "NVIDIA", exchange: "NMS" },
  { symbol: "MSFT", name: "Microsoft", exchange: "NMS" },
  { symbol: "^N225", name: "日経平均", exchange: "Osaka" },
];
