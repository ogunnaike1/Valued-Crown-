import { products } from "./products";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products", children: products.map((p) => ({ label: p.name, href: `/products/${p.slug}`, sub: p.industry })) },
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerColumns = [
  { title: "PRODUCTS", links: products.map((p) => ({ label: p.name, href: `/products/${p.slug}` })) },
  { title: "EXPLORE", links: [{ label: "All products", href: "/products" }, { label: "Solutions", href: "/solutions" }, { label: "Industries", href: "/industries" }] },
  { title: "COMPANY", links: [{ label: "About us", href: "/about" }, { label: "Contact", href: "/contact" }] },
];

/** WhatsApp number in international format, digits only (e.g. "2348012345678"). Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local.
 *  While it is empty, the floating button opens the contact pop-up instead. */
export const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
export const whatsappMessage = "Hello Valued Crown Technologies, I'd like to know more about your software.";

/** Social profile links. Set these in .env.local (full URLs). An icon without a link stays visible but inactive. */
export const socials = [
  { id: "facebook", label: "Facebook", url: process.env.NEXT_PUBLIC_FACEBOOK_URL || "" },
  { id: "instagram", label: "Instagram", url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "" },
  { id: "x", label: "X (Twitter)", url: process.env.NEXT_PUBLIC_X_URL || "" },
  { id: "linkedin", label: "LinkedIn", url: process.env.NEXT_PUBLIC_LINKEDIN_URL || "" },
] as const;
