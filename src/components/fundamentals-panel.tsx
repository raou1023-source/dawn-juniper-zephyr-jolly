import { useQuery } from "@tanstack/react-query";
import { getFundamentals } from "@/lib/stocks/api";
import { formatPrice } from "@/lib/stocks/format";
import { useLocale, useT } from "@/lib/use-t";
import type { MsgKey } from "@/lib/i18n";
import { TermHint } from "./term-hint";

type Props = {
  symbol?: string;
  currency?: string;
  week52High?: number;
  week52Low?: number;
};

export function FundamentalsPanel({ symbol, currency = "", week52High, week52Low }: Props) {
  const t = useT();
  const locale = useLocale();
  const q = useQuery({
    queryKey: ["fundamentals", symbol ?? ""],
    enabled: Boolean(symbol),
    queryFn: () => getFundamentals({ data: { symbol: symbol! } }),
    staleTime: 15 * 60_000,
  });
  const data = q.data;
  if (!symbol) return null;

  const cells: { key: MsgKey; value: string }[] = [
    { key: "statPer", value: fmtRatio(data?.per) },
    { key: "statPbr", value: fmtRatio(data?.pbr) },
    { key: "statEps", value: fmtNum(data?.eps, currency, symbol, locale) },
    { key: "statDiv", value: fmtNum(data?.dividendRate, currency, symbol, locale) },
    { key: "statYield", value: fmtPct(data?.dividendYield) },
    { key: "statPayout", value: fmtPct(data?.payout) },
    { key: "statRoe", value: fmtPct(data?.roe) },
    { key: "statCap", value: fmtCap(data?.marketCap, locale) },
    { key: "statHigh", value: fmtNum(data?.week52High ?? week52High, currency, symbol, locale) },
    { key: "statLow", value: fmtNum(data?.week52Low ?? week52Low, currency, symbol, locale) },
  ];

  return (
    <section className="shrink-0 border-t border-border bg-bg pb-3">
      <div className="flex items-center justify-between px-4 pt-2 md:px-6">
        <p className="text-[11px] tracking-wide text-faint uppercase">{t("company")}</p>
      </div>
      {q.isLoading && !data ? (
        <p className="px-4 py-2 text-xs text-muted md:px-6">{t("newsLoading")}</p>
      ) : (
        <div className="overflow-x-auto overscroll-x-contain px-4 pb-2 md:px-6">
          <dl className="flex min-w-max gap-4">
            {cells.map((cell) => (
              <div key={cell.key} className="min-w-24 shrink-0 py-1">
                <dt className="text-[10px] text-faint">
                  <TermHint label={t(cell.key)} hint={t(`${cell.key}Hint` as MsgKey)} />
                </dt>
                <dd className="font-mono text-sm tabular-nums text-fg">{cell.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}

function fmtRatio(n?: number) {
  if (n == null || !Number.isFinite(n) || n <= 0) return "—";
  return n.toFixed(2);
}

function fmtPct(n?: number) {
  if (n == null || !Number.isFinite(n)) return "—";
  const pct = Math.abs(n) <= 1.5 ? n * 100 : n;
  return `${pct.toFixed(2)}%`;
}

function fmtNum(n: number | undefined, currency: string, symbol: string, locale: "ja" | "en" | "zh" | "ko") {
  if (n == null || !Number.isFinite(n)) return "—";
  return formatPrice(n, currency, symbol, locale);
}

function fmtCap(n: number | undefined, locale: "ja" | "en" | "zh" | "ko") {
  if (n == null || !Number.isFinite(n) || n <= 0) return "—";
  const abs = Math.abs(n);
  if (locale === "ja") {
    if (abs >= 1e12) return `${(n / 1e12).toFixed(2)}兆`;
    if (abs >= 1e8) return `${(n / 1e8).toFixed(2)}億`;
    return n.toLocaleString("ja-JP");
  }
  if (abs >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  return n.toLocaleString(locale === "zh" ? "zh-CN" : locale === "ko" ? "ko-KR" : "en-US");
}
