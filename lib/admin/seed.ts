/**
 * Deterministic DEMO data (Nigerian context, ₦). There is no database behind the back office yet:
 * everything here is generated from a seeded PRNG so the dashboard, charts and tables render realistically.
 * Replace these functions with API calls; the shapes are what the UI consumes.
 */
import { BRANCHES, WORKSPACES, type WorkspaceSlug } from "./config";

function hash(str: string) { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return h >>> 0; }
export function rng(seed: string) { let a = hash(seed); return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

export interface Day { date: Date; revenue: number; txns: number; items: number; newCustomers: number; refunds: number; cost: number }

export const branchScale = (id: string) => (id === "lekki" ? 1.15 : id === "ikeja" ? 1 : id === "abuja" ? 0.8 : 2.95);

function dailyFor(slug: WorkspaceSlug, branch: string, days: number, today: Date): Day[] {
  const b = WORKSPACES[slug].base;
  const r = rng(`${slug}:${branch}:daily`);
  const out: Day[] = [];
  const t0 = startOfDay(today);
  const frac = Math.min(1, Math.max(0.3, (today.getHours() * 60 + today.getMinutes()) / (21 * 60)));
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(t0); date.setDate(t0.getDate() - i);
    const trend = 1 + ((days - 1 - i) / days) * 0.12;
    const noise = 0.88 + r() * 0.26;
    let revenue = b.revenue * branchScale(branch) * b.weekday[date.getDay()] * trend * noise;
    if (i === 0) revenue *= frac;
    const txns = Math.max(1, Math.round((revenue / b.ticket) * (0.92 + r() * 0.16)));
    out.push({
      date, revenue: Math.round(revenue / 10) * 10, txns,
      items: Math.round(txns * b.itemsPerTxn * (0.9 + r() * 0.2)),
      newCustomers: Math.round(txns * (0.08 + r() * 0.07)),
      refunds: Math.round(revenue * (0.004 + r() * 0.012)),
      cost: Math.round(revenue * (1 - b.margin) * (0.96 + r() * 0.08)),
    });
  }
  return out;
}

/** 60 days of history, oldest → newest (last = today so far). Branch "all" sums the branches. */
export function daily(slug: WorkspaceSlug, branch: string, today: Date, days = 60): Day[] {
  if (branch !== "all") return dailyFor(slug, branch, days, today);
  const parts = BRANCHES.map((b) => dailyFor(slug, b.id, days, today));
  return parts[0].map((d, i) => parts.reduce((acc, p) => ({ ...acc, revenue: acc.revenue + p[i].revenue, txns: acc.txns + p[i].txns, items: acc.items + p[i].items, newCustomers: acc.newCustomers + p[i].newCustomers, refunds: acc.refunds + p[i].refunds, cost: acc.cost + p[i].cost }), { ...d, revenue: 0, txns: 0, items: 0, newCustomers: 0, refunds: 0, cost: 0 }));
}

export const sum = (days: Day[]) => days.reduce((a, d) => ({ revenue: a.revenue + d.revenue, txns: a.txns + d.txns, items: a.items + d.items, newCustomers: a.newCustomers + d.newCustomers, refunds: a.refunds + d.refunds, cost: a.cost + d.cost }), { revenue: 0, txns: 0, items: 0, newCustomers: 0, refunds: 0, cost: 0 });

const hourProfile: Record<WorkspaceSlug, (h: number) => number> = {
  "hotel-manager": (h) => 0.15 + Math.exp(-((h - 11) ** 2) / 6) * 0.9 + Math.exp(-((h - 15) ** 2) / 5) * 1 + Math.exp(-((h - 20) ** 2) / 6) * 0.7,
  "restaurant-manager": (h) => (h < 8 ? 0.02 : 0.05 + Math.exp(-((h - 13) ** 2) / 4) * 0.95 + Math.exp(-((h - 19.5) ** 2) / 5) * 1),
  "shop-manager": (h) => (h < 8 || h > 21 ? 0.02 : 0.2 + Math.exp(-((h - 12) ** 2) / 12) * 0.6 + Math.exp(-((h - 17) ** 2) / 6) * 0.9),
  "laundry-manager": (h) => (h < 7 || h > 20 ? 0.02 : 0.15 + Math.exp(-((h - 9) ** 2) / 4) * 0.9 + Math.exp(-((h - 18) ** 2) / 4) * 0.8),
};

