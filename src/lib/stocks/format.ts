import { LOCALE_BCP, type Locale } from "@/lib/i18n";

const ZERO_DEC = new Set(["JPY", "KRW"]);
const YIELD = /^\^(TNX|TYX|FVX|IRX)$/i;

export function formatPrice(n: number, currency: string, symbol = "", locale: Locale = "ja") {
  const tag = LOCALE_BCP[locale];
  if (YIELD.test(symbol)) {
    return `${n.toLocaleString(tag, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })}%`;
  }
  if (symbol.endsWith("=X")) {
    const digits = symbol.includes("JPY") ? 3 : 5;
    return n.toLocaleString(tag, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }
  if (/-(USD|JPY|EUR)$/.test(symbol) && n >= 1000) {
    return n.toLocaleString(tag, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  const digits = ZERO_DEC.has(currency) ? 0 : 2;
  return n.toLocaleString(tag, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function currencySuffix(currency: string, symbol = "", locale: Locale = "ja") {
  if (YIELD.test(symbol)) return "";
  if (symbol.endsWith("=X") && symbol.includes("JPY")) return locale === "ja" ? "円" : "";
  if (currency === "JPY") return locale === "ja" ? "円" : "";
  if (symbol.endsWith("=F")) return currency === "USD" ? "USD" : currency || "USD";
  return currency || "";
}
