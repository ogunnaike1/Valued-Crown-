import Reveal from "../Reveal";
import SplitHeading from "../SplitHeading";
import { retailOperations } from "@/data/products";

// Every point comes from the retail system documentation (security, roles, backups, SLA, maintenance, deployment).
const items = [
  { title: "Secure access", body: `Authentication and role-based access: ${retailOperations.roles.map((r) => `${r.role.toLowerCase()} (${r.access.toLowerCase()})`).join(", ")}.` },
  { title: "Daily backups", body: "Business data is backed up every day, and cloud or on-premise deployment options are available." },
  { title: "Fast support", body: "Critical issues get a response within 1 hour and are resolved within 4 hours. High priority gets a response within 2 hours." },
  { title: "Regular maintenance", body: "Weekly checks, monthly audits and updates keep every installation healthy." },
];

/** Quiet navy section: a wide heading, then four hairline-topped columns. No panels, icons or pills. */
export default function Trust() {
  return (
    <section data-theme="ink" className="bg-ink text-paper px-page py-[clamp(56px,7vw,110px)]">
      <div className="wrap flex flex-col gap-[clamp(40px,5vw,80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] gap-x-[clamp(40px,7vw,120px)] gap-y-6 items-end">
          <div className="flex flex-col gap-6">
            <Reveal as="span" className="label opacity-60">Security and support</Reveal>
            <SplitHeading
              className="font-display text-[clamp(28px,3.2vw,44px)] leading-[1.12] tracking-[-0.02em]"
              lines={[{ text: "Your data is protected", pad: 0.08 }, { text: "and supported.", pad: 0.1, style: { opacity: 0.4 } }]}
            />
          </div>
          <Reveal as="p" delay={100} className="m-0 max-w-[380px] text-[15.5px] leading-[1.7] opacity-65">
            Access controls, daily backups and a clear support commitment, so the software your business runs on stays reliable.
          </Reveal>
        </div>

        <div role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[clamp(24px,3vw,48px)]">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 80}>
              <div role="listitem" className="group relative flex flex-col gap-4 pt-6 pb-10">
                <span aria-hidden="true" data-line className="absolute left-0 right-0 -top-px h-px bg-paper/20" />
                <span aria-hidden="true" className="absolute left-0 right-0 -top-px h-px bg-[#E27C22] origin-left scale-x-0 transition-transform duration-700 ease-std group-hover:scale-x-100" />
                <h3 className="m-0 font-display text-[clamp(20px,1.8vw,24px)] leading-[1.2] tracking-[-0.015em] transition-transform duration-500 ease-std group-hover:translate-x-1">{it.title}</h3>
                <p className="m-0 text-[15px] leading-[1.7] opacity-65">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
