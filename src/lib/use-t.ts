import { useCallback } from "react";
import { translate, type MsgKey } from "@/lib/i18n";
import { useDesk } from "@/stores/desk";

export function useT() {
  const locale = useDesk((s) => s.locale ?? "ja");
  return useCallback(
    (key: MsgKey, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale],
  );
}

export function useLocale() {
  return useDesk((s) => s.locale ?? "ja");
}
