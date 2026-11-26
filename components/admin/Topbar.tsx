"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAdmin, DEMO_USER } from "@/lib/admin/context";
import { BRANCHES } from "@/lib/admin/config";
import { ops } from "@/lib/admin/seed";
import Icon from "./Icon";
import Menu, { MenuItem } from "./Menu";

export default function Topbar({ openDrawer }: { openDrawer: () => void }) {
  const { workspace, owned, setWorkspace, branch, setBranch, theme, toggleTheme, setPaletteOpen, ready, toast } = useAdmin();
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    for (const g of workspace.nav) { const it = g.items.find((i) => i.href === pathname); if (it) return [g.label, it.label]; }
    const seg = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
    return seg.map((s) => s.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()));
  }, [workspace, pathname]);

  const alerts = useMemo(() => (ready ? ops(workspace.slug, branch?.id ?? "all").attention : []), [ready, workspace.slug, branch]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-1.5 border-b border-a-line bg-a-bg/85 px-3 backdrop-blur sm:gap-3 sm:px-6">
      <button onClick={openDrawer} aria-label="Open menu" className="grid h-9 w-9 flex-none place-items-center rounded-lg text-a-fg hover:bg-a-surface2 lg:hidden"><Icon name="menu" /></button>

      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-[13px] text-a-mute md:flex">
        <Link href="/admin" className="hover:text-a-fg">Back office</Link>
        {crumbs.map((c, i) => <span key={i} className="flex items-center gap-1.5"><Icon name="right" size={12} /><span className={i === crumbs.length - 1 ? "font-semibold text-a-fg" : ""}>{c}</span></span>)}
      </nav>

      <button onClick={() => setPaletteOpen(true)} className="ml-auto flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-a-line bg-a-surface px-3 text-[13px] text-a-mute hover:border-a-mute/50 max-[420px]:w-9 max-[420px]:flex-none max-[420px]:justify-center max-[420px]:px-0 sm:max-w-[340px] md:flex-none md:w-[300px]" aria-label="Search and jump to">
        <Icon name="search" size={16} /><span className="truncate max-[420px]:hidden">Search or jump to…</span>
        <kbd className="ml-auto hidden rounded border border-a-line px-1.5 text-[10.5px] font-semibold sm:block">⌘K</kbd>
      </button>

      <Menu sheet label="Switch product workspace" width={280} button={() => (
        <span className="flex h-9 items-center gap-2 rounded-lg border border-a-line bg-a-surface px-2.5 text-[13px] text-a-fg hover:bg-a-surface2">
          <Icon name={workspace.icon} size={16} className="text-a-accent-text" /><span className="hidden max-w-[130px] truncate font-semibold xl:block">{workspace.name}</span><Icon name="down" size={14} className="text-a-mute" />
        </span>)}>
        {(close) => (<>
          <div className="px-3 pb-1 pt-1.5 text-[10.5px] font-bold uppercase tracking-[.09em] text-a-mute">Your products</div>
          {owned.map((w) => <MenuItem key={w.slug} active={w.slug === workspace.slug} onClick={() => { setWorkspace(w.slug); close(); toast(`Switched to ${w.name}`); }}><Icon name={w.icon} size={16} />{w.name}{w.slug === workspace.slug && <Icon name="check" size={14} className="ml-auto" />}</MenuItem>)}
        </>)}
      </Menu>

      <Menu sheet label="Switch branch" width={240} button={() => (
        <span className="flex h-9 items-center gap-2 rounded-lg border border-a-line bg-a-surface px-2.5 text-[13px] hover:bg-a-surface2">
          <Icon name="map" size={16} className="text-a-mute" /><span className="hidden max-w-[120px] truncate text-a-fg lg:block"><span className="text-a-mute">Branch · </span>{branch ? branch.name.replace(" Branch", "") : "All"}</span><Icon name="down" size={14} className="text-a-mute" />
        </span>)}>
        {(close) => (<>
          <MenuItem active={!branch} onClick={() => { setBranch("all"); close(); }}>All branches</MenuItem>
          {BRANCHES.map((b) => <MenuItem key={b.id} active={branch?.id === b.id} onClick={() => { setBranch(b.id); close(); }}>{b.name}<span className="ml-auto text-[11.5px] text-a-mute">{b.city}</span></MenuItem>)}
        </>)}
      </Menu>

      <Link href="/admin/reports" aria-label="Reports" className="hidden h-9 w-9 place-items-center rounded-lg text-a-mute hover:bg-a-surface2 hover:text-a-fg sm:grid"><Icon name="chart" /></Link>

      <Menu sheet label="Notifications" align="right" width={330} button={() => (
        <span className="relative grid h-9 w-9 place-items-center rounded-lg text-a-mute hover:bg-a-surface2 hover:text-a-fg"><Icon name="bell" />{alerts.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-a-accent ring-2 ring-a-bg" />}</span>)}>
        {() => (<>
          <div className="px-3 pb-1 pt-1.5 text-[12px] font-bold text-a-fg">Notifications</div>
          {alerts.length === 0 && <p className="px-3 py-4 text-[13px] text-a-mute">You&apos;re all caught up.</p>}
          {alerts.map((a) => <div key={a.name} className="rounded-lg px-3 py-2 hover:bg-a-surface2"><div className="flex items-center justify-between gap-2 text-[13px] font-semibold text-a-fg"><span className="truncate">{a.name}</span><span className={a.sev === "red" ? "text-[rgb(var(--t-red))]" : "text-[rgb(var(--t-amber))]"}>{a.value}</span></div><div className="text-[12px] text-a-mute">{a.detail}</div></div>)}
        </>)}
      </Menu>

      <button onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="grid h-9 w-9 place-items-center rounded-lg text-a-mute hover:bg-a-surface2 hover:text-a-fg"><Icon name={theme === "dark" ? "sun" : "moon"} /></button>

      <Menu sheet label="Account" align="right" width={250} button={() => (
        <span className="flex items-center gap-2 rounded-lg p-0.5 pr-1.5 hover:bg-a-surface2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-a-accent text-[12px] font-bold text-a-accent-fg">{DEMO_USER.initials}</span>
          <span className="hidden text-left leading-tight xl:block"><span className="block text-[12.5px] font-semibold text-a-fg">{DEMO_USER.name.split(" ")[0]}</span><span className="block text-[11px] text-a-mute">{DEMO_USER.role}</span></span>
        </span>)}>
        {(close) => (<>
          <div className="border-b border-a-line px-3 pb-2 pt-1.5"><div className="text-[13px] font-semibold text-a-fg">{DEMO_USER.name}</div><div className="text-[12px] text-a-mute">{DEMO_USER.email}</div></div>
          <MenuItem onClick={() => { close(); toast("Profile editing arrives with authentication"); }}><Icon name="user" size={16} />Profile</MenuItem>
          <MenuItem onClick={() => { toggleTheme(); close(); }}><Icon name={theme === "dark" ? "sun" : "moon"} size={16} />{theme === "dark" ? "Light" : "Dark"} theme</MenuItem>
          <MenuItem onClick={() => { window.location.href = "/"; }} danger><Icon name="logout" size={16} />Leave back office</MenuItem>
        </>)}
      </Menu>
    </header>
  );
}
