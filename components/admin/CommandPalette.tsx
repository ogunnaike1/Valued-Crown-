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
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/50 px-4 pt-[12vh]" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="a-pop w-full max-w-[560px] overflow-hidden rounded-2xl border border-a-line bg-a-surface shadow-2xl"
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
          if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
          if (e.key === "Enter") results[sel]?.run();
        }}>
        <div className="flex items-center gap-3 border-b border-a-line px-4">
          <Icon name="search" className="text-a-mute" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${workspace.primary.title.toLowerCase()}, ${workspace.customers.title.toLowerCase()}, pages…`} aria-label="Search" className="h-14 flex-1 bg-transparent text-[15px] text-a-fg outline-none" />
          <kbd className="rounded border border-a-line px-1.5 text-[10.5px] text-a-mute">esc</kbd>
        </div>
        <ul role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-4 py-8 text-center text-[13px] text-a-mute">No matches for “{q}”</li>}
          {results.map((r, i) => (
            <li key={r.id + i} role="option" aria-selected={i === sel}>
              <button onMouseEnter={() => setSel(i)} onClick={r.run} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] ${i === sel ? "bg-a-surface2" : ""}`}>
                <Icon name={r.icon} size={16} className="text-a-mute" /><span className="truncate text-a-fg">{r.label}</span><span className="ml-auto flex-none text-[11.5px] text-a-mute">{r.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
