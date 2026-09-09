import type { PeriodKey } from "./types";
import type { UTCTimestamp } from "lightweight-charts";

export type SeriesTime = UTCTimestamp | { year: number; month: number; day: number };

export function isIntradayPeriod(period?: PeriodKey) {
  return period === "1d" || period === "5d";
}

export function unixToBusinessDay(unix: number, zone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date(unix * 1000));
  const pick = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: pick("year"), month: pick("month"), day: pick("day") };
}

export function toSeriesTime(unix: number, period: PeriodKey | undefined, zone: string): SeriesTime {
  if (isIntradayPeriod(period)) return Math.floor(unix) as UTCTimestamp;
  return unixToBusinessDay(unix, zone);
}

export function seriesTimeKey(time: unknown): string {
  if (typeof time === "number") return `u:${time}`;
  if (time && typeof time === "object") {
    const row = time as { year?: number; month?: number; day?: number; timestamp?: number };
    if (row.year && row.month && row.day) return `d:${row.year}-${row.month}-${row.day}`;
    if (typeof row.timestamp === "number") return `u:${row.timestamp}`;
  }
  return "";
}
