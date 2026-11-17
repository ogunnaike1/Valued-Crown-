import Reveal from "../Reveal";
import SplitHeading from "../SplitHeading";
import FaqList from "../FaqList";
import { faqs } from "@/data/faq";

export default function Faq({ theme = "paper" }: { theme?: "paper" }) {
  return (
    <section data-theme={theme} className="px-page py-[clamp(40px,5vw,75px)]">
      <div className="wrap grid grid-cols-1 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.5fr)] gap-x-[clamp(32px,5vw,80px)] gap-y-8">
        <div className="flex flex-col gap-5 lg:sticky lg:top-28 self-start">
          <Reveal as="span" className="inline-flex self-start h-8 items-center px-4 rounded-full bg-[#E27C22]/15 text-[#9A500F] label">FAQ</Reveal>
          <SplitHeading
            className="font-display text-[clamp(30px,3.6vw,52px)] leading-[1.08] tracking-[-0.02em]"
            lines={[{ text: "Questions,", pad: 0.08 }, { text: "answered.", pad: 0.1, style: { color: "#E27C22" } }]}
          />
          <Reveal as="p" className="m-0 max-w-[340px] text-[16px] leading-[1.6] opacity-70">
            The things business owners ask us most. Can&apos;t find yours? Get in touch and we&apos;ll answer it.
          </Reveal>
        </div>
        <Reveal><FaqList items={faqs} /></Reveal>
      </div>
    </section>
  );
}
