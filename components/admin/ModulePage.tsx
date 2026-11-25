"use client";

import { Suspense, useMemo } from "react";
import { useAdmin } from "@/lib/admin/context";
import { BRANCHES } from "@/lib/admin/config";
import { customerRows, records, type CustomerRow, type Row } from "@/lib/admin/seed";
import { dateShort, naira } from "@/lib/admin/format";
import DataTable, { type Column, type Query } from "./DataTable";
import { Badge, Button, Card, EmptyState, KpiCard, PageHeader, Skeleton } from "./ui";

const branchName = (id: string) => BRANCHES.find((b) => b.id === id)?.name.replace(" Branch", "") ?? id;

function paginate<T>(all: T[], q: Query, match: (r: T, s: string) => boolean, get: Record<string, (r: T) => string | number>, filt: Record<string, (r: T) => string>): { rows: T[]; total: number } {
  let list = all;
  if (q.q) { const s = q.q.toLowerCase(); list = list.filter((r) => match(r, s)); }
  for (const [k, v] of Object.entries(q.filters)) if (v && filt[k]) list = list.filter((r) => filt[k](r) === v);
  if (q.sort && get[q.sort]) { const f = get[q.sort]; list = [...list].sort((a, b) => { const x = f(a), y = f(b); return (x < y ? -1 : x > y ? 1 : 0) * (q.dir === "asc" ? 1 : -1); }); }
  return { rows: list.slice((q.page - 1) * q.size, q.page * q.size), total: list.length };
}

function Field({ k, v }: { k: string; v: React.ReactNode }) { return <div className="flex items-center justify-between gap-4 border-b border-a-line py-2.5 text-[13.5px]"><span className="text-a-mute">{k}</span><span className="text-right font-medium tabular-nums text-a-fg">{v}</span></div>; }

function PrimaryList() {
  const { workspace: w, branch } = useAdmin();
  const all = useMemo(() => records(w.slug).filter((r) => !branch || r.branch === branch.id), [w.slug, branch]);
  const columns: Column<Row>[] = [
    { key: "ref", header: w.primary.title.slice(0, -1) + " no.", sortable: true, render: (r) => r.ref, csv: (r) => r.ref },
    { key: "date", header: "Date", sortable: true, render: (r) => dateShort(new Date(r.date)), csv: (r) => r.date },
    { key: "customer", header: w.words.customer[0].toUpperCase() + w.words.customer.slice(1), sortable: true, render: (r) => r.customer, csv: (r) => r.customer },
    { key: "branch", header: "Branch", render: (r) => branchName(r.branch), csv: (r) => branchName(r.branch) },
    { key: "detail", header: w.primary.detailLabel, render: (r) => r.detail, csv: (r) => r.detail },
    { key: "status", header: "Status", sortable: true, render: (r) => <Badge>{r.status}</Badge>, csv: (r) => r.status },
    { key: "total", header: "Total", sortable: true, align: "right", render: (r) => naira(r.total, 2), csv: (r) => r.total },
  ];
  const total = all.reduce((a, r) => a + (r.status === "Voided" || r.status === "Cancelled" ? 0 : r.total), 0);
  return (
    <>
      <PageHeader title={w.primary.title} meta={`${w.name} · ${branch ? branch.name : "all branches"}`} actions={<Button variant="primary" icon="plus" disabled title="Creating records arrives in the next phase">New {w.primary.singular}</Button>} />
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={`Total ${w.primary.title.toLowerCase()}`} value={all.length.toLocaleString("en-NG")} />
        <KpiCard label="Value (excl. voided)" value={naira(total)} />
        <KpiCard label="Average" value={naira(all.length ? total / all.length : 0)} />
        <KpiCard label={`${w.primary.statuses[0]}`} value={String(all.filter((r) => r.status === w.primary.statuses[0]).length)} href={`/admin/${w.primary.path}?status=${encodeURIComponent(w.primary.statuses[0])}`} />
      </div>
      <DataTable<Row>
        id={`${w.slug}-${w.primary.path}`} exportName={`${w.slug}-${w.primary.path}`} columns={columns} rowId={(r) => r.id} deps={[all]}
        placeholder={`Search ${w.primary.singular} no. or ${w.words.customer}…`}
        filters={[{ key: "status", label: "Status", options: w.primary.statuses }, ...(branch ? [] : [{ key: "branch", label: "Branch", options: BRANCHES.map((b) => branchName(b.id)) }])]}
        fetchRows={(q) => paginate(all, q, (r, s) => r.ref.toLowerCase().includes(s) || r.customer.toLowerCase().includes(s), { ref: (r) => r.ref, date: (r) => r.date, customer: (r) => r.customer, status: (r) => r.status, total: (r) => r.total }, { status: (r) => r.status, branch: (r) => branchName(r.branch) })}
        emptyTitle={`No ${w.primary.title.toLowerCase()} match these filters.`}
        drawerTitle={(r) => r.ref}
        drawer={(r) => (<><div className="mb-3"><Badge>{r.status}</Badge></div><Field k="Date" v={dateShort(new Date(r.date))} /><Field k={w.words.customer[0].toUpperCase() + w.words.customer.slice(1)} v={r.customer} /><Field k="Branch" v={branchName(r.branch)} /><Field k={w.primary.detailLabel} v={r.detail} /><Field k="Total" v={naira(r.total, 2)} /><p className="mt-5 text-[12.5px] text-a-mute">Full detail pages, refunds and voids arrive in the next phase.</p></>)}
      />
    </>
  );
}

