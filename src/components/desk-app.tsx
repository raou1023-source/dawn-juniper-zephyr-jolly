import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster } from "sonner";
import { getChart, getNews, getQuotes } from "@/lib/stocks/api";
import { formatPrice, currencySuffix } from "@/lib/stocks/format";
import type { NewsItem } from "@/lib/stocks/news";
import { PERIODS, isIntraday, type Candle, type QuoteMeta } from "@/lib/stocks/types";
import { periodKey, LOCALE_BCP } from "@/lib/i18n";
import {
  prettyName,
  isCodeName,
  quoteAliases,
  liveKind,
  chartTimezone,
  zoneLabelKey,
} from "@/lib/stocks/catalog";
import { revealChart } from "@/lib/scroll-chart";
import { useWatchSwipe } from "@/lib/use-watch-swipe";
import { useLocale, useT } from "@/lib/use-t";
import { LanguageSwitch } from "./language-switch";
import { PwaBoot } from "./pwa-install";
import { useDesk } from "@/stores/desk";
import { cn } from "@/lib/utils";
import { AccountMenu } from "./account-menu";
import { AlertWatcher } from "./alert-watcher";
import { AlertsMenu } from "./alerts-menu";
import { CustomizePanel } from "./customize-panel";
import { LiveControls } from "@/components/live-controls";
import { NewsPanel } from "./news-panel";
import { FundamentalsPanel } from "./fundamentals-panel";
import { PriceChart } from "./price-chart";
import { SearchDock } from "./search-dock";
import { WatchlistPanel } from "./watchlist-panel";

export function DeskApp() {
  return <DeskShell />;
}

