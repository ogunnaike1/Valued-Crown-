import Link from "next/link";
import Logo from "../Logo";
import LogoMark from "../LogoMark";
import { navLinks, socials, contactInfo } from "@/data/site";
import NewsletterForm from "../NewsletterForm";
import { products } from "@/data/products";
import { company } from "@/data/company";

const icons: Record<string, JSX.Element> = {
  facebook: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
  instagram: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>,
  x: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  linkedin: <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
};

const colTitle = "m-0 mb-6 font-mono text-[11px] tracking-[.22em] uppercase text-paper/50";
const link = "group inline-flex items-center gap-2 text-[15px] text-paper/80 hover:text-white transition-colors";
const arrow = <span aria-hidden="true" className="inline-block w-0 overflow-hidden opacity-0 -translate-x-1 transition-all duration-300 group-hover:w-4 group-hover:opacity-100 group-hover:translate-x-0">→</span>;

const ico = (d: JSX.Element) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
const pin = ico(<><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>);
const phoneIcon = ico(<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />);
const mailIcon = ico(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>);

/** Footer: newsletter headline, contact tiles, brand + link columns, legal bar over a faint crown watermark. */
export default function Footer() {
  const circle = "w-10 h-10 rounded-full flex items-center justify-center border border-paper/25 text-paper";
  const info = [
    { icon: pin, title: "Visit", text: contactInfo.address, fallback: "Find our location", href: "/contact" },
    { icon: phoneIcon, title: "Call", text: contactInfo.phone, fallback: "Request a call back", href: contactInfo.phone ? `tel:${contactInfo.phone.replace(/[^\d+]/g, "")}` : "/contact" },
    { icon: mailIcon, title: "Write", text: contactInfo.email, fallback: "Send us a message", href: contactInfo.email ? `mailto:${contactInfo.email}` : "/contact" },
  ];
  return (
    <footer data-theme="ink" className="relative overflow-hidden bg-ink text-paper px-page">
      {/* soft glow + watermark crown */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full bg-[#1B3F8F]/30 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-10 w-[420px] h-[290px] text-paper opacity-[.04]"><LogoMark className="w-full h-full" /></div>

      <div className="wrap relative">
        {/* headline + newsletter */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-20 items-end pt-[clamp(56px,7vw,104px)] pb-[clamp(40px,5vw,72px)]">
          <h2 className="m-0 font-display font-bold text-[clamp(32px,4.4vw,58px)] leading-[1.05] tracking-[-0.035em] max-w-[16ch]">Software that fits the way you work.</h2>
          <div>
            <p className="m-0 mb-5 text-[16px] leading-[1.7] text-paper/70 max-w-[44ch]">Product news and practical tips for retail, restaurant and hotel operators. No spam, unsubscribe anytime.</p>
            <NewsletterForm />
          </div>
        </div>

        {/* contact tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-paper/12 border border-paper/12 rounded-2xl overflow-hidden">
          {info.map((i) => {
            const inner = (
              <>
                <span className="w-10 h-10 rounded-full bg-paper/10 flex items-center justify-center flex-none transition-colors duration-300 group-hover:bg-paper group-hover:text-ink">{i.icon}</span>
                <span className="flex flex-col gap-1 min-w-0">
                  <span className="font-mono text-[11px] tracking-[.22em] uppercase text-paper/50">{i.title}</span>
                  <span className="text-[16px] leading-snug break-words">{i.text || i.fallback}</span>
                </span>
              </>
            );
            const cls = "group flex items-center gap-4 p-6 bg-ink hover:bg-ink-2 transition-colors duration-300";
            return i.href.startsWith("/") ? <Link key={i.title} href={i.href} className={cls}>{inner}</Link> : <a key={i.title} href={i.href} className={cls}>{inner}</a>;
          })}
        </div>

        {/* brand + links */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] gap-x-10 gap-y-12 py-[clamp(48px,6vw,88px)]">
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-6">
            <Logo tone="light" className="self-start" />
            <p className="m-0 text-[15px] leading-[1.75] text-paper/70 max-w-[36ch]">{company.tagline}</p>
            <div className="flex gap-3" aria-label="Social media">
              {socials.map((s) =>
                s.url ? (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={`${circle} transition-colors duration-300 hover:bg-paper hover:text-ink hover:border-paper`}>{icons[s.id]}</a>
                ) : (
                  <span key={s.id} title={`${s.label} link coming soon`} className={`${circle} opacity-40`}>{icons[s.id]}</span>
                )
              )}
            </div>
          </div>

          <nav aria-label="Company" className="flex flex-col gap-4 items-start">
            <h3 className={colTitle}>Explore</h3>
            {navLinks.filter((l) => l.label !== "Products").map((l) => <Link key={l.label} href={l.href} className={link}>{l.label}{arrow}</Link>)}
          </nav>

          <nav aria-label="Products" className="flex flex-col gap-4 items-start">
            <h3 className={colTitle}>Products</h3>
            {products.map((p) => <Link key={p.slug} href={`/products/${p.slug}`} className={link}>{p.name}{arrow}</Link>)}
          </nav>
        </div>

        <div className="border-t border-paper/12 py-6 flex flex-wrap items-center justify-between gap-4 text-[14px] text-paper/60">
          <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-paper/40" />
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
