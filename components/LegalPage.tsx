import Link from "next/link";
import PageHero from "./PageHero";

export interface LegalSection { title: string; body: string[]; list?: string[] }

/** Shared layout for the Privacy Policy and Terms of Service pages. */
export default function LegalPage({ label, title, accent, intro, updated, sections }: { label: string; title: string; accent?: string; intro: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero label={label} title={title} accent={accent} text={intro} />
      <section data-theme="paper" className="px-page py-[clamp(32px,4vw,64px)]">
        <div className="wrap grid lg:grid-cols-[240px_1fr] gap-10 lg:gap-16">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-3">
              <span className="label opacity-60">On this page</span>
              {sections.map((s, i) => <a key={s.title} href={`#s${i + 1}`} className="text-[14px] leading-snug opacity-70 hover:opacity-100 transition-opacity">{i + 1}. {s.title}</a>)}
            </div>
          </nav>
          <article className="max-w-[760px] flex flex-col gap-10">
            <p className="m-0 text-[14px] opacity-60">Last updated: {updated}</p>
            {sections.map((s, i) => (
              <section key={s.title} id={`s${i + 1}`} className="scroll-mt-28 flex flex-col gap-3">
                <h2 className="m-0 font-display font-medium text-[clamp(22px,2.2vw,28px)] tracking-[-0.02em]">{i + 1}. {s.title}</h2>
                {s.body.map((p) => <p key={p} className="m-0 text-[16px] leading-[1.75] opacity-80">{p}</p>)}
                {s.list ? <ul className="m-0 pl-5 flex flex-col gap-2 list-disc text-[16px] leading-[1.7] opacity-80">{s.list.map((l) => <li key={l}>{l}</li>)}</ul> : null}
              </section>
            ))}
            <p className="m-0 pt-6 hair-t text-[16px] leading-[1.7] opacity-80">Questions? <Link href="/contact" className="underline underline-offset-4">Contact us</Link> and we&apos;ll be glad to help.</p>
          </article>
        </div>
      </section>
    </>
  );
}
