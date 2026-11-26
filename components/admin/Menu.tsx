"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Minimal accessible popover menu: closes on outside click and Escape. */
export default function Menu({ button, children, align = "left", width = 260, label, sheet = false }: { sheet?: boolean; button: (open: boolean) => ReactNode; children: (close: () => void) => ReactNode; align?: "left" | "right"; width?: number; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", down); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open]);
  return (
    <div ref={ref} className={`relative ${sheet ? "max-sm:static" : ""}`}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)} className="flex items-center rounded-lg">{button(open)}</button>
      {open && (
        <div role="menu" style={{ width }} className={`a-pop absolute top-[calc(100%+6px)] ${sheet ? "max-sm:!left-3 max-sm:!right-3 max-sm:!w-auto" : ""} z-50 max-w-[calc(100vw-24px)] rounded-xl border border-a-line bg-a-surface p-1.5 shadow-xl ${align === "right" ? "right-0" : "left-0"}`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function MenuItem({ children, onClick, active, danger }: { children: ReactNode; onClick: () => void; active?: boolean; danger?: boolean }) {
  return (
    <button role="menuitem" onClick={onClick} className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] hover:bg-a-surface2 ${active ? "bg-a-surface2 font-semibold" : ""} ${danger ? "text-[rgb(var(--t-red))]" : "text-a-fg"}`}>{children}</button>
  );
}
