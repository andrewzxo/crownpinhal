"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Crown, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import type { SubscriptionDTO } from "@/lib/types";

export default function SubscribeModal() {
  const planId = useAppStore((s) => s.subscribePlanId);
  const closeSubscribe = useAppStore((s) => s.closeSubscribe);
  const content = useAppStore((s) => s.content);
  const user = useAppStore((s) => s.user);
  const openAuthModal = useAppStore((s) => s.openAuthModal);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const plan = content?.plans.find((p) => p.id === planId) ?? null;

  useEffect(() => {
    if (!planId) {
      setNotes("");
      setDone(false);
      setLoading(false);
    }
  }, [planId]);

  async function handleSubscribe() {
    if (!plan) return;
    if (!user) {
      closeSubscribe();
      openAuthModal("Para assinar um plano, entre ou crie sua conta primeiro.", "register");
      return;
    }
    setLoading(true);
    try {
      await api<{ subscription: SubscriptionDTO }>("/api/subscriptions", {
        method: "POST",
        body: JSON.stringify({ planId: plan.id, notes }),
      });
      setDone(true);
      toast.success(`Pedido do plano ${plan.name} enviado! Em breve entraremos em contato.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao assinar plano.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={!!planId} onOpenChange={(open) => !open && closeSubscribe()}>
      <DialogContent className="bg-[#0d0d0d] border-[#2a2a2a] max-w-md">
        {plan ? (
          done ? (
            <div className="py-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center gold-glow mb-4">
                <BadgeCheck className="w-8 h-8 text-black" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-center font-display text-2xl uppercase">
                  Pedido <span className="text-gold-gradient">enviado!</span>
                </DialogTitle>
                <DialogDescription className="text-center text-muted-foreground mt-2">
                  Recebemos seu interesse no plano <strong className="text-[#d9a441]">{plan.name}</strong>.
                  Nossa equipe entrará em contato pelo e-mail{" "}
                  <strong className="text-foreground">{user?.email}</strong> para finalizar sua
                  assinatura.
                </DialogDescription>
              </DialogHeader>
              <Button
                onClick={closeSubscribe}
                className="mt-6 w-full h-11 bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-semibold"
              >
                <Crown className="w-4 h-4 mr-2" />
                Entendi
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <p className="font-heading uppercase tracking-[0.3em] text-xs text-[#d9a441]">
                  Assinatura CROWN
                </p>
                <DialogTitle className="font-display text-2xl uppercase tracking-wide">
                  Plano <span className="text-gold-gradient">{plan.name}</span>
                </DialogTitle>
                <DialogDescription>
                  {plan.description}{" "}
                  {plan.price !== null
                    ? `— R$ ${plan.price.toFixed(2).replace(".", ",")}${plan.period ? ` / ${plan.period}` : ""}`
                    : "— Valores disponíveis na recepção ou pelo WhatsApp."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="rounded-lg bg-[#0a0a0a] border border-[#262626] p-4 space-y-2">
                  <p className="font-heading uppercase text-xs tracking-wider text-[#d9a441]">
                    Incluído no plano
                  </p>
                  <ul className="space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Crown className="w-3.5 h-3.5 mt-0.5 text-[#d9a441] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="sub-notes"
                    className="font-heading uppercase text-xs tracking-wider text-[#d9a441]"
                  >
                    Observação <span className="text-muted-foreground normal-case">(opcional)</span>
                  </label>
                  <Textarea
                    id="sub-notes"
                    placeholder="Ex: tenho interesse em musculação à noite, gostaria de saber mais sobre as condições..."
                    className="bg-[#0a0a0a] border-[#2a2a2a] min-h-[80px] focus-visible:ring-[#d9a441]/50"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="rounded-lg bg-[#d9a441]/5 border border-[#d9a441]/20 p-3 text-xs text-muted-foreground">
                  Pedido será feito em nome de{" "}
                  <strong className="text-foreground">{user?.name}</strong> ({user?.email}). O
                  dono da academia receberá seu pedido no painel de controle.
                </div>

                <Button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full h-12 bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-semibold text-base gold-glow-sm"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Crown className="w-5 h-5" />
                  )}
                  Confirmar assinatura
                </Button>
              </div>
            </>
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
