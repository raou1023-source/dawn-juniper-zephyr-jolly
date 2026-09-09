import type { Candle } from "./types";

export type LinePoint = { time: number; value: number };

export function sma(candles: Candle[], period: number): LinePoint[] {
  const out: LinePoint[] = [];
  let sum = 0;
  for (let i = 0; i < candles.length; i++) {
    sum += candles[i]!.close;
    if (i >= period) sum -= candles[i - period]!.close;
    if (i >= period - 1) {
      out.push({ time: candles[i]!.time, value: sum / period });
    }
  }
  return out;
}

export function ema(candles: Candle[], period: number): LinePoint[] {
  const out: LinePoint[] = [];
  if (candles.length === 0) return out;
  const k = 2 / (period + 1);
  let prev = candles[0]!.close;
  for (let i = 0; i < candles.length; i++) {
    const val = candles[i]!.close * k + prev * (1 - k);
    prev = val;
    if (i >= period - 1) out.push({ time: candles[i]!.time, value: val });
  }
  return out;
}

export function bollinger(candles: Candle[], period = 20, mult = 2) {
  const mid: LinePoint[] = [];
  const upper: LinePoint[] = [];
  const lower: LinePoint[] = [];
  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += candles[j]!.close;
    const mean = sum / period;
    let sq = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const d = candles[j]!.close - mean;
      sq += d * d;
    }
    const sd = Math.sqrt(sq / period);
    const t = candles[i]!.time;
    mid.push({ time: t, value: mean });
    upper.push({ time: t, value: mean + mult * sd });
    lower.push({ time: t, value: mean - mult * sd });
  }
  return { mid, upper, lower };
}
