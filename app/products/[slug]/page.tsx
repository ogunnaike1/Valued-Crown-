import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import ProductHero from "@/components/product/ProductHero";
import { Overview, Features, Benefits, Modules, RetailOperations, IdealFor, Closing } from "@/components/product/ProductSections";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug);
  if (!p) return {};
  return { title: p.name, description: p.meta, alternates: { canonical: `/products/${p.slug}` }, openGraph: { title: p.name, description: p.meta } };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  if (!p) notFound();
  return (
    <>
      <ProductHero product={p} />
      <Overview p={p} />
      <Features p={p} />
      <Benefits p={p} />
      <Modules p={p} />
      {p.slug === "retail-manager" ? <RetailOperations /> : null}
      <IdealFor p={p} />
      <Closing p={p} />
    </>
  );
}
