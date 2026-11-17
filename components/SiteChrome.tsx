"use client";

import type { ReactNode } from "react";
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

export default function SiteChrome({ children }: { children: ReactNode }) {
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
