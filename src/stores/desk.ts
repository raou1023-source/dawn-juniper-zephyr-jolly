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
import { safeHexColor, safeSymbol } from "@/lib/safe";
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
        if (list.length >= 200) return;
        if (list.some((w) => w.symbol.toUpperCase() === symbol)) {
          set({ selected: symbol });
          return;
        }
        const catalog = lookupCatalog(symbol);
        const rawName = item.name.replace(/[<>]/g, "").slice(0, 80);
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
        if (get().selected === symbol) return;
        set({ selected: symbol });
        try {
          sessionStorage.setItem("kabu-sel", symbol);
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
      setLiveMs: (liveMs) => set({ liveMs }),
      setNotifyEnabled: (notifyEnabled) => set({ notifyEnabled }),
      setNotifyThreshold: (notifyThreshold) => set({ notifyThreshold }),
      setBrowserNotify: (browserNotify) => set({ browserNotify }),
      pushAlert: (alert) => {
        const list = get().alerts ?? [];
        if (list.some((a) => a.id === alert.id)) return;
        set({
          alerts: [{ ...alert, read: false }, ...list].slice(0, 40),
        });
      },
      markAlertsRead: () =>
        set({
          alerts: (get().alerts ?? []).map((a) => ({ ...a, read: true })),
        }),
      replaceWatchlist: (items, selected) => {
        const next = items.length ? items : [];
        set({
          watchlist: next,
          selected: selected && next.some((w) => w.symbol === selected)
            ? selected
            : (next[0]?.symbol ?? ""),
        });
      },
      setListMeta: (listId, listName) => set({ listId, listName }),
      setLocale: (locale) => set({ locale }),
    }),
    { name: "kabu-desk-v2", skipHydration: true },
  ),
);
