"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { WORKSPACES, BRANCHES, type Workspace, type WorkspaceSlug, type Branch } from "./config";

export type Theme = "light" | "dark";

/** Demo identity. No auth exists in this repo yet: swap for the real session (role + purchased products). */
export const DEMO_USER = { name: "Olusegun Ogunnaike", initials: "OO", role: "Administrator", email: "admin@valuedcrown.example", products: Object.keys(WORKSPACES) as WorkspaceSlug[] };

interface Ctx {
  ready: boolean;
  workspace: Workspace;
  setWorkspace: (s: WorkspaceSlug) => void;
  owned: Workspace[];
  branch: Branch | null; // null = all branches
  setBranch: (id: string | "all") => void;
  theme: Theme;
  toggleTheme: () => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  pinned: string[];
  togglePin: (href: string) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  now: Date;
  toast: (msg: string, tone?: "ok" | "error") => void;
  toasts: { id: number; msg: string; tone: "ok" | "error" }[];
}

const AdminCtx = createContext<Ctx | null>(null);
export const useAdmin = () => { const c = useContext(AdminCtx); if (!c) throw new Error("useAdmin outside AdminProvider"); return c; };

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } };

export function AdminProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [slug, setSlug] = useState<WorkspaceSlug>(DEMO_USER.products[0]);
  const [branchId, setBranchId] = useState<string>("all");
  const [theme, setTheme] = useState<Theme>("light");
  const [collapsed, setCollapsedS] = useState(false);
  const [pinned, setPinned] = useState<string[]>([]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [toasts, setToasts] = useState<Ctx["toasts"]>([]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("product") as WorkspaceSlug | null;
    const saved = (q && WORKSPACES[q] ? q : read("vc-admin-product")) as WorkspaceSlug | null;
    if (saved && DEMO_USER.products.includes(saved)) setSlug(saved);
    setBranchId(read("vc-admin-branch") || "all");
    setTheme((read("vc-admin-theme") as Theme) || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    setCollapsedS(read("vc-admin-collapsed") === "1");
    try { setPinned(JSON.parse(read("vc-admin-pins") || "[]")); } catch { setPinned([]); }
    setReady(true);
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const setWorkspace = useCallback((s: WorkspaceSlug) => { setSlug(s); write("vc-admin-product", s); }, []);
  const setBranch = useCallback((id: string) => { setBranchId(id); write("vc-admin-branch", id); }, []);
  const toggleTheme = useCallback(() => setTheme((t) => { const n = t === "dark" ? "light" : "dark"; write("vc-admin-theme", n); return n; }), []);
  const setCollapsed = useCallback((v: boolean) => { setCollapsedS(v); write("vc-admin-collapsed", v ? "1" : "0"); }, []);
  const togglePin = useCallback((href: string) => setPinned((p) => { const n = p.includes(href) ? p.filter((x) => x !== href) : [...p, href]; write("vc-admin-pins", JSON.stringify(n)); return n; }), []);
  const toast = useCallback((msg: string, tone: "ok" | "error" = "ok") => { const id = Date.now() + Math.random(); setToasts((t) => [...t, { id, msg, tone }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500); }, []);

  const value = useMemo<Ctx>(() => ({
    ready, workspace: WORKSPACES[slug], setWorkspace, owned: DEMO_USER.products.map((p) => WORKSPACES[p]),
    branch: BRANCHES.find((b) => b.id === branchId) ?? null, setBranch, theme, toggleTheme, collapsed, setCollapsed,
    pinned, togglePin, paletteOpen, setPaletteOpen, now, toast, toasts,
  }), [ready, slug, setWorkspace, branchId, setBranch, theme, toggleTheme, collapsed, setCollapsed, pinned, togglePin, paletteOpen, now, toast, toasts]);

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}
