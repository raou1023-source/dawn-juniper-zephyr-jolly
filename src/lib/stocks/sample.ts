import type { Candle, ChartPayload, QuoteMeta } from "./types";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASES: Record<string, number> = {
  "7203.T": 3117,
  "6758.T": 4300,
  "9984.T": 15000,
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
  "BTC-USD": 64000,
  "ETH-USD": 3400,
  "^TNX": 4.2,
  TLT: 92,
  "2510.T": 98000,
};

function barsFor(interval: string, range: string): { count: number; step: number } {
  if (interval === "1m") return { count: 120, step: 60 };
  if (interval === "5m") return { count: range === "5d" ? 160 : 78, step: 5 * 60 };
  if (interval === "15m") return { count: 130, step: 15 * 60 };
  if (interval === "1d") {
    if (range === "1mo") return { count: 22, step: 86400 };
    if (range === "3mo") return { count: 66, step: 86400 };
    if (range === "6mo") return { count: 130, step: 86400 };
    return { count: 252, step: 86400 };
  }
  if (interval === "1wk") return { count: 260, step: 7 * 86400 };
  return { count: 180, step: 30 * 86400 };
}

export function sampleChart(
  symbol: string,
  name: string,
  range: string,
  interval: string,
): ChartPayload {
  const rnd = mulberry32(hash(symbol + ":" + range + ":" + interval));
  const { count, step } = barsFor(interval, range);
  const base = BASES[symbol] ?? 80 + (hash(symbol) % 900);
  let price = base * (0.82 + rnd() * 0.2);
  const now = Math.floor(Date.now() / 1000);
  const start = now - count * step;
  const candles: Candle[] = [];

  for (let i = 0; i < count; i++) {
    const drift = (rnd() - 0.48) * price * 0.018;
    const shock = rnd() < 0.04 ? (rnd() - 0.5) * price * 0.06 : 0;
    const open = price;
    const close = Math.max(0.5, open + drift + shock);
    const hi = Math.max(open, close) * (1 + rnd() * 0.012);
    const lo = Math.min(open, close) * (1 - rnd() * 0.012);
    const volume = Math.floor((0.4 + rnd()) * 1_200_000 * (1 + Math.abs(close - open) / open));
    candles.push({
      time: start + i * step,
      open: round(open),
      high: round(hi),
      low: round(lo),
      close: round(close),
      volume,
    });
    price = close;
  }

  const last = candles[candles.length - 1]!;
  const prev = candles[candles.length - 2] ?? last;
  applyDrift(last, symbol);
  const change = last.close - prev.close;
  const meta: QuoteMeta = {
    symbol,
    name,
    currency: guessCurrency(symbol),
    exchange: symbol.endsWith(".T") ? "TYO" : "NMS",
    price: last.close,
    previousClose: prev.close,
    change,
    changePercent: prev.close ? (change / prev.close) * 100 : 0,
    dayHigh: last.high,
    dayLow: last.low,
    volume: last.volume,
    source: "sample",
  };

  return { meta, candles, source: "sample" };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function applyDrift(candle: Candle, symbol: string) {
  const t = Math.floor(Date.now() / 1000);
  const phase = (hash(symbol) % 360) / 57.3;
  const drift = Math.sin(t / 9 + phase) * candle.close * 0.0024;
  const close = Math.max(0.5, candle.close + drift);
  candle.close = round(close);
  candle.high = round(Math.max(candle.high, close));
  candle.low = round(Math.min(candle.low, close));
}

export function sampleQuote(symbol: string, name: string): QuoteMeta {
  const chart = sampleChart(symbol, name, "1d", "5m");
  return { ...chart.meta, name: name || chart.meta.name };
}

function guessCurrency(symbol: string) {
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
