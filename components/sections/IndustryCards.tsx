import Image from "next/image";
import Link from "next/link";
import Reveal from "../Reveal";
import SplitHeading from "../SplitHeading";
import { industries } from "@/data/industries";
import { getProduct } from "@/data/products";

/** Photo cards: big rounded image that zooms on hover, a floating product tag, and a pill button that turns orange. */
export default function IndustryCards() {
  return (
    <section data-theme="paper" className="px-page py-[clamp(40px,5.0vw,75px)]">
      <div className="wrap">
        <div className="flex flex-col items-center text-center gap-5 mb-[clamp(28px,3.5vw,50px)]">
          <Reveal as="span" className="inline-flex h-8 items-center px-4 rounded-full bg-[#E27C22]/15 text-[#9A500F] label">Industries we serve</Reveal>
          <SplitHeading
            className="font-display font-medium text-[clamp(32px,4.4vw,64px)] leading-[1.05] tracking-[-0.03em] text-center"
            lines={[{ text: "Made for the way", pad: 0.08 }, { text: "you operate.", pad: 0.1, style: { color: "#E27C22" } }]}
          />
          <Reveal as="p" className="m-0 max-w-[520px] text-[16px] leading-[1.6] opacity-70">
            Whether you run a retail store, restaurant, hotel or laundry, there is software built for how your business works.
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((ind, i) => (
            <Reveal key={ind.id} delay={(i % 4) * 90} className="h-full">
              <div className="group flex flex-col h-full bg-white rounded-[28px] p-3 border border-line shadow-[0_10px_30px_rgba(4,20,51,.05)] transition-[transform,box-shadow,border-color] duration-500 ease-std hover:-translate-y-2 hover:border-[#E27C22]/60 hover:shadow-[0_26px_50px_rgba(4,20,51,.12)]">
                <div data-img-reveal className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-ink">
                  <Image src={ind.image.src} alt={ind.image.alt} fill unoptimized sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-[900ms] ease-std group-hover:scale-110" style={{ objectPosition: ind.image.position }} />
                  <span className="absolute left-3 bottom-3 h-8 px-3 rounded-full bg-white/95 text-ink text-[12px] font-medium flex items-center gap-2 transition-transform duration-500 ease-std group-hover:-translate-y-1">
                    <span className="w-2 h-2 rounded-full bg-[#E27C22]" />{getProduct(ind.product)?.name}
                  </span>
                </div>
                <div className="flex flex-col gap-3 flex-1 px-3 pt-5 pb-3">
                  <h3 className="m-0 font-display font-medium text-[clamp(21px,1.8vw,26px)] leading-[1.1] tracking-[-0.025em]">{ind.name}</h3>
                  <p className="m-0 text-[14.5px] leading-[1.6] opacity-70 line-clamp-4">{ind.lead}</p>
                  <Link href={`/industries#${ind.id}`} className="mt-auto h-12 rounded-full flex items-center justify-center gap-2 bg-ink text-paper text-[15px] font-medium transition-colors duration-300 group-hover:bg-[#E27C22]">
                    Explore <span className="transition-transform duration-500 ease-std group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
