import { useEffect, useRef, useState } from "react";
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  type MouseEventParams,
  type UTCTimestamp,
} from "lightweight-charts";
import { bollinger, ema, sma } from "@/lib/stocks/indicators";
import { formatPrice } from "@/lib/stocks/format";
import { LOCALE_BCP } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/use-t";
import { chartTimezone } from "@/lib/stocks/catalog";
import { seriesTimeKey, toSeriesTime } from "@/lib/stocks/market-time";
import type { Candle, ChartSettings, PeriodKey } from "@/lib/stocks/types";

type Props = {
  candles: Candle[];
  settings: ChartSettings;
  symbol?: string;
  currency?: string;
  period?: PeriodKey;
  timezone?: string;
};

const SMA_COLORS = {
  20: "#7aa2c4",
  50: "#c4a36a",
  200: "#9b8fd4",
};

type AnySeries =
  | ISeriesApi<"Candlestick">
  | ISeriesApi<"Bar">
  | ISeriesApi<"Line">
  | ISeriesApi<"Area">
  | ISeriesApi<"Histogram">;

export function PriceChart({
  candles,
  settings,
  symbol = "",
  currency = "",
  period,
  timezone,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainRef = useRef<AnySeries | null>(null);
  const extraRef = useRef<AnySeries[]>([]);
  const candlesRef = useRef(candles);
  const periodRef = useRef(period);
  const zoneRef = useRef(timezone || chartTimezone(symbol));
  candlesRef.current = candles;
  periodRef.current = period;
  zoneRef.current = timezone || chartTimezone(symbol);
  const countRef = useRef(0);
  const hoverRef = useRef<Candle | null>(null);
  const pressRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const timerRef = useRef(0);
  const axisHintRef = useRef<HTMLParagraphElement>(null);
  const [inspect, setInspect] = useState<Inspect | null>(null);
  candlesRef.current = candles;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const ink = settings.background === "ink";
    const bg = ink ? "#14161a" : "#f3f1ec";
    const text = ink ? "#8b909a" : "#5c616b";
    const grid = settings.showGrid
      ? ink
        ? "rgba(232,234,238,0.06)"
        : "rgba(22,24,29,0.08)"
      : "transparent";
    const border = ink ? "#2a2e36" : "#d7d2c8";

    const size = host.getBoundingClientRect();
    const fmt = scaleFormat(symbol, currency);
    const chart = createChart(host, {
      width: Math.max(1, Math.floor(size.width)),
      height: Math.max(1, Math.floor(size.height)),
      layout: {
        background: { color: bg },
        textColor: text,
        fontFamily: "IBM Plex Sans, Hiragino Sans, sans-serif",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: grid },
        horzLines: { color: grid },
      },
      crosshair: {
        mode: settings.showCrosshair ? 1 : 2,
        vertLine: {
          visible: settings.showCrosshair,
          color: ink ? "rgba(197,205,216,0.35)" : "rgba(22,24,29,0.25)",
          width: 1,
          style: 3,
        },
        horzLine: {
          visible: settings.showCrosshair,
          color: ink ? "rgba(197,205,216,0.35)" : "rgba(22,24,29,0.25)",
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: border,
        mode: settings.logScale ? 1 : 0,
      },
      timeScale: {
        borderColor: border,
        visible: true,
        timeVisible: true,
        secondsVisible: false,
        ticksVisible: true,
        barSpacing: 8,
        minBarSpacing: 2,
        rightOffset: 4,
        lockVisibleTimeRangeOnResize: false,
        shiftVisibleRangeOnNewBar: false,
        fixLeftEdge: false,
        fixRightEdge: false,
        tickMarkFormatter: (time: number | { year: number; month: number; day: number }, tickMarkType: number) =>
          formatAxisTime(time, candlesRef.current, periodRef.current, tickMarkType, zoneRef.current),
      },
      localization: {
        locale: "ja-JP",
        dateFormat: "yyyy/MM/dd",
        timeFormatter: (time: number | { year: number; month: number; day: number }) =>
          formatAxisTime(time, candlesRef.current, periodRef.current, "label", zoneRef.current),
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: { time: true, price: true },
        axisDoubleClickReset: { time: false, price: true },
      },
    });
    chartRef.current = chart;

    if (settings.kind === "candle") {
      mainRef.current = chart.addCandlestickSeries({
        upColor: bg,
        downColor: settings.downColor,
        borderVisible: true,
        borderUpColor: settings.upColor,
        borderDownColor: settings.downColor,
        wickVisible: true,
        wickUpColor: settings.upColor,
        wickDownColor: settings.downColor,
        lastValueVisible: settings.showLastPrice,
        priceLineVisible: settings.showLastPrice,
        priceFormat: fmt,
      });
    } else if (settings.kind === "bar") {
      mainRef.current = chart.addBarSeries({
        upColor: settings.upColor,
        downColor: settings.downColor,
        thinBars: true,
        openVisible: true,
        lastValueVisible: settings.showLastPrice,
        priceLineVisible: settings.showLastPrice,
        priceFormat: fmt,
      });
    } else if (settings.kind === "area") {
      mainRef.current = chart.addAreaSeries({
        lineColor: settings.lineColor,
        topColor: settings.areaTop,
        bottomColor: settings.areaBottom,
        lineWidth: 2,
        lastValueVisible: settings.showLastPrice,
        priceLineVisible: settings.showLastPrice,
        priceFormat: fmt,
        crosshairMarkerVisible: true,
      });
    } else {
      mainRef.current = chart.addLineSeries({
        color: settings.lineColor,
        lineWidth: 2,
        lastValueVisible: settings.showLastPrice,
        priceLineVisible: settings.showLastPrice,
        priceFormat: fmt,
        crosshairMarkerVisible: true,
      });
    }

    extraRef.current = [];
    paintSeries(chart, settings, candlesRef.current, mainRef, extraRef, periodRef.current, zoneRef.current);
    countRef.current = candlesRef.current.length;

    const onRange = () => {
      const span = chart.timeScale().getVisibleRange();
      if (!span || !axisHintRef.current) return;
      const from = formatAxisTime(span.from, candlesRef.current, periodRef.current, "label", zoneRef.current);
      const to = formatAxisTime(span.to, candlesRef.current, periodRef.current, "label", zoneRef.current);
      axisHintRef.current.textContent = from && to ? `${from}  →  ${to}` : "";
    };
    chart.timeScale().subscribeVisibleTimeRangeChange(onRange);
    requestAnimationFrame(() => {
      fitReadable(chart, candlesRef.current.length, periodRef.current);
      onRange();
    });

    const onMove = (param: MouseEventParams) => {
      hoverRef.current = candleAt(candlesRef.current, param, periodRef.current, zoneRef.current);
    };
    chart.subscribeCrosshairMove(onMove);

    const clearTimer = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = 0;
    };

    const onDown = (e: PointerEvent) => {
      pressRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        const candle = hoverRef.current ?? nearestCandle(candlesRef.current, chart, e, host, periodRef.current, zoneRef.current);
        if (!candle) return;
        const box = host.getBoundingClientRect();
        setInspect({
          candle,
          x: Math.min(Math.max(12, e.clientX - box.left), box.width - 180),
          y: Math.min(Math.max(12, e.clientY - box.top - 8), box.height - 120),
        });
      }, 420);
    };
    const onMovePtr = (e: PointerEvent) => {
      const start = pressRef.current;
      if (!start) return;
      if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 12) {
        pressRef.current = null;
        clearTimer();
      }
    };
    const onUp = () => {
      pressRef.current = null;
      clearTimer();
    };

    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onMovePtr);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);
    host.addEventListener("contextmenu", (e) => e.preventDefault());

    const ro = new ResizeObserver(() => {
      const { width, height } = host.getBoundingClientRect();
      if (width > 0 && height > 0) {
        chart.applyOptions({ width, height });
      }
    });
    ro.observe(host);

    return () => {
      ro.disconnect();
      clearTimer();
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMovePtr);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      chart.timeScale().unsubscribeVisibleTimeRangeChange(onRange);
      chart.unsubscribeCrosshairMove(onMove);
      chart.remove();
      chartRef.current = null;
      mainRef.current = null;
      extraRef.current = [];
    };
  }, [settings, symbol, currency, timezone]);

  useEffect(() => {
    const chart = chartRef.current;
    const main = mainRef.current;
    if (!chart || !main || !candles.length) return;
    const prevCount = countRef.current;
    const range = chart.timeScale().getVisibleLogicalRange();
    paintSeries(chart, settings, candles, mainRef, extraRef, period, timezone || chartTimezone(symbol));
    if (prevCount === 0 || !range) {
      requestAnimationFrame(() => fitReadable(chart, candles.length, period));
    } else if (candles.length !== prevCount) {
      const shift = candles.length - prevCount;
      chart.timeScale().setVisibleLogicalRange({
        from: range.from + Math.max(0, shift),
        to: range.to + Math.max(0, shift),
      });
    }
    countRef.current = candles.length;
  }, [candles, settings, period, timezone, symbol]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div
        ref={hostRef}
        className="relative min-h-0 flex-1 touch-manipulation"
      >
        {inspect ? (
          <CandleTip
            inspect={inspect}
            symbol={symbol}
            currency={currency}
            timezone={timezone}
            onClose={() => setInspect(null)}
          />
        ) : null}
      </div>
      <p
        ref={axisHintRef}
        className="shrink-0 border-t border-border bg-surface px-3 py-1 text-center font-mono text-[11px] text-muted tabular-nums"
      />
    </div>
  );
}

