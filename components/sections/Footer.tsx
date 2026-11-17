import Link from "next/link";
import Logo from "../Logo";
import { navLinks, socials } from "@/data/site";
import { products } from "@/data/products";
import { company } from "@/data/company";

const icons: Record<string, JSX.Element> = {
  facebook: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
  instagram: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>,
  x: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  linkedin: <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
};

const colTitle = "m-0 mb-5 font-body font-semibold text-[13px] tracking-[.06em] uppercase opacity-60";
const link = "text-[15px] opacity-85 hover:opacity-100 hover:text-white transition-opacity";

/** Clean four-column footer on flat navy: brand and social icons, site pages, products, contact. */
export default function Footer() {
  const circle = "w-10 h-10 rounded-full flex items-center justify-center border border-paper/25 text-paper";
  return (
    <footer data-theme="ink" className="bg-ink text-paper px-page">
      <div className="wrap grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-x-8 gap-y-12 pt-[clamp(48px,6vw,88px)] pb-[clamp(40px,5vw,72px)]">
        <div className="col-span-2 lg:col-span-1 flex flex-col gap-5">
          <Logo tone="light" className="self-start" />
          <p className="m-0 text-[15px] leading-[1.7] opacity-70 max-w-[340px]">{company.tagline}</p>
          <div className="flex gap-3 pt-1" aria-label="Social media">
            {socials.map((s) =>
              s.url ? (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={`${circle} transition-colors duration-300 hover:bg-paper hover:text-ink hover:border-paper`}>{icons[s.id]}</a>
              ) : (
                <span key={s.id} title={`${s.label} link coming soon`} className={`${circle} opacity-45`}>{icons[s.id]}</span>
              )
            )}
          </div>
        </div>

        <nav aria-label="Pages" className="flex flex-col gap-3">
          <h3 className={colTitle}>Pages</h3>
          {navLinks.map((l) => <Link key={l.label} href={l.href} className={link}>{l.label}</Link>)}
        </nav>

        <nav aria-label="Products" className="flex flex-col gap-3">
          <h3 className={colTitle}>Products</h3>
          {products.map((p) => <Link key={p.slug} href={`/products/${p.slug}`} className={link}>{p.name}</Link>)}
        </nav>

        <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
          <h3 className={colTitle}>Get in touch</h3>
          <p className="m-0 text-[15px] leading-[1.7] opacity-70 max-w-[300px]">Tell us how your business runs and we&apos;ll show you the software that fits.</p>
          <Link href="/contact" className="self-start h-12 px-6 bg-paper text-ink flex items-center gap-2 text-[15px] font-semibold transition-colors duration-300 hover:bg-white">Contact us <span aria-hidden="true">→</span></Link>
        </div>
      </div>

      <div className="wrap border-t border-paper/15 py-6 flex flex-wrap items-center justify-between gap-4 text-[14px]">
        <span className="opacity-60">© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
        <Link href="#top" className="opacity-80 hover:opacity-100 transition-opacity">Back to top ↑</Link>
      </div>
    </footer>
  );
}
