import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { safeSymbol } from "@/lib/safe";

const RANGE = z.enum(["1d", "5d", "1mo", "3mo", "6mo", "1y", "5y", "max"]);
const INTERVAL = z.enum(["1m", "5m", "15m", "1d", "1wk", "1mo"]);

export const getChart = createServerFn({ method: "GET" })
  .validator(
    z.object({
      symbol: z.string().min(1).max(32).regex(/^[A-Za-z0-9.^%=_/-]+$/),
      range: RANGE,
      interval: INTERVAL,
    }),
  )
  .handler(async ({ data }) => {
    const { fetchYahooChart } = await import("./yahoo.server");
    return fetchYahooChart(data.symbol, data.range, data.interval);
  });

export const searchSymbols = createServerFn({ method: "GET" })
  .validator(z.object({ q: z.string().max(48) }))
  .handler(async ({ data }) => {
    const { localSearch, searchYahoo } = await import("./yahoo.server");
    const q = data.q.replace(/[\u0000-\u001F]/g, "").trim();
    if (!q) return localSearch("");
    const live = await searchYahoo(q);
    return live.length ? live : localSearch(q);
  });

export const getQuotes = createServerFn({ method: "GET" })
  .validator(z.object({ symbols: z.string().max(4000) }))
  .handler(async ({ data }) => {
    const { fetchYahooQuotes } = await import("./yahoo.server");
    const symbols = data.symbols
      .split(",")
      .map((s) => safeSymbol(s))
      .filter((s): s is string => Boolean(s))
      .slice(0, 80);
    return fetchYahooQuotes(symbols);
  });

export const getNews = createServerFn({ method: "GET" })
  .validator(
    z.object({
      symbol: z.string().max(32).regex(/^[A-Za-z0-9.^%=_/-]+$/).optional(),
      locale: z.enum(["ja", "en", "zh", "ko"]).optional(),
      translate: z.boolean().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { fetchNews } = await import("./news.server");
    const rows = await fetchNews(data.symbol || undefined);
    if (!data.translate || rows.length === 0) return rows;
    const locale = data.locale ?? "ja";
    const { translateTitles } = await import("./translate.server");
    const titles = await translateTitles(
      rows.map((row) => row.title),
      locale,
    );
    const { stripTags } = await import("@/lib/safe");
    return rows.map((row, i) => ({
      ...row,
      title: stripTags(titles[i] || row.title).slice(0, 180),
    }));
  });

export const getFundamentals = createServerFn({ method: "GET" })
  .validator(
    z.object({
      symbol: z.string().min(1).max(32).regex(/^[A-Za-z0-9.^%=_/-]+$/),
    }),
  )
  .handler(async ({ data }) => {
    const { fetchFundamentals } = await import("./yahoo.server");
    return fetchFundamentals(data.symbol);
  });
