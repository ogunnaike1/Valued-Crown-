"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import AuthShell, { useProduct } from "./AuthShell";
import { Field, PasswordInput, SubmitButton, TextInput, strength } from "./fields";
import { products, type ProductSlug } from "@/data/products";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const phoneOk = (v: string) => /^(\+?234|0)[789][01]\d{8}$/.test(v.replace(/[\s-]/g, ""));
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * DEMO ONLY: there is no auth backend. This stores a local session so the back office opens.
 * Replace `signIn` with a real call (NextAuth, Clerk, your API) that returns the products the account owns.
 */
function startDemoSession(email: string, products: ProductSlug[]) {
  try { localStorage.setItem("vc-demo-session", JSON.stringify({ email, products })); } catch { /* ignore */ }
}

export function LoginForm() {
  const router = useRouter(); const product = useProduct();
  const next = product ? `?product=${product.slug}` : "";
  const [err, setErr] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget); const email = String(f.get("email") || "").trim(); const pw = String(f.get("password") || "");
    const n = { email: emailOk(email) ? undefined : "Enter a valid email address", password: pw ? undefined : "Enter your password" };
    setErr(n); if (n.email || n.password) return;
    setBusy(true); await wait(700); startDemoSession(email, products.map((p) => p.slug)); router.push(`/admin${next}`);
  }

  return (
    <AuthShell title="Welcome back" subtitle={product ? `Sign in to your ${product.name} dashboard.` : "Sign in to your client dashboard."}
      footer={<>New to Valued Crown? <Link href={`/signup${next}`} className="font-semibold text-ink underline decoration-crown underline-offset-4">Create an account</Link></>}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <Field label="Email" error={err.email}><TextInput name="email" type="email" autoComplete="email" placeholder="you@business.com" error={err.email} /></Field>
        <Field label="Password" error={err.password} right={<Link href="/forgot-password" className="text-[13px] font-semibold text-slate hover:text-ink">Forgot password?</Link>}><PasswordInput name="password" autoComplete="current-password" placeholder="Your password" error={err.password} /></Field>
        <label className="flex items-center gap-2.5 text-[14px] text-slate"><input type="checkbox" name="remember" className="h-4 w-4 accent-[#E27C22]" />Keep me signed in on this device</label>
        <SubmitButton busy={busy}>Sign in</SubmitButton>
        <p className="text-center text-[12.5px] text-grey">Demo mode: any valid email and password opens the sample dashboard.</p>
      </form>
    </AuthShell>
  );
}

