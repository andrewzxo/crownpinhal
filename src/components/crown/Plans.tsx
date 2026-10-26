"use client";

import { motion } from "framer-motion";
import { Check, Crown, Hourglass, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";

export default function Plans() {
  const plans = useAppStore((s) => s.content?.plans) ?? [];
  const user = useAppStore((s) => s.user);
  const openSubscribe = useAppStore((s) => s.openSubscribe);
  const openAuthModal = useAppStore((s) => s.openAuthModal);

  function handleSubscribe(planId: string) {
    if (!user) {
      openAuthModal(
        "Você precisa ter uma conta CROWN para assinar um plano. Crie a sua em menos de 1 minuto!",
        "register"
      );
      return;
    }
    openSubscribe(planId);
  }

  return (
    <section id="planos" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#d9a441]/8 blur-[140px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <SectionTitle
          eyebrow="Invista em você"
          title="ESCOLHA SEU PLANO"
          highlight="PLANO"
          subtitle="Planos pensados para cada fase da sua jornada. Valores serão anunciados em breve — garanta já seu interesse e seja avisado primeiro."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.12} className={p.highlighted ? "md:-mt-6 md:mb-[-1.5rem]" : ""}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`relative h-full flex flex-col rounded-3xl p-7 ${
                  p.highlighted
                    ? "border-gold-gradient gold-glow bg-[#101010] shadow-2xl"
                    : "border border-[#262626] bg-[#0d0d0d] hover:border-[#d9a441]/30"
                } transition-all duration-300`}
              >
                {/* Badge */}
                {p.badge && (
                  <span
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 font-heading uppercase tracking-widest text-xs font-bold ${
                      p.highlighted
                        ? "bg-gold-gradient text-black gold-glow-sm"
                        : "bg-[#1a1a1a] border border-[#d9a441]/40 text-[#d9a441]"
                    }`}
                  >
                    {p.badge}
                  </span>
                )}

                <h3 className="font-display uppercase text-3xl tracking-wide mt-2">
                  {p.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>

                {/* Preço — ainda não definido */}
                <div className="mt-6 rounded-xl bg-[#0a0a0a] border border-[#262626] px-4 py-4">
                  {p.price !== null ? (
                    <p className="font-display text-4xl text-gold-gradient">
                      R$ {p.price.toFixed(2).replace(".", ",")}
                      {p.period && (
                        <span className="text-sm font-heading uppercase tracking-wider text-muted-foreground">
                          {" "}
                          /{p.period}
                        </span>
                      )}
                    </p>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Hourglass className="w-6 h-6 text-[#d9a441] shrink-0" />
                      <div>
                        <p className="font-heading uppercase tracking-wider text-sm text-[#d9a441]">
                          Valores em breve
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Consulte na recepção ou envie seu pedido
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="mt-6 space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/85">
                      <span className="mt-0.5 w-4.5 h-4.5 shrink-0 rounded-full bg-[#d9a441]/15 border border-[#d9a441]/40 flex items-center justify-center w-[18px] h-[18px]">
                        <Check className="w-3 h-3 text-[#d9a441]" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(p.id)}
                  className={`mt-8 w-full h-12 font-heading uppercase tracking-wider font-bold text-sm transition-all hover:scale-[1.02] ${
                    p.highlighted
                      ? "bg-gold-gradient hover:brightness-110 text-black gold-glow-sm"
                      : "bg-[#1a1a1a] border border-[#d9a441]/40 text-[#d9a441] hover:bg-[#d9a441] hover:text-black"
                  }`}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Quero esse plano
                </Button>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="mt-10 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Info className="w-4 h-4 text-[#d9a441]" />
            Ao assinar, o dono da academia recebe seu pedido e entra em contato para finalizar.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
