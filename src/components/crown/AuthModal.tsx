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

export default function AuthModal() {
  const authModal = useAppStore((s) => s.authModal);
  const closeAuthModal = useAppStore((s) => s.closeAuthModal);

  return (
    <Dialog open={authModal.open} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="bg-[#17171b] border-[#2b2b31] text-zinc-100 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-xl uppercase tracking-wide text-white">
            {authModal.tab === "register" ? "Crie sua conta" : "Acesse sua conta"}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            {authModal.reason ||
              "Para assinar um plano da CROWN, é necessário entrar ou criar sua conta."}
          </DialogDescription>
        </DialogHeader>
        <AuthForm onSuccess={() => closeAuthModal()} />
      </DialogContent>
    </Dialog>
  );
}