type Inspect = { candle: Candle; x: number; y: number };

function candleAt(candles: Candle[], param: MouseEventParams, period?: PeriodKey, zone?: string): Candle | null {
  const key = seriesTimeKey(param.time);
  if (!key) return null;
  const tz = zone || "Asia/Tokyo";
  return candles.find((c) => seriesTimeKey(toSeriesTime(c.time, period, tz)) === key) ?? null;
}

function nearestCandle(
  candles: Candle[],
  chart: IChartApi,
  e: PointerEvent,
  host: HTMLDivElement,
  period?: PeriodKey,
  zone = "Asia/Tokyo",
): Candle | null {
  if (!candles.length) return null;
  const x = e.clientX - host.getBoundingClientRect().left;
  const time = chart.timeScale().coordinateToTime(x);
  const key = seriesTimeKey(time);
  const hit = candles.find((c) => seriesTimeKey(toSeriesTime(c.time, period, zone)) === key);
  if (hit) return hit;
  return candles[candles.length - 1] ?? null;
}

function CandleTip({
  inspect,
  symbol,
  currency,
  timezone,
  onClose,
}: {
  inspect: Inspect;
  symbol: string;
  currency: string;
  timezone?: string;
  onClose: () => void;
}) {
  const t = useT();
  const locale = useLocale();
  const c = inspect.candle;
  const up = c.close >= c.open;
  const when = new Date(c.time * 1000).toLocaleString(LOCALE_BCP[locale], {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: chartTimezone(symbol, undefined, timezone),
  });
  const n = (v: number) => formatPrice(v, currency, symbol, locale);
  return (
    <div
      className="absolute z-20 min-w-40 rounded-md border border-border bg-elevated/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm"
      style={{ left: inspect.x, top: inspect.y }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="text-[11px] text-muted">{when}</p>
        <button type="button" onClick={onClose} className="text-[11px] text-faint hover:text-fg">
          {t("dismiss")}
        </button>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono tabular-nums">
        <dt className="text-faint">{t("open")}</dt>
        <dd className="text-right text-fg">{n(c.open)}</dd>
        <dt className="text-faint">{t("high")}</dt>
        <dd className="text-right text-fg">{n(c.high)}</dd>
        <dt className="text-faint">{t("low")}</dt>
        <dd className="text-right text-fg">{n(c.low)}</dd>
        <dt className="text-faint">{t("close")}</dt>
        <dd className={up ? "text-right text-up" : "text-right text-down"}>{n(c.close)}</dd>
      </dl>
    </div>
  );
}

function safeZone(zone?: string) {
  if (!zone) return "Asia/Tokyo";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone }).format(new Date());
    return zone;
  } catch {
    return "Asia/Tokyo";
  }
}

