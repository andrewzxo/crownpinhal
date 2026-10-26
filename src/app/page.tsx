"use client";

import { useEffect } from "react";
import { Crown } from "lucide-react";
import { api } from "@/lib/api";
import { useAppStore, VISITOR_KEY } from "@/lib/store";
import type { SessionUser } from "@/lib/types";
import AuthGate from "@/components/crown/AuthGate";
import AuthModal from "@/components/crown/AuthModal";
import SubscribeModal from "@/components/crown/SubscribeModal";
import SiteView from "@/components/crown/SiteView";
import AdminPanel from "@/components/crown/admin/AdminPanel";
import OwnerDashboard from "@/components/crown/admin/OwnerDashboard";

function Splash() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
      <div className="animate-pulse-gold">
        <img
          src="/logo.png"
          alt="Carregando CROWN Academia"
          className="w-64 gold-drop-glow"
        />
      </div>
      <p className="font-heading uppercase tracking-[0.4em] text-xs text-[#d9a441] animate-pulse">
        Carregando o império...
      </p>
    </div>
  );
}

export default function Home() {
  const authChecked = useAppStore((s) => s.authChecked);
  const user = useAppStore((s) => s.user);
  const visitor = useAppStore((s) => s.visitor);
  const view = useAppStore((s) => s.view);
  const setUser = useAppStore((s) => s.setUser);
  const setVisitor = useAppStore((s) => s.setVisitor);
  const refreshContent = useAppStore((s) => s.refreshContent);

  useEffect(() => {
    (async () => {
      try {
        const { user } = await api<{ user: SessionUser | null }>("/api/auth/me");
        const isVisitor =
          typeof window !== "undefined" && localStorage.getItem(VISITOR_KEY) === "1";
        if (user) {
          setUser(user);
        } else if (isVisitor) {
          setVisitor(true);
        } else {
          setUser(null); // mostra o portão de acesso
        }
      } catch {
        setUser(null);
      }
      refreshContent();
    })();
  }, []);

  if (!authChecked) return <Splash />;

  if (!user && !visitor) return <AuthGate />;

  if (user && view === "admin") {
    return (
      <>
        <AdminPanel />
        <AuthModal />
        <SubscribeModal />
      </>
    );
  }

  if (user && view === "owner") {
    return (
      <>
        <OwnerDashboard />
        <AuthModal />
        <SubscribeModal />
      </>
    );
  }

  return (
    <>
      <SiteView />
      <AuthModal />
      <SubscribeModal />
    </>
  );
}
