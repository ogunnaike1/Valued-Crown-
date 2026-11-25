"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "@/lib/admin/context";
import { ops } from "@/lib/admin/seed";
import LogoMark from "@/components/LogoMark";
import Icon from "./Icon";
import { cx } from "./ui";

export default function Sidebar({ drawer, closeDrawer }: { drawer: boolean; closeDrawer: () => void }) {
  const { workspace, collapsed, setCollapsed, pinned, togglePin, branch, ready } = useAdmin();
  const pathname = usePathname();
  const [shut, setShut] = useState<Record<string, boolean>>({});

  useEffect(() => { closeDrawer(); /* close the mobile drawer on navigation */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const badges = useMemo(() => {
    if (!ready) return { alerts: 0, pending: 0 };
    const o = ops(workspace.slug, branch?.id ?? "all");
    return { alerts: o.attention.length, pending: Number(o.tiles[1]?.value.replace(/\D/g, "")) || 0 };
  }, [workspace.slug, branch, ready]);

  const all = workspace.nav.flatMap((g) => g.items);
  const pins = all.filter((i) => pinned.includes(i.href));
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/"));
  const slim = collapsed && !drawer;

  const Item = ({ item }: { item: (typeof all)[number] }) => {
    const n = item.badge ? badges[item.badge] : 0;
    const on = isActive(item.href);
    return (
      <li className="group relative">
        <Link href={item.href} title={slim ? item.label : undefined} aria-current={on ? "page" : undefined}
          className={cx("flex h-9 items-center gap-3 rounded-lg px-3 text-[13.5px] transition-colors", on ? "bg-a-accent/12 text-a-fg" : "text-a-mute hover:bg-a-surface2 hover:text-a-fg", slim && "justify-center px-0")}>
          <Icon name={item.icon} size={18} className={on ? "text-a-accent-text" : ""} />
          {!slim && <span className="truncate">{item.label}</span>}
          {!slim && n > 0 && <span className="ml-auto rounded-full bg-a-accent px-1.5 text-[10.5px] font-bold leading-[18px] text-a-accent-fg tabular-nums">{n}</span>}
        </Link>
        {!slim && (
          <button onClick={() => togglePin(item.href)} aria-label={pinned.includes(item.href) ? `Unpin ${item.label}` : `Pin ${item.label}`} aria-pressed={pinned.includes(item.href)}
            className={cx("absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-md text-a-mute hover:bg-a-surface hover:text-a-fg", pinned.includes(item.href) ? "opacity-100 text-a-accent-text" : "opacity-0 focus-visible:opacity-100 group-hover:opacity-100", item.badge && badges[item.badge] > 0 && "right-9")}>
            <Icon name="pin" size={13} />
          </button>
        )}
      </li>
    );
  };

  return (
    <>
      {drawer && <button aria-label="Close menu" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={closeDrawer} />}
      <aside aria-label="Primary" className={cx("fixed inset-y-0 left-0 z-50 flex flex-col border-r border-a-line bg-a-surface transition-[transform,width] duration-200", collapsed ? "lg:w-[68px]" : "lg:w-[256px]", "w-[272px]", drawer ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className={cx("flex h-16 flex-none items-center gap-2.5 border-b border-a-line px-4", slim && "justify-center px-0")}>
          <span className="block h-7 w-10 flex-none text-a-fg"><LogoMark className="h-full w-full" /></span>
          {!slim && <div className="min-w-0 leading-tight"><div className="font-display text-[15px] text-a-fg">Valued Crown</div><div className="text-[11px] text-a-mute">Back office</div></div>}
          {!slim && <button onClick={() => (drawer ? closeDrawer() : setCollapsed(true))} aria-label="Collapse sidebar" className="ml-auto hidden h-8 w-8 place-items-center rounded-lg text-a-mute hover:bg-a-surface2 lg:grid"><Icon name="left" size={16} /></button>}
          {!slim && <button onClick={closeDrawer} aria-label="Close menu" className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-a-mute hover:bg-a-surface2 lg:hidden"><Icon name="x" size={16} /></button>}
        </div>
        {slim && <button onClick={() => setCollapsed(false)} aria-label="Expand sidebar" className="mx-auto mt-2 hidden h-8 w-8 place-items-center rounded-lg text-a-mute hover:bg-a-surface2 lg:grid"><Icon name="right" size={16} /></button>}

        <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Back office">
          {pins.length > 0 && (
            <div className="mb-3">
              {!slim && <div className="px-3 pb-1 text-[10.5px] font-bold uppercase tracking-[.09em] text-a-mute">Pinned</div>}
              <ul className="space-y-0.5">{pins.map((i) => <Item key={"p" + i.href} item={i} />)}</ul>
            </div>
          )}
          {workspace.nav.map((g) => (
            <div key={g.label} className="mb-3">
              {!slim && (
                <button onClick={() => setShut((s) => ({ ...s, [g.label]: !s[g.label] }))} aria-expanded={!shut[g.label]} className="flex w-full items-center justify-between px-3 pb-1 text-[10.5px] font-bold uppercase tracking-[.09em] text-a-mute hover:text-a-fg">
                  {g.label}<Icon name={shut[g.label] ? "right" : "down"} size={12} />
                </button>
              )}
              {(slim || !shut[g.label]) && <ul className="space-y-0.5">{g.items.map((i) => <Item key={i.href} item={i} />)}</ul>}
              {slim && <div className="mx-3 my-2 border-t border-a-line" />}
            </div>
          ))}
        </nav>

        <div className={cx("flex flex-none items-center gap-2 border-t border-a-line px-4 py-3 text-[11.5px] text-a-mute", slim && "justify-center px-0")}>
          <span className="a-live h-2 w-2 rounded-full bg-[rgb(var(--t-green))]" />{!slim && <><span>All systems online</span><span className="ml-auto tabular-nums">v0.1</span></>}
        </div>
      </aside>
    </>
  );
}
