import { translate, type MsgKey } from "@/lib/i18n";
import { useDesk } from "@/stores/desk";

export function useT() {
  const locale = useDesk((s) => s.locale ?? "ja");
  return (key: MsgKey, vars?: Record<string, string | number>) =>
    translate(locale, key, vars);
}

export function useLocale() {
  return useDesk((s) => s.locale ?? "ja");
}
