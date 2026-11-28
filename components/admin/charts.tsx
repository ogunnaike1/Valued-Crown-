"use client";

import { useState } from "react";
const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

const path = (pts: [number, number][]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

export function Sparkline({ data, className, color = "var(--c1)" }: { data: number[]; className?: string; color?: string }) {
  if (data.length < 2) return null;
  const w = 100, h = 36, max = Math.max(...data), min = Math.min(...data), span = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / span) * (h - 6)] as [number, number]);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d={`${path(pts)} L${w},${h} L0,${h} Z`} fill={color} opacity="0.12" />
      <path d={path(pts)} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

/** Current period (solid) against previous period (dashed), with hover tooltip. */
export function CompareChart({ labels, current, previous, format }: { labels: string[]; current: number[]; previous: number[]; format: (n: number) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  if (!current.length || current.every((v) => v === 0)) return <div className="grid h-56 place-items-center text-[13px] text-a-mute">No sales recorded in this period</div>;
  const W = 640, H = 220, L = 8, R = 8, T = 12, B = 24;
  const max = Math.max(...current, ...previous) * 1.1 || 1;
  const x = (i: number) => L + (i / Math.max(1, current.length - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - v / max) * (H - T - B);
  const cur = current.map((v, i) => [x(i), y(v)] as [number, number]);
  const prev = previous.map((v, i) => [x(i), y(v)] as [number, number]);
  const step = Math.ceil(labels.length / 7);
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-full" role="img" aria-label="Net sales, current versus previous period"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const i = Math.round(((e.clientX - r.left) / r.width * W - L) / (W - L - R) * (current.length - 1)); setHover(Math.max(0, Math.min(current.length - 1, i))); }}>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => <line key={g} x1={L} x2={W - R} y1={y(max * g)} y2={y(max * g)} stroke="rgb(var(--a-line))" strokeWidth="1" />)}
        <path d={`${path(cur)} L${x(current.length - 1)},${H - B} L${x(0)},${H - B} Z`} fill="var(--c1)" opacity="0.1" />
        <path d={path(prev)} fill="none" stroke="var(--c5)" strokeWidth="1.8" strokeDasharray="5 4" />
        <path d={path(cur)} fill="none" stroke="var(--c1)" strokeWidth="2.2" strokeLinejoin="round" />
        {labels.map((l, i) => i % step === 0 && <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10.5" fill="rgb(var(--a-mute))">{l}</text>)}
        {hover !== null && <><line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} stroke="rgb(var(--a-mute))" strokeDasharray="3 3" /><circle cx={x(hover)} cy={y(current[hover])} r="4.5" fill="var(--c1)" stroke="rgb(var(--a-surface))" strokeWidth="2" /></>}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-2 rounded-lg border border-a-line bg-a-surface px-3 py-2 text-[12px] shadow-lg" style={{ left: `clamp(8px, ${(x(hover) / W) * 100}%, calc(100% - 150px))` }}>
          <div className="mb-1 font-semibold text-a-fg">{labels[hover]}</div>
          <div className="flex items-center gap-2 text-a-fg"><i className="h-2 w-2 rounded-full" style={{ background: "var(--c1)" }} />This period <b className="ml-auto pl-3 tabular-nums">{format(current[hover])}</b></div>
          <div className="flex items-center gap-2 text-a-mute"><i className="h-2 w-2 rounded-full" style={{ background: "var(--c5)" }} />Previous <b className="ml-auto pl-3 tabular-nums">{format(previous[hover] ?? 0)}</b></div>
        </div>
      )}
    </div>
  );
}

