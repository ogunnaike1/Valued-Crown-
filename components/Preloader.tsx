"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import { markReady, resetReady } from "@/lib/ready";
import { getLenis } from "@/lib/lenis";
import LogoMark from "./LogoMark";

const RING_TEXT = "VALUED CROWN TECHNOLOGIES  ·  BUSINESS SOFTWARE  ·  BUILT IN-HOUSE  ·  ";
const R_PROGRESS = 118;
const CIRC = 2 * Math.PI * R_PROGRESS;

interface Ctl { start: (url: string) => void; complete: () => void; reduce: boolean; busy: boolean; navigating: boolean; startedAt: number }

/**
 * The one loader for the whole site: orbit rings around the crown mark, a progress arc, then a zoom-out and an upward wipe.
 * - On a full page load it plays while the page loads.
 * - On every in-site link click it plays again (wipes in from the bottom, route changes underneath, wipes out the top),
 *   so first load and page-to-page navigation look identical.
 * Skipped for reduced motion (navigation then just changes route). Hard fallbacks mean it can never hang.
 */
export default function Preloader() {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const textRing = useRef<SVGGElement>(null);
  const orbit = useRef<SVGGElement>(null);
  const arc = useRef<SVGCircleElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const ctl = useRef<Ctl>({ start: () => {}, complete: () => {}, reduce: false, busy: true, navigating: false, startedAt: 0 });
  const first = useRef(true);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const c = ctl.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      c.reduce = true;
      c.busy = false;
      c.start = (url) => router.push(url);
      el.style.display = "none";
      markReady();
      return;
    }

    const timers: number[] = [];
    const state = { p: 0 };
    let completing = false;
    let ticking = false;
    let breathe: gsap.core.Tween | null = null;
    const paint = () => { if (arc.current) arc.current.style.strokeDashoffset = String(CIRC * (1 - state.p / 100)); };

    const spinText = gsap.to(textRing.current, { rotation: 360, svgOrigin: "150 150", duration: 14, ease: "none", repeat: -1 });
    const spinOrbit = gsap.to(orbit.current, { rotation: -360, svgOrigin: "150 150", duration: 5.5, ease: "none", repeat: -1 });
    gsap.set(arc.current, { rotation: -90, svgOrigin: "150 150" });

    const run = () => {
      if (!ticking) { gsap.ticker.add(paint); ticking = true; }
      spinText.timeScale(1).play();
      spinOrbit.timeScale(1).play();
    };
    const idle = () => {
      if (ticking) { gsap.ticker.remove(paint); ticking = false; }
      spinText.pause();
      spinOrbit.pause();
    };
    const intro = () => {
      completing = false;
      state.p = 0;
      paint();
      gsap.killTweensOf([stage.current, mark.current, state]);
      gsap.set(stage.current, { scale: 0.9, opacity: 0 });
      gsap.set(mark.current, { scale: 0.7, opacity: 0 });
      gsap.to(stage.current, { scale: 1, opacity: 1, duration: 0.7, ease: "expo.out", delay: 0.05 });
      gsap.to(mark.current, { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.6)", delay: 0.2 });
      breathe?.kill();
      breathe = gsap.to(mark.current, { scale: 1.06, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.1 });
      gsap.to(state, { p: 82, duration: 1.7, ease: "power2.out", delay: 0.2 });
    };
    const finish = () => {
      el.style.display = "none";
      idle();
      markReady();
      c.busy = false;
      c.navigating = false;
    };
    const complete = () => {
      if (completing) return;
      completing = true;
      gsap.to(state, {
        p: 100, duration: 0.5, ease: "power2.inOut",
        onComplete: () => {
          breathe?.kill();
          spinText.timeScale(4);
          spinOrbit.timeScale(4);
          gsap.timeline()
            .to(mark.current, { scale: 1.25, duration: 0.3, ease: "power2.out" }, 0)
            .to(stage.current, { scale: 2.4, opacity: 0, duration: 0.8, ease: "power3.in" }, 0.25)
            .to(panel.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "power4.inOut" }, 0.55)
            .call(markReady, [], 1.1)
            .call(finish, [], 1.6);
        },
      });
    };
    c.complete = complete;

    // in-site navigation: wipe in from the bottom, change route while covered, then complete() once the new page is mounted
    c.start = (url: string) => {
      if (c.busy) return;
      c.busy = true;
      c.navigating = true;
      c.startedAt = performance.now();
      resetReady();
      el.style.display = "block";
      run();
      gsap.set(panel.current, { clipPath: "inset(100% 0 0 0)" });
      gsap.to(panel.current, { clipPath: "inset(0 0 0 0)", duration: 0.6, ease: "power4.inOut", onComplete: () => router.push(url) });
      intro();
      timers.push(window.setTimeout(() => { if (c.navigating) complete(); }, 6000)); // never stay stuck if the route never changes
    };

    // first load
    run();
    intro();
    if (document.readyState === "complete") timers.push(window.setTimeout(() => { c.navigating = false; complete(); }, 2000));
    else {
      window.addEventListener("load", () => timers.push(window.setTimeout(complete, 400)), { once: true });
      timers.push(window.setTimeout(complete, 3400));
    }
    timers.push(window.setTimeout(finish, 7000)); // hard fallback for the first load

    return () => {
      idle();
      spinText.kill(); spinOrbit.kill(); breathe?.kill();
      gsap.killTweensOf([state, stage.current, mark.current, panel.current]);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // intercept internal link clicks so every page change runs the same loader
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return; // same page: hash / native handling
      if (url.pathname === "/contact" && location.pathname !== "/contact") return; // contact links open the pop-up instead
      e.preventDefault();
      ctl.current.start(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // the new route is mounted: reset scroll (or jump to #section) while still covered, then finish the loader
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const c = ctl.current;
    if (!c.navigating) return;
    const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    ScrollTrigger.refresh();
    const y = target ? Math.max(0, target.getBoundingClientRect().top + window.scrollY - 72) : 0;
    window.scrollTo(0, y);
    getLenis()?.scrollTo(y, { immediate: true, force: true });
    const wait = Math.max(0, 1500 - (performance.now() - c.startedAt)); // let the arc fill a little before it clears
    const t = window.setTimeout(() => c.complete(), wait);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div ref={root} id="preloader" className="fixed inset-0 z-[400] pointer-events-none overflow-hidden">
      <div ref={panel} className="absolute inset-0 bg-ink text-paper flex items-center justify-center" style={{ clipPath: "inset(0 0 0 0)" }}>
        <div ref={stage} className="relative w-[min(78vw,400px)] aspect-square">
          <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full" aria-hidden="true">
            <defs>
              <path id="vc-ring-path" d="M150,150 m-134,0 a134,134 0 1,1 268,0 a134,134 0 1,1 -268,0" />
            </defs>
            <g ref={textRing}>
              <text fill="#FAFCFF" fillOpacity="0.55" fontSize="10.5" letterSpacing="3.4" fontFamily="var(--font-mono), monospace">
                <textPath href="#vc-ring-path" startOffset="0" textLength="830" lengthAdjust="spacing">{RING_TEXT}</textPath>
              </text>
            </g>
            <circle cx="150" cy="150" r={R_PROGRESS} fill="none" stroke="#FAFCFF" strokeOpacity="0.12" strokeWidth="2" />
            <circle ref={arc} cx="150" cy="150" r={R_PROGRESS} fill="none" stroke="#E27C22" strokeWidth="3" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC} />
            <g ref={orbit}>
              <circle cx="150" cy="150" r="92" fill="none" stroke="#FAFCFF" strokeOpacity="0.22" strokeWidth="1.2" strokeDasharray="2 7" strokeLinecap="round" />
              <circle cx="150" cy="58" r="5" fill="#E27C22" />
              <circle cx="150" cy="242" r="3" fill="#FAFCFF" fillOpacity="0.8" />
            </g>
          </svg>
          <div ref={mark} className="absolute inset-0 flex items-center justify-center">
            <LogoMark className="w-[34%] h-auto text-paper" title="Valued Crown Technologies" />
          </div>
        </div>
      </div>
    </div>
  );
}