/** 7 (Mon..Sun) × 24 intensity grid, 0..1 */
export function heatmap(slug: WorkspaceSlug, branch: string) {
  const r = rng(`${slug}:${branch}:heat`);
  const w = WORKSPACES[slug].base.weekday;
  return [1, 2, 3, 4, 5, 6, 0].map((dow) => Array.from({ length: 24 }, (_, h) => Math.min(1, hourProfile[slug](h) * w[dow] * (0.8 + r() * 0.4) / 1.3)));
}

export interface Tile { label: string; value: string; hint?: string; tone?: "alert"; href?: string }

export function ops(slug: WorkspaceSlug, branch: string) {
  const r = rng(`${slug}:${branch}:ops`);
  const k = branch === "all" ? 2.95 : branchScale(branch);
  const n = (base: number) => Math.max(1, Math.round(base * k * (0.85 + r() * 0.3)));
  let tiles: Tile[]; let mix: number[]; let attention: { name: string; detail: string; value: string; sev: "red" | "amber" }[];
  const l = WORKSPACES[slug].opsLabels;
  if (slug === "hotel-manager") {
    const rooms = n(28), occ = Math.round(rooms * (0.62 + r() * 0.2)), dirty = n(5), ooo = Math.max(1, Math.round(rooms * 0.04));
    mix = [occ, rooms - occ - dirty - ooo, dirty, ooo];
    tiles = [{ label: l[0], value: `${Math.round((occ / rooms) * 100)}%`, hint: `${occ} of ${rooms} rooms` }, { label: l[1], value: String(n(6)), hint: "expected check-ins" }, { label: l[2], value: String(n(5)), hint: "expected check-outs" }, { label: l[3], value: String(dirty), tone: "alert", hint: "awaiting housekeeping" }];
    attention = [{ name: "Room 204 · Deluxe King", detail: "Awaiting cleaning after checkout", value: "Dirty", sev: "amber" }, { name: "Room 112 · Standard Twin", detail: "AC not cooling (maintenance request)", value: "Out of order", sev: "red" }, { name: "Room 307 · Executive Suite", detail: "Awaiting cleaning after checkout", value: "Dirty", sev: "amber" }, { name: "Room 118 · Classic Double", detail: "Plumbing request logged", value: "Open", sev: "amber" }];
  } else if (slug === "restaurant-manager") {
    const tbl = n(14), occ = Math.round(tbl * (0.4 + r() * 0.3)), res = n(3), dirty = n(1);
    mix = [occ, Math.max(0, tbl - occ - res - dirty), res, dirty];
    tiles = [{ label: l[0], value: String(Math.max(0, tbl - occ - res - dirty)), hint: `${tbl} tables total` }, { label: l[1], value: String(n(5)), hint: "tickets on the kitchen display" }, { label: l[2], value: `${Math.round(11 + r() * 8)} min`, hint: "order → ready" }, { label: l[3], value: String(n(4)), tone: "alert", hint: "at or below reorder level" }];
    attention = [{ name: "Palm oil (25L)", detail: "Reorder level 6", value: "2 left", sev: "red" }, { name: "Fresh tilapia (kg)", detail: "Reorder level 20", value: "9 left", sev: "amber" }, { name: "Basmati rice (50kg)", detail: "Reorder level 4", value: "3 left", sev: "amber" }, { name: "Chapman syrup (L)", detail: "Reorder level 10", value: "0 left", sev: "red" }];
  } else if (slug === "shop-manager") {
    const inS = n(520), low = n(24), out = n(8);
    mix = [inS, low, out];
    tiles = [{ label: l[0], value: String(low), tone: "alert", hint: `${out} out of stock`, href: "/admin/inventory" }, { label: l[1], value: String(n(3)), hint: "awaiting delivery" }, { label: l[2], value: String(n(3)), hint: "ringing sales now" }, { label: l[3], value: String(n(1)), hint: "between branches" }];
    attention = [{ name: "Peak Milk 400g", detail: "Reorder at 40", value: "12 of 40", sev: "red" }, { name: "Golden Penny Rice 5kg", detail: "Reorder at 30", value: "18 of 30", sev: "amber" }, { name: "Dettol 500ml", detail: "Reorder at 25", value: "0 of 25", sev: "red" }, { name: "Indomie Carton (40)", detail: "Reorder at 20", value: "14 of 20", sev: "amber" }];
  } else {
    const rcv = n(14), wsh = n(18), irn = n(12), rdy = n(16);
    mix = [rcv, wsh, irn, rdy];
    tiles = [{ label: l[0], value: String(rcv + wsh + irn), hint: "sorting, washing, ironing" }, { label: l[1], value: String(rdy), hint: "waiting for customers" }, { label: l[2], value: String(n(9)), hint: "driver routes assigned" }, { label: l[3], value: String(n(3)), tone: "alert", hint: "past promised date" }];
    attention = [{ name: "LDY-2611-0187 · Mrs. Okafor", detail: "Pickup promised yesterday", value: "1 day late", sev: "red" }, { name: "LDY-2611-0192 · Mr. Bello", detail: "Delivery promised today 4pm", value: "Due today", sev: "amber" }, { name: "LDY-2611-0179 · Ms. Adeyemi", detail: "Ready for pickup, not collected", value: "3 days", sev: "amber" }, { name: "LDY-2611-0171 · Mr. Eze", detail: "Delivery failed: no answer", value: "Rescheduling", sev: "red" }];
  }
  return { tiles, mix, attention };
}

