import { LOCALES } from "@/lib/i18n";
import { useDesk } from "@/stores/desk";
import { cn } from "@/lib/utils";

export function LanguageSwitch() {
  const locale = useDesk((s) => s.locale ?? "ja");
  const setLocale = useDesk((s) => s.setLocale);
  return (
    <div className="flex items-center gap-0.5 rounded-md bg-elevated p-0.5">
      {LOCALES.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setLocale(item.id)}
          className={cn(
            "h-7 rounded px-1.5 text-[10px] tracking-wide",
            locale === item.id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
          )}
          aria-pressed={locale === item.id}
        >
          {item.id === "ja" ? "JP" : item.id === "en" ? "EN" : item.id === "zh" ? "中" : "한"}
        </button>
      ))}
    </div>
  );
}