function scaleFormat(symbol: string, currency: string) {
  if (/\^=(TNX|TYX|FVX|IRX)$/i.test(symbol) || /^\^(TNX|TYX|FVX|IRX)$/i.test(symbol)) {
    return { type: "price" as const, precision: 3, minMove: 0.001 };
  }
  if (/=X$/i.test(symbol) && /JPY/i.test(symbol)) {
    return { type: "price" as const, precision: 3, minMove: 0.001 };
  }
  if (/=X$/i.test(symbol)) {
    return { type: "price" as const, precision: 5, minMove: 0.00001 };
  }
  if (currency === "JPY" || /\.T$/i.test(symbol)) {
    return { type: "price" as const, precision: 1, minMove: 0.1 };
  }
  return { type: "price" as const, precision: 2, minMove: 0.01 };
}

function toBarPoint(c: Candle, mode: "candle" | "bar", period?: PeriodKey, zone = "Asia/Tokyo") {
  const open = c.open;
  const close = c.close;
  let high = Math.max(c.high, open, close);
  let low = Math.min(c.low, open, close);
  if (mode === "candle") {
    const span = Math.max(Math.abs(close) * 0.0012, Math.abs(close - open), 1e-6);
    if (high - low < span) {
      const mid = (open + close) / 2;
      high = mid + span / 2;
      low = mid - span / 2;
    }
  }
  return {
    time: toSeriesTime(c.time, period, zone),
    open,
    high,
    low,
    close,
  };
}

