import Link from "next/link";
import Reveal from "../Reveal";
import SplitHeading from "../SplitHeading";
import { products } from "@/data/products";

// Left and right columns are drawn directly from the products' own feature lists.
const left = ["Point-of-sale terminals and checkout", "Reservations and bookings", "Front desk and guest check-in", "Table, order and kitchen tickets", "Customer and guest records"];
const right = ["Inventory, stock and purchase orders", "Billing, invoices and payments", "Reports and analytics", "User roles and permissions", "Backups and data security"];

const Tick = () => (
  <span className="flex-none w-6 h-6 rounded-full bg-[#E27C22]/15 text-[#C2650F] flex items-center justify-center">
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
  </span>
);
const Arrow = () => <span aria-hidden="true" className="vc-nudge hidden lg:flex items-center justify-center text-[28px] text-[#E27C22]">→</span>;

/** One connected system: where staff and customers work, the four products, and the back office. */
export default function Ecosystem() {
  const col = (title: string, items: string[]) => (
    <div className="bg-white rounded-[28px] p-[clamp(20px,2.2vw,30px)] flex flex-col gap-1 h-full shadow-[0_10px_30px_rgba(4,20,51,.05)]">
      <span className="inline-flex self-start h-7 items-center px-3 rounded-full bg-[#EEF3FB] label mb-3">{title}</span>
      {items.map((t) => (
        <div key={t} className="group flex items-center gap-3 py-[11px] rounded-xl px-2 -mx-2 text-[15px] leading-[1.4] transition-[background-color,transform] duration-300 hover:bg-[#EEF3FB] hover:translate-x-1">
          <Tick />{t}
        </div>
      ))}
    </div>
  );
  return (
    <section data-theme="paper" className="px-page py-[clamp(40px,5.0vw,75px)] bg-[#EEF3FB]">
      <div className="wrap">
        <div className="flex flex-col items-center text-center gap-5 mb-[clamp(28px,3.5vw,50px)]">
          <Reveal as="span" className="inline-flex h-8 items-center px-4 rounded-full bg-[#E27C22]/15 text-[#9A500F] label">How it fits together</Reveal>
          <SplitHeading
            className="font-display font-medium text-[clamp(32px,4.4vw,64px)] leading-[1.05] tracking-[-0.03em] text-center"
            lines={[{ text: "One connected", pad: 0.08 }, { text: "system.", pad: 0.1, style: { color: "#E27C22" } }]}
          />
          <Reveal as="p" className="m-0 max-w-[560px] text-[16px] leading-[1.6] opacity-70">
            From the till and the front desk to the reports on the owner&apos;s screen, every part shares the same data, so the numbers agree.
          </Reveal>
        </div>
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-stretch">
            {col("Where you meet customers", left)}
            <Arrow />
            <div className="bg-ink text-paper rounded-[28px] p-[clamp(20px,2.2vw,30px)] flex flex-col gap-3 shadow-[0_24px_50px_rgba(4,20,51,.22)]">
              <span className="inline-flex self-start h-7 items-center px-3 rounded-full bg-paper/10 label mb-1">Core products</span>
              {products.map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}`} className="group flex items-center justify-between gap-3 bg-white text-ink rounded-2xl px-4 h-[64px] transition-[transform,background-color] duration-500 ease-std hover:-translate-y-[3px] hover:bg-[#FFF4EA]">
                  <span className="flex flex-col leading-tight"><span className="font-display font-medium text-[18px] tracking-[-0.02em]">{p.name}</span><span className="text-[12px] opacity-60">{p.industry}</span></span>
                  <span className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center transition-[background-color,transform] duration-500 ease-std group-hover:bg-[#E27C22] group-hover:translate-x-1">→</span>
                </Link>
              ))}
            </div>
            <Arrow />
            {col("Back office", right)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
