import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/lib/stocks/api";
import type { NewsItem } from "@/lib/stocks/news";
import { safeNewsUrl } from "@/lib/safe";
import { LOCALE_BCP } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/use-t";
import { cn } from "@/lib/utils";

type Props = {
  symbol?: string;
  name?: string;
};

export function NewsPanel({ symbol, name }: Props) {
  const t = useT();
  const locale = useLocale();
  const [translateOn, setTranslateOn] = useState(true);
  const symbolQ = useQuery({
    queryKey: ["news", symbol ?? "", locale, translateOn],
    queryFn: () =>
      getNews({
        data: { symbol: symbol || undefined, locale, translate: translateOn },
      }),
    staleTime: 180_000,
  });
  const marketQ = useQuery({
    queryKey: ["news", "market", locale, translateOn],
    queryFn: () => getNews({ data: { locale, translate: translateOn } }),
    staleTime: 180_000,
  });

  const symbolNews = symbolQ.data ?? [];
  const marketNews = (marketQ.data ?? []).filter(
    (n) => !symbol || !symbolNews.some((s) => s.id === n.id),
  );

  return (
    <section className="bg-bg px-4 py-4 md:px-6">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h3 className="font-display text-lg tracking-tight">{t("news")}</h3>
          <p className="text-[11px] text-faint">{t("newsOnly")}</p>
        </div>
        <button
          type="button"
          onClick={() => setTranslateOn((v) => !v)}
          className={cn(
            "h-8 shrink-0 rounded-md px-2.5 text-xs",
            translateOn ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
          )}
        >
          {translateOn ? t("translated") : t("translateNews")}
        </button>
      </div>
      {symbol ? (
        <NewsGroup label={name || symbol} items={symbolNews} loading={symbolQ.isFetching} />
      ) : null}
      <NewsGroup label={t("market")} items={marketNews} loading={marketQ.isFetching} />
    </section>
  );
}

function NewsGroup({
  label,
  items,
  loading,
}: {
  label: string;
  items: NewsItem[];
  loading: boolean;
}) {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-[11px] tracking-wide text-faint uppercase">{label}</p>
      {loading && items.length === 0 ? (
        <p className="text-xs text-muted">{t("newsLoading")}</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-muted">{t("noNews")}</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {items
            .filter((item) => safeNewsUrl(item.url))
            .slice(0, 6)
            .map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md px-2 py-2 hover:bg-elevated"
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm text-fg">{item.title}</span>
                    {item.impact !== "none" ? (
                      <span
                        className={cn(
                          "shrink-0 text-[10px]",
                          item.impact === "up" ? "text-up" : "text-down",
                        )}
                      >
                        {item.impact === "up" ? t("newsUp") : t("newsDown")}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-[11px] text-faint">
                    {item.source} · {formatAgo(item.publishedAt, t, locale)}
                  </span>
                </a>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

function formatAgo(
  ts: number,
  t: (key: "justNow" | "minutesAgo" | "hoursAgo", vars?: Record<string, string | number>) => string,
  locale: "ja" | "en" | "zh" | "ko",
) {
  const min = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (min < 1) return t("justNow");
  if (min < 60) return t("minutesAgo", { n: min });
  const hr = Math.round(min / 60);
  if (hr < 24) return t("hoursAgo", { n: hr });
  return new Date(ts).toLocaleDateString(LOCALE_BCP[locale]);
}
