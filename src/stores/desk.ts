import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_SETTINGS,
  DEFAULT_WATCHLIST,
  type ChartSettings,
  type PeriodKey,
  type WatchItem,
} from "@/lib/stocks/types";
import { classify, lookupCatalog, normalizeSymbol } from "@/lib/stocks/catalog";
import { safeHexColor, safeLocale, safeName, safeSymbol, safeUuid, stripTags } from "@/lib/safe";
import type { Locale } from "@/lib/i18n";
import type { DeskAlert } from "@/lib/stocks/news";

type DeskState = {
  watchlist: WatchItem[];
  selected: string;
  period: PeriodKey;
  settings: ChartSettings;
  live: boolean;
  liveMs: number;
  notifyEnabled: boolean;
  notifyThreshold: number;
  browserNotify: boolean;
  alerts: DeskAlert[];
  listId: string | null;
  listName: string;
  locale: Locale;
  addItem: (item: WatchItem) => void;
  renameItem: (symbol: string, name: string) => void;
  renameMany: (rows: { symbol: string; name: string }[]) => void;
  removeItem: (symbol: string) => void;
  select: (symbol: string) => void;
  setPeriod: (period: PeriodKey) => void;
  patchSettings: (patch: Partial<ChartSettings>) => void;
  resetSettings: () => void;
  moveItem: (from: number, to: number) => void;
  setLive: (live: boolean) => void;
  setLiveMs: (liveMs: number) => void;
  setNotifyEnabled: (notifyEnabled: boolean) => void;
  setNotifyThreshold: (notifyThreshold: number) => void;
  setBrowserNotify: (browserNotify: boolean) => void;
  pushAlert: (alert: Omit<DeskAlert, "read">) => void;
  markAlertsRead: () => void;
  replaceWatchlist: (items: WatchItem[], selected?: string) => void;
  setListMeta: (listId: string | null, listName: string) => void;
  setLocale: (locale: Locale) => void;
};

