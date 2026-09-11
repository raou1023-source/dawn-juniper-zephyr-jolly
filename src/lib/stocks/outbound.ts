import { isPrivateHost } from "@/lib/safe";

export async function outbound(
  url: string,
  hosts: Set<string>,
  init: RequestInit & { timeout?: number } = {},
) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
    throw new Error("blocked");
  }
  if (parsed.port && parsed.port !== "443") throw new Error("blocked");
  const host = parsed.hostname.toLowerCase();
  if (!hosts.has(host)) throw new Error("blocked");
  if (isPrivateHost(host)) throw new Error("blocked");
  const { timeout = 8000, redirect = "error", ...rest } = init;
  const headers = new Headers(rest.headers);
  headers.delete("host");
  return fetch(parsed.href, {
    ...rest,
    headers,
    redirect,
    signal: rest.signal ?? AbortSignal.timeout(timeout),
  });
}
