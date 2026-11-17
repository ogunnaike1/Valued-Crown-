import Reveal from "../Reveal";
import SplitHeading from "../SplitHeading";
import { company } from "@/data/company";

/**
 * Quiet editorial process list: no cards, icons or tints. A short intro on the left, then five hairline-divided rows
 * where the type does the work. Hovering a row draws a thin orange rule across its top edge.
 */
export default function HowWeWork() {
  return (
    <section data-theme="paper" className="px-page py-[clamp(56px,7vw,110px)]">
      <div className="wrap grid grid-cols-1 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] gap-x-[clamp(40px,7vw,120px)] gap-y-10">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 self-start">
          <Reveal as="span" className="label opacity-60">How we work</Reveal>
          <SplitHeading
            className="font-display text-[clamp(28px,3.2vw,44px)] leading-[1.12] tracking-[-0.02em]"
            lines={[{ text: "From consultation", pad: 0.08 }, { text: "to ongoing support.", pad: 0.1, style: { opacity: 0.4 } }]}
          />
          <Reveal as="p" className="m-0 max-w-[340px] text-[15.5px] leading-[1.7] opacity-65">
            We partner closely with clients to understand their goals, then build, deliver and support software that fits how the business actually runs.
          </Reveal>
        </div>

        <div role="list">
          {company.journey.map((s, i) => (
            <Reveal key={s.title} as="div" delay={i * 70}>
              <div role="listitem" className="group relative grid grid-cols-1 md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] gap-x-10 gap-y-2 items-baseline py-[clamp(22px,2.6vw,36px)] last:border-b border-ink/15">
                <span aria-hidden="true" data-line className="absolute left-0 right-0 -top-px h-px bg-ink/15" />
                <span aria-hidden="true" className="absolute left-0 right-0 -top-px h-px bg-[#E27C22] origin-left scale-x-0 transition-transform duration-700 ease-std group-hover:scale-x-100" />
                <h3 className="m-0 font-display text-[clamp(22px,2.2vw,30px)] leading-[1.15] tracking-[-0.015em] flex items-center gap-3 transition-transform duration-500 ease-std group-hover:translate-x-2">
                  {s.title}
                </h3>
                <p className="m-0 text-[15.5px] leading-[1.7] opacity-65 max-w-[440px]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
