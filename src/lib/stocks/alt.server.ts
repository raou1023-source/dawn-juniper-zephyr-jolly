import { lookupCatalog } from "./catalog";
import { outbound } from "./outbound";
import { sanitizeCandles } from "./ohlc";
import type { Candle, ChartPayload, QuoteMeta } from "./types";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const HOSTS = new Set([
  "api.exchange.coinbase.com",
  "api.coinbase.com",
  "open.er-api.com",
  "api.frankfurter.app",
  "stooq.com",
]);

async function getJson(url: string, timeout = 7000): Promise<unknown> {
  const res = await safeFetch(url, "application/json", timeout);
  return res.json();
}

async function getText(url: string): Promise<string> {
  const res = await safeFetch(url, "text/plain", 7000);
  return res.text();
}

async function safeFetch(url: string, accept: string, timeout: number) {
  const res = await outbound(url, HOSTS, {
    headers: { "User-Agent": UA, Accept: accept },
    timeout,
    redirect: "error",
  });
  if (!res.ok) throw new Error(`alt ${res.status}`);
  return res;
}

const CRYPTO_CB: Record<string, string> = {
  "BTC-USD": "BTC-USD",
  "ETH-USD": "ETH-USD",
  "SOL-USD": "SOL-USD",
  "XRP-USD": "XRP-USD",
  "BTC-JPY": "BTC-USD",
  "ETH-JPY": "ETH-USD",
};

function rangeDays(range: string) {
  if (range === "1d" || range === "5d") return 5;
  if (range === "1mo") return 31;
  if (range === "3mo") return 93;
  if (range === "6mo") return 186;
  if (range === "1y") return 366;
  return 800;
}

export async function fetchAltChart(symbol: string, range: string): Promise<ChartPayload | null> {
  const crypto = await cryptoChart(symbol, range);
  if (crypto) return crypto;
  const fx = await fxChart(symbol, range);
  if (fx) return fx;
  const stooq = await stooqChart(symbol, range);
  if (stooq) return stooq;
  return null;
}

export async function fetchAltQuotes(symbols: string[]): Promise<QuoteMeta[]> {
  const out: QuoteMeta[] = [];
  const rates = await fxRates();
  for (const symbol of symbols.slice(0, 20)) {
    const row =
      (await cryptoQuote(symbol, rates)) ||
      fxQuote(symbol, rates) ||
      (await metalQuote(symbol)) ||
      (await stooqQuote(symbol));
    if (row) out.push(row);
  }
  return out;
}

async function cryptoChart(symbol: string, range: string): Promise<ChartPayload | null> {
  const product = CRYPTO_CB[symbol.toUpperCase()];
  if (!product) return null;
  const gran = range === "1d" || range === "5d" ? 3600 : 86400;
  try {
    const raw = (await getJson(
      `https://api.exchange.coinbase.com/products/${product}/candles?granularity=${gran}`,
    )) as number[][];
    const candles = raw
      .map((row) => ({
        time: row[0]!,
        low: row[1]!,
        high: row[2]!,
        open: row[3]!,
        close: row[4]!,
        volume: row[5] ?? 0,
      }))
      .filter((c) => Number.isFinite(c.close))
      .sort((a, b) => a.time - b.time);
    const jpy = symbol.toUpperCase().endsWith("-JPY") ? await usdJpy() : 1;
    const scaled = jpy === 1 ? candles : candles.map((c) => scale(c, jpy));
    const cut = scaled[scaled.length - 1]!.time - rangeDays(range) * 86400;
    const sliced = scaled.filter((c) => c.time >= cut);
    return pack(symbol, sanitizeCandles(sliced.length >= 2 ? sliced : scaled), symbol.endsWith("JPY") ? "JPY" : "USD", "Coinbase");
  } catch {
    return null;
  }
}

