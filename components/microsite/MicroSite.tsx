import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "../Logo";
import LogoMark from "../LogoMark";
import Reveal from "../Reveal";
import { siteDomains, type Product } from "@/data/products";

const wrap = "mx-auto w-full max-w-[1240px] px-[clamp(20px,4vw,48px)]";
const eyebrow = "font-mono text-[11px] tracking-[.22em] uppercase text-[#E27C22]";
const h2 = "m-0 font-display font-bold text-[clamp(28px,3.6vw,48px)] leading-[1.08] tracking-[-0.035em]";
const orange = "#E27C22";
const drop = "invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 absolute left-0 top-full pt-3";

const ic = (d: ReactNode) => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
const icons = [
  ic(<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>),
  ic(<><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 12l9 4 9-4M3 17l9 4 9-4" /></>),
  ic(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5" /><path d="M16 5.5a3.5 3.5 0 0 1 0 6.5M18 14.8c1.8.7 3.1 2.4 3.5 5.2" /></>),
  ic(<><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></>),
  ic(<><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h4" /></>),
  ic(<><path d="M12 3l8 3v6c0 4.5-3.3 8-8 9-4.7-1-8-4.5-8-9V6l8-3z" /><path d="m9 12 2 2 4-4" /></>),
];

/** Abstract product dashboard drawn in CSS, labelled with the product's own modules (no invented figures). */
function DashboardMock({ p, tall = false }: { p: Product; tall?: boolean }) {
  if (p.screenshot) {
    return (
      <div className="rounded-2xl border border-line bg-white shadow-[0_40px_80px_-20px_rgba(4,20,51,.35)] overflow-hidden">
        <Image src={p.screenshot.src} alt={p.screenshot.alt} width={p.screenshot.width} height={p.screenshot.height} unoptimized priority={tall} sizes="(min-width:1024px) 980px, 100vw" className="block w-full h-auto" />
      </div>
    );
  }
  const bars = [38, 62, 48, 80, 56, 90, 70];
  return (
    <div className="rounded-2xl border border-line bg-white shadow-[0_40px_80px_-20px_rgba(4,20,51,.35)] overflow-hidden text-ink">
      <div className="h-9 px-4 flex items-center gap-2 bg-[#F1F4F9] border-b border-line">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 h-5 flex-1 max-w-[280px] rounded-md bg-white border border-line px-3 flex items-center font-mono text-[10px] opacity-60">{siteDomains[p.slug]}</span>
      </div>
      <div className={`grid grid-cols-[150px_1fr] ${tall ? "min-h-[360px]" : "min-h-[300px]"}`}>
        <div className="bg-ink text-paper p-4 flex flex-col gap-1.5">
          <span className="font-display font-bold text-[13px] mb-2 truncate">{p.name}</span>
          {p.groups.slice(0, 6).map((g, i) => (
            <span key={g.title} className={`text-[10.5px] leading-tight px-2 py-1.5 rounded-md truncate ${i === 0 ? "bg-paper/15" : "opacity-60"}`}>{g.title}</span>
          ))}
        </div>
        <div className="p-5 flex flex-col gap-4 bg-[#FAFBFD]">
          <div className="grid grid-cols-3 gap-3">
            {p.groups.slice(0, 3).map((g, i) => (
              <div key={g.title} className="rounded-lg border border-line bg-white p-3 flex flex-col gap-2">
                <span className="text-[10px] opacity-60 truncate">{g.title}</span>
                <span className="h-2 rounded-full bg-[#E4E9F2]"><span className="block h-full rounded-full" style={{ width: `${[72, 54, 86][i]}%`, background: i === 0 ? orange : "#041433" }} /></span>
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-lg border border-line bg-white p-4 flex items-end gap-2.5 min-h-[120px]">
            {bars.map((h, i) => <span key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: i === 5 ? orange : "#0A1E45", opacity: i === 5 ? 1 : 0.85 - i * 0.05 }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * A product's standalone website, laid out like a SaaS landing page: nav with a features menu, big hero with a product
 * preview, feature grid, two showcase rows, "why choose", numbers, closing call to action and a multi-column footer.
 * It never uses the main site's header/footer, so it can be moved to its own sub-domain as is.
 */
export default function MicroSite({ p }: { p: Product }) {
  const demo = `/contact?interest=${p.slug}`;
  const docHref = `/docs/${p.slug}.docx`;
  const domain = siteDomains[p.slug];
  const mainSite = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const showcase = p.benefits.slice(0, 2);
  const reasons = p.benefits.slice(2, 5);
  const totalCaps = p.groups.reduce((n, g) => n + g.items.length, 0);
  const stats = [
    { n: p.groups.length, l: "Core modules" },
    { n: totalCaps, l: "Built-in capabilities" },
    { n: p.idealFor.length, l: "Business types served" },
  ];

  return (
    <div className="bg-paper text-ink">
      {/* nav */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
        <div className={`${wrap} h-[76px] flex items-center justify-between gap-6`}>
          <a href="#top" className="flex-none text-ink" aria-label="Valued Crown Technologies, back to top"><Logo tone="ink" /></a>
          <nav aria-label="Product" className="hidden lg:flex items-center gap-1 text-[15px] font-medium">
            <a href="#top" className="px-4 h-10 flex items-center opacity-80 hover:opacity-100">Overview</a>

            <div className="relative group">
              <a href="#features" className="px-4 h-10 flex items-center gap-1 opacity-80 group-hover:opacity-100">Features <span aria-hidden="true" className="text-[10px]">▾</span></a>
              <div className={`${drop} w-[580px]`}>
                <div className="grid grid-cols-[1fr_200px] bg-white border border-line rounded-2xl shadow-[0_30px_60px_-15px_rgba(4,20,51,.25)] overflow-hidden">
                  <div className="p-5 grid grid-cols-2 gap-x-4 gap-y-1 content-start">
                    <span className="col-span-2 font-mono text-[10px] tracking-[.2em] uppercase opacity-50 mb-2">{p.name} features</span>
                    {p.groups.map((g) => <a key={g.title} href="#features" className="py-1.5 text-[14px] leading-snug opacity-80 hover:opacity-100 hover:text-[#E27C22]">{g.title}</a>)}
                  </div>
                  <div className="bg-ink text-paper p-5 flex flex-col gap-3">
                    <span className="font-display font-bold text-[17px] leading-tight">Build your package?</span>
                    <span className="text-[12.5px] leading-snug opacity-70">Tell us what your business needs and we&apos;ll set it up around you.</span>
                    <Link href={demo} className="mt-auto h-9 px-3 bg-paper text-ink text-[13px] font-semibold flex items-center justify-center">Talk to us</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <a href="#why" className="px-4 h-10 flex items-center gap-1 opacity-80 group-hover:opacity-100">Why choose? <span aria-hidden="true" className="text-[10px]">▾</span></a>
              <div className={`${drop} w-[340px]`}>
                <div className="bg-white border border-line rounded-2xl shadow-[0_30px_60px_-15px_rgba(4,20,51,.25)] p-5 flex flex-col gap-1">
                  {reasons.map((r) => <a key={r.title} href="#why" className="py-2 text-[14.5px] opacity-80 hover:opacity-100 hover:text-[#E27C22]">{r.title}</a>)}
                  <span className="my-2 h-px bg-line" />
                  <a href="#who" className="py-2 text-[14.5px] opacity-80 hover:opacity-100 hover:text-[#E27C22]">Who can use {p.name}?</a>
                </div>
              </div>
            </div>

            <a href={docHref} download className="px-4 h-10 flex items-center opacity-80 hover:opacity-100">Download</a>

            <div className="relative group">
              <a href="#features" className="px-4 h-10 flex items-center gap-1 opacity-80 group-hover:opacity-100">Resources <span aria-hidden="true" className="text-[10px]">▾</span></a>
              <div className={`${drop} w-[320px]`}>
                <div className="bg-white border border-line rounded-2xl shadow-[0_30px_60px_-15px_rgba(4,20,51,.25)] p-4 flex flex-col">
                  <a href={docHref} download className="p-3 rounded-lg hover:bg-paper"><span className="block font-semibold text-[14.5px]">Documentation</span><span className="block text-[13px] opacity-60">Download the {p.name} guide</span></a>
                  <a href="#features" className="p-3 rounded-lg hover:bg-paper"><span className="block font-semibold text-[14.5px]">All features</span><span className="block text-[13px] opacity-60">Full list of features</span></a>
                  <Link href={demo} className="p-3 rounded-lg hover:bg-paper"><span className="block font-semibold text-[14.5px]">Demo / Training</span><span className="block text-[13px] opacity-60">Book a demo or training session</span></Link>
                </div>
              </div>
            </div>
          </nav>
          <Link href={demo} className="h-12 px-5 sm:px-7 bg-ink text-paper flex flex-none items-center gap-2 whitespace-nowrap text-[15px] font-semibold hover:bg-ink-2 transition-colors">Buy now <span aria-hidden="true" style={{ color: orange }}>→</span></Link>
        </div>
      </header>
      <div id="top" />

      {/* hero */}
      <section className="relative overflow-hidden bg-white border-b border-line">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-[#EEF3FB] to-transparent" />
        <div className={`${wrap} relative pt-[clamp(48px,6vw,96px)] flex flex-col items-center text-center gap-6`}>
          <Reveal as="span" className="inline-flex h-8 items-center px-4 rounded-full border border-line bg-white font-mono text-[11px] tracking-[.2em] uppercase text-ink/70">{p.industry}</Reveal>
          <Reveal delay={80}><h1 className="m-0 font-display font-bold text-[clamp(36px,5.6vw,78px)] leading-[1.04] tracking-[-0.04em] max-w-[17ch] mx-auto">{p.headline}</h1></Reveal>
          <Reveal as="p" delay={160} className="m-0 text-[clamp(17px,1.5vw,21px)] leading-[1.6] text-ink/70 max-w-[56ch]">{p.subtitle}</Reveal>
          <Reveal delay={240} className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href={demo} className="h-14 px-8 bg-ink text-paper flex items-center gap-3 font-semibold text-[15px] hover:bg-ink-2 transition-colors">Get it now <span aria-hidden="true" style={{ color: orange }}>→</span></Link>
            <a href={docHref} download className="h-14 px-8 border border-ink flex items-center gap-3 font-semibold text-[15px] hover:bg-ink hover:text-paper transition-colors">Download Doc <span aria-hidden="true">↓</span></a>
          </Reveal>
          <Reveal delay={320} className="w-full max-w-[1000px] mt-[clamp(28px,4vw,56px)] pb-[clamp(32px,5vw,72px)]">
            <div className="relative">
              <DashboardMock p={p} tall />
              {!p.screenshot ? <div className="absolute -left-4 -bottom-6 hidden md:block w-[200px] aspect-[4/3] rounded-xl overflow-hidden border-4 border-white shadow-2xl">
                <Image src={p.image.src} alt={p.image.alt} fill unoptimized sizes="200px" className="object-cover" style={{ objectPosition: p.image.position }} />
              </div> : null}
            </div>
          </Reveal>
        </div>
      </section>

      {/* features grid */}
      <section id="features" className="scroll-mt-20 py-[clamp(56px,7vw,112px)]">
        <div className={`${wrap} flex flex-col gap-12`}>
          <div className="flex flex-col items-center text-center gap-4 max-w-[720px] mx-auto">
            <span className={eyebrow}>Key features</span>
            <h2 className={h2}>Includes all the features that make business sense.</h2>
            <p className="m-0 text-[17px] leading-[1.65] text-ink/65">{p.name} is made up of focused modules that work together as one complete system.</p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {p.groups.map((g, i) => (
              <Reveal key={g.title} delay={(i % 3) * 80} className="h-full">
                <article className="group h-full flex flex-col gap-4 p-7 bg-white border border-line rounded-2xl transition-[border-color,box-shadow,transform] duration-300 hover:border-ink hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(4,20,51,.10)]">
                  <span className="w-12 h-12 rounded-xl bg-ink text-paper flex items-center justify-center transition-colors duration-300 group-hover:bg-[#E27C22]">{icons[i % icons.length]}</span>
                  <h3 className="m-0 font-display font-bold text-[21px] tracking-[-0.02em] leading-tight">{g.title}</h3>
                  <p className="m-0 text-[15px] leading-[1.6] text-ink/65">{g.blurb}</p>
                  <ul className="m-0 mt-auto pt-4 p-0 list-none flex flex-col gap-2 border-t border-line">
                    {g.items.slice(0, 4).map((it) => <li key={it} className="flex gap-3 text-[14px] leading-snug"><span aria-hidden="true" className="mt-[7px] w-[6px] h-[6px] rounded-full flex-none" style={{ background: orange }} />{it}</li>)}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* showcase rows */}
      {showcase.map((b, i) => (
        <section key={b.title} id={i === 0 ? "benefits" : undefined} className={`scroll-mt-20 py-[clamp(56px,7vw,104px)] ${i === 0 ? "bg-white border-y border-line" : ""}`}>
          <div className={`${wrap} grid lg:grid-cols-2 gap-[clamp(32px,6vw,96px)] items-center`}>
            <div className={`flex flex-col gap-5 items-start ${i === 1 ? "lg:order-2" : ""}`}>
              <span className={eyebrow}>{i === 0 ? "Anywhere, anytime" : "Built for growth"}</span>
              <h2 className={h2}>{b.title}</h2>
              <p className="m-0 text-[18px] leading-[1.65] text-ink/70 max-w-[48ch]">{b.body}</p>
              <Link href={demo} className="group inline-flex items-center gap-2 font-semibold text-[15px] border-b pb-[2px]" style={{ borderColor: orange }}>See it in action <span aria-hidden="true" style={{ color: orange }} className="transition-transform group-hover:translate-x-1">→</span></Link>
            </div>
            <Reveal className={i === 1 ? "lg:order-1" : ""}>
              {i === 0 ? <DashboardMock p={p} /> : (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-line shadow-[0_40px_80px_-30px_rgba(4,20,51,.4)]">
                  <Image src={p.image.src} alt={p.image.alt} fill unoptimized sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" style={{ objectPosition: p.image.position }} />
                </div>
              )}
            </Reveal>
          </div>
        </section>
      ))}

      {/* modules, when the product has them */}
      {p.modules ? (
        <section className="py-[clamp(48px,6vw,96px)] bg-white border-y border-line">
          <div className={`${wrap} flex flex-col gap-10`}>
            <div className="flex flex-col gap-3 max-w-[640px]"><span className={eyebrow}>Core modules</span><h2 className={h2}>One platform, every department.</h2></div>
            <div className="grid md:grid-cols-2 gap-x-12">
              {p.modules.map((m) => (
                <div key={m.title} className="py-5 border-t border-line flex flex-col gap-1">
                  <h3 className="m-0 font-display font-bold text-[19px] tracking-[-0.02em]">{m.title}</h3>
                  <p className="m-0 text-[15px] leading-[1.6] text-ink/65">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* why choose */}
      <section id="why" className="scroll-mt-20 py-[clamp(56px,7vw,104px)]">
        <div className={`${wrap} flex flex-col gap-12`}>
          <div className="flex flex-col items-center text-center gap-4 max-w-[680px] mx-auto">
            <span className={eyebrow}>Why choose {p.name}?</span>
            <h2 className={h2}>In addition to the features, customers love it for these reasons.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {reasons.map((r, i) => (
              <div key={r.title} className="p-8 rounded-2xl bg-ink text-paper flex flex-col gap-4">
                <span className="font-display font-bold text-[44px] leading-none" style={{ color: orange }}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="m-0 font-display font-bold text-[22px] tracking-[-0.02em]">{r.title}</h3>
                <p className="m-0 text-[15px] leading-[1.65] text-paper/70">{r.body}</p>
              </div>
            ))}
          </div>
          <ul className="m-0 p-0 list-none flex flex-wrap justify-center gap-x-8 gap-y-3 text-[15px]">
            {p.why.map((w) => <li key={w} className="flex gap-2"><span aria-hidden="true" style={{ color: orange }}>✓</span>{w}</li>)}
          </ul>
        </div>
      </section>

      {/* who it's for */}
      <section id="who" className="scroll-mt-20 py-[clamp(48px,6vw,96px)] bg-white border-y border-line">
        <div className={`${wrap} flex flex-col items-center text-center gap-8`}>
          <span className={eyebrow}>Who it&apos;s for</span>
          <h2 className={`${h2} max-w-[18ch]`}>Made for businesses like yours.</h2>
          <ul className="m-0 p-0 list-none flex flex-wrap justify-center gap-2.5 max-w-[900px]">
            {p.idealFor.map((x) => <li key={x} className="h-11 px-5 flex items-center text-[15px] border border-line rounded-full bg-paper">{x}</li>)}
          </ul>
        </div>
      </section>

      {/* numbers */}
      <section className="py-[clamp(48px,6vw,96px)]">
        <div className={`${wrap} flex flex-col items-center gap-10`}>
          <h2 className={`${h2} text-center`}>Or just go by the numbers…</h2>
          <div className="w-full grid sm:grid-cols-3 gap-5">
            {stats.map((s) => (
              <div key={s.l} className="rounded-2xl border border-line bg-white p-8 text-center">
                <div className="font-display font-bold text-[clamp(48px,6vw,80px)] leading-none tracking-[-0.04em]">{s.n}<span style={{ color: orange }}>+</span></div>
                <div className="mt-3 text-[15px] text-ink/65">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* closing CTA */}
      <section className="px-[clamp(20px,4vw,48px)] pb-[clamp(48px,6vw,96px)]">
        <div className="mx-auto max-w-[1240px] relative overflow-hidden rounded-3xl bg-ink text-paper py-[clamp(48px,7vw,104px)] px-[clamp(24px,5vw,72px)] flex flex-col items-center text-center gap-6">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-10 w-[420px] h-[290px] text-paper opacity-[.05]"><LogoMark className="w-full h-full" /></div>
          <span className={eyebrow}>The time is right</span>
          <h2 className={`${h2} max-w-[20ch]`}>{p.closing.title}</h2>
          <p className="m-0 text-[17px] leading-[1.65] text-paper/75 max-w-[60ch]">{p.closing.body[0]}</p>
          <Link href={demo} className="h-14 px-8 bg-paper text-ink flex items-center gap-3 font-semibold text-[15px] hover:bg-white transition-colors">Get started <span aria-hidden="true" style={{ color: orange }}>→</span></Link>
          <p className="m-0 font-display font-semibold text-[18px]" style={{ color: orange }}>{p.tagline}</p>
        </div>
      </section>

      {/* footer */}
      <footer className="bg-ink text-paper">
        <div className={`${wrap} py-[clamp(40px,5vw,72px)] grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-x-8 gap-y-10`}>
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <Logo tone="light" className="self-start" />
            <p className="m-0 text-[15px] leading-[1.7] text-paper/65 max-w-[34ch]">{p.tagline}</p>
            <span className="font-mono text-[11px] tracking-[.2em] uppercase text-paper/45">{domain}</span>
          </div>
          <nav className="flex flex-col gap-3 items-start" aria-label="Product links">
            <span className="font-mono text-[11px] tracking-[.22em] uppercase text-paper/50 mb-2">Product</span>
            <a href="#features" className="text-[15px] text-paper/80 hover:text-white">Features</a>
            <a href="#benefits" className="text-[15px] text-paper/80 hover:text-white">Benefits</a>
            <a href="#who" className="text-[15px] text-paper/80 hover:text-white">Who it&apos;s for</a>
          </nav>
          <nav className="flex flex-col gap-3 items-start" aria-label="Why choose">
            <span className="font-mono text-[11px] tracking-[.22em] uppercase text-paper/50 mb-2">Why choose</span>
            {reasons.map((r) => <a key={r.title} href="#why" className="text-[15px] text-paper/80 hover:text-white">{r.title}</a>)}
          </nav>
          <nav className="flex flex-col gap-3 items-start" aria-label="Company">
            <span className="font-mono text-[11px] tracking-[.22em] uppercase text-paper/50 mb-2">Company</span>
            <a href={`${mainSite}/`} className="text-[15px] text-paper/80 hover:text-white">Valued Crown Technologies</a>
            <Link href={demo} className="text-[15px] text-paper/80 hover:text-white">Book a demo</Link>
            <a href={`${mainSite}/privacy`} className="text-[15px] text-paper/80 hover:text-white">Privacy Policy</a>
            <a href={`${mainSite}/terms`} className="text-[15px] text-paper/80 hover:text-white">Terms of Service</a>
          </nav>
        </div>
        <div className={`${wrap} border-t border-paper/12 py-6 text-[14px] text-paper/55`}>© {new Date().getFullYear()} {p.name}. A product of Valued Crown Technologies. All rights reserved.</div>
      </footer>
    </div>
  );
}
