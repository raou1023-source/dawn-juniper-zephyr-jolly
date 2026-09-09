import { useRef, type PointerEvent } from "react";
import { useDesk } from "@/stores/desk";

let lockUntil = 0;

export function watchNavLocked() {
  return Date.now() < lockUntil;
}

export function stepWatch(dir: -1 | 1) {
  if (watchNavLocked()) return;
  const { watchlist, selected, select } = useDesk.getState();
  if (watchlist.length < 2) return;
  const i = watchlist.findIndex((w) => w.symbol === selected);
  if (i < 0) return;
  const next = watchlist[i + dir];
  if (!next || next.symbol === selected) return;
  lockUntil = Date.now() + 1200;
  select(next.symbol);
}

function suppressGhostClick() {
  const stop = (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();
  };
  document.addEventListener("click", stop, true);
  document.addEventListener("pointerup", stop, true);
  window.setTimeout(() => {
    document.removeEventListener("click", stop, true);
    document.removeEventListener("pointerup", stop, true);
  }, 500);
}

export function useWatchSwipe() {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);

  return {
    onPointerDown: (e: PointerEvent) => {
      if (e.button !== 0) return;
      start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    },
    onPointerUp: (e: PointerEvent) => {
      const from = start.current;
      start.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      if (!from || from.id !== e.pointerId) return;
      const dx = e.clientX - from.x;
      const dy = e.clientY - from.y;
      if (Math.abs(dx) < 64) return;
      if (Math.abs(dy) > Math.abs(dx) * 0.4) return;
      e.preventDefault();
      e.stopPropagation();
      suppressGhostClick();
      stepWatch(dx < 0 ? 1 : -1);
    },
    onPointerCancel: (e: PointerEvent) => {
      start.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    },
  };
}
