import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.ts"],
  theme: {
    extend: {
      colors: {
        ink: "#041433",
        crown: "#E27C22", // accent colour: the logo crown
        "ink-2": "#0A1E45",
        paper: "#FAFCFF",
        slate: "#5B6B8A",
        "slate-2": "#3A4660",
        grey: "#8A93A6",
        line: "#E3E4E8",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: { none: "0" },
      transitionTimingFunction: {
        std: "cubic-bezier(0.22, 1, 0.36, 1)",
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        curtain: "cubic-bezier(0.76, 0, 0.24, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
