const SYMBOL_OK = /^[A-Za-z0-9.^%=_/-]{1,32}$/;
const HEX = /^#[0-9A-Fa-f]{6}$/;

export function safeSymbol(raw: string): string | null {
  const s = raw.trim().toUpperCase();
  if (!SYMBOL_OK.test(s)) return null;
  return s;
}

export function safeHttpUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function safeHexColor(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  return HEX.test(raw) ? raw : undefined;
}

export function stripTags(raw: string) {
  return raw.replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
}
