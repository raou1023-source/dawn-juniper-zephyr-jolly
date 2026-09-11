const SYMBOL_OK = /^[A-Za-z0-9.^%=_/-]{1,32}$/;
const HEX = /^#[0-9A-Fa-f]{6}$/;
const LOCALES = new Set(["ja", "en", "zh", "ko"]);
const NEWS_HOST =
  /(^|\.)(yahoo\.com|yahoo\.co\.jp|reuters\.com|bloomberg\.com|nikkei\.com|wsj\.com|ft\.com|cnbc\.com|marketwatch\.com|investing\.com|coindesk\.com|bbc\.com|bbc\.co\.uk|nytimes\.com|theguardian\.com)$/i;
const COOKIE_VAL = /^[\w.~+/=&%-]{1,512}$/;

export function safeSymbol(raw: string): string | null {
  const s = raw.trim().toUpperCase();
  if (!SYMBOL_OK.test(s)) return null;
  return s;
}

export function safeHttpUrl(raw: string): string | null {
  try {
    const trimmed = raw.trim();
    if (!trimmed.startsWith("https://")) return null;
    if (/[\u0000-\u001F\s]/.test(trimmed)) return null;
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    if (url.port && url.port !== "443") return null;
    const host = url.hostname.toLowerCase();
    if (!host.includes(".") || host.endsWith(".")) return null;
    if (host.endsWith(".onion") || host.endsWith(".local")) return null;
    if (isPrivateHost(host)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function safeNewsUrl(raw: string): string | null {
  const url = safeHttpUrl(raw);
  if (!url) return null;
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (!NEWS_HOST.test(host)) return null;
    return url;
  } catch {
    return null;
  }
}

export function isPrivateHost(host: string) {
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  if (h === "localhost" || h.endsWith(".local") || h === "::1") return true;
  const mapped = h.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  const ip4 = mapped?.[1] ?? (h.match(/^(\d{1,3}(?:\.\d{1,3}){3})$/)?.[1] ?? null);
  if (ip4) return isPrivateV4(ip4);
  if (h.includes(":")) {
    if (h.startsWith("fe80:") || h.startsWith("fc") || h.startsWith("fd") || h === "::" || h.startsWith("2001:db8:")) {
      return true;
    }
  }
  return false;
}

function isPrivateV4(ip: string) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = parts;
  if (a === 10 || a === 127 || a === 0 || a === 255) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

export function safeHexColor(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  return HEX.test(raw) ? raw : undefined;
}

export function stripTags(raw: string) {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export function safeName(raw: string, fallback = "") {
  const name = stripTags(raw).replace(/[<>]/g, "").slice(0, 80);
  return name || fallback;
}

export function safeLocale(raw: unknown): "ja" | "en" | "zh" | "ko" | null {
  return typeof raw === "string" && LOCALES.has(raw) ? (raw as "ja" | "en" | "zh" | "ko") : null;
}

export function safeCookieValue(raw: string): string | null {
  if (!COOKIE_VAL.test(raw)) return null;
  return raw;
}

export function safeUuid(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(raw)
    ? raw
    : null;
}
