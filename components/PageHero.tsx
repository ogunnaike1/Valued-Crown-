import type { ReactNode } from "react";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

interface Props {
  label: string;
  title: string;
  /** Muted second half of the heading. */
  accent?: string;
  text?: string;
  theme?: "paper" | "ink";
  children?: ReactNode;
}

/** Compact, centred page hero: small label, a calm two-line heading, one short paragraph, optional links. */
export default function PageHero({ label, title, accent, text, theme = "paper", children }: Props) {
  const ink = theme === "ink";
  return (
    <section data-theme={theme} className={`px-page pt-[clamp(120px,12vw,168px)] pb-[clamp(24px,3.0vw,42px)] ${ink ? "bg-ink text-paper" : "hair-b"}`}>
      <div className="wrap flex flex-col items-center text-center gap-5">
        <Reveal as="span" className="label inline-flex h-8 items-center px-3 border border-[color-mix(in_srgb,currentColor_22%,transparent)]">{label}</Reveal>
        <SplitHeading
          as="h1"
          label={accent ? `${title} ${accent}` : title}
          className="font-display font-medium text-[clamp(36px,5.2vw,72px)] leading-[1.06] tracking-[-0.03em] text-center max-w-[1000px]"
          lines={[{ text: title, pad: 0.1 }, ...(accent ? [{ text: accent, pad: 0.12, style: { color: "#E27C22" } }] : [])]}
        />
        {text ? <Reveal as="p" delay={150} className="m-0 max-w-[620px] text-[clamp(16px,1.2vw,18px)] leading-[1.6] opacity-75 [text-wrap:balance]">{text}</Reveal> : null}
        {children ? <Reveal delay={250} className="mt-2 flex flex-wrap justify-center gap-2">{children}</Reveal> : null}
      </div>
    </section>
  );
}