function uniqueSeries<T extends { time: unknown }>(rows: T[]) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const row of rows) {
    const key = seriesTimeKey(row.time);
    if (!key) continue;
    if (seen.has(key)) {
      out[out.length - 1] = row;
      continue;
    }
    seen.add(key);
    out.push(row);
  }
  return out;
}

function paintSeries(
  chart: IChartApi,
  settings: ChartSettings,
  candles: Candle[],
  mainRef: { current: AnySeries | null },
  extraRef: { current: AnySeries[] },
  period?: PeriodKey,
  zone = "Asia/Tokyo",
) {
  const mode = settings.kind === "bar" ? "bar" : "candle";
  const mapped = uniqueSeries(candles.map((c) => toBarPoint(c, mode, period, zone)));
  const lineData = uniqueSeries(
    candles
      .filter((c) => Number.isFinite(c.close))
      .map((c) => ({
        time: toSeriesTime(c.time, period, zone),
        value: c.close,
      })),
  );

  const main = mainRef.current;
  if (!main) return;
  if (settings.kind === "candle" || settings.kind === "bar") {
    (main as ISeriesApi<"Candlestick">).setData(mapped);
  } else {
    (main as ISeriesApi<"Line">).setData(lineData);
  }

  for (const s of extraRef.current) {
    try {
      chart.removeSeries(s);
    } catch {
      /* already gone */
    }
  }
  extraRef.current = [];

  const addLine = (pts: { time: number; value: number }[], color: string, width = 1) => {
    if (pts.length < 2) return;
    const s = chart.addLineSeries({
      color,
      lineWidth: width as 1 | 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });
    s.setData(pts.map((p) => ({ time: toSeriesTime(p.time, period, zone), value: p.value })));
    extraRef.current.push(s);
  };

  const ink = settings.background === "ink";
  if (settings.sma20) addLine(sma(candles, 20), SMA_COLORS[20]);
  if (settings.sma50) addLine(sma(candles, 50), SMA_COLORS[50]);
  if (settings.sma200) addLine(sma(candles, 200), SMA_COLORS[200], 2);
  if (settings.ema12) addLine(ema(candles, 12), "#6ec8c0");
  if (settings.ema26) addLine(ema(candles, 26), "#d08a6a");
  if (settings.bollinger) {
    const bb = bollinger(candles);
    addLine(bb.upper, ink ? "rgba(197,205,216,0.45)" : "rgba(22,24,29,0.35)");
    addLine(bb.mid, ink ? "rgba(197,205,216,0.7)" : "rgba(22,24,29,0.5)");
    addLine(bb.lower, ink ? "rgba(197,205,216,0.45)" : "rgba(22,24,29,0.35)");
  }

  if (settings.showVolume && candles.some((c) => c.volume > 0)) {
    const vol = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "vol",
      lastValueVisible: false,
      priceLineVisible: false,
    });
    chart.priceScale("vol").applyOptions({
      scaleMargins: { top: 0.78, bottom: 0 },
    });
    vol.setData(
      candles.map((c) => ({
        time: toSeriesTime(c.time, period, zone),
        value: c.volume,
        color: c.close >= c.open ? settings.upColor + "99" : settings.downColor + "99",
      })),
    );
    extraRef.current.push(vol);
  }
}

