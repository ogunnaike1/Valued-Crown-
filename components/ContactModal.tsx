"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ContactFields } from "./pages/ContactForm";
import { getLenis } from "@/lib/lenis";

/**
 * Contact pop-up. Any link to /contact (navbar button, hero, product "Enquire now", call-to-action blocks, footer, menus)
 * opens this instead of navigating, with the product pre-selected when the link says so (/contact?interest=hotel-manager).
 * Escape, the close button or a click outside closes it. The /contact page itself still exists and works on its own.
 */
export default function ContactModal() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false); // in the DOM
  const [shown, setShown] = useState(false); // visible (drives the transition)
  const [interest, setInterest] = useState<string | null>(null);
  const [run, setRun] = useState(0); // remounts the form so a new open starts clean
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const timer = useRef<number>();

  const close = useCallback(() => {
    setShown(false);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMounted(false), 380);
    getLenis()?.start();
    document.documentElement.style.overflow = "";
    opener.current?.focus?.();
  }, []);

  const open = useCallback((i: string | null) => {
    window.clearTimeout(timer.current);
    window.dispatchEvent(new Event("vc:close-menu")); // close the mobile menu if it is open
    setInterest(i);
    setRun((r) => r + 1);
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
  }, []);

  // intercept links to /contact (capture phase, before the page-transition loader and Next's own link handling)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== "/contact") return;
      if (location.pathname === "/contact") return; // already on the page: let it be
      e.preventDefault();
      e.stopPropagation();
      opener.current = a;
      open(url.searchParams.get("interest"));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [open]);

  // keyboard: Escape closes, Tab stays inside the dialog
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const f = Array.from(panel.current.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href]')).filter((x) => !x.hasAttribute("disabled") && x.tabIndex !== -1);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("input[name=name]")?.focus(), 450);
    return () => { document.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, [mounted, close]);

  // route changed while open (e.g. browser back): close
  const lastPath = useRef(pathname);
  const isMounted = useRef(false);
  isMounted.current = mounted;
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (isMounted.current) close();
  }, [pathname, close]);

  if (!mounted) return null;
  return (
    <div className="fixed inset-0 z-[450] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <div
        onClick={close}
        className="absolute inset-0 bg-ink/70 transition-opacity duration-[380ms] ease-std"
        style={{ opacity: shown ? 1 : 0 }}
      />
      <div
        ref={panel}
        className="relative w-full sm:max-w-[640px] h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92vh] flex flex-col overflow-hidden bg-white text-ink transition-[opacity,transform] duration-[380ms] ease-std"
        style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(28px) scale(0.98)", borderTop: "3px solid #E27C22" }}
      >
        <div className="shrink-0 relative flex flex-col gap-1 sm:gap-2 px-5 sm:px-[clamp(28px,3.4vw,44px)] pt-5 sm:pt-9 pb-3 sm:pb-6 pr-16 border-b border-ink/10 sm:border-0">
          <button type="button" onClick={close} aria-label="Close" className="absolute right-3 top-3 sm:right-4 sm:top-4 w-10 h-10 flex items-center justify-center bg-transparent border border-ink/15 text-ink cursor-pointer transition-colors duration-300 hover:bg-ink hover:text-paper">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <span className="label opacity-60 text-[11px] sm:text-inherit">Contact us</span>
          <h2 id="contact-modal-title" className="m-0 font-display text-[22px] sm:text-[clamp(24px,2.6vw,32px)] leading-[1.15] tracking-[-0.02em]">Let&apos;s talk about your business</h2>
          <p className="hidden sm:block m-0 text-[15px] leading-[1.6] opacity-65">Tell us what you run and what you need. We&apos;ll get back to you.</p>
        </div>
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] px-5 sm:px-[clamp(28px,3.4vw,44px)] pt-4 sm:pt-0"
        >
          <ContactFields key={run} interest={interest} tone="light" />
        </div>
      </div>
    </div>
  );
}