const DONUT = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)", "var(--c5)"];
export function Donut({ items, center, centerLabel }: { items: { name: string; value: number }[]; center: string; centerLabel: string }) {
  const total = items.reduce((a, b) => a + b.value, 0);
  if (!total) return <div className="grid h-40 place-items-center text-[13px] text-a-mute">No data yet</div>;
  const R = 52, C = 2 * Math.PI * R; let acc = 0;
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-36 w-36 flex-none -rotate-90" role="img" aria-label={`${centerLabel} breakdown`}>
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgb(var(--a-surface2))" strokeWidth="16" />
        {items.map((it, i) => { const len = (it.value / total) * C; const el = <circle key={it.name} cx="70" cy="70" r={R} fill="none" stroke={DONUT[i % 5]} strokeWidth="16" strokeDasharray={`${Math.max(0, len - 1.5)} ${C}`} strokeDashoffset={-acc} />; acc += len; return el; })}
        <g className="rotate-90" style={{ transformOrigin: "70px 70px" }}><text x="70" y="68" textAnchor="middle" fontSize="19" fontWeight="700" fill="rgb(var(--a-fg))">{center}</text><text x="70" y="84" textAnchor="middle" fontSize="9.5" fill="rgb(var(--a-mute))">{centerLabel}</text></g>
      </svg>
      <ul className="min-w-[150px] flex-1 space-y-2 text-[13px]">
        {items.map((it, i) => (
          <li key={it.name} className="flex min-w-0 items-center gap-2"><i className="h-2.5 w-2.5 flex-none rounded-sm" style={{ background: DONUT[i % 5] }} /><span className="min-w-0 truncate text-a-fg">{it.name}</span><span className="ml-auto tabular-nums text-a-mute">{Math.round((it.value / total) * 100)}%</span></li>
        ))}
      </ul>
    </div>
  );
}

export function Heatmap({ grid }: { grid: number[][] }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [tip, setTip] = useState<string | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const hours = grid[0]?.length ?? 24;
  const label = (d: number, h: number, v: number) => `${days[d]} ${String(h).padStart(2, "0")}:00 · ${Math.round(v * 100)}% of peak`;
  const cols = { gridTemplateColumns: `auto repeat(${hours}, minmax(0, 1fr))` };
  return (
    <div className="min-w-0">
      <div className="grid items-center gap-[2px] sm:gap-[3px]" style={cols} role="img" aria-label="Sales by hour and weekday, darker means busier">
        {grid.map((row, d) => [
          <span key={`l${d}`} className="pr-1.5 text-[10.5px] text-a-mute sm:pr-2 sm:text-[11px]">{days[d]}</span>,
          ...row.map((v, h) => {
            const id = `${d}-${h}`;
            return (
              <div key={id} className={cx("aspect-square min-w-0 rounded-[2px] sm:rounded-[3px]", sel === id && "ring-2 ring-a-fg ring-offset-1 ring-offset-a-surface")} style={{ background: `rgb(var(--a-accent) / ${0.07 + v * 0.93})` }}
                onMouseEnter={() => setTip(label(d, h, v))} onMouseLeave={() => setTip(null)}
                onClick={() => { setSel(sel === id ? null : id); setTip(sel === id ? null : label(d, h, v)); }} />
            );
          }),
        ])}
        <span />
        {Array.from({ length: hours }, (_, h) => <span key={`h${h}`} className="mt-1 whitespace-nowrap text-[10px] text-a-mute sm:text-[10.5px]">{h % 6 === 0 ? String(h).padStart(2, "0") : ""}</span>)}
      </div>
      <div className="mt-2 min-h-4 text-[12px] text-a-mute" aria-live="polite">{tip ?? (sel ? null : "Hover or tap a cell · darker means busier")}</div>
    </div>
  );
}

export function StackBar({ items }: { items: { name: string; value: number }[] }) {
  const total = items.reduce((a, b) => a + b.value, 0) || 1;
  return (
    <div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-a-surface2" role="img" aria-label="Status breakdown">
        {items.map((it, i) => <div key={it.name} style={{ width: `${(it.value / total) * 100}%`, background: DONUT[i % 5] }} />)}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[12.5px]">
        {items.map((it, i) => <li key={it.name} className="flex min-w-0 items-center gap-2"><i className="h-2.5 w-2.5 flex-none rounded-sm" style={{ background: DONUT[i % 5] }} /><span className="min-w-0 truncate text-a-mute">{it.name}</span><b className="ml-auto tabular-nums text-a-fg">{it.value}</b></li>)}
      </ul>
    </div>
  );
}