function fitReadable(chart: IChartApi, count: number, period?: PeriodKey) {
  if (count < 2) return;
  const width = chart.timeScale().width() || 480;
  const spacing = period === "1d" || period === "5d" ? 7 : period === "max" || period === "5y" ? 8 : 9;
  const visible = Math.max(24, Math.min(count, Math.floor(width / spacing) - 2));
  chart.timeScale().applyOptions({ barSpacing: spacing, rightOffset: 4 });
  chart.timeScale().setVisibleLogicalRange({
    from: count - visible,
    to: count + 2,
  });
}

function isIntradayData(candles: Candle[]) {
  if (candles.length < 2) return false;
  return candles[1]!.time - candles[0]!.time < 20 * 3600;
}

function formatAxisTime(
  time: unknown,
  candles: Candle[],
  period: PeriodKey | undefined,
  mark: number | "label",
  zone = "Asia/Tokyo",
) {
  if (time && typeof time === "object" && "year" in time && "month" in time && "day" in time) {
    const bd = time as { year: number; month: number; day: number };
    const y = String(bd.year);
    const mo = String(bd.month);
    const d = String(bd.day);
    if (mark === "label") return `${y}/${mo}/${d}`;
    if (typeof mark === "number" && mark <= 0) return y;
    if (mark === 1) return `${y}/${mo}`;
    return `${mo}/${d}`;
  }
  const unix =
    typeof time === "number"
      ? time
      : typeof time === "object" && time && "timestamp" in time
        ? Number((time as { timestamp: number }).timestamp)
        : NaN;
  if (!Number.isFinite(unix)) return "";
  const date = new Date(unix * 1000);
  let tz = zone;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz }).format(date);
  } catch {
    tz = "Asia/Tokyo";
  }
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: tz,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const y = pick("year");
  const mo = pick("month");
  const d = pick("day");
  const hh = pick("hour");
  const mm = pick("minute");
  const clock = `${hh}:${mm}`;
  const day = `${mo}/${d}`;
  const intraday = period === "1d" || period === "5d" || isIntradayData(candles);
  if (mark === "label") {
    return intraday ? `${day} ${clock}` : `${y}/${day}`;
  }
  if (mark >= 3 || (intraday && mark >= 2)) return clock;
  if (mark === 2) return intraday ? `${day} ${clock}` : day;
  if (mark === 1) return `${y}/${mo}`;
  return y;
}

