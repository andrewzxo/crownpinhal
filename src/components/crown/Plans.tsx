"use client";

import { motion } from "framer-motion";
import { Check, Crown, Hourglass, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import { CrownEdge } from "./CrownShapes";

export default function Plans() {
  const plans = useAppStore((s) => s.content?.plans) ?? [];
  const settings = useAppStore((s) => s.content?.settings);
  const user = useAppStore((s) => s.user);
  const openSubscribe = useAppStore((s) => s.openSubscribe);
  const openAuthModal = useAppStore((s) => s.openAuthModal);

  const convenios = (settings?.convenios || "PLANO FAMÍLIA|PLANO EMPRESA|PLANO HORÁRIO ECONÔMICO|OFICIAIS MILITARES")
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);

  const partners = (settings?.partners || "GYMPASS|TOTALPASS|WELLHUB")
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);

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
    <>
      <CrownEdge fill="#050505" height={20} />
      <section id="planos" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <SectionTitle
          eyebrow="Planos CROWN"
          title="ESCOLHA SEU PLANO"
          highlight="PLANO"
          subtitle="Valores serão anunciados em breve. Você já pode manifestar interesse no plano que quiser."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.12} className={p.highlighted ? "md:-mt-6 md:mb-[-1.5rem]" : ""}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`relative h-full clip-blade p-px transition-all duration-300 ${
                  p.highlighted
                    ? "bg-gold-gradient gold-drop-glow"
                    : "bg-[#262626] hover:bg-[#d9a441]/50"
                }`}
              >
                <div
                  className={`clip-blade h-full flex flex-col p-7 relative ${
                    p.highlighted ? "bg-[#101010]" : "bg-[#0d0d0d]"
                  }`}
                >
                {/* Badge inclinado */}
                {p.badge && (
                  <span className="absolute -top-3.5 left-6 -skew-x-12">
                    <span
                      className={`block skew-x-12 whitespace-nowrap px-4 py-1.5 font-heading uppercase tracking-widest text-xs font-bold ${
                        p.highlighted
                          ? "bg-gold-gradient text-black"
                          : "bg-[#050505] border border-[#d9a441]/50 text-[#d9a441]"
                      }`}
                    >
                      {p.badge}
                    </span>
                  </span>
                )}

                <h3 className="font-display uppercase text-3xl tracking-wide mt-2">
                  {p.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>

                {/* Preço — ainda não definido */}
                <div className="mt-6 bg-[#0a0a0a] border border-[#262626] px-4 py-4">
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
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground/85">
                      <span className="mt-1 w-[16px] h-[16px] shrink-0 rotate-45 bg-[#d9a441]/15 border border-[#d9a441]/50 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-[#d9a441] -rotate-45" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(p.id)}
                  className={`mt-8 w-full h-12 rounded-none font-heading uppercase tracking-wider font-bold text-sm transition-all hover:scale-[1.02] ${
                    p.highlighted
                      ? "clip-arrow-r bg-gold-gradient hover:brightness-110 text-black"
                      : "-skew-x-[10deg] bg-[#1a1a1a] border border-[#d9a441]/50 text-[#d9a441] hover:bg-[#d9a441] hover:text-black"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center gap-2 w-full ${
                      p.highlighted ? "" : "skew-x-[10deg]"
                    }`}
                  >
                    <Crown className="w-4 h-4" />
                    Quero esse plano
                  </span>
                </Button>
                </div>
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

        {/* Convênios e descontos */}
        <Reveal delay={0.35}>
          <div className="mt-16 border border-[#262626] bg-[#0b0b0b]">
            <div className="bg-[#111] border-b border-[#262626] px-6 py-4 flex items-center justify-center">
              <h3 className="font-display uppercase text-xl sm:text-2xl tracking-wide">
                Convênios e <span className="text-gold-gradient">descontos</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#262626]">
              {convenios.map((c, i) => (
                <div key={c} className="bg-[#0b0b0b] px-5 py-6 text-center hover:bg-[#111] transition-colors">
                  <span className="clip-hex bg-gold-gradient text-black font-display text-sm w-10 h-10 mx-auto mb-3 flex items-center justify-center">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-heading uppercase tracking-wider text-sm font-semibold">
                    {c}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#262626] px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 flex-wrap">
              <span className="font-heading uppercase tracking-[0.3em] text-xs text-muted-foreground">
                Aceitamos
              </span>
              {partners.map((p) => (
                <span
                  key={p}
                  className="clip-tag bg-[#d9a441]/10 font-display uppercase text-lg tracking-wide px-5 py-1.5 text-[#d9a441]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
      </section>
    </>
  );
}
