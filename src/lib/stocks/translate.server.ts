const cache = new Map<string, string>();

const TARGET: Record<string, string> = {
  ja: "ja",
  en: "en",
  zh: "zh-CN",
  ko: "ko",
};

function stripCtrl(value: string) {
  return value.replace(/[\u0000-\u001F]/g, "").trim();
}

export async function translateTitles(titles: string[], locale: string): Promise<string[]> {
  const tl = TARGET[locale] ?? "en";
  return Promise.all(titles.map((title) => translateOne(title, tl)));
}

async function translateOne(text: string, tl: string): Promise<string> {
  const key = `${tl}:${text}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const clipped = stripCtrl(text).slice(0, 200);
  const translated =
    (await viaGoogle(clipped, tl)) || (await viaMemory(clipped, tl)) || text;
  cache.set(key, translated);
  if (cache.size > 400) {
    const first = cache.keys().next().value;
    if (first) cache.delete(first);
  }
  return translated;
}

async function viaGoogle(text: string, tl: string): Promise<string | null> {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
    encodeURIComponent(tl) +
    "&dt=t&q=" +
    encodeURIComponent(text);
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const json = (await res.json()) as unknown;
    if (!Array.isArray(json) || !Array.isArray(json[0])) return null;
    const out = (json[0] as Array<[string] | undefined>)
      .map((part) => (Array.isArray(part) ? part[0] : ""))
      .join("");
    return out.trim() || null;
  } catch {
    return null;
  }
}

async function viaMemory(text: string, tl: string): Promise<string | null> {
  const pair = `autodetect|${tl === "zh-CN" ? "zh-CN" : tl}`;
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text) +
    "&langpair=" +
    encodeURIComponent(pair);
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const json = (await res.json()) as { responseData?: { translatedText?: string } };
    const out = json.responseData?.translatedText?.trim();
    return out || null;
  } catch {
    return null;
  }
}