function DeskShell() {
  useEffect(() => {
    void Promise.resolve(useDesk.persist.rehydrate()).then(() => {
      try {
        const kept = sessionStorage.getItem("kabu-sel");
        if (kept) useDesk.getState().select(kept);
      } catch {
        /* ignore */
      }
    });
  }, []);
  const selected = useDesk((s) => s.selected);
  const watchlist = useDesk((s) => s.watchlist);
  const period = useDesk((s) => s.period);
  const setPeriod = useDesk((s) => s.setPeriod);
  const settings = useDesk((s) => s.settings);
  const live = useDesk((s) => s.live);
  const liveMs = useDesk((s) => s.liveMs);
  const renameMany = useDesk((s) => s.renameMany);
  const locale = useLocale();
  const t = useT();
  const [tab, setTab] = useState<"chart" | "news" | "watch">("chart");
  const swipe = useWatchSwipe();

  const item = watchlist.find((w) => w.symbol === selected);
  const spec = PERIODS.find((p) => p.key === period) ?? PERIODS[5]!;
  const streamLive = isIntraday(period) || live;
  const quoteMs = isIntraday(period) ? 5000 : liveMs;
  const chartMs = isIntraday(period) ? 30000 : liveMs;

  const chartQ = useQuery({
    queryKey: ["chart", selected, spec.range, spec.interval],
    enabled: Boolean(selected),
    queryFn: () =>
      getChart({
        data: {
          symbol: selected,
          range: spec.range as "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "5y" | "max",
          interval: spec.interval as "1m" | "5m" | "15m" | "1d" | "1wk" | "1mo",
        },
      }),
    staleTime: streamLive ? 8_000 : 60_000,
    refetchInterval: streamLive ? chartMs : false,
    refetchIntervalInBackground: false,
  });

  const symbolsKey = watchlist.map((w) => w.symbol).join(",");
  const quotesQ = useQuery({
    queryKey: ["quotes", symbolsKey],
    enabled: watchlist.length > 0,
    queryFn: async () => {
      const codes = watchlist.map((w) => w.symbol);
      const rows: QuoteMeta[] = [];
      for (let i = 0; i < codes.length; i += 40) {
        const batch = codes.slice(i, i + 40).join(",");
        rows.push(...(await getQuotes({ data: { symbols: batch } })));
      }
      return rows;
    },
    staleTime: streamLive ? 2_000 : 60_000,
    refetchInterval: streamLive ? quoteMs : false,
    placeholderData: keepPreviousData,
  });

  const symbolNewsQ = useQuery({
    queryKey: ["desk-news", selected, locale],
    queryFn: () => getNews({ data: { symbol: selected || undefined, locale, translate: true } }),
    staleTime: 180_000,
  });
  const marketNewsQ = useQuery({
    queryKey: ["desk-news", "", locale],
    queryFn: () => getNews({ data: { locale, translate: true } }),
    staleTime: 180_000,
  });

  const quotes = useMemo(() => {
    const map = new Map<string, QuoteMeta>();
    for (const row of quotesQ.data ?? []) map.set(row.symbol.toUpperCase(), row);
    return map;
  }, [quotesQ.data]);

  const allNews = useMemo(() => {
    const map = new Map<string, NewsItem>();
    for (const n of [...(symbolNewsQ.data ?? []), ...(marketNewsQ.data ?? [])]) {
      map.set(n.id, n);
    }
    return [...map.values()];
  }, [symbolNewsQ.data, marketNewsQ.data]);

  const liveQuote = pickLiveQuote(quotes, selected);
  const chartMeta = chartQ.data?.meta;
  const meta = liveQuote
    ? {
        ...chartMeta,
        ...liveQuote,
        timezone: chartTimezone(selected, chartMeta?.exchange || liveQuote.exchange),
      }
    : chartMeta
      ? { ...chartMeta, timezone: chartTimezone(selected, chartMeta.exchange) }
      : chartMeta;
  const axisZone = chartTimezone(selected, meta?.exchange, meta?.timezone);

  useEffect(() => {
    const pending: { symbol: string; name: string }[] = [];
    for (const row of watchlist) {
      if (!isCodeName(row.name, row.symbol)) continue;
      const quote = quotes.get(row.symbol.toUpperCase());
      const fromChart = row.symbol === selected ? chartQ.data?.meta : undefined;
      const next = prettyName(row.symbol, quote?.name, fromChart?.name, row.name);
      if (next && !isCodeName(next, row.symbol)) pending.push({ symbol: row.symbol, name: next });
    }
    if (pending.length) renameMany(pending);
  }, [quotes, chartQ.data?.meta, selected, renameMany, watchlist]);

  const candles = useMemo(
    () => applyQuote(chartQ.data?.candles, liveQuote),
    [chartQ.data?.candles, liveQuote],
  );

  const firstSelect = useRef(true);
  useEffect(() => {
    if (firstSelect.current) {
      firstSelect.current = false;
      return;
    }
    setTab("chart");
    if (window.matchMedia("(max-width: 767px)").matches) revealChart();
  }, [selected]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      if (mq.matches) setTab((cur) => (cur === "watch" ? "chart" : cur));
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const up = (meta?.change ?? 0) >= 0;
  const currency = meta ? currencySuffix(meta.currency, selected) : "";

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-bg text-fg">
      <Toaster theme="dark" position="top-center" />
      <PwaBoot />
      <AlertWatcher quotes={quotes} news={allNews} />
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-3 py-2 md:px-6">
        <div>
          <p className="font-display text-xl tracking-tight">KABU</p>
          <p className="text-[11px] text-muted">{t("tagline")}</p>
        </div>
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5">
          <div className="flex rounded-md bg-elevated p-0.5">
            {(["chart", "news", "watch"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "h-8 rounded px-2.5 text-xs md:min-w-16",
                  id === "watch" && "md:hidden",
                  tab === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                )}
              >
                {t(id === "chart" ? "tabChart" : id === "news" ? "tabNews" : "tabWatch")}
              </button>
            ))}
          </div>
          <LiveControls
            updatedAt={quotesQ.dataUpdatedAt}
            fetching={quotesQ.isFetching || chartQ.isFetching}
            locked={isIntraday(period)}
          />
          <AlertsMenu />
          <LanguageSwitch />
          <AccountMenu />
        </div>
      </header>
      <CustomizePanel />
      <div className="grid min-h-0 flex-1 md:grid-cols-[260px_1fr]">
        <div className="hidden min-h-0 md:block">
          <WatchlistPanel quotes={quotes} />
        </div>
        <main className="flex min-h-0 min-w-0 flex-col">
          {tab === "news" ? (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <NewsPanel symbol={selected} name={prettyName(selected, item?.name, meta?.name)} />
            </div>
          ) : tab === "watch" ? (
            <div className="min-h-0 flex-1 overflow-hidden md:hidden">
              <WatchlistPanel quotes={quotes} />
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-[calc(4.75rem+env(safe-area-inset-bottom))]">
              <div id="kabu-chart" className="flex min-h-0 flex-1 flex-col">
                <div className="shrink-0 border-b border-border bg-bg px-4 py-2 md:px-6">
                  <div
                    className="flex flex-wrap items-end justify-between gap-3 touch-pan-y select-none"
                    onPointerDown={swipe.onPointerDown}
                    onPointerUp={swipe.onPointerUp}
                    onPointerCancel={swipe.onPointerCancel}
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-muted">{selected || "—"}</p>
                      <h2 className="truncate font-display text-xl tracking-tight md:text-3xl">
                        {prettyName(selected, item?.name, meta?.name) || t("pickSymbol")}
                      </h2>
                    </div>
                    {meta ? (
                      <div className="text-right">
                        <p className="font-mono text-xl tabular-nums tracking-tight md:text-2xl">
                          {formatPrice(meta.price, meta.currency, selected, locale)}
                          <span className="ml-1 text-xs text-muted">{currency}</span>
                        </p>
                        <p className={cn("font-mono text-sm tabular-nums", up ? "text-up" : "text-down")}>
                          {up ? "+" : ""}
                          {formatPrice(meta.change, meta.currency, selected, locale)} ({up ? "+" : ""}
                          {meta.changePercent.toFixed(2)}%)
                        </p>
                        <ChartAsOf symbol={selected} candles={candles} timezone={axisZone} />
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {PERIODS.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setPeriod(p.key)}
                        className={cn(
                          "h-8 rounded-md px-2.5 text-xs transition-colors duration-[var(--motion-quick)]",
                          period === p.key
                            ? "bg-accent text-accent-fg"
                            : "bg-elevated text-muted hover:text-fg",
                        )}
                      >
                        {t(periodKey(p.key))}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative min-h-[220px] flex-1 bg-surface">
                {!selected ? (
                  <Empty msg={t("addWatchFirst")} />
                ) : chartQ.isLoading && !candles.length ? (
                  <Empty msg={t("chartLoading")} />
                ) : !candles.length ? (
                  <Empty msg={t("chartEmpty")} />
                ) : (
                  <PriceChart
                    key={`${settings.kind}-${selected}-${period}-${axisZone}`}
                    candles={candles}
                    settings={settings}
                    symbol={selected}
                    currency={meta?.currency}
                    period={period}
                    timezone={axisZone}
                  />
                )}
                {chartQ.data?.source === "sample" ? (
                  <p className="pointer-events-none absolute right-3 bottom-3 text-[10px] text-faint">
                    {t("sampleData")}
                  </p>
                ) : null}
              </div>
              </div>
              {selected ? (
                <FundamentalsPanel
                  symbol={selected}
                  currency={meta?.currency}
                  week52High={meta?.week52High}
                  week52Low={meta?.week52Low}
                />
              ) : null}
            </div>
          )}
        </main>
      </div>
      <SearchDock />
    </div>
  );
}

