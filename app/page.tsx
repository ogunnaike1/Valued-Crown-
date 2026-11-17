import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import HowWeWork from "@/components/sections/HowWeWork";
import Ecosystem from "@/components/sections/Ecosystem";
import Trust from "@/components/sections/Trust";
import IndustryCards from "@/components/sections/IndustryCards";
import ProductGrid from "@/components/sections/ProductGrid";
import Faq from "@/components/sections/Faq";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: { absolute: "Valued Crown Technologies — Business software for retail, restaurants, hotels and laundries" },
  description: "Hotel Manager, Restaurant Manager, Shop Manager and Laundry Manager: management software for POS, inventory, reservations, billing and reporting.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductGrid />
      <HowWeWork />
      <IndustryCards />
      <Ecosystem />
      <Trust />
      <Faq />
      <CTA />
    </>
  );
}
