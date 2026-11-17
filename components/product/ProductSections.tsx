import Link from "next/link";
import Reveal from "../Reveal";
import SplitHeading from "../SplitHeading";
import FeatureExplorer from "./FeatureExplorer";
import { products, retailOperations, type Product } from "@/data/products";

const label = "label";

export function Overview({ p }: { p: Product }) {
  return (
    <section data-theme="paper" className="px-page py-[clamp(45px,5.5vw,85px)]">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-x-[clamp(24px,4vw,64px)] gap-y-8">
        <Reveal as="span" className={`${label} pt-3`}>Overview</Reveal>
        <div className="flex flex-col gap-8">
          {p.intro.map((t, i) => (
            <Reveal as="p" key={i} delay={i * 100} className={`m-0 font-display font-medium tracking-[-0.03em] leading-[1.08] [text-wrap:pretty] ${i === 0 ? "text-[clamp(26px,3.4vw,58px)]" : "text-[clamp(20px,2vw,32px)] opacity-70 max-w-[900px]"}`}>{t}</Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Features({ p }: { p: Product }) {
  return (
    <section id="features" data-theme="ink" className="px-page py-[clamp(45px,5.5vw,85px)] scroll-mt-16">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-[clamp(28px,3.5vw,50px)]">
        <SplitHeading className="font-display font-medium text-[clamp(30px,3.6vw,52px)] leading-[1.08] tracking-[-0.03em]" lines={[{ text: "Key features", pad: 0.08 }]} />
      </div>
      <FeatureExplorer groups={p.groups} />
    </section>
  );
}

export function Benefits({ p }: { p: Product }) {
  return (
    <section data-theme="paper" className="px-page py-[clamp(45px,5.5vw,85px)]">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-[clamp(28px,3.5vw,50px)]">
        <SplitHeading className="font-display font-medium text-[clamp(30px,3.6vw,52px)] leading-[1.08] tracking-[-0.03em]" lines={[{ text: `Benefits of`, pad: 0.08 }, { text: p.name, pad: 0.08 }]} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 hair-t hair-l">
        {p.benefits.map((b, i) => (
          <Reveal key={b.title} delay={(i % 3) * 80}>
            <div className="h-full flex flex-col gap-4 p-[clamp(20px,2.2vw,36px)] md:min-h-[260px] hair-r hair-b">
              <span className="font-display font-bold text-[clamp(24px,2.2vw,36px)] tracking-[-0.04em] leading-[1]">{b.title}</span>
              <span className="text-[15px] leading-[1.55] opacity-70 mt-auto">{b.body}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Modules({ p }: { p: Product }) {
  if (!p.modules) return null;
  return (
    <section data-theme="ink" className="bg-ink text-paper px-page py-[clamp(45px,5.5vw,85px)]">
      <div className="label flex flex-wrap justify-between gap-5 pb-[18px] border-b border-current mb-[clamp(24px,2.8vw,40px)]"><span>Core modules</span></div>
      <div className="flex flex-col">
        {p.modules.map((m, i) => (
          <Reveal key={m.title}>
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-x-6 gap-y-2 items-baseline py-[clamp(20px,2.4vw,36px)] border-b border-current/30">
              <span className="font-display font-medium text-[clamp(28px,2.2vw,24px)] tracking-[-0.03em] leading-[1.08]">{m.title}</span>
              <span className="text-[16px] leading-[1.5] max-w-[440px]">{m.body}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Retail only: workflows, architecture, roles, SLA, security and maintenance from the system documentation. */
export function RetailOperations() {
  const o = retailOperations;
  return (
    <section data-theme="ink" className="px-page py-[clamp(45px,5.5vw,85px)]">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-[clamp(28px,3.5vw,50px)]">
        <SplitHeading className="font-display font-medium text-[clamp(30px,3.6vw,52px)] leading-[1.08] tracking-[-0.03em]" lines={[{ text: "How it runs", pad: 0.08 }, { text: "day to day.", pad: 0.08, style: { opacity: 0.45 } }]} />
        <Reveal as="span" className="label opacity-60">System documentation</Reveal>
      </div>

      <div className="flex flex-col hair-t">
        {o.workflows.map((w) => (
          <Reveal key={w.title}>
            <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-4 lg:gap-10 py-7 hair-b items-center">
              <span className="font-display font-bold text-[clamp(22px,2vw,30px)] tracking-[-0.035em]">{w.title}</span>
              <ol className="m-0 p-0 list-none flex flex-wrap items-center gap-y-3">
                {w.steps.map((s, i) => (
                  <li key={s} className="flex items-center">
                    <span className="h-11 px-4 flex items-center gap-3 border border-current/30 text-[14px]">{s}</span>
                    {i < w.steps.length - 1 ? <span className="w-5 h-px bg-current/40" /> : null}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[clamp(32px,5vw,80px)] gap-y-[clamp(48px,6vw,80px)] mt-[clamp(39px,4.9vw,70px)]">
        <Reveal>
          <span className="label opacity-60">System architecture</span>
          <div className="mt-5 flex flex-col sm:flex-row items-stretch gap-0">
            {o.architecture.map((a, i) => (
              <div key={a} className="flex-1 flex sm:flex-row flex-col items-stretch">
                <div className="flex-1 p-5 border border-current/30 flex flex-col gap-6 min-h-[120px]"><span className="font-display font-bold text-[22px] tracking-[-0.03em] leading-[1.05]">{a}</span></div>
                {i < o.architecture.length - 1 ? <div className="sm:w-8 w-px h-6 sm:h-px self-center bg-current/40 sm:flex-none" /> : null}
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[11px] opacity-60 uppercase tracking-[.05em]">{o.architectureNote}</p>
        </Reveal>

        <Reveal delay={100}>
          <span className="label opacity-60">User roles</span>
          <div className="mt-5 hair-t">
            {o.roles.map((r) => (
              <div key={r.role} className="flex justify-between gap-4 py-4 hair-b"><span className="font-display font-bold text-[24px] tracking-[-0.035em]">{r.role}</span><span className="opacity-70 text-[15px] self-center">{r.access}</span></div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <span className="label opacity-60">Support response times</span>
          <div className="mt-5 hair-t">
            <div className="grid grid-cols-3 py-3 hair-b font-mono text-[11px] opacity-60 uppercase"><span>Priority</span><span>Response</span><span>Resolution</span></div>
            {o.sla.map((s) => (
              <div key={s.level} className="grid grid-cols-3 py-3 hair-b text-[15px]"><span className="font-medium">{s.level}</span><span>{s.response}</span><span className="opacity-70">{s.resolution ?? "—"}</span></div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100} className="flex flex-col gap-10">
          <div>
            <span className="label opacity-60">Security</span>
            <ul className="m-0 mt-5 p-0 list-none hair-t">{o.security.map((s) => <li key={s} className="py-3 hair-b flex gap-3 text-[15px]">{s}</li>)}</ul>
          </div>
          <div>
            <span className="label opacity-60">Maintenance</span>
            <ul className="m-0 mt-5 p-0 list-none hair-t">{o.maintenance.map((s) => <li key={s} className="py-3 hair-b flex gap-3 text-[15px]">{s}</li>)}</ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function IdealFor({ p }: { p: Product }) {
  return (
    <section data-theme="paper" className="px-page py-[clamp(45px,5.5vw,85px)]">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] gap-x-[clamp(32px,5vw,80px)] gap-y-10">
        <div className="flex flex-col gap-6">
          <Reveal as="span" className="label">Ideal for</Reveal>
          <SplitHeading className="font-display font-medium text-[clamp(30px,3.6vw,52px)] leading-[1.08] tracking-[-0.03em]" lines={[{ text: "Built for", pad: 0.08 }, { text: "your business.", pad: 0.08 }]} />
          <ul className="m-0 mt-4 p-0 list-none flex flex-col">
            <Reveal as="span" className="label opacity-60 pb-3 hair-b">Why choose {p.name}?</Reveal>
            {p.why.map((w) => <li key={w} className="flex gap-3 py-[10px] hair-b text-[15px]"><span className="font-mono text-[12px] mt-[2px] opacity-60">✓</span>{w}</li>)}
          </ul>
        </div>
        <div className="flex flex-col hair-t self-start">
          {p.idealFor.map((t, i) => (
            <Reveal key={t}>
              <div className="group flex items-baseline gap-5 py-[clamp(10px,1.2vw,18px)] hair-b transition-[padding] duration-500 ease-std hover:pl-4">
                <span className="font-display font-medium text-[clamp(28px,2.2vw,26px)] tracking-[-0.03em] leading-[1.08]">{t}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Closing({ p }: { p: Product }) {
  const others = products.filter((x) => x.slug !== p.slug);
  return (
    <>
      <section data-theme="ink" className="px-page py-[clamp(45px,5.5vw,85px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-x-[clamp(32px,5vw,80px)] gap-y-8 items-end">
          <SplitHeading className="font-display font-medium text-[clamp(30px,3.6vw,52px)] leading-[1.08] tracking-[-0.03em]" lines={[{ text: p.closing.title, pad: 0.08 }]} />
          <div className="flex flex-col gap-4">
            {p.closing.body.map((t, i) => <Reveal as="p" key={i} delay={i * 100} className="m-0 text-[16px] leading-[1.6] opacity-75">{t}</Reveal>)}
          </div>
        </div>
        <Reveal className="mt-[clamp(34px,4.2vw,62px)] pt-6 border-t border-current/20 flex flex-wrap items-center justify-between gap-6">
          <span className="font-display font-medium text-[clamp(22px,2.4vw,40px)] tracking-[-0.03em]">{p.tagline}</span>
          <Link href={`/contact?interest=${p.slug}`} className="h-[60px] px-7 bg-paper text-ink flex items-center gap-3 font-medium text-[15px]">Enquire now <span>→</span></Link>
        </Reveal>
      </section>

      <section data-theme="paper" className="px-page py-[clamp(40px,5.0vw,75px)]">
        <div className="label flex flex-wrap justify-between gap-5 pb-[18px] hair-b mb-8"><span>Other products</span><Link href="/products" className="underline underline-offset-4">All products →</Link></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {others.map((o) => (
            <Reveal key={o.slug}>
              <Link href={`/products/${o.slug}`} className="group flex flex-col gap-10 p-6 min-h-[260px] transition-transform duration-500 ease-std hover:-translate-y-1" style={{ background: o.colors.bg, color: o.colors.fg, boxShadow: `inset 0 0 0 1px ${o.colors.edge === "transparent" ? "rgba(4,20,51,.14)" : o.colors.edge}` }}>
                <span className="label"><span className="opacity-70">{o.industry}</span></span>
                <span className="font-display font-medium text-[clamp(30px,3.6vw,52px)] tracking-[-0.04em] leading-[.92] mt-auto">{o.name}</span>
                <span className="text-[14px] leading-[1.45] opacity-80">{o.tagline}</span>
                <span className="flex justify-between text-[14px] font-medium"><span>Learn more</span><span className="transition-transform duration-500 ease-std group-hover:translate-x-1">→</span></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
