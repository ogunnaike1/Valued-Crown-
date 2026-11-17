"use client";
import { useState } from "react";

/** Footer newsletter signup. Sent through the contact endpoint so it reaches the same webhook. */
export default function NewsletterForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setState("error"); return; }
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Newsletter subscriber", email, website: data.get("website"), message: "Newsletter subscription request from the website footer." }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
      <div className="flex h-14 max-w-[480px] rounded-full border border-paper/25 bg-paper/5 p-1.5 focus-within:border-paper/60 transition-colors">
        <input name="email" type="email" autoComplete="email" placeholder="Enter your email" aria-label="Email address" className="flex-1 min-w-0 px-5 bg-transparent text-paper placeholder:text-paper/45 outline-none text-[15px]" />
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button type="submit" disabled={state === "sending"} aria-label="Subscribe" className="w-12 rounded-full flex items-center justify-center bg-paper text-ink transition-transform hover:scale-105 disabled:opacity-60">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M21 3 3 10.5l7 2.5 2.5 7L21 3z" /><path d="m10 13 11-10" /></svg>
        </button>
      </div>
      <p role="status" className="m-0 text-[14px] min-h-[20px] opacity-80">
        {state === "done" && "Thanks for subscribing!"}
        {state === "error" && "Please enter a valid email and try again."}
      </p>
    </form>
  );
}
