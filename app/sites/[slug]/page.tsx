import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products, siteDomains } from "@/data/products";
import MicroSite from "@/components/microsite/MicroSite";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug);
  if (!p) return {};
  return {
    title: { absolute: `${p.name} — ${p.subtitle}` },
    description: p.meta,
    alternates: { canonical: `/sites/${p.slug}` },
    openGraph: { title: `${p.name} (${siteDomains[p.slug]})`, description: p.meta },
  };
}

export default function ProductSitePage({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  if (!p) notFound();
  return <MicroSite p={p} />;
}
