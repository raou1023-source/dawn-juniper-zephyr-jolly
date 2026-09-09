import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  label: string;
  hint: string;
};

const OPEN = "kabu-hint-open";

export function TermHint({ label, hint }: Props) {
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState({ top: 0, left: 0, width: 224 });
  const wrapRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) setOpen(false);
    };
    window.addEventListener(OPEN, onOther);
    return () => window.removeEventListener(OPEN, onOther);
  }, [id]);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const anchor = btnRef.current ?? wrapRef.current;
      if (!anchor) return;
      const r = anchor.getBoundingClientRect();
      const width = Math.min(280, window.innerWidth - 16);
      let left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
      const tipH = tipRef.current?.offsetHeight ?? 120;
      let top = r.bottom + 6;
      if (top + tipH > window.innerHeight - 8) top = Math.max(8, r.top - tipH - 6);
      setBox({ top, left, width });
    };
    place();
    const frame = requestAnimationFrame(place);
    return () => cancelAnimationFrame(frame);
  }, [open, hint]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      const target = e.target as Node;
      if (wrapRef.current?.contains(target) || tipRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onWin = () => setOpen(false);
    document.addEventListener("pointerdown", close);
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      document.removeEventListener("pointerdown", close);
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className="relative inline-flex items-start pr-3">
      <span>{label}</span>
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setOpen((v) => {
            const next = !v;
            if (next) window.dispatchEvent(new CustomEvent(OPEN, { detail: id }));
            return next;
          });
        }}
        className="absolute -top-1.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-accent text-[9px] leading-none text-accent-fg"
      >
        !
      </button>
      {open
        ? createPortal(
            <span
              ref={tipRef}
              id={id}
              role="tooltip"
              style={{ top: box.top, left: box.left, width: box.width }}
              className="fixed z-[80] max-h-[min(50vh,16rem)] overflow-y-auto rounded-md border border-border bg-elevated px-3 py-2.5 text-[12px] leading-relaxed text-fg shadow-lg"
            >
              {hint}
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}
