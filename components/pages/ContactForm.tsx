"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { products } from "@/data/products";

type Status = "idle" | "sending" | "sent" | "error";
const interests = [
  { value: "general", label: "General enquiry" },
  ...products.map((p) => ({ value: p.slug, label: p.name })),
];

const field = "w-full bg-transparent border-0 border-b border-current/40 py-3 text-[17px] outline-none transition-colors duration-300 focus:border-[#E27C22] placeholder:text-current/40";

/** The form itself. `tone` is the background it sits on: "dark" (the Contact page) or "light" (the pop-up). */
export function ContactFields({ interest: initial, tone = "dark" }: { interest?: string | null; tone?: "dark" | "light" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const errs: Record<string, string> = {};
    if (!data.name?.trim()) errs.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) errs.email = "Please enter a valid email";
    if (!data.message?.trim() || data.message.trim().length < 10) errs.message = "Tell us a little more (at least 10 characters)";
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col gap-4 py-10">
        
        <h3 className="m-0 font-display font-medium text-[clamp(28px,2.2vw,26px)] tracking-[-0.03em] leading-[1.08]">Message received.</h3>
        <p className="m-0 text-[17px] leading-[1.5] opacity-75 max-w-[460px]">Thank you for getting in touch. We&apos;ll review your message and respond as soon as we can.</p>
        <button onClick={() => setStatus("idle")} className="self-start underline underline-offset-4 text-[15px] font-medium bg-transparent text-inherit border-0 p-0 cursor-pointer">Send another message</button>
      </div>
    );
  }

  const err = (k: string) => (fieldErrors[k] ? <span role="alert" className="text-[13px] underline underline-offset-2">{fieldErrors[k]}</span> : null);
  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
      <label className="flex flex-col gap-1"><span className="label opacity-60">Name *</span><input name="name" autoComplete="name" className={field} placeholder="Your full name" />{err("name")}</label>
      <label className="flex flex-col gap-1"><span className="label opacity-60">Company</span><input name="company" autoComplete="organization" className={field} placeholder="Your business" /></label>
      <label className="flex flex-col gap-1"><span className="label opacity-60">Email *</span><input name="email" type="email" autoComplete="email" className={field} placeholder="you@company.com" />{err("email")}</label>
      <label className="flex flex-col gap-1"><span className="label opacity-60">Phone</span><input name="phone" type="tel" autoComplete="tel" className={field} placeholder="Optional" /></label>
      <label className="flex flex-col gap-1 sm:col-span-2">
        <span className="label opacity-60">I&apos;m interested in</span>
        <select name="interest" defaultValue={interests.some((i) => i.value === initial) ? initial! : "general"} className={`${field} appearance-none cursor-pointer`}>
          {interests.map((i) => <option key={i.value} value={i.value} className="text-ink">{i.label}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1 sm:col-span-2"><span className="label opacity-60">Message *</span><textarea name="message" rows={5} className={`${field} resize-y`} placeholder="Tell us about your business and what you need" />{err("message")}</label>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />
      <div className="sm:col-span-2 flex flex-wrap items-center gap-5">
        <button type="submit" disabled={status === "sending"} className={`h-[60px] px-8 font-medium text-[15px] flex items-center gap-3 cursor-pointer disabled:opacity-60 transition-transform duration-300 hover:-translate-y-[2px] ${tone === "dark" ? "bg-paper text-ink" : "bg-ink text-paper"}`}>
          {status === "sending" ? "Sending…" : "Send message"}<span>→</span>
        </button>
        {status === "error" ? <span role="alert" className="text-[14px] underline underline-offset-2">{error}</span> : null}
      </div>
    </form>
  );
}

/** Contact page version: reads the pre-selected product from ?interest=… */
export default function ContactForm() {
  const params = useSearchParams();
  return <ContactFields interest={params.get("interest")} tone="dark" />;
}
