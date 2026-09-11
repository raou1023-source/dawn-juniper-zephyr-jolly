import { Bell } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useT } from "@/lib/use-t";
import { useDesk } from "@/stores/desk";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const THRESHOLDS = [3, 5, 8];

export function AlertsMenu() {
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState({ top: 56, left: 8, width: 320, maxH: 360 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = wrapRef.current?.getBoundingClientRect();
      const pad = 8;
      const width = Math.min(360, window.innerWidth - pad * 2);
      let left = r ? r.right - width : pad;
      left = Math.min(Math.max(pad, left), window.innerWidth - width - pad);
      const top = Math.min((r?.bottom ?? 48) + 6, window.innerHeight - 120);
      const maxH = Math.max(160, window.innerHeight - top - pad);
      setBox({ top, left, width, maxH });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      const n = e.target;
      if (!(n instanceof Node)) return;
      if (wrapRef.current?.contains(n) || panelRef.current?.contains(n)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [open]);

  async function enableBrowser() {
    if (typeof Notification === "undefined") return;
    const perm = await Notification.requestPermission();
    setBrowserNotify(perm === "granted");
  }

  return (
    <div className="relative" ref={wrapRef}>
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
      {open
        ? createPortal(
            <div
              ref={panelRef}
              className="fixed z-50 overflow-y-auto rounded-lg border border-border bg-surface p-3 shadow-lg"
              style={{
                top: box.top,
                left: box.left,
                width: box.width,
                maxHeight: box.maxH,
              }}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm text-fg">{t("notifyTitle")}</p>
                <button
                  type="button"
                  onClick={() => setNotifyEnabled(!notifyEnabled)}
                  className={cn(
                    "h-7 shrink-0 rounded-md px-2 text-[11px]",
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
                      "h-7 min-w-0 flex-1 rounded-md px-1 text-[11px]",
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
              <ul>
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
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
