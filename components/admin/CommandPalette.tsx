"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAdmin } from "@/lib/admin/context";
import { records, customerRows } from "@/lib/admin/seed";
import { WORKSPACE_LIST } from "@/lib/admin/config";
import Icon, { type IconName } from "./Icon";

interface Cmd { id: string; label: string; hint: string; icon: IconName; run: () => void }

export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, workspace, setWorkspace, toggleTheme, toast } = useAdmin();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const close = () => { setPaletteOpen(false); setQ(""); setSel(0); };
  const go = (href: string) => () => { router.push(href); close(); };

  const base = useMemo<Cmd[]>(() => [
    ...workspace.nav.flatMap((g) => g.items.map((i) => ({ id: i.href, label: i.label, hint: `Go to · ${g.label}`, icon: i.icon, run: go(i.href) }))),
    { id: "new", label: `New ${workspace.primary.singular}`, hint: "Quick action", icon: "plus" as IconName, run: () => { close(); toast(`Creating a ${workspace.primary.singular} arrives in the next phase`); } },
    { id: "theme", label: "Toggle dark mode", hint: "Quick action", icon: "moon" as IconName, run: () => { toggleTheme(); close(); } },
    ...WORKSPACE_LIST.filter((w) => w.slug !== workspace.slug).map((w) => ({ id: "ws" + w.slug, label: `Switch to ${w.name}`, hint: "Workspace", icon: w.icon, run: () => { setWorkspace(w.slug); close(); } })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [workspace]);

  const results = useMemo<Cmd[]>(() => {
    const s = q.trim().toLowerCase();
    if (!s) return base.slice(0, 9);
    const nav = base.filter((c) => c.label.toLowerCase().includes(s));
    const rec = paletteOpen ? records(workspace.slug).filter((r) => r.ref.toLowerCase().includes(s) || r.customer.toLowerCase().includes(s)).slice(0, 4).map<Cmd>((r) => ({ id: r.id, label: `${r.ref} · ${r.customer}`, hint: workspace.primary.title, icon: "receipt", run: go(`/admin/${workspace.primary.path}?q=${encodeURIComponent(r.ref)}`) })) : [];
    const cus = paletteOpen ? customerRows(workspace.slug).filter((c) => c.name.toLowerCase().includes(s) || c.code.toLowerCase().includes(s)).slice(0, 3).map<Cmd>((c) => ({ id: c.id, label: `${c.name} · ${c.code}`, hint: workspace.customers.title, icon: "user", run: go(`/admin/${workspace.customers.path}?q=${encodeURIComponent(c.name)}`) })) : [];
    return [...nav, ...rec, ...cus].slice(0, 10);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, base, paletteOpen, workspace]);

  useEffect(() => { if (paletteOpen) setTimeout(() => input.current?.focus(), 20); }, [paletteOpen]);
  useEffect(() => setSel(0), [q]);
  if (!paletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/55 p-3 pt-[max(12px,env(safe-area-inset-top))] backdrop-blur-[2px] sm:p-6 sm:pt-[10vh]" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="a-pop flex max-h-[calc(100dvh-24px)] w-full max-w-[600px] flex-col overflow-hidden rounded-2xl border border-a-line bg-a-surface shadow-2xl sm:max-h-[min(560px,calc(100dvh-20vh))]"
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
          if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
          if (e.key === "Enter") results[sel]?.run();
        }}>
        <div className="flex flex-none items-center gap-3 border-b border-a-line px-4">
          <Icon name="search" size={18} className="flex-none text-a-mute" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages, orders, customers…" aria-label="Search" autoComplete="off" spellCheck={false}
            className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-a-fg placeholder:text-a-mute !outline-none !ring-0 focus:!outline-none focus-visible:!outline-none" />
          <button onClick={close} aria-label="Close search" className="grid h-8 flex-none place-items-center rounded-md border border-a-line px-2 text-[11px] font-semibold text-a-mute hover:text-a-fg"><span className="sm:hidden"><Icon name="x" size={14} /></span><span className="hidden sm:inline">esc</span></button>
        </div>
        <ul role="listbox" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
          {results.length === 0 && <li className="px-4 py-10 text-center text-[13px] text-a-mute">No matches for “{q}”</li>}
          {results.map((r, i) => (
            <li key={r.id + i} role="option" aria-selected={i === sel} ref={(el) => { if (el && i === sel) el.scrollIntoView({ block: "nearest" }); }}>
              <button onMouseEnter={() => setSel(i)} onClick={r.run} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${i === sel ? "bg-a-surface2" : ""}`}>
                <span className={`grid h-8 w-8 flex-none place-items-center rounded-lg ${i === sel ? "bg-a-accent/15 text-a-accent-text" : "bg-a-surface2 text-a-mute"}`}><Icon name={r.icon} size={16} /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-[14px] font-medium text-a-fg">{r.label}</span><span className="block truncate text-[11.5px] text-a-mute sm:hidden">{r.hint}</span></span>
                <span className="hidden flex-none text-[11.5px] text-a-mute sm:block">{r.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="hidden flex-none items-center gap-4 border-t border-a-line px-4 py-2 text-[11.5px] text-a-mute sm:flex">
          <span><kbd className="rounded border border-a-line px-1">↑</kbd> <kbd className="rounded border border-a-line px-1">↓</kbd> navigate</span>
          <span><kbd className="rounded border border-a-line px-1">↵</kbd> open</span>
          <span className="ml-auto">{results.length} result{results.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    </div>
  );
}