export function SignupForm() {
  const router = useRouter(); const pre = useProduct();
  const [step, setStep] = useState<1 | 2>(1);
  const [picked, setPicked] = useState<ProductSlug[]>(pre ? [pre.slug] : []);
  const [pw, setPw] = useState("");
  const [data, setData] = useState({ name: "", email: "", phone: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const sc = strength(pw);

  function next(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget); const d = { name: String(f.get("name") || "").trim(), email: String(f.get("email") || "").trim(), phone: String(f.get("phone") || "").trim() };
    const n: Record<string, string> = {};
    if (d.name.length < 2) n.name = "Enter your full name";
    if (!emailOk(d.email)) n.email = "Enter a valid email address";
    if (!phoneOk(d.phone)) n.phone = "Enter a Nigerian phone number, e.g. 0803 123 4567";
    if (pw.length < 8) n.password = "Use at least 8 characters";
    setErr(n); setData(d); if (Object.keys(n).length === 0) setStep(2);
  }

  async function finish(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget); const n: Record<string, string> = {};
    if (String(f.get("business") || "").trim().length < 2) n.business = "Enter your business name";
    if (picked.length === 0) n.products = "Choose at least one product";
    if (!f.get("terms")) n.terms = "Please accept the terms to continue";
    setErr(n); if (Object.keys(n).length) return;
    setBusy(true); await wait(900); startDemoSession(data.email, picked); router.push(`/admin?product=${picked[0]}`);
  }

  return (
    <AuthShell title={step === 1 ? "Create your account" : "Tell us about your business"} subtitle={step === 1 ? "Set up access to your client dashboard." : "We'll tailor the dashboard to the products you use."}
      footer={<>Already have an account? <Link href={`/login${pre ? `?product=${pre.slug}` : ""}`} className="font-semibold text-ink underline decoration-crown underline-offset-4">Sign in</Link></>}>
      <ol className="mb-7 flex items-center gap-3 text-[12.5px] font-semibold" aria-label="Progress">
        {["Account", "Business"].map((l, i) => (
          <li key={l} className="flex flex-1 flex-col gap-2" aria-current={step === i + 1 ? "step" : undefined}><span className={`h-1 ${step >= i + 1 ? "bg-crown" : "bg-line"}`} /><span className={step >= i + 1 ? "text-ink" : "text-grey"}>{i + 1}. {l}</span></li>
        ))}
      </ol>

      {step === 1 ? (
        <form onSubmit={next} noValidate className="flex flex-col gap-5">
          <Field label="Full name" error={err.name}><TextInput name="name" autoComplete="name" defaultValue={data.name} placeholder="Adaeze Okonkwo" error={err.name} /></Field>
          <Field label="Work email" error={err.email}><TextInput name="email" type="email" autoComplete="email" defaultValue={data.email} placeholder="you@business.com" error={err.email} /></Field>
          <Field label="Phone / WhatsApp" error={err.phone}><TextInput name="phone" type="tel" autoComplete="tel" defaultValue={data.phone} placeholder="0803 123 4567" error={err.phone} /></Field>
          <Field label="Password" error={err.password} hint={pw ? undefined : "At least 8 characters. Mix letters, numbers and symbols."}>
            <PasswordInput name="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Create a password" error={err.password} />
            {pw && <div className="mt-1 flex items-center gap-3" aria-live="polite"><div className="flex flex-1 gap-1">{[1, 2, 3, 4].map((i) => <span key={i} className="h-1 flex-1" style={{ background: i <= sc ? ["", "#C62828", "#E27C22", "#B8A100", "#1B8F5A"][sc] : "#E3E4E8" }} />)}</div><span className="text-[12.5px] text-slate">{["", "Weak", "Fair", "Good", "Strong"][sc]}</span></div>}
          </Field>
          <SubmitButton>Continue</SubmitButton>
        </form>
      ) : (
        <form onSubmit={finish} noValidate className="flex flex-col gap-5">
          <Field label="Business name" error={err.business}><TextInput name="business" autoComplete="organization" placeholder="e.g. Lekki Grand Hotel" error={err.business} /></Field>
          <fieldset>
            <legend className="mb-2 text-[13.5px] font-semibold">Which products do you use?</legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {products.map((p) => {
                const on = picked.includes(p.slug);
                return (
                  <label key={p.slug} className={`flex cursor-pointer flex-col gap-1 border p-3.5 transition-colors ${on ? "border-crown bg-crown/[.07]" : "border-line bg-white hover:border-grey"}`}>
                    <input type="checkbox" className="sr-only" checked={on} onChange={() => setPicked((s) => (on ? s.filter((x) => x !== p.slug) : [...s, p.slug]))} />
                    <span className="flex items-center justify-between font-semibold text-[14.5px]">{p.name}<span className={`grid h-4 w-4 place-items-center border text-[10px] leading-none text-white ${on ? "border-crown bg-crown" : "border-grey"}`} aria-hidden="true">{on && "✓"}</span></span>
                    <span className="text-[12.5px] text-slate">{p.industry}</span>
                  </label>
                );
              })}
            </div>
            {err.products && <p role="alert" className="mt-1.5 text-[12.5px] text-[#C62828]">{err.products}</p>}
          </fieldset>
          <Field label="Number of branches">
            <select name="branches" defaultValue="1" className="h-12 w-full border border-line bg-white px-3 text-[15px] outline-none focus:border-crown focus:ring-2 focus:ring-crown/25"><option value="1">1 location</option><option value="2-5">2 – 5 locations</option><option value="6+">6 or more</option></select>
          </Field>
          <div>
            <label className="flex items-start gap-2.5 text-[14px] text-slate"><input type="checkbox" name="terms" className="mt-1 h-4 w-4 accent-[#E27C22]" /><span>I agree to the <Link href="/terms" target="_blank" className="font-semibold text-ink underline">Terms</Link> and <Link href="/privacy" target="_blank" className="font-semibold text-ink underline">Privacy Policy</Link>.</span></label>
            {err.terms && <p role="alert" className="mt-1.5 text-[12.5px] text-[#C62828]">{err.terms}</p>}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="h-12 flex-none border border-ink px-5 text-[15px] font-semibold hover:bg-ink hover:text-paper">Back</button>
            <div className="flex-1"><SubmitButton busy={busy}>Create account</SubmitButton></div>
          </div>
        </form>
      )}
    </AuthShell>
  );
}

export function ForgotForm() {
  const [sent, setSent] = useState<string | null>(null);
  const [err, setErr] = useState<string>();
  const [busy, setBusy] = useState(false);
  const q = useSearchParams().get("product");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "").trim();
    if (!emailOk(email)) return setErr("Enter a valid email address");
    setErr(undefined); setBusy(true); await wait(700); setBusy(false); setSent(email);
  }
  return (
    <AuthShell title={sent ? "Check your email" : "Reset your password"} subtitle={sent ? `If an account exists for ${sent}, we've sent a link to reset your password.` : "Enter your email and we'll send you a reset link."}
      footer={<Link href={`/login${q ? `?product=${q}` : ""}`} className="font-semibold text-ink underline decoration-crown underline-offset-4">← Back to sign in</Link>}>
      {sent ? (
        <div className="border border-line bg-white p-5 text-[14px] leading-[1.6] text-slate">Didn&apos;t get it? Check your spam folder, or <button onClick={() => setSent(null)} className="font-semibold text-ink underline">try another address</button>. Still stuck? Email <a href="mailto:info@vctech.ng" className="font-semibold text-ink underline">info@vctech.ng</a>.</div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <Field label="Email" error={err}><TextInput name="email" type="email" autoComplete="email" placeholder="you@business.com" error={err} /></Field>
          <SubmitButton busy={busy}>Send reset link</SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}
