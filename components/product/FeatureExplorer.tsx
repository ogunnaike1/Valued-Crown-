"use client";

import { useState } from "react";
import type { FeatureGroup } from "@/data/products";

/** Interactive feature list: sticky group index on the left, the selected group's detail on the right. */
export default function FeatureExplorer({ groups }: { groups: FeatureGroup[] }) {
  const [i, setI] = useState(0);
  const g = groups[i];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.3fr)] gap-[clamp(28px,5vw,80px)]">
      <div role="tablist" aria-label="Feature groups" className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 lg:gap-0 lg:sticky lg:top-28 self-start -mx-[var(--pad)] px-[var(--pad)] lg:mx-0 lg:px-0 pb-2 lg:pb-0">
        {groups.map((x, k) => (
          <button
            key={x.title}
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            onMouseEnter={() => matchMedia("(hover: hover)").matches && setI(k)}
            className="group flex-none lg:flex-auto text-left flex items-baseline gap-4 py-3 lg:py-[14px] px-4 lg:px-0 lg:hair-t border border-current/20 lg:border-0 bg-transparent text-inherit cursor-pointer transition-opacity duration-300"
            style={{ opacity: k === i ? 1 : 0.5 }}
          >
            <span className="font-display font-bold text-[clamp(18px,1.7vw,28px)] tracking-[-0.035em] leading-[1.05] whitespace-nowrap lg:whitespace-normal transition-transform duration-500 ease-std lg:group-hover:translate-x-1" style={{ transform: k === i ? "translateX(8px)" : undefined }}>
              {x.title}
            </span>
          </button>
        ))}
        <div className="hidden lg:block hair-t" />
      </div>

      <div key={g.title} role="tabpanel" className="flex flex-col gap-8 animate-[vc-fade_.7s_var(--e-std)]">
        <div className="flex flex-col gap-4">
          <h3 className="m-0 font-display font-medium text-[clamp(28px,2.2vw,27px)] leading-[1.08] tracking-[-0.03em]">{g.title}</h3>
          <p className="m-0 max-w-[560px] text-[clamp(17px,1.4vw,21px)] leading-[1.45] opacity-80">{g.blurb}</p>
        </div>
        <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 hair-t">
          {g.items.map((it) => (
            <li key={it} className="flex gap-3 py-[14px] pr-4 hair-b text-[15px] leading-[1.4]">
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
