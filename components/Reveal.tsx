"use client";

import { createElement, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, MOTION_OK } from "@/lib/gsap";
import { onReady } from "@/lib/ready";

interface Props {
  as?: "div" | "span" | "p" | "figure";
  delay?: number; // ms
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function Reveal({ as = "div", delay = 0, className, style, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.set(el, { opacity: 0, y: 30 });
      let st: ScrollTrigger | undefined;
      const off = onReady(() => {
        st = ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.to(el, { opacity: 1, duration: 1.1, delay: delay / 1000, ease: "power2.out" });
            gsap.to(el, { y: 0, duration: 1.3, delay: delay / 1000, ease: "expo.out" });
          },
        });
      });
      return () => {
        off();
        st?.kill();
      };
    });
    return () => mm.revert();
  }, [delay]);

  return createElement(as, { ref, className, style }, children);
}
