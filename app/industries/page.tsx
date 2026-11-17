import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import IndustryList from "@/components/pages/IndustryList";
import PageHero from "@/components/PageHero";
import CTA from "@/components/sections/CTA";
import { industries } from "@/data/industries";
import { products, getProduct } from "@/data/products";

export const metadata: Metadata = {
  title: "Industries",
  description: "Software for retail and wholesale, restaurants and food service, hotels and hospitality, and laundry and garment care businesses.",
  alternates: { canonical: "/industries" },
};

const themes = [
  { theme: "paper", cls: "" },
  { theme: "ink", cls: "bg-ink text-paper" },
  { theme: "paper", cls: "" },
  { theme: "ink", cls: "bg-ink text-paper" },
] as const;

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        label="Industries we serve"
        title="Whatever you operate,"
        accent="we build for it."
        text="Whether you run a retail store, restaurant, hotel or a growing multi-location business, our goal is technology that makes your business smarter, faster and more efficient."
      >
        {industries.map((i) => <a key={i.id} href={`#${i.id}`} className="h-9 px-4 flex items-center border border-current text-[13px] font-medium transition-colors duration-300 hover:bg-ink hover:text-paper">{i.name}</a>)}
      </PageHero>

      {industries.map((ind, k) => {
        const p = getProduct(ind.product)!;
        const t = themes[k];
        const extra = (ind.alsoUses ?? []).map((s) => products.find((x) => x.slug === s)!);
        return (
          <section key={ind.id} id={ind.id} data-theme={t.theme} className={`scroll-mt-0 px-page py-[clamp(40px,5.0vw,80px)] ${t.cls}`}>
            <div className={`grid grid-cols-1 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.2fr)] gap-x-[clamp(32px,5vw,96px)] gap-y-12 ${k % 2 ? "lg:[direction:rtl] [&>*]:lg:[direction:ltr]" : ""}`}>
              <div className="flex flex-col gap-7 lg:sticky lg:top-28 self-start">
                <SplitHeading as="h2" className="font-display font-medium text-[clamp(30px,3.6vw,52px)] leading-[1.08] tracking-[-0.03em]" lines={[{ text: ind.name, pad: 0.08 }]} />
                <Reveal as="p" className="m-0 max-w-[480px] text-[clamp(18px,1.5vw,23px)] leading-[1.4] font-medium [text-wrap:pretty]">{ind.lead}</Reveal>
                <Reveal className="flex flex-col gap-3 pt-4 border-t border-current/30">
                  <span className="label opacity-70">Recommended software</span>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/products/${p.slug}`} className="h-12 px-5 flex items-center gap-3 font-medium text-[15px] bg-current/0 border border-current transition-colors duration-300 hover:bg-[var(--fg)] hover:text-[var(--bg)]">{p.name}<span>→</span></Link>
                    {extra.map((x) => <Link key={x.slug} href={`/products/${x.slug}`} className="h-12 px-5 flex items-center gap-3 text-[15px] border border-current/40 transition-colors duration-300 hover:border-current">{x.name}<span>→</span></Link>)}
                  </div>
                  <p className="m-0 text-[13px] opacity-70">{p.tagline}</p>
                </Reveal>
              </div>
              <div><IndustryList types={ind.types} /></div>
            </div>
          </section>
        );
      })}

      <CTA
        kicker="Your business"
        lines={[{ text: "Not listed?", pad: 0.1 }, { text: "Talk to us.", pad: 0.12 }]}
        text="Our solutions are designed to fit your specific operational requirements and business goals."
        theme="paper"
      />
    </>
  );
}
