"use client";

import { useEffect, useState } from "react";
import { onReady } from "@/lib/ready";

/** Types, holds, erases and cycles through words. Static first word under reduced motion. */
export default function Typewriter({ words, className }: { words: string[]; className?: string }) {
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0, cur = words[0], deleting = true, t: number;
    const step = () => {
      if (deleting) {
        cur = cur.slice(0, -1);
        setText(cur);
        if (!cur) { deleting = false; i = (i + 1) % words.length; t = window.setTimeout(step, 320); return; }
        t = window.setTimeout(step, 45);
      } else {
        const w = words[i];
        cur = w.slice(0, cur.length + 1);
        setText(cur);
        if (cur === w) { deleting = true; t = window.setTimeout(step, 1900); return; }
        t = window.setTimeout(step, 90);
      }
    };
    const off = onReady(() => { t = window.setTimeout(step, 1800); });
    return () => { off(); clearTimeout(t); };
  }, [words]);

  return (
    <span className={className}>
      {text}
      <span className="vc-caret" aria-hidden="true" />
    </span>
  );
}
