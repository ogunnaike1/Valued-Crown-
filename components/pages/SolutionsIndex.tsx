"use client";

import { useEffect, useState } from "react";
import { capabilities } from "@/data/solutions";

/** Sticky capability index that follows the section in view. */
export default function SolutionsIndex() {
  const [active, setActive] = useState(capabilities[0].id);

  useEffect(() => {
    const els = capabilities.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="Solutions" className="hidden lg:flex flex-col sticky top-28 self-start">
      {capabilities.map((c) => (
        <a key={c.id} href={`#${c.id}`} className="flex items-baseline gap-4 py-[10px] hair-t transition-opacity duration-300" style={{ opacity: active === c.id ? 1 : 0.45 }}>
          <span className="text-[15px] font-medium transition-transform duration-500 ease-std" style={{ transform: active === c.id ? "translateX(8px)" : "none" }}>{c.title}</span>
          
        </a>
      ))}
      <div className="hair-t" />
    </nav>
  );
}
