"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { Button, cx } from "./ui";

export interface FilterDef { key: string; label: string; options: string[] }

/** Search + select filters + removable chips + Reset. Collapses behind a toggle on mobile. */
export default function FilterBar({ q, onQ, filters, values, onChange, onReset, placeholder }: { q: string; onQ: (v: string) => void; filters: FilterDef[]; values: Record<string, string>; onChange: (key: string, v: string) => void; onReset: () => void; placeholder: string }) {
  const [text, setText] = useState(q);
  const [open, setOpen] = useState(false);
  useEffect(() => setText(q), [q]);
  useEffect(() => { if (text === q) return; const t = setTimeout(() => onQ(text), 250); return () => clearTimeout(t); }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
  const active = filters.filter((f) => values[f.key]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-[200px] flex-1 sm:max-w-sm">
          <span className="sr-only">Search</span>
          <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-a-mute" />
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} className="h-9 w-full rounded-lg border border-a-line bg-a-surface pl-9 pr-3 text-[13px] text-a-fg outline-none focus:border-a-accent" />
        </label>
        <Button className="sm:hidden" icon="filter" onClick={() => setOpen((o) => !o)} aria-expanded={open}>Filters{active.length ? ` (${active.length})` : ""}</Button>
        <div className={cx("flex-wrap items-center gap-2", open ? "flex w-full" : "hidden", "sm:flex sm:w-auto")}>
          {filters.map((f) => (
            <label key={f.key} className="relative">
              <span className="sr-only">{f.label}</span>
              <select value={values[f.key] ?? ""} onChange={(e) => onChange(f.key, e.target.value)} className={cx("h-9 appearance-none rounded-lg border bg-a-surface pl-3 pr-8 text-[13px] outline-none focus:border-a-accent", values[f.key] ? "border-a-accent text-a-fg" : "border-a-line text-a-mute")}>
                <option value="">{f.label}: all</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <Icon name="down" size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-a-mute" />
            </label>
          ))}
        </div>
      </div>
      {(active.length > 0 || q) && (
        <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
          {q && <Chip label={`Search: ${q}`} onRemove={() => onQ("")} />}
          {active.map((f) => <Chip key={f.key} label={`${f.label}: ${values[f.key]}`} onRemove={() => onChange(f.key, "")} />)}
          <button onClick={onReset} className="text-[12.5px] font-semibold text-a-accent-text hover:underline">Reset</button>
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-a-line bg-a-surface2 py-0.5 pl-2.5 pr-1 text-[12px] text-a-fg">{label}<button onClick={onRemove} aria-label={`Remove ${label}`} className="grid h-5 w-5 place-items-center rounded-full text-a-mute hover:bg-a-line hover:text-a-fg"><Icon name="x" size={11} strokeWidth={2.4} /></button></span>;
}
