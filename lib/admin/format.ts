export const naira = (n: number, decimals = 0) =>
  "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export const compactNaira = (n: number) => {
  const a = Math.abs(n);
  if (a >= 1e9) return `₦${(n / 1e9).toFixed(1)}B`;
  if (a >= 1e6) return `₦${(n / 1e6).toFixed(a >= 1e7 ? 1 : 2)}M`;
  if (a >= 1e3) return `₦${(n / 1e3).toFixed(0)}K`;
  return `₦${Math.round(n)}`;
};

export const num = (n: number) => n.toLocaleString("en-NG");

/** Percent change. Returns null (render "—") when there is nothing to compare, never a bogus −100%. */
export function delta(cur: number, prev: number): number | null {
  if (!prev && !cur) return null;
  if (!prev) return null;
  return ((cur - prev) / prev) * 100;
}

export const fmtDelta = (d: number | null) => (d === null ? "—" : `${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(1)}%`);

export const dateShort = (d: Date) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const dayShort = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export function timeAgo(mins: number) {
  if (mins < 1) return "just now";
  if (mins < 60) return `${Math.round(mins)} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
  return `${Math.round(mins / 1440)} d ago`;
}

export function greeting(d = new Date()) {
  const h = d.getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
