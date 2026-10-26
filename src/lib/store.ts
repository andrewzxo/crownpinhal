"use client";

import { create } from "zustand";
import type { ContentResponse, SessionUser } from "@/lib/types";

export type View = "site" | "admin" | "owner";

interface AuthModalState {
  open: boolean;
  reason: string | null;
  tab: "login" | "register";
}

interface AppState {
  authChecked: boolean;
  user: SessionUser | null;
  visitor: boolean;
  view: View;
  content: ContentResponse | null;
  contentLoading: boolean;
  authModal: AuthModalState;
  subscribePlanId: string | null;

  setUser: (user: SessionUser | null) => void;
  setVisitor: (visitor: boolean) => void;
  setView: (view: View) => void;
  setContent: (content: ContentResponse | null) => void;
  openAuthModal: (reason?: string | null, tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  openSubscribe: (planId: string) => void;
  closeSubscribe: () => void;
  refreshContent: () => Promise<void>;
  logout: () => Promise<void>;
}

export const VISITOR_KEY = "crown_visitor";

export const useAppStore = create<AppState>((set, get) => ({
  authChecked: false,
  user: null,
  visitor: false,
  view: "site",
  content: null,
  contentLoading: true,
  authModal: { open: false, reason: null, tab: "login" },
  subscribePlanId: null,

  setUser: (user) =>
    set({
      user,
      visitor: user ? false : get().visitor,
      view: "site",
      authChecked: true,
    }),
  setVisitor: (visitor) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(VISITOR_KEY, visitor ? "1" : "0");
    }
    set({ visitor, view: "site", authChecked: true });
  },
  setView: (view) => set({ view }),
  setContent: (content) => set({ content, contentLoading: false }),

  openAuthModal: (reason = null, tab = "login") =>
    set({ authModal: { open: true, reason, tab } }),
  closeAuthModal: () => set({ authModal: { open: false, reason: null, tab: "login" } }),

  openSubscribe: (planId) => set({ subscribePlanId: planId }),
  closeSubscribe: () => set({ subscribePlanId: null }),

  refreshContent: async () => {
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      const data = await res.json();
      set({ content: data, contentLoading: false });
    } catch {
      set({ contentLoading: false });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem(VISITOR_KEY);
      }
      set({
        user: null,
        visitor: false,
        view: "site",
        content: null,
        contentLoading: true,
        authChecked: true,
      });
      await get().refreshContent();
    }
  },
}));
