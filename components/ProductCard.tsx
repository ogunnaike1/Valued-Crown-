import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

/**
 * Product card: photo band on top, industry label, headline, feature chips and two links
 * ("About …" to the product page, "Enquire now" to the contact form pre-filled for that product).
 */
export default function ProductCard({ p }: { p: Product; detailed?: boolean }) {
  return (
    <article className="group flex flex-col h-full bg-white text-ink border border-line overflow-hidden transition-[border-color,box-shadow] duration-500 ease-std hover:border-ink hover:shadow-[0_24px_48px_rgba(4,20,51,.10)]">
      <div className="h-[3px] bg-[#E27C22]" />
      <div data-img-reveal className="relative h-[clamp(150px,14vw,200px)] overflow-hidden bg-ink">
        <Image
          src={p.image.src}
          alt={p.image.alt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-std group-hover:scale-[1.04]"
          style={{ objectPosition: p.image.position }}
        />
        <span className="absolute left-4 bottom-4 h-8 px-3 flex items-center bg-white text-ink font-display font-medium text-[17px] tracking-[-0.02em]">{p.name}</span>
      </div>

      <div className="flex flex-col gap-5 p-[clamp(20px,2.4vw,32px)] flex-1">
        <span className="label opacity-60">{p.industry}</span>
        <h3 className="m-0 font-display font-medium text-[clamp(24px,2.3vw,34px)] leading-[1.08] tracking-[-0.03em] [text-wrap:balance]">{p.headline}</h3>
        <ul className="m-0 p-0 list-none flex flex-wrap gap-[6px]">
          {p.groups.slice(0, 6).map((g) => (
            <li key={g.title} className="h-8 px-3 flex items-center text-[13px] border border-line rounded-full bg-paper">{g.title}</li>
          ))}
        </ul>
        <div className="mt-auto pt-4 flex flex-wrap items-center gap-x-7 gap-y-3 text-[15px] font-medium">
          <Link href={`/products/${p.slug}`} className="group/l inline-flex items-center gap-2 border-b border-[#E27C22] pb-[2px]">
            About {p.name}<span className="text-[#E27C22] transition-transform duration-500 ease-std group-hover/l:translate-x-1">→</span>
          </Link>
          <Link href={`/contact?interest=${p.slug}`} className="group/l inline-flex items-center gap-2 opacity-75 hover:opacity-100 transition-opacity">
            Enquire now<span className="transition-transform duration-500 ease-std group-hover/l:translate-x-[2px] group-hover/l:-translate-y-[2px]">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
