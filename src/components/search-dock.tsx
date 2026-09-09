import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { classify, normalizeSymbol, type AssetKind } from "@/lib/stocks/catalog";
import { kindKey } from "@/lib/i18n";
import { useT } from "@/lib/use-t";
import { searchSymbols } from "@/lib/stocks/api";
import { safeSymbol } from "@/lib/safe";
import type { SearchHit } from "@/lib/stocks/types";
import { useDesk } from "@/stores/desk";
import { revealChart } from "@/lib/scroll-chart";
import { cn } from "@/lib/utils";

const FILTERS: { key: "all" | AssetKind; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "jp", label: "日本株" },
  { key: "overseas", label: "海外株" },
  { key: "etf", label: "ETF" },
  { key: "fund", label: "投信" },
  { key: "index", label: "指数" },
  { key: "commodity", label: "商品" },
  { key: "fx", label: "為替" },
  { key: "crypto", label: "暗号" },
  { key: "bond", label: "債券" },
];

export function SearchDock() {
  const watchlist = useDesk((s) => s.watchlist);
  const addItem = useDesk((s) => s.addItem);
  const t = useT();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | AssetKind>("all");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open && !q.trim()) return;
    let ignore = false;
    const handle = window.setTimeout(async () => {
      setBusy(true);
      try {
        const rows = await searchSymbols({ data: { q } });
        if (!ignore) setHits(rows);
      } catch {
        if (!ignore) setHits([]);
      } finally {
        if (!ignore) setBusy(false);
      }
    }, 200);
    return () => {
      ignore = true;
      window.clearTimeout(handle);
    };
  }, [q, open]);

  const known = useMemo(
    () => new Set(watchlist.map((w) => w.symbol.toUpperCase())),
    [watchlist],
  );

  const visible = useMemo(() => {
    return hits.filter((h) => {
      const kind = h.kind ?? classify(h.symbol, h.type, h.exchange);
      return filter === "all" || kind === filter;
    });
  }, [hits, filter]);

  function addHit(hit: SearchHit) {
    const symbol = safeSymbol(normalizeSymbol(hit.symbol)) ?? normalizeSymbol(hit.symbol);
    addItem({
      symbol,
      name: hit.name,
      exchange: hit.exchange,
      kind: hit.kind ?? classify(hit.symbol, hit.type, hit.exchange),
    });
    const exists = useDesk.getState().watchlist.some((w) => w.symbol.toUpperCase() === symbol);
    if (exists) {
      toast.success(`${hit.name} · ${symbol}`);
      setQ("");
      setOpen(false);
      window.setTimeout(revealChart, 50);
    }
  }

  function addTyped() {
    const raw = q.trim();
    if (!raw) return;
    const code = normalizeSymbol(raw);
    const match = visible.find((h) => {
      const sym = h.symbol.toUpperCase();
      return (
        sym === code ||
        sym === raw.toUpperCase() ||
        sym.replace(/\.T$/, "") === raw.toUpperCase()
      );
    });
    if (match) {
      addHit({ ...match, symbol: normalizeSymbol(match.symbol) });
      return;
    }
    addItem({
      symbol: code,
      name: code,
      kind: classify(code),
    });
    setQ("");
    setOpen(false);
    window.setTimeout(revealChart, 50);
  }

  const showResults = open && (q.trim().length > 0 || filter !== "all" || hits.length > 0);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
      {showResults ? (
        <div className="max-h-64 overflow-y-auto border-b border-border px-3 pt-2 pb-2 md:px-6">
          {busy && visible.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted">{t("searching")}</p>
          ) : visible.length === 0 ? (
            <div className="px-2 py-3">
              <p className="text-xs text-muted">{t("noHits")}</p>
              {q.trim() ? (
                <button
                  type="button"
                  onClick={addTyped}
                  className="mt-2 inline-flex h-8 items-center gap-1 rounded-md bg-accent px-3 text-xs text-accent-fg"
                >
                  <Plus className="size-3.5" />
                  {t("add")} {q.trim().toUpperCase()}
                </button>
              ) : null}
            </div>
          ) : (
            <ul className="mx-auto flex max-w-5xl flex-col">
              {visible.slice(0, 12).map((hit) => {
                const added = known.has(hit.symbol.toUpperCase());
                const kind = hit.kind ?? classify(hit.symbol, hit.type, hit.exchange);
                return (
                  <li
                    key={hit.symbol}
                    className="flex items-center gap-2 border-b border-border/60 py-1.5 last:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-fg">
                        <span className="font-mono text-xs">{hit.symbol}</span>
                        <span className="ml-2 text-muted">{hit.name}</span>
                      </p>
                      <p className="text-[10px] text-faint">{t(kindKey(kind))}</p>
                    </div>
                    {added ? (
                      <span className="shrink-0 rounded-md bg-elevated px-2 py-1 text-[11px] text-muted">
                        {t("added")}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addHit(hit)}
                        className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md bg-accent px-2.5 text-xs text-accent-fg"
                      >
                        <Plus className="size-3.5" />
                        {t("add")}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
      <div className="flex flex-col gap-2 px-3 py-2 md:flex-row md:items-center md:px-6">
        <p className="hidden shrink-0 text-[11px] tracking-wide text-faint uppercase md:block">
          {t("search")}
        </p>
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                setFilter(f.key);
                setOpen(true);
              }}
              className={cn(
                "h-8 shrink-0 rounded-md px-2 text-[11px]",
                filter === f.key ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
              )}
            >
              {f.key === "all" ? t("all") : t(kindKey(f.key))}
            </button>
          ))}
        </div>
        <label className="relative flex w-full md:max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTyped();
              }
              if (e.key === "Escape") setOpen(false);
            }}
            placeholder={t("searchPh")}
            className="h-11 w-full rounded-md border border-border bg-bg pr-20 pl-10 text-sm text-fg placeholder:text-faint outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={addTyped}
            disabled={!q.trim()}
            className="absolute top-1/2 right-1 inline-flex h-9 -translate-y-1/2 items-center gap-1 rounded-md bg-accent px-2.5 text-xs text-accent-fg disabled:opacity-40"
          >
            <Plus className="size-3.5" />
            {t("add")}
          </button>
        </label>
      </div>
    </div>
  );
}
