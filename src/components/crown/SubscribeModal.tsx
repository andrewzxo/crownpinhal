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
import type { PlanDTO, PlanPriceOption, SubscriptionDTO } from "@/lib/types";

function brl(v: number) {
  const s = v.toFixed(2).replace(".", ",");
  return s.endsWith(",00") ? `R$ ${s.slice(0, -3)}` : `R$ ${s}`;
}

function PriceTable({ options }: { options: PlanPriceOption[] }) {
  return (
    <div className="bg-[#141418] border border-[#2b2b31] p-4 space-y-2">
      <p className="font-heading uppercase text-xs tracking-wider text-zinc-400">
        Valores do plano
      </p>
      <div className="space-y-2">
        {options.map((o) => (
          <div key={o.label} className="flex flex-col gap-0.5">
            <span className="font-heading uppercase tracking-wider text-xs text-zinc-400 leading-tight">
              {o.label}
            </span>
            <span className="font-display text-lg text-[#d9a441] whitespace-nowrap">
              {brl(o.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <DialogContent className="bg-[#17171b] border-[#2b2b31] text-zinc-100 max-w-md">
        {plan ? (
          done ? (
            <div className="py-6 text-center">
              <div className="mx-auto w-16 h-16 bg-[#222228] border border-[#3a3a42] flex items-center justify-center mb-4">
                <BadgeCheck className="w-8 h-8 text-[#d9a441]" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-center font-display text-2xl uppercase text-white">
                  Pedido <span className="text-[#d9a441]">enviado!</span>
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-400 mt-2">
                  Recebemos seu interesse no plano <strong className="text-[#d9a441]">{plan.name}</strong>.
                  Nossa equipe entrará em contato pelo e-mail{" "}
                  <strong className="text-zinc-100">{user?.email}</strong> para finalizar sua
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
                <p className="font-heading uppercase tracking-[0.3em] text-xs text-zinc-400">
                  Assinatura CROWN
                </p>
                <DialogTitle className="font-display text-2xl uppercase tracking-wide text-white">
                  Plano <span className="text-[#d9a441]">{plan.name}</span>
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  {plan.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {plan.priceOptions && plan.priceOptions.length > 0 ? (
                  <PriceTable options={plan.priceOptions} />
                ) : plan.price !== null ? (
                  <div className="bg-[#141418] border border-[#2b2b31] p-4">
                    <p className="font-display text-3xl text-[#d9a441]">
                      {brl(plan.price)}
                      {plan.period && (
                        <span className="text-sm font-heading uppercase tracking-wider text-zinc-400">
                          {" "}
                          /{plan.period}
                        </span>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#141418] border border-[#2b2b31] p-4">
                    <p className="text-sm text-zinc-400">
                      Valores disponíveis na recepção ou pelo WhatsApp.
                    </p>
                  </div>
                )}

                {plan.features.length > 0 && (
                  <div className="bg-[#141418] border border-[#2b2b31] p-4 space-y-2">
                    <p className="font-heading uppercase text-xs tracking-wider text-zinc-400">
                      Incluído no plano
                    </p>
                    <ul className="space-y-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="text-sm text-zinc-400 flex items-start gap-2">
                          <Crown className="w-3.5 h-3.5 mt-0.5 text-[#d9a441] shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="sub-notes"
                    className="font-heading uppercase text-xs tracking-wider text-[#d9a441]"
                  >
                    Observação <span className="text-zinc-400 normal-case">(opcional)</span>
                  </label>
                  <Textarea
                    id="sub-notes"
                    placeholder="Ex: tenho interesse em musculação à noite, gostaria de saber mais sobre as condições..."
                    className="bg-[#0a0a0a] border-[#2a2a2a] text-zinc-100 placeholder:text-zinc-500 min-h-[80px] focus-visible:ring-[#d9a441]/50"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="bg-[#141418] border border-[#2b2b31] p-3 text-xs text-zinc-400">
                  Pedido será feito em nome de{" "}
                  <strong className="text-zinc-100">{user?.name}</strong> ({user?.email}). O
                  dono da academia receberá seu pedido no painel de controle.
                </div>

                <Button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full h-12 bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-semibold text-base"
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
