import type { MetadataRoute } from "next";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const routes = ["", "/products", "/solutions", "/industries", "/about", "/contact", "/privacy", "/terms", ...products.map((p) => `/products/${p.slug}`), ...products.map((p) => `/sites/${p.slug}`)];
  return routes.map((r) => ({ url: base + r, lastModified: new Date() }));
}
