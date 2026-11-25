import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.ts", "./lib/**/*.ts"],
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
        // admin back-office tokens (RGB triplets in globals.css, switched by [data-admin-theme])
        "a-bg": "rgb(var(--a-bg) / <alpha-value>)",
        "a-surface": "rgb(var(--a-surface) / <alpha-value>)",
        "a-surface2": "rgb(var(--a-surface2) / <alpha-value>)",
        "a-line": "rgb(var(--a-line) / <alpha-value>)",
        "a-fg": "rgb(var(--a-fg) / <alpha-value>)",
        "a-mute": "rgb(var(--a-mute) / <alpha-value>)",
        "a-accent": "rgb(var(--a-accent) / <alpha-value>)",
        "a-accent-fg": "rgb(var(--a-accent-fg) / <alpha-value>)",
        "a-accent-text": "rgb(var(--a-accent-text) / <alpha-value>)",
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
