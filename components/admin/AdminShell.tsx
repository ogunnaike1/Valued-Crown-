"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AdminProvider, useAdmin } from "@/lib/admin/context";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";
import { Skeleton } from "./ui";
import Icon from "./Icon";

function Toasts() {
  const { toasts } = useAdmin();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="a-pop pointer-events-auto flex items-center gap-2 rounded-xl border border-a-line bg-a-surface px-4 py-3 text-[13px] text-a-fg shadow-lg">
          <Icon name={t.tone === "ok" ? "check" : "alert"} size={16} className={t.tone === "ok" ? "text-[rgb(var(--t-green))]" : "text-[rgb(var(--t-red))]"} />{t.msg}
        </div>
      ))}
    </div>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { theme, ready, collapsed, setPaletteOpen } = useAdmin();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(true); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPaletteOpen]);

  return (
    <div className="admin-root min-h-screen overflow-x-clip" data-admin-theme={theme}>
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-a-accent focus:px-3 focus:py-2 focus:text-a-accent-fg">Skip to content</a>
      <Sidebar drawer={drawer} closeDrawer={() => setDrawer(false)} />
      <div className={`min-w-0 transition-[padding] duration-200 ${collapsed ? "lg:pl-[68px]" : "lg:pl-[256px]"}`}>
        <Topbar openDrawer={() => setDrawer(true)} />
        <main id="admin-main" className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-6 sm:px-6">
          {ready ? children : <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>}
          <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 text-[12px] text-a-mute">
            <span>Demo data · connect your database to go live</span>
            <a className="hover:text-a-fg" href="/contact">Documentation &amp; support</a>
          </footer>
        </main>
      </div>
      <CommandPalette />
      <Toasts />
    </div>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  return <AdminProvider><Frame>{children}</Frame></AdminProvider>;
}
