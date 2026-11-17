"use client";

import { useState } from "react";
import type { Faq } from "@/data/faq";

/** Accessible accordion: one answer open at a time, smooth height change, plus FAQPage structured data for search engines. */
export default function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number>(0);
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <div className="flex flex-col gap-3">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className={`rounded-[22px] border bg-white transition-[border-color,box-shadow] duration-500 ease-std ${isOpen ? "border-[#E27C22]/60 shadow-[0_14px_34px_rgba(4,20,51,.08)]" : "border-line hover:border-ink/40"}`}>
            <h3 className="m-0">
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between gap-5 text-left px-6 py-5 bg-transparent text-ink cursor-pointer"
              >
                <span className="font-display text-[clamp(17px,1.5vw,20px)] leading-[1.3] tracking-[-0.01em]">{f.q}</span>
                <span className={`flex-none w-9 h-9 rounded-full flex items-center justify-center text-[20px] leading-none transition-[background-color,color,transform] duration-500 ease-std ${isOpen ? "bg-[#E27C22] text-white rotate-45" : "bg-[#EEF3FB] text-ink"}`} aria-hidden="true">+</span>
              </button>
            </h3>
            <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="grid transition-[grid-template-rows] duration-500 ease-std" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
              <div className="overflow-hidden">
                <p className="m-0 px-6 pb-6 pr-[72px] text-[15.5px] leading-[1.7] opacity-75">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
