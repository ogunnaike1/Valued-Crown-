"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/lib/admin/context";
import { daily, sum } from "@/lib/admin/seed";
import { pageRows, pageSpec, type PageRow } from "@/lib/admin/pages";
import { compactNaira, dateShort, naira } from "@/lib/admin/format";
import DataTable, { type Column, type Query } from "./DataTable";
import { Badge, Button, Card, KpiCard, PageHeader, cx } from "./ui";
import Icon from "./Icon";

function paginate(all: PageRow[], q: Query, searchKeys: string[], filterKeys: string[]) {
  let list = all;
  if (q.q) { const s = q.q.toLowerCase(); list = list.filter((r) => searchKeys.some((k) => String(r[k]).toLowerCase().includes(s))); }
  for (const [k, v] of Object.entries(q.filters)) if (v && filterKeys.includes(k)) list = list.filter((r) => String(r[k]) === v);
  if (q.sort) { const k = q.sort; list = [...list].sort((a, b) => { const x = a[k], y = b[k]; return (x < y ? -1 : x > y ? 1 : 0) * (q.dir === "asc" ? 1 : -1); }); }
  return { rows: list.slice((q.page - 1) * q.size, q.page * q.size), total: list.length };
}

/** Any list page without a bespoke screen: KPIs, search, filters, sortable table, detail drawer and CSV export. */
export function GenericList({ path }: { path: string }) {
  const { workspace: w, branch, toast } = useAdmin();
  const spec = useMemo(() => pageSpec(w.slug, path), [w.slug, path]);
  const all = useMemo(() => pageRows(w.slug, path).filter((r) => !branch || !r.branchId || r.branchId === branch.id), [w.slug, path, branch]);

  const statusCol = spec.cols.find((c) => c.kind === "status");
  const moneyCol = spec.cols.find((c) => c.kind === "money");
  const textKeys = spec.cols.filter((c) => ["id", "person", "name", "choice", "email", "seq", "branch"].includes(c.kind)).map((c) => c.k);
  const filterCols = spec.cols.filter((c) => c.kind === "status" || (c.kind === "choice" && (c.opts?.length ?? 0) <= 8) || c.kind === "branch");
  const filterKeys = filterCols.map((c) => c.k);
  const sortableKinds = ["id", "person", "name", "date", "future", "money", "int", "status", "choice", "seq", "email", "branch"];

  const render = (c: (typeof spec.cols)[number], r: PageRow) => {
    const v = r[c.k];
    switch (c.kind) {
      case "status": return <Badge>{String(v)}</Badge>;
      case "money": return naira(Number(v));
      case "date": case "future": return dateShort(new Date(String(v)));
      case "int": return Number(v).toLocaleString("en-NG");
      default: return String(v);
    }
  };
  const columns: Column<PageRow>[] = spec.cols.map((c) => ({
    key: c.k, header: c.h, sortable: sortableKinds.includes(c.kind), align: c.kind === "money" || c.kind === "int" ? "right" : undefined,
    render: (r) => render(c, r), csv: (r) => (c.kind === "date" || c.kind === "future" ? String(r[c.k]).slice(0, 10) : r[c.k]),
  }));

  const total = moneyCol ? all.reduce((a, r) => a + Number(r[moneyCol.k]), 0) : 0;
  const statuses = statusCol ? Array.from(new Set(statusCol.opts)) : [];
  const countOf = (s: string) => all.filter((r) => r[statusCol!.k] === s).length;
  const first = spec.cols[0];
  const label = (r: PageRow) => String(r[first.k]);

  return (
    <>
      <PageHeader title={spec.title} meta={`${w.name} · ${branch ? branch.name : "all branches"}`} actions={<Button variant="primary" icon="plus" onClick={() => toast(`Creating a ${spec.singular} arrives in the next phase`)}>New {spec.singular}</Button>} />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label={`Total ${spec.title.toLowerCase()}`} value={all.length.toLocaleString("en-NG")} />
        {statuses[0] && <KpiCard label={statuses[0]} value={String(countOf(statuses[0]))} href={`?${statusCol!.k}=${encodeURIComponent(statuses[0])}`} />}
        {statuses[1] && statuses[1] !== statuses[0] && <KpiCard label={statuses[1]} value={String(countOf(statuses[1]))} href={`?${statusCol!.k}=${encodeURIComponent(statuses[1])}`} />}
        {moneyCol ? <KpiCard label={`${moneyCol.h} (total)`} value={compactNaira(total)} /> : <KpiCard label="Branches" value={String(new Set(all.map((r) => r.branchId)).size || 1)} />}
      </div>
      <DataTable<PageRow>
        id={`${w.slug}-${path}`} exportName={`${w.slug}-${path}`} columns={columns} rowId={(r) => r._id} deps={[all]}
        placeholder={`Search ${spec.title.toLowerCase()}…`}
        filters={filterCols.map((c) => ({ key: c.k, label: c.h, options: Array.from(new Set(c.kind === "branch" ? all.map((r) => String(r[c.k])) : c.opts)) }))}
        fetchRows={(q) => paginate(all, q, textKeys, filterKeys)}
        emptyTitle={`No ${spec.title.toLowerCase()} match these filters.`}
        drawerTitle={label}
        drawer={(r) => (
          <>
            {statusCol && <div className="mb-3"><Badge>{String(r[statusCol.k])}</Badge></div>}
            {spec.cols.filter((c) => c !== statusCol).map((c) => (
              <div key={c.k} className="flex items-center justify-between gap-4 border-b border-a-line py-2.5 text-[13.5px]"><span className="text-a-mute">{c.h}</span><span className="text-right font-medium tabular-nums text-a-fg">{render(c, r)}</span></div>
            ))}
            <div className="mt-4 flex gap-2"><Button size="sm" onClick={() => toast(`Editing ${spec.singular}s arrives in the next phase`)}>Edit</Button><Button size="sm" variant="ghost" onClick={() => toast("Added to your activity log")}>Add note</Button></div>
          </>
        )}
      />
    </>
  );
}

