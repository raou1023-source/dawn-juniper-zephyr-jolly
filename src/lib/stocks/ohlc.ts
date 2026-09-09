import type { Candle } from "./types";

export function sanitizeCandles(rows: Candle[]): Candle[] {
  const cleaned: Candle[] = [];
  let prev = 0;
  for (const raw of rows) {
    if (!Number.isFinite(raw.open) || !Number.isFinite(raw.close)) continue;
    const high = Math.max(raw.high, raw.open, raw.close);
    const low = Math.min(raw.low, raw.open, raw.close);
    if (!Number.isFinite(high) || !Number.isFinite(low) || high < low) continue;
    let time = Math.floor(raw.time);
    if (time <= prev) time = prev + 1;
    cleaned.push({
      time,
      open: raw.open,
      high,
      low,
      close: raw.close,
      volume: raw.volume || 0,
    });
    prev = time;
  }
  return cleaned;
}
