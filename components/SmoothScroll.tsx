"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useIsoLayoutEffect, MOTION_OK } from "@/lib/gsap";
import { getLenis, setLenis } from "@/lib/lenis";

const THEMES: Record<string, [string, string]> = {
  paper: ["#FAFCFF", "#041433"],
  ink: ["#041433", "#FAFCFF"],
};

/** Lenis smooth scroll (once), the section theme engine (re-scanned on every route), in-page hash scrolling. */
export default function SmoothScroll() {
  const pathname = usePathname();

  // Smooth scroll + hash links: mounted once for the whole site
  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        setLenis(null);
      };
    });

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a") as HTMLAnchorElement | null;
      if (!a || !a.hash) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      const target = url.hash === "#top" ? 0 : document.getElementById(url.hash.slice(1));
      if (target === null) return;
      e.preventDefault();
      const l = getLenis();
      if (l) l.scrollTo(target as number | HTMLElement, { duration: 1.6, offset: -72 });
      else window.scrollTo({ top: target === 0 ? 0 : (target as HTMLElement).getBoundingClientRect().top + scrollY - 72, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  // Theme engine: whichever [data-theme] section spans the viewport's vertical centre sets --bg / --fg.
  // Evaluated on every scroll update (not per-section toggles) so fast jumps can never leave a stale theme.
  useIsoLayoutEffect(() => {
    const rootStyle = document.documentElement.style;
    const sections = Array.from(document.body.querySelectorAll<HTMLElement>("[data-theme]"));
    let current = "";
    const applyTheme = () => {
      const mid = window.innerHeight * 0.5;
      let name = "paper";
      for (const sec of sections) {
        const r = sec.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) { name = sec.dataset.theme || "paper"; break; }
      }
      if (name === current) return;
      current = name;
      const t = THEMES[name];
      rootStyle.setProperty("--bg", t[0]);
      rootStyle.setProperty("--fg", t[1]);
      document.documentElement.dataset.theme = name;
      window.dispatchEvent(new CustomEvent("vc:theme", { detail: name }));
    };
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: applyTheme, onRefresh: applyTheme });
    window.addEventListener("scroll", applyTheme, { passive: true });
    applyTheme();
    const timers = [window.setTimeout(() => { ScrollTrigger.refresh(); applyTheme(); }, 150), window.setTimeout(() => ScrollTrigger.refresh(), 900)];
    return () => {
      st.kill();
      window.removeEventListener("scroll", applyTheme);
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
