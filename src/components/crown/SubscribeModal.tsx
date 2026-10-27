"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { WhatsAppIcon } from "./CtaSection";
import type { PlanDTO, PlanPriceOption, SubscriptionDTO } from "@/lib/types";

function brl(v: number) {
  const s = v.toFixed(2).replace(".", ",");
  return s.endsWith(",00") ? `R$ ${s.slice(0, -3)}` : `R$ ${s}`;
}

function OptionPicker({
  plan,
  selectedLabel,
  onSelect,
}: {
  plan: PlanDTO;
  selectedLabel: string | null;
  onSelect: (label: string) => void;
}) {
  const options = plan.priceOptions ?? [];
  return (
    <div
      role="radiogroup"
      aria-label={`Período do plano ${plan.name}`}
      className="bg-[#141418] border border-[#2b2b31] p-4 space-y-2"
    >
      <p className="font-heading uppercase text-xs tracking-wider text-zinc-400">
        Escolha o período
      </p>
      <div className="space-y-2">
        {options.map((o: PlanPriceOption) => {
          const isSelected = selectedLabel === o.label;
          return (
            <button
              key={o.label}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(o.label)}
              className={`w-full min-h-11 px-3 py-2 flex items-center justify-between gap-2 text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "border border-[#d9a441] bg-[#d9a441]/10"
                  : "border border-[#2b2b31] bg-[#0a0a0a] hover:border-[#3a3a42]"
              }`}
            >
              <span
                className={`font-heading uppercase tracking-wider text-[11px] leading-tight ${
                  isSelected ? "text-[#d9a441] font-bold" : "text-zinc-400"
                }`}
              >
                {o.label}
              </span>
              <span
                className={`font-display text-lg whitespace-nowrap ${
                  isSelected ? "text-[#d9a441]" : "text-zinc-200"
                }`}
              >
                {brl(o.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function SubscribeModal() {
  const planId = useAppStore((s) => s.subscribePlanId);
  const optionFromCard = useAppStore((s) => s.subscribeOptionLabel);
  const closeSubscribe = useAppStore((s) => s.closeSubscribe);
  const content = useAppStore((s) => s.content);
  const user = useAppStore((s) => s.user);
  const openAuthModal = useAppStore((s) => s.openAuthModal);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [waHref, setWaHref] = useState<string | null>(null);

  const plan = content?.plans.find((p) => p.id === planId) ?? null;
  const whatsapp = content?.settings?.whatsapp || "5519991504548";

  useEffect(() => {
    if (!planId) {
      setSelectedLabel(null);
      setNotes("");
      setDone(false);
      setLoading(false);
      setWaHref(null);
    }
  }, [planId]);

  // Pré-seleciona o período escolhido no card do plano
  useEffect(() => {
    if (planId && plan) {
      const valid =
        optionFromCard && plan.priceOptions?.some((o) => o.label === optionFromCard)
          ? optionFromCard
          : plan.priceOptions?.[0]?.label ?? null;
      setSelectedLabel(valid);
    }
  }, [planId]);

  const selectedOption =
    plan?.priceOptions?.find((o) => o.label === selectedLabel) ?? null;

  function buildWhatsAppHref(): string {
    const lines = [
      "Olá, CROWN! Quero assinar um plano.",
      "",
      `Nome: ${user?.name ?? "—"}`,
      `E-mail: ${user?.email ?? "—"}`,
      `Plano: ${plan?.name ?? "—"}`,
    ];
    if (selectedOption) {
      lines.push(`Período: ${selectedOption.label}`);
      lines.push(`Valor: ${brl(selectedOption.price)}`);
    }
    if (notes.trim()) {
      lines.push(`Observação: ${notes.trim()}`);
    }
    lines.push("", "Pedido feito pelo site da CROWN.");
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

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
        body: JSON.stringify({ planId: plan.id, notes, optionLabel: selectedLabel }),
      });
      const href = buildWhatsAppHref();
      setWaHref(href);
      setDone(true);
      toast.success(`Pedido do plano ${plan.name} enviado! Abrindo o WhatsApp...`);
      // Redireciona o pedido para o WhatsApp da academia com todas as informações
      const win = window.open(href, "_blank", "noopener,noreferrer");
      if (!win) {
        toast.error("Pop-up bloqueado. Toque no botão verde para abrir o WhatsApp.");
      }
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
              <DialogHeader>
                <DialogTitle className="text-center font-display text-2xl uppercase text-white">
                  Pedido <span className="text-[#d9a441]">enviado!</span>
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-400 mt-2">
                  Seu pedido do plano <strong className="text-[#d9a441]">{plan.name}</strong>
                  {selectedOption ? (
                    <>
                      {" "}
                      ({selectedOption.label} — {brl(selectedOption.price)})
                    </>
                  ) : null}{" "}
                  ficou registrado em nome de <strong className="text-zinc-100">{user?.name}</strong>.
                  Finalize pelo WhatsApp com todas as informações do pedido.
                </DialogDescription>
              </DialogHeader>
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full h-12 inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:brightness-110 text-black font-heading uppercase tracking-wider font-bold text-sm transition-all"
                >
                  <WhatsAppIcon className="w-5 h-5 shrink-0" />
                  Abrir WhatsApp com o pedido
                </a>
              )}
              <Button
                onClick={closeSubscribe}
                variant="ghost"
                className="mt-3 w-full h-10 font-heading uppercase tracking-wider text-zinc-400 hover:text-white"
              >
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
                  <OptionPicker
                    plan={plan}
                    selectedLabel={selectedLabel}
                    onSelect={setSelectedLabel}
                  />
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
                          <span className="mt-[9px] h-px w-3 shrink-0 bg-[#d9a441]" aria-hidden />
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
                  Pedido em nome de <strong className="text-zinc-100">{user?.name}</strong> (
                  {user?.email}). Ao confirmar, você será levado ao WhatsApp da academia com
                  todas as informações do pedido — e o pedido também fica registrado no painel
                  CROWN.
                </div>

                <Button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full h-12 bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-semibold text-base"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  Confirmar e enviar ao WhatsApp
                </Button>
              </div>
            </>
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
