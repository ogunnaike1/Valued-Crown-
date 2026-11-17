import Btn from "../Btn";
import Reveal from "../Reveal";
import SplitHeading, { type SplitLine } from "../SplitHeading";

interface Props {
  kicker?: string;
  lines?: SplitLine[];
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  theme?: "paper" | "ink";
}

export default function CTA({
  kicker = "Start a conversation",
  lines = [{ text: "Let's build a smarter", pad: 0.1 }, { text: "way to work.", pad: 0.12, style: { opacity: 0.5 } }],
  text = "Tell us about your business and we'll show you how our software fits the way you operate.",
  primary = { label: "Contact us", href: "/contact" },
  secondary = { label: "Explore our products", href: "/products" },
  theme = "paper",
}: Props) {
  const dark = theme === "ink";
  return (
    <section data-theme={theme} className={`px-page py-[clamp(36px,4.5vw,65px)] ${dark ? "bg-ink text-paper" : "hair-t"}`}>
      <div className="wrap flex flex-col items-center text-center gap-5">
        <Reveal as="span" className="label opacity-60">{kicker}</Reveal>
        <SplitHeading className="font-display font-medium text-[clamp(34px,4.6vw,64px)] leading-[1.1] tracking-[-0.03em] text-center" lines={lines} />
        <Reveal as="p" className="m-0 max-w-[520px] text-[clamp(16px,1.2vw,18px)] leading-[1.6] opacity-75 [text-wrap:balance]">{text}</Reveal>
        <Reveal delay={120} className="mt-3 flex flex-wrap justify-center gap-2">
          <Btn href={primary.href} label={primary.label} arrow height={56} padX={26} bg={dark ? "#FAFCFF" : undefined} fg={dark ? "#041433" : undefined} />
          <Btn href={secondary.href} label={secondary.label} variant="outline" height={56} padX={26} borderColor={dark ? "#FAFCFF" : "#041433"} />
        </Reveal>
      </div>
    </section>
  );
}
