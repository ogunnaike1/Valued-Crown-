import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import CTA from "@/components/sections/CTA";
import PageHero from "@/components/PageHero";
import ProductGrid from "@/components/sections/ProductGrid";
import { products } from "@/data/products";
import { capabilities } from "@/data/solutions";

export const metadata: Metadata = {
  title: "Products",
  description: "Hotel Manager, Restaurant Manager, Retail Manager and Laundry Manager — management software for hospitality, food service, retail and laundry businesses.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        label="Our products"
        title="Four products."
        accent="One standard."
        text="Management software for the way hotels, restaurants, retail stores and laundries actually work — easy to use, scalable, secure and supported."
      />

      <ProductGrid detailed withHeading={false} />

      {/* coverage matrix */}
      <section data-theme="paper" className="px-page py-[clamp(45px,5.5vw,85px)]">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-[clamp(24px,2.8vw,40px)]">
          <SplitHeading className="font-display font-medium text-[clamp(30px,3.6vw,52px)] leading-[1.08] tracking-[-0.03em]" lines={[{ text: "What each", pad: 0.08 }, { text: "product covers.", pad: 0.08 }]} />
          <Reveal as="p" className="m-0 max-w-[340px] text-[15px] leading-[1.55] opacity-70">Based on each product&apos;s feature list. Open a product for the full detail.</Reveal>
        </div>
        <Reveal className="overflow-x-auto -mx-[var(--pad)] px-[var(--pad)]">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="hair-b">
                <th className="py-4 pr-4 font-mono text-[11px] font-normal uppercase tracking-[.05em] opacity-60">Capability</th>
                {products.map((p) => (
                  <th key={p.slug} className="py-4 px-3 font-display font-bold text-[18px] tracking-[-0.03em]"><Link href={`/products/${p.slug}`} className="hover:opacity-60 transition-opacity">{p.name}</Link></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {capabilities.map((c) => (
                <tr key={c.id} className="hair-b">
                  <td className="py-[14px] pr-4 text-[15px] font-medium"><Link href={`/solutions#${c.id}`} className="hover:opacity-60 transition-opacity">{c.title}</Link></td>
                  {products.map((p) => {
                    const has = c.products.includes(p.slug);
                    return (
                      <td key={p.slug} className="py-[14px] px-3" aria-label={has ? "Included" : "Not listed"}>
                        {has ? <span className="inline-block w-[10px] h-[10px] bg-ink" /> : <span className="inline-block w-[10px] h-px bg-current opacity-30 align-middle" />}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      <CTA
        kicker="Not sure which fits?"
        lines={[{ text: "Tell us how", pad: 0.1 }, { text: "you operate.", pad: 0.12 }]}
        text="Describe your business and we'll point you to the right product and show it working."
      />
    </>
  );
}
