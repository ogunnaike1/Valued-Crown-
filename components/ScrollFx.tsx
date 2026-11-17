"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useIsoLayoutEffect, MOTION_OK } from "@/lib/gsap";
import { onReady } from "@/lib/ready";

/**
 * Site-wide scroll effects, deliberately few and quiet:
 * 1. A thin orange reading-progress line along the very top that grows as you scroll the page.
 * 2. Photos (marked data-img-reveal) are uncovered with a soft upward wipe while the picture settles from a slight zoom.
 * 3. Hairline dividers (data-line) draw themselves across when they scroll into view.
 * Text reveals and counters live in their own components. Everything is skipped for reduced motion.
 */
export default function ScrollFx() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const triggers: ScrollTrigger[] = [];
      const tweens: gsap.core.Animation[] = [];

      // 1. progress line
      gsap.set(bar.current, { scaleX: 0 });
      triggers.push(ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }), onRefresh: (self) => gsap.set(bar.current, { scaleX: self.progress }) }));

      const off = onReady(() => {
        // 2. photo wipe + settle
        gsap.utils.toArray<HTMLElement>("[data-img-reveal]").forEach((box) => {
          const img = box.querySelector("img");
          gsap.set(box, { clipPath: "inset(0 0 100% 0)" });
          if (img) gsap.set(img, { scale: 1.2 });
          const t = ScrollTrigger.create({
            trigger: box, start: "top 90%", once: true,
            onEnter: () => {
              tweens.push(gsap.to(box, { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power3.inOut", clearProps: "clipPath" }));
              if (img) tweens.push(gsap.to(img, { scale: 1, duration: 1.6, ease: "power3.out", clearProps: "transform" })); // clear so CSS hover zoom keeps working
            },
          });
          triggers.push(t);
        });
        // 3. hairlines draw across
        gsap.utils.toArray<HTMLElement>("[data-line]").forEach((ln) => {
          gsap.set(ln, { scaleX: 0, transformOrigin: "left center" });
          triggers.push(ScrollTrigger.create({ trigger: ln, start: "top 94%", once: true, onEnter: () => tweens.push(gsap.to(ln, { scaleX: 1, duration: 1.1, ease: "power3.inOut" })) }));
        });
        ScrollTrigger.refresh();
      });

      return () => {
        off();
        triggers.forEach((t) => t.kill());
        tweens.forEach((t) => t.kill());
        gsap.set("[data-img-reveal], [data-img-reveal] img, [data-line]", { clearProps: "all" });
      };
    });
    return () => mm.revert();
  }, [pathname]);

  return <div ref={bar} aria-hidden="true" className="fixed left-0 top-0 right-0 h-[3px] z-[260] bg-[#E27C22] origin-left pointer-events-none" style={{ transform: "scaleX(0)" }} />;
}
