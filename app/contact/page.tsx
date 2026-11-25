import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import Faq from "@/components/sections/Faq";
import ContactForm from "@/components/pages/ContactForm";
import { products } from "@/data/products";
import { contactInfo } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Valued Crown Technologies about Hotel Manager, Restaurant Manager, Shop Manager or Laundry Manager.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        theme="ink"
        label="Contact"
        title="Let's talk"
        accent="about your business."
        text="Walk through any product, or tell us how your business runs and we'll show you what fits. We partner with clients every step of the way, from consultation to ongoing technical support."
      />
      <section data-theme="ink" className="bg-ink text-paper px-page pb-[clamp(40px,5.0vw,75px)]">
        <div className="wrap grid grid-cols-1 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] gap-x-[clamp(40px,6vw,110px)] gap-y-12 border-t border-paper/15 pt-[clamp(24px,2.5vw,40px)]">
          <Reveal className="flex flex-col hair-t self-start">
            <span className="label opacity-60 py-3">Our products</span>
            {products.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group flex justify-between items-baseline py-3 hair-t text-[15px] transition-[padding] duration-500 ease-std hover:pl-3">
                <span className="font-display font-medium text-[20px] tracking-[-0.02em]">{p.name}</span><span className="opacity-60">{p.industry} →</span>
              </Link>
            ))}
            <span className="label opacity-60 py-3 mt-8 hair-t">Reach us directly</span>
            <a href={`mailto:${contactInfo.email}`} className="py-3 hair-t text-[17px] hover:text-crown">{contactInfo.email}</a>
            <a href={`tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`} className="py-3 hair-t text-[17px] hover:text-crown">Call or WhatsApp · {contactInfo.phone}</a>
            <span className="py-3 hair-t text-[17px] opacity-80">{contactInfo.address}</span>
          </Reveal>
        <Reveal delay={150}>
          <Suspense fallback={<div className="h-[480px]" />}>
            <ContactForm />
          </Suspense>
        </Reveal>
        </div>
      </section>
      <Faq />
    </>
  );
}
