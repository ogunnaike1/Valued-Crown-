import type { Metadata } from "next";
import { Nunito, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

// Headings: Nunito ExtraBold / Black. Body, buttons and navigation: Plus Jakarta Sans. (Mono is kept for the small technical labels.)
const display = Nunito({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-display", display: "swap" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

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
