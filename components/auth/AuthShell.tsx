"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import LogoMark from "../LogoMark";
import { products, type Product } from "@/data/products";

/** Product named in ?product=, or null. */
export function useProduct(): Product | null {
  const slug = useSearchParams().get("product");
  return products.find((p) => p.slug === slug) ?? null;
}

/** Split-screen layout: brand panel (reflects the chosen product) on the left, form on the right. */
export default function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  const product = useProduct();
  const perks = product ? product.benefits.slice(0, 3) : [
    { title: "One back office", body: "Sales, stock, customers and reports for the product you use, in one place." },
    { title: "Every branch, one login", body: "Switch between branches and see consolidated numbers." },
    { title: "Secure by default", body: "Role-based access and automated backups." },
  ];
  return (
    <div className="grid min-h-screen bg-paper text-ink lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-paper lg:flex" aria-label="About">
        <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-[.14]" style={{ background: "radial-gradient(circle, #E27C22, transparent 65%)" }} />
        <Link href="/" className="relative flex items-center gap-3">
          <span className="block h-9 w-[52px] text-paper"><LogoMark className="h-full w-full" /></span>
          <span className="flex flex-col leading-none"><span className="font-display text-[22px] font-bold tracking-[-0.03em]">Valued Crown</span><span className="mt-[5px] font-mono text-[8px] uppercase tracking-[.34em] opacity-65">Technologies</span></span>
        </Link>
        <div className="relative max-w-[460px]">
          <span className="label text-crown">{product ? product.industry : "Client portal"}</span>
          <h2 className="font-display mt-4 text-[clamp(32px,3.2vw,46px)] leading-[1.05] tracking-[-0.03em]">{product ? product.name : "Your business, at a glance."}</h2>
          <p className="mt-4 text-[16px] leading-[1.6] text-paper/70">{product ? product.tagline : "Sign in to the back office for the Valued Crown software you use."}</p>
          <ul className="mt-10 space-y-5">
            {perks.map((b) => (
              <li key={b.title} className="flex gap-4"><span className="mt-[7px] h-2 w-2 flex-none bg-crown" /><span><span className="block font-semibold">{b.title}</span><span className="block text-[14px] leading-[1.55] text-paper/60">{b.body}</span></span></li>
            ))}
          </ul>
        </div>
        <p className="relative text-[12.5px] text-paper/45">© {new Date().getFullYear()} Valued Crown Technologies</p>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="flex items-center gap-2 lg:hidden"><span className="block h-7 w-10"><LogoMark className="h-full w-full" /></span><span className="font-display text-[17px] font-bold">Valued Crown</span></Link>
          <Link href="/" className="text-[13.5px] font-semibold text-slate hover:text-ink">← Back to website</Link>
        </div>
        <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-[clamp(28px,3vw,36px)] leading-[1.1] tracking-[-0.03em]">{title}</h1>
          <p className="mt-2 text-[15px] text-slate">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-center text-[14px] text-slate">{footer}</div>
        </div>
      </main>
    </div>
  );
}
