import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CTA from "@/components/sections/CTA";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "About us",
  description: "Valued Crown Technologies is a technology-driven software company building retail, restaurant and hospitality management solutions.",
  alternates: { canonical: "/about" },
};

const eyebrow = "label opacity-60";
const h2 = "m-0 font-display font-medium text-[clamp(30px,3.4vw,46px)] leading-[1.15] tracking-[-0.02em]";

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About us"
        title="Transforming businesses"
        accent="through innovative software."
        text={company.intro[0]}
      />

      {/* who we are */}
      <section data-theme="paper" className="px-page py-[clamp(28px,3.5vw,50px)]">
        <div className="wrap max-w-[820px]">
          <p className="m-0 text-[17px] leading-[1.75] opacity-80">{company.intro[1]}</p>
        </div>
      </section>

      {/* mission + vision */}
      <section data-theme="paper" className="px-page pb-[clamp(28px,3.5vw,50px)]">
        <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-ink text-paper p-[clamp(24px,3vw,40px)] flex flex-col gap-4">
            <span className="label opacity-60">Our mission</span>
            <p className="m-0 text-[clamp(18px,1.7vw,22px)] leading-[1.5]">{company.mission}</p>
          </div>
          <div className="bg-white border border-line p-[clamp(24px,3vw,40px)] flex flex-col gap-4">
            <span className={eyebrow}>Our vision</span>
            <p className="m-0 text-[clamp(18px,1.7vw,22px)] leading-[1.5]">{company.vision}</p>
          </div>
        </div>
      </section>

      {/* what we do */}
      <section data-theme="paper" className="px-page py-[clamp(28px,3.5vw,50px)] hair-t">
        <div className="wrap flex flex-col gap-10">
          <div className="flex flex-col gap-3 max-w-[620px]">
            <span className={eyebrow}>What we do</span>
            <h2 className={h2}>Software for three kinds of business</h2>
            <p className="m-0 text-[16px] leading-[1.6] opacity-70">We design, develop, implement and support business management solutions tailored to each client.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {company.areas.map((a) => (
              <div key={a.title} className="bg-white border border-line p-6 flex flex-col gap-3">
                <h3 className="m-0 font-display font-medium text-[22px] tracking-[-0.02em]">{a.title}</h3>
                <p className="m-0 text-[15px] leading-[1.65] opacity-75">{a.items.slice(0, 4).join(", ")} and more.</p>
              </div>
            ))}
          </div>
          <Link href="/products" className="self-start text-[15px] font-medium border-b border-ink pb-[2px]">See our products →</Link>
        </div>
      </section>

      {/* why choose us */}
      <section data-theme="paper" className="px-page py-[clamp(28px,3.5vw,50px)] hair-t">
        <div className="wrap flex flex-col gap-10">
          <div className="flex flex-col gap-3 max-w-[620px]">
            <span className={eyebrow}>Why choose us</span>
            <h2 className={h2}>What you can expect from us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {company.why.map((w) => (
              <div key={w.title} className="bg-white border border-line p-6 flex flex-col gap-2">
                <h3 className="m-0 font-display font-medium text-[20px] tracking-[-0.02em]">{w.title}</h3>
                <p className="m-0 text-[15px] leading-[1.65] opacity-75">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* values */}
      <section data-theme="paper" className="px-page py-[clamp(28px,3.5vw,50px)] hair-t">
        <div className="wrap flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className={eyebrow}>Our core values</span>
            <h2 className={h2}>What we stand for</h2>
          </div>
          <ul className="m-0 p-0 list-none flex flex-wrap gap-3">
            {company.values.map((v) => <li key={v} className="h-11 px-5 flex items-center bg-white border border-line text-[15px] font-medium">{v}</li>)}
          </ul>
        </div>
      </section>

      <CTA
        kicker="Partner with us"
        lines={[{ text: "Let's transform your", pad: 0.1 }, { text: "business together.", pad: 0.12, style: { opacity: 0.5 } }]}
        text={company.closing}
        primary={{ label: "Get in touch", href: "/contact" }}
      />
    </>
  );
}