async function cryptoQuote(symbol: string, rates: Record<string, number> | null): Promise<QuoteMeta | null> {
  const product = CRYPTO_CB[symbol.toUpperCase()];
  if (!product) return null;
  try {
    const json = (await getJson(`https://api.coinbase.com/v2/prices/${product}/spot`)) as {
      data?: { amount?: string };
    };
    let price = Number(json.data?.amount);
    if (!Number.isFinite(price)) return null;
    if (symbol.toUpperCase().endsWith("-JPY")) {
      const jpy = rates?.JPY ?? (await usdJpy());
      price *= jpy;
    }
    return live(symbol, price, symbol.toUpperCase().endsWith("-JPY") ? "JPY" : "USD", "Coinbase");
  } catch {
    return null;
  }
}

async function fxRates(): Promise<Record<string, number> | null> {
  try {
    const json = (await getJson("https://open.er-api.com/v6/latest/USD")) as {
      rates?: Record<string, number>;
    };
    return json.rates ?? null;
  } catch {
    try {
      const json = (await getJson("https://api.frankfurter.app/latest?from=USD")) as {
        rates?: Record<string, number>;
      };
      return json.rates ?? null;
    } catch {
      return null;
    }
  }
}

function fxQuote(symbol: string, rates: Record<string, number> | null): QuoteMeta | null {
  if (!rates) return null;
  const price = fxPrice(symbol, rates);
  if (price == null) return null;
  const jpy = /JPY/i.test(symbol);
  return live(symbol, price, jpy ? "JPY" : "USD", "FX");
}

function fxPrice(symbol: string, rates: Record<string, number>): number | null {
  const s = symbol.toUpperCase().replace("=X", "");
  const pair = s.match(/^([A-Z]{3})([A-Z]{3})$/);
  const one = s.match(/^([A-Z]{3})$/);
  let base = "USD";
  let quote = "";
  if (pair) {
    base = pair[1]!;
    quote = pair[2]!;
  } else if (one) {
    base = "USD";
    quote = one[1]!;
  } else return null;
  const usdQuote = quote === "USD" ? 1 : rates[quote];
  const usdBase = base === "USD" ? 1 : rates[base];
  if (!usdQuote || !usdBase) return null;
  return usdQuote / usdBase;
}

async function fxChart(symbol: string, range: string): Promise<ChartPayload | null> {
  if (!symbol.toUpperCase().includes("=X") && !/^[A-Z]{6}=X$/.test(symbol.toUpperCase())) {
    if (!/=X$/i.test(symbol)) return null;
  }
  const s = symbol.toUpperCase().replace("=X", "");
  const pair = s.match(/^([A-Z]{3})([A-Z]{3})$/) ?? (s.match(/^([A-Z]{3})$/) ? ["", "USD", s] : null);
  if (!pair) return null;
  const base = pair[1] || "USD";
  const quote = pair[2]!;
  if (!/^[A-Z]{3}$/.test(base) || !/^[A-Z]{3}$/.test(quote)) return null;
  const end = new Date();
  const start = new Date(end.getTime() - rangeDays(range) * 86400);
  const from = start.toISOString().slice(0, 10);
  const to = end.toISOString().slice(0, 10);
  try {
    const json = (await getJson(
      `https://api.frankfurter.app/${from}..${to}?from=${base}&to=${quote}`,
    )) as { rates?: Record<string, Record<string, number>> };
    const rows = Object.entries(json.rates ?? {})
      .map(([day, map]) => {
        const close = map[quote];
        if (!close) return null;
        const time = Math.floor(Date.parse(day + "T00:00:00Z") / 1000);
        return { time, open: close, high: close, low: close, close, volume: 0 };
      })
      .filter((c): c is Candle => Boolean(c))
      .sort((a, b) => a.time - b.time);
    if (rows.length < 2) return null;
    return pack(symbol, sanitizeCandles(rows), quote === "JPY" ? "JPY" : quote, "ECB");
  } catch {
    return null;
  }
}

