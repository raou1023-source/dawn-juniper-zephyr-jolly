import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { classify, prettyName } from "@/lib/stocks/catalog";
import { formatPrice } from "@/lib/stocks/format";
import { kindKey, groupKey } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/use-t";
import type { AssetKind, QuoteMeta, WatchItem } from "@/lib/stocks/types";
import { useDesk } from "@/stores/desk";
import { cn } from "@/lib/utils";
import { WatchlistSync } from "./watchlist-sync";

type Props = {
  quotes: Map<string, QuoteMeta>;
};

const GROUP_ORDER: AssetKind[] = [
  "jp",
  "overseas",
  "index",
  "fx",
  "etf",
  "fund",
  "commodity",
  "crypto",
  "bond",
];

function watchGroup(item: WatchItem): AssetKind {
  const kind = item.kind ?? classify(item.symbol, undefined, item.exchange);
  if (kind === "etf" || kind === "fund") {
    return item.symbol.toUpperCase().endsWith(".T") ? "jp" : "overseas";
  }
  return kind;
}

export function WatchlistPanel({ quotes }: Props) {
  const watchlist = useDesk((s) => s.watchlist);
  const selected = useDesk((s) => s.selected);
  const select = useDesk((s) => s.select);
  const removeItem = useDesk((s) => s.removeItem);
  const t = useT();
  const locale = useLocale();
  const [hold, setHold] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const holdRef = useRef<string | null>(null);
  const overRef = useRef<string | null>(null);
  const drag = useRef<{
    symbol: string;
    group: string;
    pointerId: number;
    timer: number;
    y: number;
  } | null>(null);
  const dragged = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => {
    const buckets = new Map<AssetKind, WatchItem[]>();
    for (const item of watchlist) {
      const g = watchGroup(item);
      const list = buckets.get(g) ?? [];
      list.push(item);
      buckets.set(g, list);
    }
    return GROUP_ORDER.filter((k) => (buckets.get(k)?.length ?? 0) > 0).map((key) => ({
      key,
      items: buckets.get(key)!,
    }));
  }, [watchlist]);

  function stopDrag() {
    const cur = drag.current;
    if (cur) window.clearTimeout(cur.timer);
    drag.current = null;
    holdRef.current = null;
    overRef.current = null;
    setHold(null);
    setOver(null);
    document.body.style.touchAction = "";
    document.body.style.overflow = "";
  }

  function targetAt(y: number, group: string) {
    const nodes = listRef.current?.querySelectorAll(`[data-watch-group="${group}"]`);
    if (!nodes?.length) return null;
    let bestSym: string | null = null;
    let bestDist = Infinity;
    for (const node of nodes) {
      if (!(node instanceof HTMLElement)) continue;
      const r = node.getBoundingClientRect();
      const d = Math.abs((r.top + r.bottom) / 2 - y);
      if (d < bestDist) {
        bestDist = d;
        bestSym = node.getAttribute("data-watch-sym");
      }
    }
    return bestSym;
  }

  function armDrag(symbol: string, group: string, pointerId: number) {
    dragged.current = true;
    holdRef.current = symbol;
    overRef.current = symbol;
    setHold(symbol);
    setOver(symbol);
    document.body.style.touchAction = "none";
    document.body.style.overflow = "hidden";
    if (drag.current) drag.current.timer = 0;
    void pointerId;
    void group;
  }

  function onDown(e: ReactPointerEvent, symbol: string, group: string, immediate = false) {
    if (e.button !== 0) return;
    if (e.target instanceof Element && e.target.closest("[data-watch-del]")) return;
    dragged.current = false;
    window.clearTimeout(drag.current?.timer ?? 0);
    const pointerId = e.pointerId;
    const timer = immediate
      ? 0
      : window.setTimeout(() => {
          if (drag.current?.pointerId !== pointerId) return;
          armDrag(symbol, group, pointerId);
        }, 360);
    drag.current = { symbol, group, pointerId, timer, y: e.clientY };
    if (immediate) {
      e.preventDefault();
      e.stopPropagation();
      armDrag(symbol, group, pointerId);
    }
  }

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const cur = drag.current;
      if (!cur || e.pointerId !== cur.pointerId) return;
      if (!holdRef.current) {
        if (Math.abs(e.clientY - cur.y) > 14) stopDrag();
        return;
      }
      e.preventDefault();
      const next = targetAt(e.clientY, cur.group);
      if (next && next !== overRef.current) {
        overRef.current = next;
        setOver(next);
      }
      const box = listRef.current;
      if (box) {
        const rect = box.getBoundingClientRect();
        if (e.clientY < rect.top + 48) box.scrollTop -= 20;
        else if (e.clientY > rect.bottom - 48) box.scrollTop += 20;
      }
    };
    const touchMove = (e: TouchEvent) => {
      if (!holdRef.current) return;
      e.preventDefault();
    };
    const up = (e: PointerEvent) => {
      const cur = drag.current;
      if (!cur || e.pointerId !== cur.pointerId) return;
      const fromSym = holdRef.current;
      const toSym = overRef.current;
      if (fromSym && toSym && fromSym !== toSym) {
        const list = useDesk.getState().watchlist;
        const from = list.findIndex((w) => w.symbol === fromSym);
        const to = list.findIndex((w) => w.symbol === toSym);
        if (from >= 0 && to >= 0) useDesk.getState().moveItem(from, to);
      }
      stopDrag();
      window.setTimeout(() => {
        dragged.current = false;
      }, 100);
    };
    document.addEventListener("pointermove", move, { passive: false });
    document.addEventListener("touchmove", touchMove, { passive: false });
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", up);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("touchmove", touchMove);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-border bg-surface pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-[calc(4.75rem+env(safe-area-inset-bottom))]">
      <div className="px-4 pt-4 pb-2">
        <p className="font-display text-lg tracking-tight text-fg">{t("watch")}</p>
        <p className="text-xs text-muted">{t("watchHint", { n: watchlist.length })}</p>
      </div>
      <WatchlistSync />

      <div
        ref={listRef}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-y-none px-2 pb-4",
          hold && "touch-none",
        )}
      >
        {watchlist.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-muted">{t("watchEmpty")}</p>
        ) : (
          groups.map((group) => (
            <section key={group.key} className="mb-3">
              <h3 className="sticky top-0 z-10 bg-surface/95 px-2 py-1.5 text-[11px] tracking-wide text-faint backdrop-blur-sm">
                {t(groupKey(group.key))} · {group.items.length}
              </h3>
              <ul>
                {group.items.map((item) => {
                  const active = item.symbol === selected;
                  const quote = quotes.get(item.symbol.toUpperCase());
                  const up = (quote?.change ?? 0) >= 0;
                  const kind = item.kind ?? classify(item.symbol, undefined, item.exchange);
                  const lifting = hold === item.symbol;
                  const drop = over === item.symbol && hold && hold !== item.symbol;
                  return (
                    <li
                      key={item.symbol}
                      data-watch-sym={item.symbol}
                      data-watch-group={group.key}
                      className={cn("group relative", drop && "ring-1 ring-accent rounded-md")}
                    >
                      <button
                        type="button"
                        aria-label="並べ替え"
                        onPointerDown={(e) => onDown(e, item.symbol, group.key, true)}
                        className="absolute top-2 left-0 z-10 flex size-8 items-center justify-center rounded-sm text-faint touch-none"
                      >
                        <GripVertical className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onPointerDown={(e) => onDown(e, item.symbol, group.key)}
                        onClick={() => {
                          if (dragged.current) return;
                          select(item.symbol);
                        }}
                        className={cn(
                          "flex w-full items-start justify-between gap-2 rounded-md py-2.5 pr-9 pl-8 text-left transition-colors duration-[var(--motion-quick)]",
                          lifting ? "bg-elevated opacity-90 shadow-lg" : active ? "bg-elevated" : "hover:bg-elevated/60",
                        )}
                      >
                        <span className="min-w-0">
                          <span className="block font-mono text-[13px] text-fg">{item.symbol}</span>
                          <span className="block truncate text-[11px] text-muted">
                            {prettyName(item.symbol, item.name, quote?.name)}
                          </span>
                          <span className="mt-0.5 block text-[10px] text-faint">{t(kindKey(kind))}</span>
                        </span>
                        {quote ? (
                          <span className="shrink-0 text-right">
                            <span className="block font-mono text-[12px] tabular-nums text-fg">
                              {formatPrice(quote.price, quote.currency, item.symbol, locale)}
                            </span>
                            <span
                              className={cn(
                                "block font-mono text-[10px] tabular-nums",
                                up ? "text-up" : "text-down",
                              )}
                            >
                              {up ? "+" : ""}
                              {quote.changePercent.toFixed(2)}%
                            </span>
                          </span>
                        ) : null}
                      </button>
                      <button
                        type="button"
                        data-watch-del
                        aria-label={`${item.symbol} を削除`}
                        onClick={() => removeItem(item.symbol)}
                        className="absolute top-2 right-1 flex size-8 items-center justify-center rounded-sm text-faint hover:bg-subtle hover:text-down md:size-7 md:opacity-0 md:group-hover:opacity-100"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </aside>
  );
}
