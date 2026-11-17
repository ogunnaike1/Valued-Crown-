import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

// Fonts are self-hosted (app/fonts, variable woff2, latin subset) so builds never depend on Google Fonts being reachable.
// Headings: Nunito ExtraBold. Body, buttons and navigation: Plus Jakarta Sans. Mono: JetBrains Mono (small technical labels).
const display = localFont({ src: [{ path: "./fonts/Nunito.woff2", weight: "200 1000", style: "normal" }], variable: "--font-display", display: "swap" });
const body = localFont({ src: [{ path: "./fonts/PlusJakartaSans.woff2", weight: "200 800", style: "normal" }], variable: "--font-body", display: "swap" });
const mono = localFont({ src: [{ path: "./fonts/JetBrainsMono.woff2", weight: "100 800", style: "normal" }], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Valued Crown Technologies — Business software for retail, restaurants and hotels", template: "%s — Valued Crown Technologies" },
  description:
    "Valued Crown Technologies builds retail, restaurant, hotel and laundry management software: POS, inventory, reservations, billing and reporting.",
  icons: { icon: "/assets/logo-mark.png" },
  openGraph: { siteName: "Valued Crown Technologies", type: "website" },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body><SiteChrome>{children}</SiteChrome></body>
    </html>
  );
}
