import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { classify, prettyName } from "@/lib/stocks/catalog";
import { formatPrice } from "@/lib/stocks/format";
import { kindKey } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/use-t";
import type { QuoteMeta } from "@/lib/stocks/types";
import { useDesk } from "@/stores/desk";
import { cn } from "@/lib/utils";
import { WatchlistSync } from "./watchlist-sync";

type Props = {
  quotes: Map<string, QuoteMeta>;
};

export function WatchlistPanel({ quotes }: Props) {
  const watchlist = useDesk((s) => s.watchlist);
  const selected = useDesk((s) => s.selected);
  const select = useDesk((s) => s.select);
  const removeItem = useDesk((s) => s.removeItem);
  const t = useT();
  const locale = useLocale();

  const items = useMemo(() => watchlist, [watchlist]);

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-border bg-surface">
      <div className="px-4 pt-4 pb-3">
        <p className="font-display text-lg tracking-tight text-fg">{t("watch")}</p>
        <p className="text-xs text-muted">{t("watchHint", { n: items.length })}</p>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {items.length === 0 ? (
          <li className="px-2 py-8 text-center text-sm text-muted">
            {t("watchEmpty")}
          </li>
        ) : (
          items.map((item) => {
            const active = item.symbol === selected;
            const quote = quotes.get(item.symbol.toUpperCase());
            const up = (quote?.change ?? 0) >= 0;
            const kind = item.kind ?? classify(item.symbol, undefined, item.exchange);
            return (
              <li key={item.symbol} className="group relative">
                <button
                  type="button"
                  onClick={() => select(item.symbol)}
                  className={cn(
                    "flex w-full items-start justify-between gap-2 rounded-md py-2.5 pr-9 pl-3 text-left transition-colors duration-[var(--motion-quick)]",
                    active ? "bg-elevated" : "hover:bg-elevated/60",
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
                  aria-label={`${item.symbol} を削除`}
                  onClick={() => removeItem(item.symbol)}
                  className="absolute top-2 right-1 flex size-8 items-center justify-center rounded-sm text-faint hover:bg-subtle hover:text-down md:size-7 md:opacity-0 md:group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            );
          })
        )}
      </ul>
      <WatchlistSync />
    </aside>
  );
}
