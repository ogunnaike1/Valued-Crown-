"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";

export const inputCls = "h-12 w-full border bg-white px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-grey focus:border-crown focus:ring-2 focus:ring-crown/25";

export function Field({ label, error, hint, right, children }: { label: string; error?: string; hint?: string; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between"><label className="text-[13.5px] font-semibold text-ink">{label}</label>{right}</div>
      {children}
      {error ? <p role="alert" className="text-[12.5px] text-[#C62828]">{error}</p> : hint ? <p className="text-[12.5px] text-slate">{hint}</p> : null}
    </div>
  );
}

export function TextInput({ error, ...p }: InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return <input {...p} aria-invalid={!!error} className={`${inputCls} ${error ? "border-[#C62828]" : "border-line"}`} />;
}

export function PasswordInput({ error, ...p }: InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...p} type={show ? "text" : "password"} aria-invalid={!!error} className={`${inputCls} pr-16 ${error ? "border-[#C62828]" : "border-line"}`} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show} className="absolute right-3 top-1/2 -translate-y-1/2 text-[12.5px] font-semibold text-slate hover:text-ink">{show ? "Hide" : "Show"}</button>
    </div>
  );
}

export function SubmitButton({ children, busy }: { children: ReactNode; busy?: boolean }) {
  return (
    <button type="submit" disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 bg-ink text-[15px] font-semibold text-paper transition-colors hover:bg-ink-2 disabled:opacity-60">
      {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" aria-label="Working" /> : <>{children}<span aria-hidden="true" className="text-crown">→</span></>}
    </button>
  );
}

export function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++; if (pw.length >= 12) s++; if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++; if (/\d/.test(pw)) s++; if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s);
}
