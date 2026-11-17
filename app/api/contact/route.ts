import { NextResponse } from "next/server";

const INTERESTS = new Set(["general", "hotel-manager", "restaurant-manager", "retail-manager", "laundry-manager"]);
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Contact form endpoint. Validates the submission and forwards it as JSON to CONTACT_WEBHOOK_URL
 * (e.g. a Zapier / Make / Slack / Formspree-compatible endpoint). Without a webhook configured it only
 * logs the message server-side in development and returns 503 in production, so submissions are never
 * silently dropped while appearing to succeed.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (clean(body.website, 200)) return NextResponse.json({ ok: true }); // honeypot: pretend success to bots

  const msg = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    interest: INTERESTS.has(clean(body.interest, 40)) ? clean(body.interest, 40) : "general",
    message: clean(body.message, 4000),
    receivedAt: new Date().toISOString(),
  };
  if (!msg.name || !/^\S+@\S+\.\S+$/.test(msg.email) || msg.message.length < 10) {
    return NextResponse.json({ error: "Please complete the required fields." }, { status: 422 });
  }

  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(msg) });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error("[contact] webhook failed", e);
      return NextResponse.json({ error: "We couldn't send your message. Please try again shortly." }, { status: 502 });
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[contact] (no CONTACT_WEBHOOK_URL set — dev only)", msg);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Messaging isn't configured yet. Please try again later." }, { status: 503 });
}
