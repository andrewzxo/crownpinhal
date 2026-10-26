"use client";

import { useAppStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthForm } from "./AuthGate";
import { Crown } from "lucide-react";

export default function AuthModal() {
  const authModal = useAppStore((s) => s.authModal);
  const closeAuthModal = useAppStore((s) => s.closeAuthModal);

  return (
    <Dialog open={authModal.open} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="bg-[#0d0d0d] border-[#2a2a2a] max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center mb-2 gold-glow-sm">
            <Crown className="w-7 h-7 text-black" />
          </div>
          <DialogTitle className="text-center font-display text-xl uppercase tracking-wide">
            {authModal.tab === "register" ? "Crie sua conta" : "Acesse sua conta"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {authModal.reason ||
              "Para assinar um plano da CROWN, é necessário entrar ou criar sua conta."}
          </DialogDescription>
        </DialogHeader>
        <AuthForm onSuccess={() => closeAuthModal()} />
      </DialogContent>
    </Dialog>
  );
}
