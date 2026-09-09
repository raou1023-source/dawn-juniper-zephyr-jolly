import { Bell } from "lucide-react";
import { useState } from "react";
import { useT } from "@/lib/use-t";
import { useDesk } from "@/stores/desk";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const THRESHOLDS = [3, 5, 8];

export function AlertsMenu() {
  const [open, setOpen] = useState(false);
  const alerts = useDesk((s) => s.alerts ?? []);
  const unread = alerts.filter((a) => !a.read).length;
  const notifyEnabled = useDesk((s) => s.notifyEnabled ?? true);
  const notifyThreshold = useDesk((s) => s.notifyThreshold ?? 5);
  const browserNotify = useDesk((s) => s.browserNotify ?? false);
  const setNotifyEnabled = useDesk((s) => s.setNotifyEnabled);
  const setNotifyThreshold = useDesk((s) => s.setNotifyThreshold);
  const setBrowserNotify = useDesk((s) => s.setBrowserNotify);
  const markAlertsRead = useDesk((s) => s.markAlertsRead);
  const t = useT();

  async function enableBrowser() {
    if (typeof Notification === "undefined") return;
    const perm = await Notification.requestPermission();
    setBrowserNotify(perm === "granted");
  }

  return (
    <div className="relative">
      <Button
        size="sm"
        variant={open ? "default" : "subtle"}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAlertsRead();
        }}
        aria-label={t("notify")}
      >
        <Bell className="size-3.5" />
        {t("notify")}
        {unread > 0 ? (
          <span className="ml-0.5 inline-flex min-w-4 justify-center rounded-full bg-down px-1 text-[10px] text-fg">
            {unread}
          </span>
        ) : null}
      </Button>
      {open ? (
        <div className="absolute top-10 right-0 z-30 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-border bg-surface p-3 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-fg">{t("notifyTitle")}</p>
            <button
              type="button"
              onClick={() => setNotifyEnabled(!notifyEnabled)}
              className={cn(
                "h-7 rounded-md px-2 text-[11px]",
                notifyEnabled ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
              )}
            >
              {notifyEnabled ? "ON" : "OFF"}
            </button>
          </div>
          <div className="mb-3 flex gap-1">
            {THRESHOLDS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNotifyThreshold(n)}
                className={cn(
                  "h-7 flex-1 rounded-md text-[11px]",
                  notifyThreshold === n
                    ? "bg-accent text-accent-fg"
                    : "bg-elevated text-muted",
                )}
              >
                {t("notifyPct", { n })}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void enableBrowser()}
            className="mb-3 h-8 w-full rounded-md bg-elevated text-xs text-muted hover:text-fg"
          >
            {browserNotify ? t("browserOn") : t("browserOff")}
          </button>
          <ul className="max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <li className="px-1 py-4 text-center text-xs text-muted">
                {t("noAlerts")}
              </li>
            ) : (
              alerts.slice(0, 12).map((alert) => (
                <li key={alert.id} className="border-t border-border py-2 first:border-t-0">
                  <p className="text-xs text-fg">{alert.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{alert.body}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
