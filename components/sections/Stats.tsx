import Reveal from "../Reveal";
import Counter from "../Counter";
import { products } from "@/data/products";
import { capabilities } from "@/data/solutions";
import { industries } from "@/data/industries";

// Counts taken straight from the site's own content, so they always match what is listed on the pages.
const stats = [
  { value: products.length, label: "Products" },
  { value: capabilities.length, label: "Solution areas" },
  { value: industries.length, label: "Industries" },
  { value: industries.reduce((n, i) => n + i.types.length, 0), label: "Business types" },
];

/** Animated count cards: a line drops from a dot onto each card, then the number counts up. Sits just above the footer. */
export default function Stats() {
  return (
    <section data-theme="paper" className="relative overflow-hidden px-page py-[clamp(48px,6vw,90px)] bg-[#EEF3FB]">
      <svg aria-hidden="true" className="vc-waves absolute top-0 left-0 h-full opacity-[.07] pointer-events-none" style={{ width: "calc(100% + 400px)" }} preserveAspectRatio="none">
        <defs><pattern id="vc-wave-stats" width="400" height="44" patternUnits="userSpaceOnUse"><path d="M0 22 Q100 0 200 22 T400 22" fill="none" stroke="currentColor" strokeWidth="1.2" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#vc-wave-stats)" />
      </svg>
      <div className="wrap relative">
        <Reveal className="text-center mb-[clamp(36px,4vw,60px)]">
          <h2 className="m-0 font-display text-[clamp(26px,3vw,40px)] leading-[1.15] tracking-[-0.02em]">Everything your business needs,<br className="hidden sm:block" /> in one place</h2>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6 max-w-[960px] mx-auto">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="flex flex-col items-center">
              <span aria-hidden="true" className="block w-[9px] h-[9px] rounded-full bg-[#E27C22]" />
              <span aria-hidden="true" className="block w-px h-9 bg-[#E27C22]/60" />
              <span aria-hidden="true" className="block h-px w-[86%] bg-[#E27C22]/60" />
              <div className="w-full bg-white flex items-center justify-center h-[clamp(84px,9vw,118px)]">
                <span className="font-display text-[clamp(38px,4.4vw,60px)] leading-none tracking-[-0.02em] text-ink"><Counter value={s.value} /></span>
              </div>
              <span className="mt-4 text-[clamp(14px,1.2vw,17px)] font-semibold text-center">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
