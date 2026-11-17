"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Btn from "./Btn";
import Logo, { type LogoTone } from "./Logo";
import { navLinks } from "@/data/site";
import { products } from "@/data/products";
import { getLenis } from "@/lib/lenis";

type Theme = "paper" | "ink";
interface Palette { bg: string; fg: string; btnBg: string; btnFg: string; logo: LogoTone }

// Once scrolled, the bar takes the colour *opposite* the section beneath it so it always reads as a distinct,
// changing layer; at the very top it is transparent and follows the section's own colours.
const SCROLLED: Record<Theme, Palette> = {
  paper: { bg: "#041433", fg: "#FAFCFF", btnBg: "#FAFCFF", btnFg: "#041433", logo: "light" },
  ink: { bg: "#FAFCFF", fg: "#041433", btnBg: "#041433", btnFg: "#FAFCFF", logo: "ink" },
};
const TOP: Record<Theme, Palette> = {
  paper: { bg: "transparent", fg: "#041433", btnBg: "#041433", btnFg: "#FAFCFF", logo: "ink" },
  ink: { bg: "transparent", fg: "#FAFCFF", btnBg: "#FAFCFF", btnFg: "#041433", logo: "light" },
};

function RollLabel({ children }: { children: string }) {
  return (
    <span className="roll-box">
      <span className="roll-inner"><span>{children}</span><span>{children}</span></span>
    </span>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("paper");
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const open = useRef({ menu: false, mega: false });
  open.current = { menu, mega };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));

  // The bar's colours follow whichever themed section is directly underneath it. This is read straight from the page
  // (on mount, every route change, scroll and resize) instead of relying on an event, so it can never fall out of sync.
  useEffect(() => {
    const probe = () => {
      const y = scrolled ? 32 : 38; // a point inside the bar
      let found: Theme = "paper";
      const els = document.body.querySelectorAll<HTMLElement>("[data-theme]");
      for (const el of Array.from(els)) {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) { found = (el.dataset.theme as Theme) || "paper"; break; }
      }
      setTheme((t) => (t === found ? t : found));
    };
    probe();
    const raf = requestAnimationFrame(probe);
    const timers = [60, 200, 500, 1200].map((ms) => window.setTimeout(probe, ms)); // covers page transitions + late layout
    window.addEventListener("scroll", probe, { passive: true });
    window.addEventListener("resize", probe);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", probe);
      window.removeEventListener("resize", probe);
    };
  }, [pathname, scrolled]);

  // close menus whenever the route changes
  useEffect(() => {
    setMenu(false);
    setMega(false);
    getLenis()?.start();
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClose = () => { setMenu(false); setMega(false); };
    window.addEventListener("vc:close-menu", onClose);
    return () => window.removeEventListener("vc:close-menu", onClose);
  }, []);

  // Escape closes the menus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMega(false); if (open.current.menu) toggleMenu(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pal = scrolled || menu ? SCROLLED[theme] : TOP[theme];

  const toggleMenu = () => {
    const next = !open.current.menu;
    setMenu(next);
    const l = getLenis();
    if (l) next ? l.stop() : l.start();
  };

  return (
    <>
      <header
        onMouseLeave={() => setMega(false)}
        className="fixed top-0 left-0 right-0 z-[200]"
        style={{
          backgroundColor: pal.bg,
          color: pal.fg,
          transition: "background-color .6s var(--e-std), color .6s var(--e-std)",
        }}
      >
        <div className="relative flex items-center justify-between gap-5 px-page transition-[height] duration-500 ease-std" style={{ height: scrolled ? 64 : 76 }}>
          <Link href="/" aria-label="Valued Crown Technologies — home" className="flex items-center">
            <Logo tone={pal.logo} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex gap-[34px] text-[14px] font-medium">
            {navLinks.filter((l) => l.href !== "/contact").map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="roll relative flex items-center gap-[6px]"
                aria-current={isActive(l.href) ? "page" : undefined}
                aria-haspopup={"children" in l ? "true" : undefined}
                aria-expanded={"children" in l ? mega : undefined}
                onMouseEnter={() => setMega("children" in l)}
                onFocus={() => setMega("children" in l)}
              >
                <RollLabel>{l.label}</RollLabel>
                <span aria-hidden="true" className="absolute left-0 right-0 -bottom-[7px] h-[2px] bg-[#E27C22] origin-left transition-transform duration-500 ease-std" style={{ transform: isActive(l.href) || (l.label === "Products" && mega) ? "scaleX(1)" : "scaleX(0)" }} />
              </Link>
            ))}
          </nav>

          <div className="flex gap-2 items-center">
            <div className="hidden sm:block"><Btn href="/contact" label="Contact us" height={44} padX={18} bg={pal.btnBg} fg={pal.btnFg} className="!text-[14px]" /></div>
            <button
              onClick={toggleMenu}
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="group lg:hidden w-11 h-11 flex flex-col items-end justify-center gap-[7px] bg-transparent border-0 text-inherit cursor-pointer p-0"
            >
              <span className="block h-[1.5px] w-[26px] bg-current transition-[width] duration-500 ease-std group-hover:w-[18px]" />
              <span className="block h-[1.5px] w-[18px] bg-current transition-[width] duration-500 ease-std group-hover:w-[26px]" />
            </button>
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-px bg-current" style={{ opacity: mega || scrolled ? 0 : 0.14 }} />
        </div>

        {/* products mega menu */}
        <div
          className="hidden lg:block absolute left-0 right-0 bg-white text-ink"
          style={{
            top: "100%",
            clipPath: mega ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            pointerEvents: mega ? "auto" : "none",
            visibility: mega ? "visible" : "hidden",
            transition: "clip-path .7s cubic-bezier(.76,0,.24,1), visibility 0s linear " + (mega ? "0s" : ".7s"),
            boxShadow: "0 30px 60px rgba(4,20,51,.12)",
          }}
        >
          <div className="grid grid-cols-4">
            {products.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} onClick={() => setMega(false)} className="flex flex-col gap-[10px] pt-7 pb-8 px-[clamp(16px,2vw,28px)] border-r border-line transition-colors duration-300 hover:bg-paper">
                <span className="font-mono text-[11px] tracking-[.05em] text-slate">{p.industry}</span>
                <span className="font-display font-medium text-[30px] tracking-[-0.03em] leading-none">{p.name}</span>
                <span className="text-[14px] leading-[1.45] text-slate-2">{p.tagline}</span>
              </Link>
            ))}
          </div>
          <Link href="/products" onClick={() => setMega(false)} className="flex justify-between items-center px-[clamp(16px,2vw,28px)] h-[52px] border-t border-line text-[14px] font-medium hover:bg-paper transition-colors">
            <span>View all products</span><span>→</span>
          </Link>
        </div>
      </header>

      {/* mobile menu */}
      <div
        id="mobile-menu"
        className="fixed inset-0 z-[300] bg-ink text-paper flex flex-col px-[clamp(20px,5vw,40px)] pt-[14px] pb-7 overflow-y-auto"
        style={{
          clipPath: menu ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          pointerEvents: menu ? "auto" : "none",
          visibility: menu ? "visible" : "hidden",
          transition: "clip-path .9s cubic-bezier(.76,0,.24,1), visibility 0s linear " + (menu ? "0s" : ".9s"),
        }}
        aria-hidden={!menu}
      >
        <div className="flex justify-between items-center h-11 flex-none">
          <Logo tone="light" />
          <button onClick={toggleMenu} aria-label="Close menu" className="group relative w-11 h-11 bg-transparent border-0 text-paper cursor-pointer p-0">
            <span className="absolute left-1/2 top-1/2 block h-[1.5px] w-[26px] -ml-[13px] bg-current rotate-45 transition-transform duration-500 ease-std group-hover:rotate-[135deg]" />
            <span className="absolute left-1/2 top-1/2 block h-[1.5px] w-[26px] -ml-[13px] bg-current -rotate-45 transition-transform duration-500 ease-std group-hover:rotate-[-135deg]" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 flex flex-col justify-center py-6">
          {navLinks.map((l, i) => (
            <div key={l.label} className="border-t border-paper/15 overflow-hidden">
              <Link href={l.href} className="flex items-baseline justify-between py-[10px]">
                <span
                  className="font-display font-medium text-[clamp(28px,5.5vw,29px)] tracking-[-0.03em] leading-none block"
                  style={{
                    transform: menu ? "none" : "translateY(110%)",
                    transition: "transform .9s cubic-bezier(.22,1,.36,1)",
                    transitionDelay: menu ? `${300 + i * 55}ms` : "0ms",
                    opacity: isActive(l.href) ? 0.55 : 1,
                  }}
                >
                  {l.label}
                </span>
              </Link>
              {"children" in l ? (
                <div className="flex flex-wrap gap-x-5 gap-y-1 pb-3">
                  {l.children.map((c) => <Link key={c.href} href={c.href} className="text-[14px] opacity-70 hover:opacity-100 py-1">{c.label}</Link>)}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
