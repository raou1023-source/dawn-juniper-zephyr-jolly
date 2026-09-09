import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { translate } from "@/lib/i18n";
import { isBigMoveNews, type NewsItem } from "@/lib/stocks/news";
import type { QuoteMeta } from "@/lib/stocks/types";
import { useDesk } from "@/stores/desk";

type Props = {
  quotes: Map<string, QuoteMeta>;
  news: NewsItem[];
};

export function AlertWatcher({ quotes, news }: Props) {
  const watchlist = useDesk((s) => s.watchlist);
  const notifyEnabled = useDesk((s) => s.notifyEnabled ?? true);
  const notifyThreshold = useDesk((s) => s.notifyThreshold ?? 5);
  const browserNotify = useDesk((s) => s.browserNotify ?? false);
  const pushAlert = useDesk((s) => s.pushAlert);
  const seen = useRef(new Set(useDesk.getState().alerts?.map((a) => a.id) ?? []));

  useEffect(() => {
    if (!notifyEnabled) return;
    for (const item of watchlist) {
      const quote = quotes.get(item.symbol.toUpperCase());
      if (!quote) continue;
      if (Math.abs(quote.changePercent) < notifyThreshold) continue;
      const id = `move:${item.symbol}:${new Date().toISOString().slice(0, 13)}`;
      if (seen.current.has(id)) continue;
      seen.current.add(id);
      const locale = useDesk.getState().locale ?? "ja";
      const dirKey = quote.changePercent >= 0 ? "moveUp" : "moveDown";
      const title = translate(locale, dirKey, { s: item.symbol });
      const body = translate(locale, "moveBody", {
        name: item.name,
        pct: `${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}`,
        n: notifyThreshold,
      });
      pushAlert({ id, kind: "move", title, body, symbol: item.symbol, at: Date.now() });
      toast(title, { description: body });
      notifyBrowser(browserNotify, title, body);
    }
  }, [quotes, watchlist, notifyEnabled, notifyThreshold, browserNotify, pushAlert]);

  useEffect(() => {
    if (!notifyEnabled) return;
    const symbols = new Set(watchlist.map((w) => w.symbol.toUpperCase()));
    const names = watchlist.map((w) => w.name);
    for (const item of news) {
      if (!isBigMoveNews(item)) continue;
      const hit =
        item.symbols.some((s) => symbols.has(s.toUpperCase())) ||
        names.some((n) => item.title.includes(n));
      if (!hit && item.symbols.length) continue;
      const id = `news:${item.id}`;
      if (seen.current.has(id)) continue;
      seen.current.add(id);
      const locale = useDesk.getState().locale ?? "ja";
      const title = translate(locale, item.impact === "up" ? "newsUp" : "newsDown");
      pushAlert({
        id,
        kind: "news",
        title,
        body: item.title,
        symbol: item.symbols[0],
        at: item.publishedAt,
      });
      toast(title, { description: item.title });
      notifyBrowser(browserNotify, title, item.title);
    }
  }, [news, watchlist, notifyEnabled, browserNotify, pushAlert]);

  return null;
}

function notifyBrowser(enabled: boolean, title: string, body: string) {
  if (!enabled || typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body });
  } catch {
    /* iframe / denied */
  }
}