const NAMES = ["Adaeze Okonkwo", "Tunde Bakare", "Chidi Nwosu", "Fatima Sani", "Emeka Anyanwu", "Ngozi Eze", "Ibrahim Musa", "Funke Adebayo", "Kelechi Obi", "Zainab Yusuf", "Segun Ajayi", "Amaka Uche", "Bola Ogunleye", "Yetunde Alade", "Obinna Okeke", "Halima Abubakar"];

export function staff(slug: WorkspaceSlug, branch: string) {
  const r = rng(`${slug}:${branch}:staff`);
  const b = WORKSPACES[slug].base;
  const roles: Record<WorkspaceSlug, string[]> = { "hotel-manager": ["Front desk", "Front desk", "Night auditor", "Concierge", "Housekeeping lead"], "restaurant-manager": ["Cashier", "Waiter", "Waiter", "Bartender", "Cashier"], "shop-manager": ["Cashier", "Cashier", "Cashier", "Supervisor", "Cashier"], "laundry-manager": ["Front desk", "Front desk", "Driver", "Driver", "Supervisor"] };
  const offset = hash(branch) % 8;
  return roles[slug].map((role, i) => {
    const on = r() > 0.25; const txns = on ? Math.round(6 + r() * 22) : 0;
    return { name: NAMES[(offset + i) % NAMES.length], role, on, txns, sales: Math.round(txns * b.ticket * (0.85 + r() * 0.3)) };
  });
}

export function activity(slug: WorkspaceSlug, branch: string) {
  const r = rng(`${slug}:${branch}:activity`);
  const w = WORKSPACES[slug];
  const t: Record<WorkspaceSlug, (who: string, amt: string) => string[]> = {
    "hotel-manager": (who, amt) => [`${who} checked in a guest · folio ${amt}`, `${who} posted a restaurant charge to a room · ${amt}`, `${who} checked out a guest · ${amt} settled`, `${who} took a booking deposit · ${amt}`],
    "restaurant-manager": (who, amt) => [`${who} completed an order for ${amt}`, `${who} sent a KOT to the kitchen · ${amt}`, `${who} split a bill · ${amt}`, `${who} closed a table · ${amt}`],
    "shop-manager": (who, amt) => [`${who} completed a sale for ${amt}`, `${who} processed a return · ${amt}`, `${who} held a sale for ${amt}`, `${who} applied a promo to a sale of ${amt}`],
    "laundry-manager": (who, amt) => [`${who} created a laundry order · ${amt}`, `${who} marked an order ready for pickup · ${amt}`, `${who} confirmed a delivery · ${amt}`, `${who} recorded an advance payment · ${amt}`],
  };
  let mins = 2;
  return Array.from({ length: 8 }, () => {
    mins += 3 + r() * 40;
    const amt = "₦" + (Math.round((w.base.ticket * (0.4 + r() * 1.4)) / 50) * 50).toLocaleString("en-NG");
    const who = NAMES[Math.floor(r() * NAMES.length)].split(" ")[0] + " " + NAMES[Math.floor(r() * NAMES.length)].split(" ")[1][0] + ".";
    const lines = t[slug](who, amt);
    return { text: lines[Math.floor(r() * lines.length)], mins };
  });
}