async function metalQuote(symbol: string): Promise<QuoteMeta | null> {
  const map: Record<string, string> = { "GC=F": "XAU-USD", "SI=F": "XAG-USD" };
  const product = map[symbol.toUpperCase()];
  if (!product) return null;
  try {
    const json = (await getJson(`https://api.coinbase.com/v2/prices/${product}/spot`)) as {
      data?: { amount?: string };
    };
    const price = Number(json.data?.amount);
    if (!Number.isFinite(price)) return null;
    return live(symbol, price, "USD", "Coinbase");
  } catch {
    return null;
  }
}

function toStooq(symbol: string) {
  const s = symbol.toUpperCase();
  if (s.endsWith(".T") && /^\d{4}\.T$/.test(s)) return `${s.replace(".T", "")}.jp`;
  if (/^[A-Z]{1,5}$/.test(s)) return `${s}.us`;
  if (s === "USDJPY=X" || s === "JPY=X") return "usdjpy";
  if (s === "EURUSD=X" || s === "EUR=X") return "eurusd";
  if (s === "GBPUSD=X") return "gbpusd";
  if (s === "EURJPY=X") return "eurjpy";
  if (s === "GC=F") return "gc.f";
  if (s === "CL=F") return "cl.f";
  if (s === "PL=F") return "pl.f";
  if (s === "^N225") return "^nkx";
  if (s === "^GSPC") return "^spx";
  if (s === "^DJI") return "^dji";
  if (s === "^TNX") return "10usy.b";
  return null;
}

async function stooqChart(symbol: string, range: string): Promise<ChartPayload | null> {
  const code = toStooq(symbol);
  if (!code) return null;
  try {
    const text = await getText(`https://stooq.com/q/d/l/?s=${encodeURIComponent(code)}&i=d`);
    if (!text.startsWith("Date")) return null;
    const lines = text.trim().split("\n").slice(1);
    const candles: Candle[] = [];
    for (const line of lines) {
      const [date, open, high, low, close, volume] = line.split(",");
      if (!date || !close) continue;
      const t = Math.floor(Date.parse(date + "T00:00:00Z") / 1000);
      const c = Number(close);
      if (!Number.isFinite(t) || !Number.isFinite(c)) continue;
      candles.push({
        time: t,
        open: Number(open) || c,
        high: Number(high) || c,
        low: Number(low) || c,
        close: c,
        volume: Number(volume) || 0,
      });
    }
    if (candles.length < 2) return null;
    const cut = candles[candles.length - 1]!.time - rangeDays(range) * 86400;
    return pack(symbol, sanitizeCandles(candles.filter((c) => c.time >= cut)), guessCcy(symbol), "Stooq");
  } catch {
    return null;
  }
}

async function stooqQuote(symbol: string): Promise<QuoteMeta | null> {
  const hit = await stooqChart(symbol, "1mo");
  if (!hit) return null;
  return hit.meta;
}

async function usdJpy() {
  const rates = await fxRates();
  return rates?.JPY ?? 150;
}

function scale(c: Candle, n: number): Candle {
  return {
    time: c.time,
    open: c.open * n,
    high: c.high * n,
    low: c.low * n,
    close: c.close * n,
    volume: c.volume,
  };
}

function pack(symbol: string, candles: Candle[], currency: string, exchange: string): ChartPayload | null {
  if (candles.length < 2) return null;
  const last = candles[candles.length - 1]!;
  const prev = candles[candles.length - 2]!.close;
  const name = lookupCatalog(symbol)?.name || symbol;
  return {
    meta: {
      symbol,
      name,
      currency,
      exchange,
      price: last.close,
      previousClose: prev,
      change: last.close - prev,
      changePercent: prev ? ((last.close - prev) / prev) * 100 : 0,
      source: "live",
    },
    candles,
    source: "live",
  };
}

function live(symbol: string, price: number, currency: string, exchange: string): QuoteMeta {
  return {
    symbol,
    name: lookupCatalog(symbol)?.name || symbol,
    currency,
    exchange,
    price,
    previousClose: price,
    change: 0,
    changePercent: 0,
    source: "live",
  };
}

function guessCcy(symbol: string) {
  if (/\.T$/i.test(symbol) || /JPY/i.test(symbol) || symbol === "^N225") return "JPY";
  return "USD";
}
