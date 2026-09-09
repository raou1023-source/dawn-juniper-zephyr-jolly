import { LOCALE_BCP } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/use-t";
import { useDesk } from "@/stores/desk";
import { cn } from "@/lib/utils";

const SPEEDS = [
  { ms: 5000, key: "s5" as const },
  { ms: 15000, key: "s15" as const },
  { ms: 30000, key: "s30" as const },
];

type Props = {
  updatedAt: number;
  fetching: boolean;
  locked?: boolean;
};

export function LiveControls({ updatedAt, fetching, locked }: Props) {
  const live = useDesk((s) => s.live);
  const liveMs = useDesk((s) => s.liveMs);
  const setLive = useDesk((s) => s.setLive);
  const setLiveMs = useDesk((s) => s.setLiveMs);
  const locale = useLocale();
  const t = useT();
  const on = locked || live;
  const stamp = updatedAt
    ? new Date(updatedAt).toLocaleTimeString(LOCALE_BCP[locale], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => {
          if (!locked) setLive(!live);
        }}
        disabled={locked}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors duration-[var(--motion-quick)]",
          on ? "bg-elevated text-fg" : "bg-elevated text-muted",
          locked && "opacity-100",
        )}
        aria-pressed={on}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            on ? "bg-up animate-live-pulse" : "bg-faint",
          )}
        />
        {locked ? t("liveAlways") : on ? t("liveOn") : t("liveOff")}
      </button>
      {!locked && on
        ? SPEEDS.map((s) => (
            <button
              key={s.ms}
              type="button"
              onClick={() => setLiveMs(s.ms)}
              className={cn(
                "hidden h-8 rounded-md px-2 text-[11px] sm:inline-flex sm:items-center",
                liveMs === s.ms ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
              )}
            >
              {t(s.key)}
            </button>
          ))
        : null}
      {locked ? (
        <span className="hidden text-[11px] text-muted sm:inline">{t("live3s")}</span>
      ) : null}
      <span className="hidden font-mono text-[10px] text-faint tabular-nums md:inline">
        {fetching ? t("updating") : stamp}
      </span>
    </div>
  );
}