function pickLiveQuote(quotes: Map<string, QuoteMeta>, selected: string) {
  for (const code of [selected, ...quoteAliases(selected)]) {
    const row = quotes.get(code.toUpperCase());
    if (row && row.source !== "sample") return row;
  }
  return undefined;
}

function applyQuote(candles: Candle[] | undefined, quote?: QuoteMeta): Candle[] {
  if (!candles?.length) return [];
  if (!quote || quote.source === "sample") return candles;
  const last = candles[candles.length - 1]!;
  if (last.close === quote.price) return candles;
  const prev = candles.length >= 2 ? candles[candles.length - 2]!.time : last.time;
  const barSec = Math.max(60, last.time - prev);
  const ageSec = Date.now() / 1000 - last.time;
  if (barSec < 3 * 3600 && ageSec > 3 * 3600) return candles;
  if (barSec >= 3 * 3600 && ageSec > 4 * 86400) return candles;
  const drift = Math.abs(quote.price - last.close) / Math.max(Math.abs(last.close), 1e-9);
  const kind = liveKind(quote.symbol);
  const cap = kind === "crypto" ? 0.18 : kind === "fx" ? 0.03 : kind === "future" ? 0.08 : 0.1;
  if (drift > cap) return candles;
  const next = candles.slice();
  next[next.length - 1] = {
    ...last,
    close: quote.price,
    high: Math.max(last.high, quote.price),
    low: Math.min(last.low, quote.price),
  };
  return next;
}

function ChartAsOf({
  symbol,
  candles,
  timezone,
}: {
  symbol: string;
  candles: Candle[];
  timezone?: string;
}) {
  const t = useT();
  const locale = useLocale();
  const last = candles[candles.length - 1];
  if (!last) return null;
  const zone = chartTimezone(symbol, undefined, timezone);
  const age = Date.now() / 1000 - last.time;
  const fmt = (z: string) =>
    new Date(last.time * 1000).toLocaleString(LOCALE_BCP[locale], {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: z,
    });
  const market = fmt(zone);
  const stamp =
    zone === "Asia/Tokyo"
      ? t("asOfZone", { t: market, z: t("tzTokyo") })
      : t("asOfBoth", { t: market, z: t(zoneLabelKey(zone)), j: fmt("Asia/Tokyo") });
  const kind = liveKind(symbol);
  const alwaysOn = kind === "fx" || kind === "crypto";
  const prev = candles.length >= 2 ? candles[candles.length - 2]!.time : last.time;
  const barSec = Math.max(60, last.time - prev);
  const closed = alwaysOn ? false : barSec >= 20 * 3600 ? age > 3 * 86400 : age > 2 * 3600;
  return (
    <p className="mt-1 text-[11px] text-faint">
      {stamp}
      {closed
        ? ` · ${t("sessionClosed")}`
        : age > 8 * 60 && age < 45 * 60
          ? ` · ${t("feedDelay")}`
          : null}
    </p>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center text-sm text-muted">
      {msg}
    </div>
  );
}
