import LogoMark from "./LogoMark";

export type LogoTone = "light" | "ink";

/**
 * Header logo: the VC crown mark (true vector) plus a live-typeset
 * wordmark that inherits the surrounding text colour.
 */
export default function Logo({ tone, className = "" }: { tone: LogoTone; className?: string }) {
  return (
    <span className={`flex items-center gap-[10px] ${className}`}>
      <span className="block h-[34px] w-[50px] flex-none transition-colors duration-500" style={{ color: tone === "light" ? "#FAFCFF" : "#041433" }} aria-hidden="true">
        <LogoMark className="w-full h-full" />
      </span>
      <span className="flex flex-col leading-none whitespace-nowrap">
        <span className="font-display font-bold text-[21px] tracking-[-0.035em]">Valued Crown</span>
        <span className="font-mono text-[8px] tracking-[.34em] uppercase opacity-65 mt-[5px]">Technologies</span>
      </span>
    </span>
  );
}
