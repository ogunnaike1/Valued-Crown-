"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAdmin, DEMO_USER } from "@/lib/admin/context";
import { activity, daily, lowStock, heatmap, ops, staff, sum, topItems } from "@/lib/admin/seed";
import { compactNaira, delta, dayShort, greeting, naira, num, timeAgo } from "@/lib/admin/format";
import { Badge, Button, Card, DeltaPill, EmptyState, KpiCard, PageHeader, Segmented, cx } from "../ui";
import { CompareChart, Donut, Heatmap, Sparkline, StackBar } from "../charts";
import Icon from "../Icon";

type Range = 7 | 14 | 30;

export default function Dashboard() {
  const { workspace: w, branch, now, toast } = useAdmin();
  const [range, setRange] = useState<Range>(7);
  const [hideChecklist, setHide] = useState(true);
  const [done] = useState(3);
  const bid = branch?.id ?? "all";

  useEffect(() => { try { setHide(localStorage.getItem("vc-admin-checklist-" + w.slug) === "1"); } catch { setHide(false); } }, [w.slug]);

  const days = useMemo(() => daily(w.slug, bid, now), [w.slug, bid, now]);
  const today = days[days.length - 1];
  const sameWeekday = days.slice(0, -1).filter((d) => d.date.getDay() === today.date.getDay()).slice(-4);
  const avgWeekday = sameWeekday.reduce((a, d) => a + d.revenue, 0) / (sameWeekday.length || 1);
  const cur = days.slice(-range), prev = days.slice(-range * 2, -range);
  const sCur = sum(cur), sPrev = sum(prev);
  const margin = (s: ReturnType<typeof sum>) => (s.revenue ? ((s.revenue - s.cost) / s.revenue) * 100 : 0);
  const o = useMemo(() => ops(w.slug, bid), [w.slug, bid]);
  const mix = o.mix.map((v, i) => ({ name: w.mixLabels[i], value: v }));
  const cats = w.categories.map((c) => ({ name: c.name, value: c.share }));
  const top = useMemo(() => topItems(w.slug, bid, range), [w.slug, bid, range]);
  const feed = useMemo(() => activity(w.slug, bid), [w.slug, bid]);
  const lowCount = useMemo(() => lowStock(w.slug).filter((r) => !branch || r.branch === branch.id).length, [w.slug, branch]);
  const team = useMemo(() => staff(w.slug, bid), [w.slug, bid]);
  const heat = useMemo(() => heatmap(w.slug, bid), [w.slug, bid]);
  const spark = days.slice(-14);
  const onDuty = team.filter((s) => s.on).length;
  const wd = w.words;

  return (
    <div className="space-y-5">
      <PageHeader
        title={`${greeting(now)}, ${DEMO_USER.name.split(" ")[0]}`}
        meta={<span className="flex flex-wrap items-center gap-x-3 gap-y-1"><span className="inline-flex items-center gap-1.5 rounded-full a-tone-green px-2 py-0.5 text-[11px] font-bold"><i className="a-live h-1.5 w-1.5 rounded-full bg-current" />Live</span><span>{now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} · {now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span><span>{onDuty} staff on duty</span><span>{w.name} · {branch ? branch.name : "All branches"}</span></span>}
        actions={<div className="flex flex-wrap items-center gap-2"><Button href="/admin/low-stock" icon="alert">Low stock{lowCount > 0 ? ` (${lowCount})` : ""}</Button><Segmented label="Date range" value={String(range) as "7" | "14" | "30"} onChange={(v) => setRange(Number(v) as Range)} options={[{ value: "7", label: "7 days" }, { value: "14", label: "14 days" }, { value: "30", label: "30 days" }]} /></div>}
      />

      {!hideChecklist && (
        <Card pad={false}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 p-5">
            <div className="min-w-[220px] flex-1">
              <div className="font-display text-[15px] text-a-fg">Get your {w.name.split(" ")[0].toLowerCase()} ready</div>
              <div className="mt-2 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-a-surface2"><div className="h-full rounded-full bg-a-accent" style={{ width: `${(done / w.checklist.length) * 100}%` }} /></div><span className="text-[12px] tabular-nums text-a-mute">{done} of {w.checklist.length} done</span></div>
            </div>
            <ul className="grid min-w-[260px] flex-[2] grid-cols-1 gap-x-6 gap-y-1.5 text-[13px] sm:grid-cols-2">
              {w.checklist.map((c, i) => <li key={c} className={cx("flex items-center gap-2", i < done ? "text-a-mute line-through" : "text-a-fg")}><span className={cx("grid h-4 w-4 flex-none place-items-center rounded-full border", i < done ? "border-transparent bg-[rgb(var(--t-green))] text-white" : "border-a-line")}>{i < done && <Icon name="check" size={10} strokeWidth={3} />}</span>{c}</li>)}
            </ul>
            <Button variant="ghost" size="sm" onClick={() => { setHide(true); try { localStorage.setItem("vc-admin-checklist-" + w.slug, "1"); } catch { /* ignore */ } }} aria-label="Dismiss checklist" icon="x">Dismiss</Button>
          </div>
        </Card>
      )}

      {/* Hero + mini cards */}
      <div className="grid gap-4 lg:grid-cols-4">
        <Link href={`/admin/${w.primary.path}`} className="block rounded-2xl border border-a-line bg-a-surface p-5 transition-colors hover:border-a-mute/60 lg:col-span-2" aria-label={`Today's ${w.revenueLabel.toLowerCase()}, view ${w.primary.title.toLowerCase()}`}>
          <div className="flex items-center justify-between"><span className="text-[12.5px] font-medium text-a-mute">Today&apos;s {w.revenueLabel.toLowerCase()}</span><DeltaPill value={delta(today.revenue, avgWeekday)} /></div>
          <div className="mt-2 break-words font-display text-[32px] leading-none tabular-nums text-a-fg sm:text-[40px]">{naira(today.revenue)}</div>
          <div className="mt-1.5 text-[12px] text-a-mute">vs average for the last {sameWeekday.length} {now.toLocaleDateString("en-GB", { weekday: "long" })}s · {naira(avgWeekday)}</div>
          <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
            {[[`${num(today.txns)} ${wd.sales}`, "receipt"], [`${naira(today.txns ? today.revenue / today.txns : 0)} avg ${wd.sale}`, "wallet"], [`${num(today.items)} ${wd.items}`, "box"]].map(([t, ic]) => <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-a-surface2 px-3 py-1 text-a-fg"><Icon name={ic as "box"} size={13} className="text-a-mute" />{t}</span>)}
          </div>
          <Sparkline data={spark.map((d) => d.revenue)} className="mt-4 h-16 w-full" />
          <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-a-accent-text">View today&apos;s {w.primary.title.toLowerCase()} →</span>
        </Link>
        <div className="grid gap-4 lg:col-span-2 lg:grid-cols-1 xl:grid-cols-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <KpiCard label={wd.sales[0].toUpperCase() + wd.sales.slice(1)} value={num(today.txns)} delta={delta(sCur.txns, sPrev.txns)} spark={spark.map((d) => d.txns)} hint={`${range}-day change`} href={`/admin/${w.primary.path}`} />
            <KpiCard label={`New ${wd.customers}`} value={num(today.newCustomers)} delta={delta(sCur.newCustomers, sPrev.newCustomers)} spark={spark.map((d) => d.newCustomers)} hint={`${range}-day change`} href={`/admin/${w.customers.path}`} />
            <KpiCard label="Refunds" value={naira(today.refunds)} delta={delta(sCur.refunds, sPrev.refunds)} spark={spark.map((d) => d.refunds)} hint={`${range}-day change`} href={w.slug === "shop-manager" ? "/admin/returns" : `/admin/${w.primary.path}`} />
          </div>
        </div>
      </div>

      {/* Operations (real-time) */}
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1"><h2 className="font-display text-[15px] text-a-fg">Operations now</h2><span className="text-[12px] text-a-mute">Refreshes every 30s · updated {now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span></div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {o.tiles.map((t) => (
            <Link key={t.label} href={t.href ?? "/admin"} className={cx("group block rounded-2xl border bg-a-surface p-4 transition-colors hover:border-a-mute/60 hover:bg-a-surface2/50", t.tone === "alert" ? "border-[rgb(var(--t-amber)/0.45)]" : "border-a-line")}>
              <div className="flex items-center justify-between text-[12px] font-medium text-a-mute"><span>{t.label}</span>{t.tone === "alert" ? <Icon name="alert" size={14} className="text-[rgb(var(--t-amber))]" /> : <Icon name="right" size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />}</div>
              <div className="mt-2 break-words font-display text-[24px] leading-none tabular-nums text-a-fg sm:text-[28px]">{t.value}</div>
              <div className="mt-1.5 flex items-center justify-between gap-2 text-[11.5px] text-a-mute"><span>{t.hint}</span><span className="flex-none font-semibold text-a-accent-text opacity-0 transition-opacity group-hover:opacity-100">View →</span></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Performance */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Performance" action={<span className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-[12px] text-a-mute"><span className="flex items-center gap-1.5"><i className="h-0.5 w-4 rounded" style={{ background: "var(--c1)" }} />This period</span><span className="flex items-center gap-1.5"><i className="h-0 w-4 border-t-2 border-dashed" style={{ borderColor: "var(--c5)" }} />Previous</span></span>}>
          <div className="mb-3 grid grid-cols-3 gap-3">
            {[["Net sales", compactNaira(sCur.revenue - sCur.refunds), delta(sCur.revenue, sPrev.revenue)], [`Avg ${wd.sale}`, naira(sCur.txns ? sCur.revenue / sCur.txns : 0), delta(sCur.revenue / (sCur.txns || 1), sPrev.revenue / (sPrev.txns || 1))], ["Gross margin", `${margin(sCur).toFixed(1)}%`, delta(margin(sCur), margin(sPrev))]].map(([l, v, d]) => (
              <div key={l as string} className="min-w-0"><div className="truncate text-[12px] text-a-mute">{l as string}</div><div className="break-words font-display text-[15px] tabular-nums text-a-fg sm:text-[20px]">{v as string}</div><DeltaPill value={d as number | null} /></div>
            ))}
          </div>
          <CompareChart labels={cur.map((d) => dayShort(d.date))} current={cur.map((d) => d.revenue)} previous={prev.map((d) => d.revenue)} format={naira} />
        </Card>
        <Card title={w.categoryTitle}><Donut items={cats} center={compactNaira(sCur.revenue)} centerLabel={`${range} days`} /></Card>
      </div>

      {/* Catalog insights */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={w.topTitle} action={<Link href="/admin/reports" className="text-[12.5px] font-semibold text-a-accent-text hover:underline">See all</Link>} pad={false}>
          <ul className="divide-y divide-a-line">
            {top.map((t, i) => (
              <li key={t.name} className="flex items-center gap-3 px-5 py-3 text-[13.5px]">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-a-surface2 text-[12px] font-bold tabular-nums text-a-mute">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-a-fg">{t.name}</span>
                <span className="hidden flex-none text-[12px] tabular-nums text-a-mute sm:inline">{num(t.qty)} {t.unit}</span>
                <span className="flex-none text-right font-semibold tabular-nums text-a-fg sm:w-24">{naira(t.revenue)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title={w.attentionTitle} action={<Button size="sm" onClick={() => toast(`${w.attentionAction}: this action is wired in the next phase`)}>{w.attentionAction}</Button>} pad={false}>
          {o.attention.length === 0 ? <EmptyState icon="check" title="Nothing needs attention right now." /> : (
            <ul className="divide-y divide-a-line">
              {o.attention.map((a) => (
                <li key={a.name} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1"><div className="truncate text-[13.5px] font-medium text-a-fg">{a.name}</div><div className="truncate text-[12px] text-a-mute">{a.detail}</div></div>
                  <Badge tone={a.sev === "red" ? "red" : "amber"}>{a.value}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Heatmap + status mix */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title={`${w.revenueLabel} by hour & day`} action={<span className="text-[12px] text-a-mute">Last 7 days</span>}><Heatmap grid={heat} /></Card>
        <Card title={w.mixTitle}><StackBar items={mix} /></Card>
      </div>

      {/* Activity + shift */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Activity" action={<span className="inline-flex items-center gap-1.5 text-[12px] text-a-mute"><i className="a-live h-1.5 w-1.5 rounded-full bg-[rgb(var(--t-green))]" />Live</span>} pad={false}>
          <ul className="divide-y divide-a-line">{feed.map((f, i) => <li key={i} className="flex items-start justify-between gap-4 px-5 py-3 text-[13.5px]"><span className="text-a-fg">{f.text}</span><span className="flex-none text-[12px] text-a-mute">{timeAgo(f.mins)}</span></li>)}</ul>
        </Card>
        <Card title={w.staffTitle} action={<Link href="/admin/users" className="text-[12.5px] font-semibold text-a-accent-text hover:underline">Manage</Link>} pad={false}>
          <div className="overflow-x-auto"><table className="w-full text-[13px]">
            <caption className="sr-only">{w.staffTitle}</caption>
            <thead><tr className="text-left text-[11.5px] text-a-mute"><th className="px-5 py-2 font-medium">Staff</th><th className="px-2 py-2 font-medium">Status</th><th className="px-2 py-2 text-right font-medium">{w.revenueLabel}</th><th className="px-5 py-2 text-right font-medium">Txns</th></tr></thead>
            <tbody className="divide-y divide-a-line">
              {team.map((s) => <tr key={s.name}><td className="px-5 py-2.5"><div className="font-medium text-a-fg">{s.name}</div><div className="text-[11.5px] text-a-mute">{s.role}</div></td><td className="px-2"><Badge tone={s.on ? "green" : "grey"}>{s.on ? "On" : "Off"}</Badge></td><td className="px-2 text-right tabular-nums text-a-fg">{naira(s.sales)}</td><td className="px-5 text-right tabular-nums text-a-fg">{s.txns}</td></tr>)}
            </tbody>
          </table></div>
        </Card>
      </div>
    </div>
  );
}
