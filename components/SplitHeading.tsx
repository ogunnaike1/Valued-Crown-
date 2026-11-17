"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, MOTION_OK } from "@/lib/gsap";
import { onReady } from "@/lib/ready";

export interface SplitLine {
  text: string;
  /** Rendered as one animated block instead of per-character text. */
  node?: ReactNode;
  style?: CSSProperties;
  /** Rendered after the text and animated as one character (e.g. the orange full stop). */
  suffix?: ReactNode;
  /** Descender protection override, in em. */
  pad?: number;
}

interface Props {
  as?: "h1" | "h2";
  lines: SplitLine[];
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export default function SplitHeading({ as: Tag = "h2", lines, label, className, style }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const chars = el.querySelectorAll("[data-ch]");
      gsap.set(chars, { yPercent: 108, rotation: 4 });
      let st: ScrollTrigger | undefined;
      const off = onReady(() => {
        st = ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () =>
            gsap.to(chars, { yPercent: 0, rotation: 0, duration: 1.25, ease: "expo.out", stagger: 0.016 }),
        });
      });
      return () => {
        off();
        st?.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <Tag
      ref={ref}
      aria-label={label ?? lines.map((l) => l.text).join(" ")}
      className={className}
      style={{ margin: 0, ...style }}
    >
      {lines.map((l, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="split-line"
          style={l.pad ? { paddingBottom: `${l.pad}em`, marginBottom: `-${l.pad}em` } : undefined}
        >
          <span style={{ display: "block", ...l.style }}>
            {l.node ? (
              <span data-ch style={{ display: "inline-block" }}>{l.node}</span>
            ) : null}
            {(l.node ? [] : l.text.split(" ")).map((word, w, arr) => (
              <span key={w}>
                <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                  {[...word].map((ch, c) => (
                    <span key={c} data-ch style={{ display: "inline-block", willChange: "transform" }}>
                      {ch}
                    </span>
                  ))}
                </span>
                {w < arr.length - 1 ? " " : null}
              </span>
            ))}
            {l.suffix ? (
              <span data-ch style={{ display: "inline-block" }}>
                {l.suffix}
              </span>
            ) : null}
          </span>
        </span>
      ))}
    </Tag>
  );
}
