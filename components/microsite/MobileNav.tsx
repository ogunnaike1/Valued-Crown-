"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = { label: string; href: string; download?: boolean; internal?: boolean };

/** Hamburger + slide-down panel for the product site nav, shown below the lg breakpoint. */
export default function MobileNav({ items, buyHref, loginHref }: { items: Item[]; buyHref: string; loginHref: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const link = "flex h-12 items-center border-b border-line text-[17px] font-medium";
  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="ms-mobile-nav" aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-11 w-11 flex-none place-items-center border border-ink/80 text-ink">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open ? (
        <div id="ms-mobile-nav" className="fixed inset-x-0 top-[68px] bottom-0 z-40 overflow-y-auto bg-white px-[clamp(20px,4vw,48px)] pb-10 pt-2 sm:top-[76px]">
          <nav aria-label="Product menu" className="flex flex-col">
            {items.map((i) => i.internal
              ? <Link key={i.label} href={i.href} onClick={() => setOpen(false)} className={link}>{i.label}</Link>
              : <a key={i.label} href={i.href} download={i.download || undefined} onClick={() => setOpen(false)} className={link}>{i.label}</a>)}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Link href={loginHref} onClick={() => setOpen(false)} className="flex h-12 items-center justify-center border border-ink/80 text-[15px] font-semibold">Client dashboard</Link>
            <Link href={buyHref} onClick={() => setOpen(false)} className="flex h-12 items-center justify-center gap-2 bg-ink text-[15px] font-semibold text-paper">Buy now <span aria-hidden="true" style={{ color: "#E27C22" }}>→</span></Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