export const useDesk = create<DeskState>()(
  persist(
    (set, get) => ({
      watchlist: DEFAULT_WATCHLIST,
      selected: DEFAULT_WATCHLIST[0]!.symbol,
      period: "1y",
      settings: DEFAULT_SETTINGS,
      live: true,
      liveMs: 5000,
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
        if (list.some((w) => w.symbol.toUpperCase() === symbol)) {
          set({ selected: symbol });
          return;
        }
        const catalog = lookupCatalog(symbol);
        const rawName = safeName(item.name, symbol);
        const name =
          catalog?.name ||
          (rawName && rawName.toUpperCase() !== symbol && rawName.toUpperCase() !== item.symbol.toUpperCase()
            ? rawName
            : symbol);
        const next = {
          ...item,
          symbol,
          name,
          exchange: item.exchange || catalog?.exchange,
          kind: item.kind ?? catalog?.kind ?? classify(symbol, undefined, item.exchange),
        };
        set({ watchlist: [next, ...list], selected: symbol });
      },
      renameItem: (symbol, name) => {
        get().renameMany([{ symbol, name }]);
      },
      renameMany: (rows) => {
        if (!rows.length) return;
        const map = new Map(rows.map((r) => [r.symbol, r.name.replace(/[<>]/g, "").slice(0, 80).trim()]));
        let changed = false;
        const watchlist = get().watchlist.map((w) => {
          const name = map.get(w.symbol);
          if (!name || name === w.name) return w;
          changed = true;
          return { ...w, name };
        });
        if (changed) set({ watchlist });
      },
      removeItem: (symbol) => {
        const list = get().watchlist.filter((w) => w.symbol !== symbol);
        const selected =
          get().selected === symbol ? (list[0]?.symbol ?? "") : get().selected;
        set({ watchlist: list, selected });
      },
      select: (symbol) => {
        const code = safeSymbol(normalizeSymbol(symbol));
        if (!code || get().selected === code) return;
        set({ selected: code });
        try {
          sessionStorage.setItem("kabu-sel", code);
        } catch {
          /* ignore */
        }
      },
      setPeriod: (period) => set({ period }),
      patchSettings: (patch) => {
        const next = { ...patch };
        if (next.upColor) next.upColor = safeHexColor(next.upColor) ?? get().settings.upColor;
        if (next.downColor) next.downColor = safeHexColor(next.downColor) ?? get().settings.downColor;
        if (next.wickColor) next.wickColor = safeHexColor(next.wickColor) ?? get().settings.wickColor;
        if (next.lineColor) next.lineColor = safeHexColor(next.lineColor) ?? get().settings.lineColor;
        set({ settings: { ...get().settings, ...next } });
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
      setLiveMs: (liveMs) => {
        const ms = Math.min(60_000, Math.max(5_000, Math.round(liveMs)));
        set({ liveMs: ms });
      },
      setNotifyEnabled: (notifyEnabled) => set({ notifyEnabled }),
      setNotifyThreshold: (notifyThreshold) => {
        const n = Math.min(50, Math.max(0.5, Number(notifyThreshold) || 5));
        set({ notifyThreshold: n });
      },
      setBrowserNotify: (browserNotify) => set({ browserNotify }),
      pushAlert: (alert) => {
        const list = get().alerts ?? [];
        if (list.some((a) => a.id === alert.id)) return;
        set({
          alerts: [
            {
              ...alert,
              id: String(alert.id).slice(0, 80),
              title: safeName(alert.title).slice(0, 80),
              body: safeName(alert.body).slice(0, 160),
              read: false,
            },
            ...list,
          ].slice(0, 40),
        });
      },
      markAlertsRead: () =>
        set({
          alerts: (get().alerts ?? []).map((a) => ({ ...a, read: true })),
        }),
      replaceWatchlist: (items, selected) => {
        const next = cleanWatchItems(items);
        const pick = selected ? safeSymbol(selected) : null;
        set({
          watchlist: next,
          selected: pick && next.some((w) => w.symbol === pick) ? pick : (next[0]?.symbol ?? ""),
        });
      },
      setListMeta: (listId, listName) => set({ listId, listName: safeName(listName, "メイン").slice(0, 40) }),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "kabu-desk-v2",
      skipHydration: true,
      merge: (persisted, current) => {
        const raw = persisted && typeof persisted === "object" ? (persisted as Partial<DeskState>) : {};
        const watchlist = cleanWatchItems(raw.watchlist);
        const selected = safeSymbol(String(raw.selected ?? "")) ?? watchlist[0]?.symbol ?? current.selected;
        const periods: PeriodKey[] = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "5y", "max"];
        const period = periods.includes(raw.period as PeriodKey) ? (raw.period as PeriodKey) : current.period;
        return {
          ...current,
          ...raw,
          watchlist: watchlist.length ? watchlist : current.watchlist,
          selected,
          period,
          liveMs: Math.min(60_000, Math.max(5_000, Number(raw.liveMs) || current.liveMs)),
          notifyThreshold: Math.min(50, Math.max(0.5, Number(raw.notifyThreshold) || current.notifyThreshold)),
          settings: {
            ...current.settings,
            ...(raw.settings ?? {}),
            upColor: safeHexColor(raw.settings?.upColor) ?? current.settings.upColor,
            downColor: safeHexColor(raw.settings?.downColor) ?? current.settings.downColor,
            wickColor: safeHexColor(raw.settings?.wickColor) ?? current.settings.wickColor,
            lineColor: safeHexColor(raw.settings?.lineColor) ?? current.settings.lineColor,
          },
          alerts: cleanAlerts(raw.alerts) ?? current.alerts,
          locale: safeLocale(raw.locale) ?? current.locale,
          listId: safeUuid(raw.listId) ?? null,
          listName: safeName(String(raw.listName ?? ""), current.listName).slice(0, 40),
          notifyEnabled: raw.notifyEnabled !== false,
          browserNotify: Boolean(raw.browserNotify),
        };
      },
    },
  ),
);

function cleanAlerts(raw: unknown) {
  if (!Array.isArray(raw)) return null;
  return raw.slice(0, 40).flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const a = row as { id?: string; kind?: string; title?: string; body?: string; symbol?: string; at?: number };
    const id = stripTags(String(a.id ?? "")).slice(0, 120);
    if (!id) return [];
    return [{
      id,
      kind: a.kind === "news" ? "news" as const : "move" as const,
      title: stripTags(String(a.title ?? "")).slice(0, 120),
      body: stripTags(String(a.body ?? "")).slice(0, 240),
      symbol: safeSymbol(String(a.symbol ?? "")) ?? undefined,
      at: Number.isFinite(Number(a.at)) ? Number(a.at) : Date.now(),
      read: Boolean((a as { read?: boolean }).read),
    }];
  });
}

function cleanWatchItems(raw: unknown): WatchItem[] {
  if (!Array.isArray(raw)) return [];
  const out: WatchItem[] = [];
  const seen = new Set<string>();
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const item = row as WatchItem;
    const symbol = safeSymbol(normalizeSymbol(String(item.symbol ?? "")));
    if (!symbol || seen.has(symbol)) continue;
    seen.add(symbol);
    out.push({
      symbol,
      name: safeName(String(item.name ?? ""), symbol),
      exchange: item.exchange ? safeName(String(item.exchange)).slice(0, 40) : undefined,
      kind: item.kind && ["jp","overseas","etf","fund","index","commodity","fx","crypto","bond"].includes(item.kind) ? item.kind : undefined,
    });
    if (out.length >= 5000) break;
  }
  return out;
}