/* ---------------------------------------------------------------- settings */

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={cx("relative h-6 w-11 flex-none rounded-full transition-colors", on ? "bg-a-accent" : "bg-a-line")}>
      <span className={cx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", on ? "translate-x-[22px]" : "translate-x-0.5")} />
    </button>
  );
}
const inputCls = "h-10 w-full rounded-lg border border-a-line bg-a-bg px-3 text-[14px] text-a-fg";

export function SettingsPage() {
  const { workspace: w, toast } = useAdmin();
  const [biz, setBiz] = useState({ name: "Valued Crown Demo Ltd", email: "hello@valuedcrown.ng", phone: "+234 800 000 0000", currency: "NGN (₦)", tz: "Africa/Lagos (WAT)", address: "Lagos, Nigeria" });
  const [toggles, setToggles] = useState<Record<string, boolean>>({ "Email receipts to customers": true, "SMS alerts for low stock": true, "Daily sales summary email": true, "Require manager approval for refunds": true, "Two-factor sign-in for admins": false, "Allow offline mode": true });
  return (
    <>
      <PageHeader title="Settings" meta={w.name} actions={<Button variant="primary" onClick={() => toast("Settings saved")}>Save changes</Button>} />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Business profile">
          <div className="grid gap-4 sm:grid-cols-2">
            {([["name", "Business name"], ["email", "Contact email"], ["phone", "Phone"], ["address", "Address"], ["currency", "Currency"], ["tz", "Time zone"]] as const).map(([k, l]) => (
              <label key={k} className="block text-[12.5px] font-medium text-a-mute">{l}<input value={biz[k]} onChange={(e) => setBiz({ ...biz, [k]: e.target.value })} className={cx(inputCls, "mt-1.5")} /></label>
            ))}
          </div>
        </Card>
        <Card title="Plan">
          <div className="space-y-2 text-[13.5px]"><div className="flex justify-between"><span className="text-a-mute">Product</span><span className="font-medium text-a-fg">{w.name}</span></div><div className="flex justify-between"><span className="text-a-mute">Plan</span><Badge tone="green">Professional</Badge></div><div className="flex justify-between"><span className="text-a-mute">Branches</span><span className="font-medium text-a-fg">3 of 5</span></div><div className="flex justify-between"><span className="text-a-mute">Renews</span><span className="font-medium text-a-fg">1 Jan 2027</span></div></div>
          <Button className="mt-4 w-full" onClick={() => toast("Plan changes are handled by our team. Contact support.")}>Manage plan</Button>
        </Card>
        <Card className="xl:col-span-3" title="Preferences" pad={false}>
          <ul className="divide-y divide-a-line">
            {Object.entries(toggles).map(([l, on]) => (
              <li key={l} className="flex items-center justify-between gap-4 px-5 py-3.5 text-[13.5px] text-a-fg"><span>{l}</span><Toggle on={on} label={l} onChange={(v) => { setToggles({ ...toggles, [l]: v }); toast(`${l}: ${v ? "on" : "off"}`); }} /></li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

/* ----------------------------------------------------------------- reports */

export function ReportsPage() {
  const { workspace: w, branch, now, toast } = useAdmin();
  const bid = branch?.id ?? "all";
  const days = useMemo(() => daily(w.slug, bid, now, 30), [w.slug, bid, now]);
  const s = sum(days);
  const download = (name: string, header: string[], rows: (string | number)[][]) => {
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = `${w.slug}-${name}.csv`; a.click(); URL.revokeObjectURL(a.href);
    toast(`${name} downloaded`);
  };
  const reports = [
    { t: "Daily sales", d: "Revenue, transactions and refunds for every day in the last 30 days.", ic: "chart" as const, run: () => download("daily-sales", ["Date", "Revenue", "Transactions", "Refunds"], days.map((d) => [d.date.toISOString().slice(0, 10), d.revenue, d.txns, d.refunds])) },
    { t: "Profit & margin", d: "Revenue against cost of sales with gross margin per day.", ic: "wallet" as const, run: () => download("profit-margin", ["Date", "Revenue", "Cost", "Margin %"], days.map((d) => [d.date.toISOString().slice(0, 10), d.revenue, d.cost, d.revenue ? Math.round(((d.revenue - d.cost) / d.revenue) * 100) : 0])) },
    { t: "Customer growth", d: "New customers signed up each day.", ic: "users" as const, run: () => download("customer-growth", ["Date", "New customers"], days.map((d) => [d.date.toISOString().slice(0, 10), d.newCustomers])) },
    { t: "Items sold", d: `Total ${w.words.items} sold per day.`, ic: "box" as const, run: () => download("items-sold", ["Date", w.words.items], days.map((d) => [d.date.toISOString().slice(0, 10), d.items])) },
    { t: "Staff performance", d: "Sales and transaction counts per staff member.", ic: "clock" as const, run: () => download("staff-performance", ["Staff", "Role", "Transactions", "Sales"], pageRows(w.slug, "staff").slice(0, 12).map((r, i) => [r.name, r.role, 40 + i * 7, 150000 + i * 21000])) },
    { t: "Low stock", d: "Everything at or below its reorder level.", ic: "alert" as const, run: () => download("low-stock", ["Item", "On hand", "Reorder at"], pageRows(w.slug, "inventory").filter((r) => r.status !== "In stock").map((r) => [r.name, r.onHand, r.reorder])) },
  ];
  return (
    <>
      <PageHeader title="Reports" meta={`${w.name} · last 30 days · ${branch ? branch.name : "all branches"}`} />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label="Revenue (30d)" value={compactNaira(s.revenue)} />
        <KpiCard label="Transactions" value={s.txns.toLocaleString("en-NG")} />
        <KpiCard label="Gross margin" value={`${s.revenue ? Math.round(((s.revenue - s.cost) / s.revenue) * 100) : 0}%`} />
        <KpiCard label="New customers" value={String(s.newCustomers)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.t}>
            <div className="flex h-full flex-col gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-a-surface2 text-a-accent-text"><Icon name={r.ic} size={18} /></span>
              <div><h3 className="font-display text-[15px] text-a-fg">{r.t}</h3><p className="mt-1 text-[13px] leading-snug text-a-mute">{r.d}</p></div>
              <Button size="sm" icon="download" className="mt-auto self-start" onClick={r.run}>Download CSV</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
