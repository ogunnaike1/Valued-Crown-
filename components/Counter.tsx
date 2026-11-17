"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, MOTION_OK } from "@/lib/gsap";
import { onReady } from "@/lib/ready";

/** Counts up from 0 to `value` the first time it scrolls into view. Static under reduced motion. */
export default function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      el.textContent = "0" + suffix;
      const o = { v: 0 };
      let st: ScrollTrigger | undefined;
      const off = onReady(() => {
        st = ScrollTrigger.create({
          trigger: el, start: "top 92%", once: true,
          onEnter: () => gsap.to(o, { v: value, duration: 1.8, ease: "expo.out", onUpdate: () => { el.textContent = Math.round(o.v) + suffix; } }),
        });
      });
      return () => { off(); st?.kill(); el.textContent = value + suffix; };
    });
    return () => mm.revert();
  }, [value, suffix]);

  return <span ref={ref}>{value + suffix}</span>;
}
