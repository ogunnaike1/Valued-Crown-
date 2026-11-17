import Btn from "../Btn";
import Reveal from "../Reveal";
import SplitHeading from "../SplitHeading";
import Image from "next/image";
import type { Product } from "@/data/products";

export const heroTheme = { "hotel-manager": "ink", "restaurant-manager": "paper", "retail-manager": "ink", "laundry-manager": "paper" } as const;
const bgClass = { ink: "bg-ink text-paper", paper: "" } as const;

/** Product hero. Hotel & Laundry use a centred layout with the preview below; Restaurant & Retail split it. */
export default function ProductHero({ product: p }: { product: Product }) {
  const theme = heroTheme[p.slug];
  const split = p.slug === "restaurant-manager" || p.slug === "retail-manager";
  const reversed = p.slug === "retail-manager";
  const btnSolid = theme === "ink" ? { bg: "#FAFCFF", fg: "#041433" } : {};
  const outline = theme === "ink" ? "#FAFCFF" : "#041433";

  const copy = (
    <div className={`flex flex-col ${split ? "items-start text-left" : "items-center text-center"}`}>
      <Reveal className="label flex items-center gap-3">
        {p.industry}
      </Reveal>
      <SplitHeading
        as="h1"
        label={p.name}
        className={`font-display font-medium leading-[1.08] tracking-[-0.03em] text-[clamp(36px,5.2vw,72px)]`}
        style={{ marginTop: "clamp(20px,2.4vw,32px)" }}
        lines={[{ text: p.name, pad: 0.12 }]}
      />
      <Reveal as="p" delay={150} className={`mt-[clamp(20px,2.4vw,32px)] text-[clamp(18px,1.5vw,24px)] leading-[1.3] tracking-[-0.01em] font-medium [text-wrap:balance] ${split ? "max-w-[520px]" : "max-w-[760px]"}`}>
        {p.headline}
      </Reveal>
      <Reveal as="p" delay={250} className={`mt-4 text-[16px] leading-[1.55] opacity-75 ${split ? "max-w-[480px]" : "max-w-[620px]"}`}>{p.subtitle}</Reveal>
      <Reveal delay={350} className={`mt-8 flex flex-wrap gap-2 ${split ? "" : "justify-center"}`}>
        <Btn href={`/contact?interest=${p.slug}`} label="Enquire now" arrow {...btnSolid} />
        <Btn href="#features" label="See the features" variant="outline" borderColor={outline} />
      </Reveal>
    </div>
  );

  return (
    <section data-theme={theme} className={`relative px-page pt-[clamp(120px,12vw,160px)] pb-[clamp(24px,3.0vw,44px)] overflow-hidden ${bgClass[theme]}`}>
      {split ? (
        <div className={`grid grid-cols-1 lg:grid-cols-2 items-center gap-[clamp(40px,6vw,96px)] `}>
          <div className={reversed ? "lg:order-2" : ""}>{copy}</div>
          <Reveal delay={200} className={reversed ? "lg:order-1" : ""}>
            <div data-img-reveal className="relative w-full aspect-[4/3] overflow-hidden bg-ink">
              <Image src={p.image.src} alt={p.image.alt} fill priority unoptimized sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: p.image.position }} />
            </div>
          </Reveal>
        </div>
      ) : (
        <>
          {copy}
          <Reveal delay={300} className="mt-[clamp(34px,4.2vw,67px)]">
            <div data-img-reveal className="relative w-full aspect-[16/9] max-h-[640px] overflow-hidden bg-ink">
              <Image src={p.image.src} alt={p.image.alt} fill priority unoptimized sizes="100vw" className="object-cover" style={{ objectPosition: p.image.position }} />
            </div>
          </Reveal>
        </>
      )}
      <Reveal className="label mt-10 opacity-60 text-center lg:text-left">{p.tagline}</Reveal>
    </section>
  );
}
