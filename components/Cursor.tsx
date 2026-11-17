"use client";

import { useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

type Mode = "default" | "link" | "label" | "input";

/**
 * Small, quiet pointer that sits with the fluid trail:
 * - a 8px dot that follows the pointer closely, coloured from the active section (navy on light, white on dark);
 * - over links and buttons it grows to a modest 38px ring with a faint fill, so the text underneath stays readable;
 * - over [data-cursor-label] areas (product cards) it becomes a 68px solid disc carrying the label;
 * - pressing shrinks it slightly. Fine pointers only.
 */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = root.current, d = dot.current, tx = text.current;
    if (!fine || !r || !d || !tx) return;

    document.documentElement.classList.add("vc-cursor");
    gsap.set(d, { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 2 });
    const dur = reduce ? 0.05 : 0.04; // near-instant: the native cursor is hidden, so any easing reads as lag
    const qx = gsap.quickTo(d, "x", { duration: dur, ease: "none" });
    const qy = gsap.quickTo(d, "y", { duration: dur, ease: "none" });

    let mode: Mode = "default";
    let down = false;

    const apply = () => {
      const o = { duration: 0.4, ease: "power3.out", overwrite: "auto" as const };
      const k = down ? 0.85 : 1;
      if (mode === "label") {
        gsap.to(d, { width: 68 * k, height: 68 * k, opacity: 1, backgroundColor: "var(--fg)", borderColor: "var(--fg)", ...o });
        gsap.to(tx, { opacity: 1, duration: 0.25, delay: 0.08 });
      } else if (mode === "link") {
        gsap.to(d, { width: 38 * k, height: 38 * k, opacity: 1, backgroundColor: "color-mix(in srgb, var(--fg) 10%, transparent)", borderColor: "var(--fg)", ...o });
        gsap.to(tx, { opacity: 0, duration: 0.15 });
      } else if (mode === "input") {
        gsap.to(d, { opacity: 0, ...o });
        gsap.to(tx, { opacity: 0, duration: 0.15 });
      } else {
        gsap.to(d, { width: 8 * k, height: 8 * k, opacity: 1, backgroundColor: "var(--fg)", borderColor: "var(--fg)", ...o });
        gsap.to(tx, { opacity: 0, duration: 0.15 });
      }
    };
    const setMode = (m: Mode, label?: string) => {
      if (label !== undefined) tx.textContent = label;
      if (m === mode) return;
      mode = m;
      apply();
    };

    // Position updates are immediate; the (more expensive) hit-test for links/labels runs at most once per frame.
    let shown = false, raf = 0, target: Element | null = null;
    const hit = () => {
      raf = 0;
      const t = target;
      const lt = t?.closest?.("[data-cursor-label]") as HTMLElement | null;
      const it = t?.closest?.("a,button,[role=button],[role=tab],summary,label");
      if (t?.closest?.("input,textarea,select")) setMode("input");
      else if (lt) setMode("label", lt.dataset.cursorLabel);
      else if (it) setMode("link");
      else setMode("default");
    };
    const move = (e: PointerEvent) => {
      qx(e.clientX); qy(e.clientY);
      if (!shown) { shown = true; gsap.to(r, { opacity: 1, duration: 0.25, overwrite: "auto" }); }
      target = e.target as Element | null;
      if (!raf) raf = requestAnimationFrame(hit);
    };
    const onDown = () => { down = true; apply(); };
    const onUp = () => { down = false; apply(); };
    const leave = () => { shown = false; gsap.to(r, { opacity: 0, duration: 0.25 }); };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("vc-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="fixed inset-0 z-[500] pointer-events-none opacity-0">
      <div
        ref={dot}
        className="absolute left-0 top-0 w-2 h-2 flex items-center justify-center overflow-hidden will-change-transform"
        style={{ borderRadius: "50%", background: "var(--fg)", border: "1px solid var(--fg)", boxSizing: "border-box" }}
      >
        <span ref={text} className="label whitespace-nowrap opacity-0 text-[10px]" style={{ color: "var(--bg)" }} />
      </div>
    </div>
  );
}
