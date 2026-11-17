"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { markReady } from "@/lib/ready";
import SmoothScroll from "./SmoothScroll";
import ScrollFx from "./ScrollFx";
import Preloader from "./Preloader";
import Cursor from "./Cursor";
import FluidCursor from "./FluidCursor";
import SiteHeader from "./SiteHeader";
import ContactModal from "./ContactModal";
import WhatsAppButton from "./WhatsAppButton";
import Stats from "./sections/Stats";
import Footer from "./sections/Footer";

/** Product sites have no preloader, so release the entrance-animation gate immediately. */
function ReadyNow() {
  useEffect(() => { markReady(); }, []);
  return null;
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Product sites (/sites/...) are standalone: they bring their own header and footer, ready to move to a sub-domain.
  if (pathname?.startsWith("/sites")) {
    return (
      <>
        <ReadyNow />
        <SmoothScroll />
        <ScrollFx />
        <main>{children}</main>
        <ContactModal />
        <WhatsAppButton />
      </>
    );
  }
  return (
    <>
      <SmoothScroll />
      <ScrollFx />
      <Preloader />
      <FluidCursor />
      <Cursor />
      <SiteHeader />
      <main>{children}</main>
      <Stats />
      <Footer />
      <ContactModal />
      <WhatsAppButton />
    </>
  );
}
