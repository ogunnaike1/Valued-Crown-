"use client";

import { useState } from "react";

/** Large typographic list: hovering one business type dims the rest. */
export default function IndustryList({ types }: { types: string[] }) {
  const [hover, setHover] = useState(-1);
  return (
    <ul className="m-0 p-0 list-none flex flex-col" onMouseLeave={() => setHover(-1)}>
      {types.map((t, i) => (
        <li
          key={t}
          onMouseEnter={() => setHover(i)}
          className="flex items-baseline gap-5 py-[clamp(8px,1vw,14px)] border-b border-current/25 transition-[opacity,padding] duration-500 ease-std"
          style={{ opacity: hover === -1 || hover === i ? 1 : 0.3, paddingLeft: hover === i ? 14 : 0 }}
        >
          <span className="font-display font-medium text-[clamp(26px,3.4vw,58px)] tracking-[-0.04em] leading-[.98]">{t}</span>
        </li>
      ))}
    </ul>
  );
}