export function topItems(slug: WorkspaceSlug, branch: string, days: number) {
  const r = rng(`${slug}:${branch}:top`);
  const k = (branch === "all" ? 2.95 : branchScale(branch)) * days;
  return WORKSPACES[slug].topItems.map((it, i) => { const qty = Math.round((60 - i * 9) * k * (0.9 + r() * 0.2) / (slug === "hotel-manager" ? 4 : 1)); return { ...it, qty, revenue: qty * it.price }; }).sort((a, b) => b.revenue - a.revenue);
}

/* ───── list rows (reservations / orders / sales, and customers) ───── */
export interface Row { id: string; ref: string; date: string; customer: string; branch: string; detail: string; status: string; total: number }
export interface CustomerRow { id: string; code: string; name: string; phone: string; tier: string; visits: number; spend: number; outstanding: number; status: string; branch: string }

export function records(slug: WorkspaceSlug): Row[] {
  const r = rng(`${slug}:rows`); const w = WORKSPACES[slug]; const now = new Date();
  const prefix = { "hotel-manager": "RSV", "restaurant-manager": "ORD", "shop-manager": "SALE", "laundry-manager": "LDY" }[slug];
  const detail: Record<WorkspaceSlug, () => string> = {
    "hotel-manager": () => `${w.topItems[Math.floor(r() * 5)].name} · ${1 + Math.floor(r() * 4)} night${r() > 0.7 ? "s" : ""}`,
    "restaurant-manager": () => [`Table ${1 + Math.floor(r() * 14)} · Dine-in`, "Takeaway", "Delivery"][Math.floor(r() * 3)],
    "shop-manager": () => `${1 + Math.floor(r() * 12)} items`,
    "laundry-manager": () => `${w.topItems[Math.floor(r() * 5)].name} ×${1 + Math.floor(r() * 5)}`,
  };
  const wts = slug === "shop-manager" ? [0.8, 0.03, 0.04, 0.07, 0.06] : [0.55, 0.15, 0.12, 0.1, 0.08];
  return Array.from({ length: 420 }, (_, i) => {
    const d = new Date(now.getTime() - i * (60 * 60 * 1000) * (1.2 + r() * 2.2));
    let x = r(), si = 0; for (let s = 0; s < w.primary.statuses.length; s++) { x -= (wts[s] ?? 0.05); if (x <= 0) { si = s; break; } si = s; }
    if (i < 6 && slug !== "shop-manager") si = Math.min(1, si);
    const n = 420 - i;
    return { id: `${prefix}-${n}`, ref: `${prefix}-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}-${String(n).padStart(4, "0")}`, date: d.toISOString(), customer: NAMES[Math.floor(r() * NAMES.length)], branch: BRANCHES[Math.floor(r() * 3)].id, detail: detail[slug](), status: w.primary.statuses[si], total: Math.round((w.base.ticket * (0.3 + r() * 1.8)) / 50) * 50 };
  });
}

export function customerRows(slug: WorkspaceSlug): CustomerRow[] {
  const r = rng(`${slug}:cust`);
  const tiers = ["Standard", "Silver", "Gold"];
  return Array.from({ length: 160 }, (_, i) => {
    const visits = 1 + Math.floor(r() * 40);
    return { id: String(i + 1), code: `CUS-${String(i + 1).padStart(4, "0")}`, name: NAMES[i % NAMES.length].replace(/ .*/, "") + " " + ["Adewale", "Okafor", "Bello", "Eze", "Balogun", "Ibe", "Danjuma", "Nnamdi", "Lawal", "Ojo"][Math.floor(r() * 10)], phone: `080${Math.floor(10000000 + r() * 89999999)}`, tier: tiers[visits > 28 ? 2 : visits > 12 ? 1 : 0], visits, spend: Math.round(visits * WORKSPACES[slug].base.ticket * (0.6 + r()) / 100) * 100, outstanding: r() > 0.8 ? Math.round(r() * 40) * 1000 : 0, status: r() > 0.1 ? "Active" : "Inactive", branch: BRANCHES[Math.floor(r() * 3)].id };
  });
}