function CustomerList() {
  const { workspace: w, branch } = useAdmin();
  const all = useMemo(() => customerRows(w.slug).filter((r) => !branch || r.branch === branch.id), [w.slug, branch]);
  const columns: Column<CustomerRow>[] = [
    { key: "code", header: "Code", sortable: true, render: (r) => r.code, csv: (r) => r.code },
    { key: "name", header: "Name", sortable: true, render: (r) => r.name, csv: (r) => r.name },
    { key: "phone", header: "Phone", render: (r) => r.phone, csv: (r) => r.phone },
    { key: "tier", header: "Loyalty tier", sortable: true, render: (r) => <Badge tone={r.tier === "Gold" ? "amber" : r.tier === "Silver" ? "blue" : "grey"}>{r.tier}</Badge>, csv: (r) => r.tier },
    { key: "visits", header: "Visits", sortable: true, align: "right", render: (r) => r.visits, csv: (r) => r.visits },
    { key: "spend", header: "Total spend", sortable: true, align: "right", render: (r) => naira(r.spend), csv: (r) => r.spend },
    { key: "outstanding", header: "Outstanding", sortable: true, align: "right", render: (r) => (r.outstanding ? naira(r.outstanding) : "—"), csv: (r) => r.outstanding },
    { key: "status", header: "Status", render: (r) => <Badge>{r.status}</Badge>, csv: (r) => r.status },
  ];
  return (
    <>
      <PageHeader title={w.customers.title} meta={`${all.length.toLocaleString("en-NG")} on record · ${w.name}`} actions={<Button variant="primary" icon="plus" disabled title="Creating records arrives in the next phase">New {w.customers.singular}</Button>} />
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KpiCard label={`Total ${w.customers.title.toLowerCase()}`} value={String(all.length)} />
        <KpiCard label="With balance" value={String(all.filter((c) => c.outstanding).length)} href={`/admin/${w.customers.path}?sort=outstanding&dir=desc`} />
        <KpiCard label="Total outstanding" value={naira(all.reduce((a, c) => a + c.outstanding, 0))} />
      </div>
      <DataTable<CustomerRow>
        id={`${w.slug}-${w.customers.path}`} exportName={`${w.slug}-${w.customers.path}`} columns={columns} rowId={(r) => r.id} deps={[all]}
        placeholder="Search name, code or phone…"
        filters={[{ key: "tier", label: "Tier", options: ["Standard", "Silver", "Gold"] }, { key: "status", label: "Status", options: ["Active", "Inactive"] }]}
        fetchRows={(q) => paginate(all, q, (r, s) => r.name.toLowerCase().includes(s) || r.code.toLowerCase().includes(s) || r.phone.includes(s), { code: (r) => r.code, name: (r) => r.name, tier: (r) => r.tier, visits: (r) => r.visits, spend: (r) => r.spend, outstanding: (r) => r.outstanding }, { tier: (r) => r.tier, status: (r) => r.status })}
        emptyTitle={`No ${w.customers.title.toLowerCase()} found.`}
        emptyAction={<Button variant="primary" icon="plus" size="sm" disabled>Add {w.customers.singular}</Button>}
        drawerTitle={(r) => r.name}
        drawer={(r) => (<><div className="mb-3 flex gap-2"><Badge>{r.status}</Badge><Badge tone={r.tier === "Gold" ? "amber" : "grey"}>{r.tier}</Badge></div><Field k="Code" v={r.code} /><Field k="Phone" v={r.phone} /><Field k="Visits" v={r.visits} /><Field k="Total spend" v={naira(r.spend)} /><Field k="Outstanding" v={r.outstanding ? naira(r.outstanding) : "—"} /><Field k="Branch" v={branchName(r.branch)} /></>)}
      />
    </>
  );
}

export default function ModulePage({ slug }: { slug: string[] }) {
  const { workspace: w, ready } = useAdmin();
  const path = slug.join("/");
  const item = w.nav.flatMap((g) => g.items).find((i) => i.href === `/admin/${path}`);
  if (!ready) return <Skeleton className="h-64 w-full" />;
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      {path === w.primary.path ? <PrimaryList /> : path === w.customers.path ? <CustomerList /> : (
        <>
          <PageHeader title={item?.label ?? path.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase())} meta={w.name} />
          <Card pad={false}><EmptyState icon={item?.icon ?? "layers"} title={item ? `${item.label} is part of ${w.name} and is scheduled for a later build phase. The shell, navigation and shared tables it will use are ready.` : "This page doesn't exist for this product."} action={<Button href="/admin" variant="primary" size="sm">Back to dashboard</Button>} /></Card>
        </>
      )}
    </Suspense>
  );
}
