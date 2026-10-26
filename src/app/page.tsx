"use client";

import { useEffect } from "react";
import { Crown } from "lucide-react";
import { toast } from "sonner";
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
    <div className="min-h-screen bg-[#101013] flex flex-col items-center justify-center gap-10">
      <img
        src="/logo.png"
        alt="Carregando CROWN Academia"
        className="w-72 sm:w-96 animate-pulse"
      />
      <p className="font-heading uppercase tracking-[0.4em] text-xs text-zinc-500">
        Carregando...
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
    // Retorno do login com Google
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const googleError = params.get("googleError");
      const googleSuccess = params.get("googleSuccess");
      if (googleError || googleSuccess) {
        let msg = "";
        if (googleError === "config") {
          msg =
            "Login com Google ainda não configurado. Adicione GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no arquivo .env do servidor.";
        } else if (googleError === "state") {
          msg = "Sessão de login com Google expirada. Tente novamente.";
        } else if (googleError) {
          msg = "Não foi possível entrar com o Google. Tente novamente.";
        } else {
          msg = "Login com Google realizado!";
        }
        // pequeno atraso: evita perder o toast no remount do StrictMode
        const kind = googleError ? "error" : "success";
        setTimeout(() => {
          if (kind === "error") toast.error(msg);
          else toast.success(msg);
        }, 150);
        params.delete("googleError");
        params.delete("googleSuccess");
        const qs = params.toString();
        window.history.replaceState(
          {},
          "",
          window.location.pathname + (qs ? `?${qs}` : "")
        );
      }
    }

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
