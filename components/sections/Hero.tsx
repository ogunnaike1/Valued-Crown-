import Btn from "../Btn";
import Reveal from "../Reveal";
import SplitHeading from "../SplitHeading";
import Typewriter from "../Typewriter";
import Marquee from "../Marquee";
import { industries } from "@/data/industries";

const rowA = [...industries[0].types, ...industries[1].types];
const rowB = [...industries[2].types, ...industries[3].types];
// From the About Us content: "technology that makes your business smarter, faster, and more efficient"
const words = ["smarter.", "faster.", "more efficient.", "more profitable."];

export default function Hero() {
  return (
    <section data-theme="paper" className="relative px-page pt-[clamp(120px,13vw,170px)]">
      {/* drifting wave lines */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[min(100vh,900px)] overflow-hidden pointer-events-none opacity-[.09]">
        <svg className="vc-waves absolute top-0 left-0 h-full" style={{ width: "calc(100% + 400px)" }} preserveAspectRatio="none">
          <defs>
            <pattern id="vc-wave" width="400" height="44" patternUnits="userSpaceOnUse">
              <path d="M0 22 Q100 0 200 22 T400 22" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vc-wave)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <Reveal className="label inline-flex items-center gap-3 h-9 px-4 border border-[color-mix(in_srgb,currentColor_22%,transparent)]">
          Retail · Restaurant · Hospitality
        </Reveal>

        <SplitHeading
          as="h1"
          label="Technology that makes your business smarter, faster and more efficient"
          className="font-display font-medium text-[clamp(40px,6.4vw,92px)] leading-[1.05] tracking-[-0.03em] text-center w-full"
          style={{ marginTop: "clamp(24px,3vw,40px)" }}
          lines={[
            { text: "Technology that makes", pad: 0.12 },
            { text: "", pad: 0.14, node: <>your business <Typewriter words={words} className="text-[#E27C22]" /></> },
          ]}
        />

        <Reveal as="p" delay={200} className="mt-[clamp(24px,3vw,40px)] max-w-[580px] text-[clamp(17px,1.3vw,20px)] leading-[1.5] [text-wrap:balance]">
          <strong className="font-semibold">Valued Crown Technologies</strong> develops software that simplifies business operations, improves efficiency, and helps organizations make better decisions through technology.
        </Reveal>

        <Reveal delay={300} className="mt-8 flex flex-wrap justify-center gap-2">
          <Btn href="/products" label="Explore our products" arrow />
          <Btn href="/contact" label="Contact us" variant="outline" />
        </Reveal>
      </div>

      <Reveal delay={500} className="relative z-10 -mx-[var(--pad)] mt-[clamp(34px,4.2vw,62px)] mb-[clamp(39px,4.9vw,77px)] flex flex-col gap-3">
        <Marquee items={rowA} duration={70} />
        <Marquee items={rowB} reverse duration={65} />
      </Reveal>
    </section>
  );
}
