"use client";

import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import Icon, { type IconName } from "./Icon";
import { fmtDelta } from "@/lib/admin/format";
import { Sparkline } from "./charts";

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

/* One status → tone map for every list in the back office. */
const TONES: Record<string, string> = {
  draft: "grey", held: "amber", pending: "amber", reserved: "amber", received: "amber", preparing: "blue", "in transit": "blue", processing: "blue", washing: "blue", ironing: "blue", "checked in": "blue",
  completed: "green", posted: "green", active: "green", paid: "green", ready: "green", delivered: "green", "checked out": "green",
  voided: "red", failed: "red", cancelled: "red", "no-show": "red", overdue: "red", inactive: "grey",
  refunded: "purple", "partially refunded": "purple",
};
export function Badge({ children, tone }: { children: string; tone?: "grey" | "amber" | "green" | "red" | "blue" | "purple" }) {
  const t = tone ?? TONES[children.toLowerCase()] ?? "grey";
  return <span className={cx("a-tone-" + t, "inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11.5px] font-semibold whitespace-nowrap")}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
}

export function Button({ variant = "secondary", size = "md", icon, className, children, href, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "sm" | "md"; icon?: IconName; href?: string }) {
  const cls = cx(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
    size === "sm" ? "h-8 px-3 text-[12.5px]" : "h-9 px-3.5 text-[13px]",
    variant === "primary" && "bg-a-accent text-a-accent-fg hover:brightness-105",
    variant === "secondary" && "border border-a-line bg-a-surface text-a-fg hover:bg-a-surface2",
    variant === "ghost" && "text-a-mute hover:bg-a-surface2 hover:text-a-fg",
    variant === "danger" && "border border-a-line bg-a-surface text-[rgb(var(--t-red))] hover:bg-a-surface2",
    className,
  );
  const inner = <>{icon && <Icon name={icon} size={15} />}{children}</>;
  if (href) return <Link href={href} className={cls}>{inner}</Link>;
  return <button type="button" className={cls} {...rest}>{inner}</button>;
}

export function Card({ title, action, children, className, pad = true }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={cx("min-w-0 rounded-2xl border border-a-line bg-a-surface", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-1">
          <h2 className="min-w-0 font-display text-[15px] text-a-fg">{title}</h2>
          {action}
        </header>
      )}
      <div className={pad ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function DeltaPill({ value }: { value: number | null }) {
  if (value === null) return <span className="text-[12px] font-semibold text-a-mute tabular-nums" title="Nothing to compare against yet">—</span>;
  const up = value >= 0;
  return (
    <span className={cx("inline-flex items-center gap-0.5 text-[12px] font-semibold tabular-nums", up ? "text-[rgb(var(--t-green))]" : "text-[rgb(var(--t-red))]")}>
      <Icon name={up ? "arrowUp" : "arrowDown"} size={12} strokeWidth={2.4} />{fmtDelta(value).replace(/^[+−]/, "")}
    </span>
  );
}

export function KpiCard({ label, value, delta, spark, href, hint }: { label: string; value: string; delta?: number | null; spark?: number[]; href?: string; hint?: string }) {
  const body = (
    <div className="flex h-full flex-col justify-between gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-[12px] font-medium text-a-mute">{label}</span>
        {delta !== undefined && <DeltaPill value={delta} />}
      </div>
      <div className="flex min-w-0 items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="break-words font-display text-[19px] leading-tight tabular-nums text-a-fg sm:text-[24px] sm:leading-none">{value}</div>
          {hint && <div className="mt-1.5 text-[11.5px] text-a-mute">{hint}</div>}
        </div>
        {spark && <Sparkline data={spark} className="h-9 w-16 flex-none sm:w-24" />}
      </div>
    </div>
  );
  const cls = "block min-w-0 rounded-2xl border border-a-line bg-a-surface";
  return href ? <Link href={href} className={cx(cls, "transition-colors hover:border-a-mute/50")}>{body}</Link> : <div className={cls}>{body}</div>;
}

export function Skeleton({ className }: { className?: string }) { return <div className={cx("a-skel", className)} aria-hidden="true" />; }

export function EmptyState({ icon = "inbox", title, action }: { icon?: IconName; title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-a-surface2 text-a-mute"><Icon name={icon} size={20} /></span>
      <p className="max-w-xs text-[13.5px] text-a-mute">{title}</p>
      {action}
    </div>
  );
}

export function PageHeader({ title, meta, actions }: { title: string; meta?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-[24px] leading-tight text-a-fg">{title}</h1>
        {meta && <div className="mt-1 text-[13px] text-a-mute">{meta}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg border border-a-line bg-a-surface2 p-0.5">
      {options.map((o) => (
        <button key={o.value} role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)} className={cx("h-7 rounded-md px-3 text-[12px] font-semibold transition-colors", value === o.value ? "bg-a-surface text-a-fg shadow-sm" : "text-a-mute hover:text-a-fg")}>{o.label}</button>
      ))}
    </div>
  );
}
