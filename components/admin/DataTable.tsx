"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Icon from "./Icon";
import Menu, { MenuItem } from "./Menu";
import FilterBar, { type FilterDef } from "./FilterBar";
import { Button, EmptyState, Skeleton, cx } from "./ui";
import { useAdmin } from "@/lib/admin/context";

export interface Column<T> { key: string; header: string; sortable?: boolean; align?: "right"; render: (r: T) => ReactNode; csv: (r: T) => string | number; hidden?: boolean }
export interface Query { q: string; filters: Record<string, string>; sort: string; dir: "asc" | "desc"; page: number; size: number }
export interface Result<T> { rows: T[]; total: number }

const SIZES = [10, 25, 50, 100];

/**
 * Shared list-page table. `fetchRows` is the server contract: it receives the full query (search, filters,
 * sort, page, size) and returns one page plus the total. Today it is backed by demo data; point it at an API.
 */
export default function DataTable<T>({ id, columns, fetchRows, filters, rowId, drawerTitle, drawer, placeholder, emptyTitle, emptyAction, exportName, deps }: {
  id: string; columns: Column<T>[]; fetchRows: (q: Query) => Result<T>; filters: FilterDef[]; rowId: (r: T) => string;
  drawerTitle: (r: T) => string; drawer: (r: T) => ReactNode; placeholder: string; emptyTitle: string; emptyAction?: ReactNode; exportName: string; deps: unknown[];
}) {
  const router = useRouter(); const pathname = usePathname(); const sp = useSearchParams();
  const { toast } = useAdmin();
  const [dense, setDense] = useState(false);
  const [hiddenCols, setHiddenCols] = useState<string[]>(columns.filter((c) => c.hidden).map((c) => c.key));
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<T | null>(null);
  const [data, setData] = useState<Result<T> | null>(null);
  const [views, setViews] = useState<{ name: string; qs: string }[]>([]);

  const query = useMemo<Query>(() => ({
    q: sp.get("q") ?? "", sort: sp.get("sort") ?? "", dir: sp.get("dir") === "asc" ? "asc" : "desc",
    page: Math.max(1, Number(sp.get("page")) || 1), size: SIZES.includes(Number(sp.get("size"))) ? Number(sp.get("size")) : 10,
    filters: Object.fromEntries(filters.map((f) => [f.key, sp.get(f.key) ?? ""])),
  }), [sp, filters]);

  const set = useCallback((patch: Record<string, string | number | null>, keepPage = false) => {
    const n = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v === null || v === "" ? n.delete(k) : n.set(k, String(v))));
    if (!keepPage) n.delete("page");
    router.replace(`${pathname}${n.toString() ? "?" + n : ""}`, { scroll: false });
  }, [sp, router, pathname]);

  const qs = sp.toString();
  useEffect(() => {
    setData(null);
    const t = setTimeout(() => setData(fetchRows(query)), 160); // simulated round-trip so skeletons are exercised
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs, ...deps]);
  useEffect(() => setSelected([]), [qs]);
  useEffect(() => { try { setViews(JSON.parse(localStorage.getItem("vc-views-" + id) || "[]")); } catch { setViews([]); } }, [id]);

  const cols = columns.filter((c) => !hiddenCols.includes(c.key));
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / query.size));
  const rows = data?.rows ?? [];
  const allOn = rows.length > 0 && rows.every((r) => selected.includes(rowId(r)));

  const exportCsv = (only?: T[]) => {
    const list = only ?? fetchRows({ ...query, page: 1, size: 1_000_000 }).rows;
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [columns.map((c) => esc(c.header)).join(","), ...list.map((r) => columns.map((c) => esc(c.csv(r))).join(","))].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = `${exportName}.csv`; a.click(); URL.revokeObjectURL(a.href);
    toast(`Exported ${list.length} rows`);
  };
  const saveView = () => {
    const name = window.prompt("Name this view"); if (!name) return;
    const n = [...views.filter((v) => v.name !== name), { name, qs }]; setViews(n);
    try { localStorage.setItem("vc-views-" + id, JSON.stringify(n)); } catch { /* ignore */ }
    toast(`Saved view “${name}”`);
  };
  const sortBy = (k: string) => set(query.sort === k ? { dir: query.dir === "asc" ? "desc" : "asc" } : { sort: k, dir: "asc" }, true);

  return (
    <div className="space-y-3">
      <FilterBar q={query.q} onQ={(v) => set({ q: v })} filters={filters} values={query.filters} onChange={(k, v) => set({ [k]: v })} onReset={() => router.replace(pathname, { scroll: false })} placeholder={placeholder} />

      <div className="overflow-hidden rounded-2xl border border-a-line bg-a-surface">
        <div className="flex flex-wrap items-center gap-2 border-b border-a-line px-4 py-2.5">
          {selected.length > 0 ? (
            <>
              <span className="text-[13px] font-semibold text-a-fg">{selected.length} selected</span>
              <Button size="sm" icon="download" onClick={() => exportCsv(rows.filter((r) => selected.includes(rowId(r))))}>Export selected</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
            </>
          ) : <span className="text-[13px] text-a-mute" aria-live="polite">{data ? `${total.toLocaleString("en-NG")} result${total === 1 ? "" : "s"}` : "Loading…"}</span>}
          <div className="ml-auto flex items-center gap-1.5">
            <Menu label="Saved views" align="right" width={230} button={() => <span className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-semibold text-a-mute hover:bg-a-surface2 hover:text-a-fg"><Icon name="star" size={14} />Views</span>}>
              {(close) => (<>
                {views.length === 0 && <p className="px-3 py-2 text-[12.5px] text-a-mute">No saved views yet.</p>}
                {views.map((v) => <MenuItem key={v.name} onClick={() => { router.replace(`${pathname}${v.qs ? "?" + v.qs : ""}`); close(); }}>{v.name}</MenuItem>)}
                <div className="my-1 border-t border-a-line" />
                <MenuItem onClick={() => { close(); saveView(); }}><Icon name="plus" size={14} />Save current view</MenuItem>
              </>)}
            </Menu>
            <Menu label="Columns" align="right" width={210} button={() => <span className="flex h-8 w-8 items-center justify-center rounded-lg text-a-mute hover:bg-a-surface2 hover:text-a-fg"><Icon name="columns" size={16} /></span>}>
              {() => columns.map((c) => (
                <label key={c.key} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-a-fg hover:bg-a-surface2">
                  <input type="checkbox" checked={!hiddenCols.includes(c.key)} onChange={() => setHiddenCols((h) => (h.includes(c.key) ? h.filter((x) => x !== c.key) : [...h, c.key]))} className="accent-[rgb(var(--a-accent))]" />{c.header}
                </label>
              ))}
            </Menu>
            <button onClick={() => setDense((d) => !d)} aria-pressed={dense} aria-label="Toggle compact rows" className={cx("grid h-8 w-8 place-items-center rounded-lg hover:bg-a-surface2", dense ? "text-a-accent-text" : "text-a-mute")}><Icon name="list" size={16} /></button>
            <Button size="sm" icon="download" onClick={() => exportCsv()}>CSV</Button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden max-h-[640px] overflow-auto md:block">
          <table className="w-full border-separate border-spacing-0 text-[13px]">
            <caption className="sr-only">{exportName}</caption>
            <thead className="sticky top-0 z-10 bg-a-surface">
              <tr>
                <th className="w-10 border-b border-a-line px-4 py-2.5"><input type="checkbox" aria-label="Select all rows on this page" checked={allOn} onChange={() => setSelected(allOn ? [] : rows.map(rowId))} className="accent-[rgb(var(--a-accent))]" /></th>
                {cols.map((c) => (
                  <th key={c.key} scope="col" aria-sort={query.sort === c.key ? (query.dir === "asc" ? "ascending" : "descending") : undefined} className={cx("whitespace-nowrap border-b border-a-line px-3 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-a-mute", c.align === "right" ? "text-right" : "text-left")}>
                    {c.sortable ? <button onClick={() => sortBy(c.key)} className="inline-flex items-center gap-1 uppercase hover:text-a-fg">{c.header}<Icon name={query.sort === c.key ? (query.dir === "asc" ? "arrowUp" : "arrowDown") : "sort"} size={12} className={query.sort === c.key ? "text-a-accent-text" : "opacity-50"} /></button> : c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!data && Array.from({ length: 6 }, (_, i) => <tr key={i}><td colSpan={cols.length + 1} className="border-b border-a-line px-4 py-3"><Skeleton className="h-5 w-full" /></td></tr>)}
              {data && rows.map((r) => {
                const rid = rowId(r);
                return (
                  <tr key={rid} onClick={() => setOpen(r)} className={cx("cursor-pointer hover:bg-a-surface2", selected.includes(rid) && "bg-a-accent/5")}>
                    <td className="border-b border-a-line px-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" aria-label={`Select ${rid}`} checked={selected.includes(rid)} onChange={() => setSelected((s) => (s.includes(rid) ? s.filter((x) => x !== rid) : [...s, rid]))} className="accent-[rgb(var(--a-accent))]" /></td>
                    {cols.map((c, i) => (
                      <td key={c.key} className={cx("border-b border-a-line px-3 tabular-nums text-a-fg", dense ? "py-1.5" : "py-3", c.align === "right" && "text-right")}>
                        {i === 0 ? <button onClick={(e) => { e.stopPropagation(); setOpen(r); }} className="font-semibold hover:text-a-accent-text hover:underline">{c.render(r)}</button> : c.render(r)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ul className="divide-y divide-a-line md:hidden">
          {!data && Array.from({ length: 4 }, (_, i) => <li key={i} className="p-4"><Skeleton className="h-16 w-full" /></li>)}
          {data && rows.map((r) => (
            <li key={rowId(r)}>
              <button onClick={() => setOpen(r)} className="block w-full space-y-1.5 p-4 text-left">
                <div className="flex items-center justify-between gap-3 font-semibold text-a-fg">{cols[0]?.render(r)}<span className="tabular-nums">{cols[cols.length - 1]?.render(r)}</span></div>
                {cols.slice(1, 4).map((c) => <div key={c.key} className="flex items-center justify-between text-[12.5px]"><span className="text-a-mute">{c.header}</span><span className="text-a-fg tabular-nums">{c.render(r)}</span></div>)}
              </button>
            </li>
          ))}
        </ul>

        {data && rows.length === 0 && <EmptyState title={emptyTitle} action={emptyAction} />}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-a-line px-4 py-2.5 text-[12.5px] text-a-mute">
          <label className="flex items-center gap-2">Rows
            <select value={query.size} onChange={(e) => set({ size: e.target.value })} className="h-8 rounded-lg border border-a-line bg-a-surface px-2 text-a-fg">{SIZES.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <div className="flex items-center gap-2">
            <span className="tabular-nums">Page {Math.min(query.page, pages)} of {pages}</span>
            <Button size="sm" aria-label="Previous page" disabled={query.page <= 1} onClick={() => set({ page: query.page - 1 }, true)}><Icon name="left" size={14} /></Button>
            <Button size="sm" aria-label="Next page" disabled={query.page >= pages} onClick={() => set({ page: query.page + 1 }, true)}><Icon name="right" size={14} /></Button>
          </div>
        </div>
      </div>

      {open && <Drawer title={drawerTitle(open)} onClose={() => setOpen(null)}>{drawer(open)}</Drawer>}
    </div>
  );
}

function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/40" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside role="dialog" aria-modal="true" aria-label={title} className="a-pop flex h-full w-full max-w-[420px] flex-col border-l border-a-line bg-a-surface shadow-2xl">
        <header className="flex items-center justify-between border-b border-a-line px-5 py-4"><h2 className="font-display text-[16px] text-a-fg">{title}</h2><button autoFocus onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-a-mute hover:bg-a-surface2"><Icon name="x" size={16} /></button></header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
