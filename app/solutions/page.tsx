import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import SolutionsIndex from "@/components/pages/SolutionsIndex";
import PageHero from "@/components/PageHero";
import CTA from "@/components/sections/CTA";
import { capabilities } from "@/data/solutions";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Point of sale, inventory, billing, reservations, customer management, multi-branch control, reporting and security — the capabilities behind every Valued Crown product.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        theme="ink"
        label="Solutions"
        title="Practical tools"
        accent="for every operation."
        text="Built around the real-world needs of businesses: sales and inventory, point of sale, restaurant operations, hotel management, reservations, reporting and analytics."
      >
        {capabilities.map((c) => <a key={c.id} href={`#${c.id}`} className="h-9 px-4 flex items-center border border-paper/30 text-[13px] font-medium transition-colors duration-300 hover:bg-paper hover:text-ink">{c.title}</a>)}
      </PageHero>

      <section data-theme="paper" className="px-page py-[clamp(40px,5.0vw,80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-x-[clamp(32px,5vw,96px)]">
          <SolutionsIndex />
          <div className="flex flex-col">
            {capabilities.map((c) => (
              <article key={c.id} id={c.id} className="scroll-mt-24 py-[clamp(24px,2.5vw,40px)] hair-t first:border-t-0 first:pt-0">
                <Reveal className="flex flex-col gap-6">
                  <h2 className="m-0 font-display font-medium text-[clamp(30px,3.6vw,52px)] leading-[1.08] tracking-[-0.03em]">{c.title}</h2>
                  <p className="m-0 max-w-[620px] text-[clamp(18px,1.5vw,23px)] leading-[1.4] font-medium tracking-[-0.01em] [text-wrap:pretty]">{c.summary}</p>
                </Reveal>
                <ul className="m-0 mt-8 p-0 list-none hair-t">
                  {c.points.map((pt) => (
                    <li key={pt} className="flex gap-3 py-[14px] hair-b text-[15px] leading-[1.45]">{pt}</li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="label opacity-60 mr-2">Available in</span>
                  {c.products.map((s) => {
                    const p = products.find((x) => x.slug === s)!;
                    return <Link key={s} href={`/products/${s}`} className="h-9 px-4 flex items-center text-[13px] font-medium bg-ink text-paper transition-colors duration-300 hover:bg-slate">{p.name}</Link>;
                  })}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTA
        kicker="See it working"
        lines={[{ text: "Find the right", pad: 0.1 }, { text: "fit for", pad: 0.1 }, { text: "your business.", pad: 0.12 }]}
        text="Tell us how your business runs and we'll show you the products and capabilities that match."
      />
    </>
  );
}
