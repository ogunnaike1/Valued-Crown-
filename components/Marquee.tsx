export default function Marquee({ items, reverse = false, duration = 45 }: { items: string[]; reverse?: boolean; duration?: number }) {
  const row = (hidden: boolean) => (
    <ul className="flex flex-none gap-3 pr-3 m-0 p-0 list-none" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li
          key={t}
          className="flex-none h-[50px] px-6 flex items-center text-[15px] font-medium whitespace-nowrap bg-[color-mix(in_srgb,currentColor_8%,transparent)] transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          {t}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="vc-marquee flex overflow-hidden" style={{ ["--dur" as string]: `${duration}s`, ["--dir" as string]: reverse ? "reverse" : "normal" }}>
      <div className="vc-marquee-track flex flex-none">{row(false)}{row(true)}</div>
    </div>
  );
}
