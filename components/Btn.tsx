"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";

interface Props {
  href: string;
  label: string;
  variant?: "solid" | "outline";
  arrow?: boolean;
  height?: number;
  padX?: number;
  borderColor?: string;
  bg?: string;
  fg?: string;
  magnetic?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Link-button with roll-text hover and optional magnetic pull. Internal hrefs use next/link. */
export default function Btn({
  href, label, variant = "solid", arrow, height = 56, padX = 24,
  borderColor = "currentColor", bg, fg, magnetic = true, className = "", style,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !magnetic || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };

  const solid = variant === "solid";
  const cls = `roll flex items-center text-[15px] font-semibold box-border transition-[transform,background-color,color] duration-500 ease-std ${solid ? "bg-ink text-paper gap-[14px]" : ""} ${className}`;
  const st: CSSProperties = {
    height, padding: `0 ${padX}px`,
    ...(solid ? { boxShadow: "0 0 0 1px color-mix(in srgb, currentColor 14%, transparent)" } : { border: `1px solid ${borderColor}` }),
    ...(bg ? { background: bg } : {}),
    ...(fg ? { color: fg } : {}),
    ...style,
  };
  const inner = (
    <>
      <span className="roll-box">
        <span className="roll-inner"><span>{label}</span><span>{label}</span></span>
      </span>
      {arrow ? <span className="text-[#E27C22]">→</span> : null}
    </>
  );
  const common = { ref, onPointerMove: move, onPointerLeave: leave, className: cls, style: st };
  return href.startsWith("/") ? <Link href={href} {...common}>{inner}</Link> : <a href={href} {...common}>{inner}</a>;
}
