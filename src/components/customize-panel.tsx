import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import type { ChartKind, ChartSettings } from "@/lib/stocks/types";
import type { MsgKey } from "@/lib/i18n";
import { TermHint } from "./term-hint";
import { useT } from "@/lib/use-t";
import { useDesk } from "@/stores/desk";
import { cn } from "@/lib/utils";

const HINTS = new Set([
  "candle",
  "bar",
  "line",
  "area",
  "log",
  "sma20",
  "sma50",
  "sma200",
  "ema12",
  "ema26",
  "bollinger",
  "volume",
]);

const KINDS: { key: ChartKind; label: "candle" | "bar" | "line" | "area" }[] = [
  { key: "candle", label: "candle" },
  { key: "bar", label: "bar" },
  { key: "line", label: "line" },
  { key: "area", label: "area" },
];

const TOGGLES: { key: keyof ChartSettings; label: "grid" | "volume" | "crosshair" | "lastPrice" | "log" | "sma20" | "sma50" | "sma200" | "ema12" | "ema26" | "bollinger" }[] = [
  { key: "showGrid", label: "grid" },
  { key: "showVolume", label: "volume" },
  { key: "showCrosshair", label: "crosshair" },
  { key: "showLastPrice", label: "lastPrice" },
  { key: "logScale", label: "log" },
  { key: "sma20", label: "sma20" },
  { key: "sma50", label: "sma50" },
  { key: "sma200", label: "sma200" },
  { key: "ema12", label: "ema12" },
  { key: "ema26", label: "ema26" },
  { key: "bollinger", label: "bollinger" },
];

export function CustomizePanel() {
  const settings = useDesk((s) => s.settings);
  const patch = useDesk((s) => s.patchSettings);
  const reset = useDesk((s) => s.resetSettings);
  const [open, setOpen] = useState(false);
  const t = useT();
  const kind = t(KINDS.find((k) => k.key === settings.kind)?.label ?? "candle");

  return (
    <section className="border-b border-border bg-surface px-4 py-2 md:px-6">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1 text-xs tracking-wide text-muted hover:text-fg"
        >
          {t("custom")}
          <span className="text-faint">· {kind}</span>
          <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
        </button>
        {open ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] text-muted hover:text-fg"
          >
            <RotateCcw className="size-3" />
            {t("reset")}
          </button>
        ) : null}
      </div>
      {open ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {KINDS.map((k) => (
          <button
            key={k.key}
            type="button"
            onClick={() => patch({ kind: k.key })}
            className={cn(
              "h-8 rounded-md px-2.5 text-xs",
              settings.kind === k.key
                ? "bg-accent text-accent-fg"
                : "bg-elevated text-muted hover:text-fg",
            )}
          >
            {HINTS.has(k.label) ? (
              <TermHint label={t(k.label)} hint={t(`${k.label}Hint` as MsgKey)} />
            ) : (
              t(k.label)
            )}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-border" />
        {(["ink", "paper"] as const).map((bg) => (
          <button
            key={bg}
            type="button"
            onClick={() => patch({ background: bg })}
            className={cn(
              "h-8 rounded-md px-2.5 text-xs",
              settings.background === bg
                ? "bg-accent text-accent-fg"
                : "bg-elevated text-muted hover:text-fg",
            )}
          >
            {t(bg)}
          </button>
        ))}
        <ColorChip label={t("colorUp")} value={settings.upColor} onChange={(upColor) => patch({ upColor })} />
        <ColorChip label={t("colorDown")} value={settings.downColor} onChange={(downColor) => patch({ downColor })} />
        <ColorChip label={t("wick")} value={settings.wickColor} onChange={(wickColor) => patch({ wickColor })} />
        <span className="mx-1 h-5 w-px bg-border" />
        {TOGGLES.map((item) => {
          const on = Boolean(settings[item.key]);
          const label =
            item.label === "sma20" || item.label === "sma50" || item.label === "sma200" ||
            item.label === "ema12" || item.label === "ema26" || item.label === "bollinger"
              ? item.label === "bollinger"
                ? "BB"
                : item.label.toUpperCase()
              : t(item.label);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => patch({ [item.key]: !on } as Partial<ChartSettings>)}
              className={cn(
                "h-8 rounded-md px-2.5 text-xs",
                on ? "bg-accent text-accent-fg" : "bg-elevated text-muted hover:text-fg",
              )}
            >
            {HINTS.has(item.label) ? (
              <TermHint label={label} hint={t(`${item.label}Hint` as MsgKey)} />
            ) : (
              label
            )}
            </button>
          );
        })}
        </div>
      ) : null}
    </section>
  );
}

function ColorChip({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="inline-flex h-8 items-center gap-1.5 rounded-md bg-elevated px-2 text-xs text-muted">
      {label}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="size-4 cursor-pointer rounded-sm border-0 bg-transparent p-0"
      />
    </label>
  );
}
