"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Hourglass, Info } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { PlanDTO } from "@/lib/types";
import Reveal, { SectionTitle } from "./Reveal";
import { CrownEdge } from "./CrownShapes";

type CategoryKey = "todos" | "planos" | "club" | "dia";

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "planos", label: "Planos" },
  { key: "club", label: "Crown Club" },
  { key: "dia", label: "Day Use" },
];

function planCategory(p: PlanDTO): Exclude<CategoryKey, "todos"> {
  const n = p.name.toUpperCase();
  if (n.startsWith("CROWN CLUB")) return "club";
  if (n.startsWith("DAY USE")) return "dia";
  return "planos";
}

function brl(v: number) {
  const s = v.toFixed(2).replace(".", ",");
  return s.endsWith(",00") ? `R$ ${s.slice(0, -3)}` : `R$ ${s}`;
}

export default function Plans() {
  const plans = useAppStore((s) => s.content?.plans) ?? [];
  const settings = useAppStore((s) => s.content?.settings);
  const user = useAppStore((s) => s.user);
  const openSubscribe = useAppStore((s) => s.openSubscribe);
  const openAuthModal = useAppStore((s) => s.openAuthModal);
  const [cat, setCat] = useState<CategoryKey>("todos");

  // Descontos oficiais (formato "NOME → DETALHE", separados por |)
  const convenios = (
    settings?.convenios ||
    "PLANO FAMÍLIA / PLANO EMPRESA → 10% DE DESCONTO|HORÁRIO ECONÔMICO (SEG A SEX 13H ÀS 16H • FINS DE SEMANA LIVRES) → 30% DE DESCONTO|OFICIAIS MILITARES → 20% DE DESCONTO|ESTACIONAMENTO → GRÁTIS PARA OS ALUNOS CROWN"
  )
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => {
      const [name, ...rest] = t.split("→");
      return { name: name.trim(), detail: rest.join("→").trim() };
    });

  const partners = (settings?.partners || "WELLHUB (ANTIGO GYMPASS)|TOTALPASS")
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);

  const visible = useMemo(
    () => plans.filter((p) => cat === "todos" || planCategory(p) === cat),
    [plans, cat]
  );

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
      <section id="planos" className="relative py-24 sm:py-32 overflow-hidden scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <SectionTitle
          eyebrow="Planos CROWN"
          title="PLANOS E VALORES"
          highlight="VALORES"
          subtitle="Tabela oficial de valores da CROWN. Escolha o plano, toque em Quero esse plano e a recepção finaliza sua assinatura."
        />

        {/* Botões de categoria — pular direto para o grupo desejado */}
        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="Filtrar planos por categoria"
            className="mt-10 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:justify-center"
          >
            {CATEGORIES.map((c) => {
              const isActive = cat === c.key;
              return (
                <button
                  key={c.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setCat(c.key)}
                  className={`shrink-0 clip-tag px-4 sm:px-5 py-2 font-heading uppercase tracking-wider text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gold-gradient text-black font-bold"
                      : "bg-[#121212] border border-[#262626] text-muted-foreground hover:text-[#d9a441] hover:border-[#d9a441]/60"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 items-stretch">
          {visible.map((p, i) => (
            <Reveal
              key={p.id}
              delay={(i % 4) * 0.08}
              className={p.highlighted ? "col-span-2 md:col-span-1" : ""}
            >
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
                  className={`clip-blade h-full flex flex-col p-4 sm:p-6 relative ${
                    p.highlighted ? "bg-[#101010]" : "bg-[#0d0d0d]"
                  }`}
                >
                  {/* Badge DENTRO do card — não é cortado pelo clip */}
                  {p.badge && (
                    <span className="-skew-x-12 self-start mb-3">
                      <span
                        className={`block skew-x-12 whitespace-nowrap px-2.5 py-1 font-heading uppercase tracking-widest text-[10px] sm:text-xs font-bold ${
                          p.highlighted
                            ? "bg-gold-gradient text-black"
                            : "bg-[#050505] border border-[#d9a441]/50 text-[#d9a441]"
                        }`}
                      >
                        {p.badge}
                      </span>
                    </span>
                  )}

                  <h3 className="font-display uppercase text-lg sm:text-2xl tracking-wide leading-tight">
                    {p.name}
                  </h3>
                  <p className="mt-1.5 text-[11px] sm:text-sm text-muted-foreground line-clamp-2">
                    {p.description}
                  </p>

                  {/* Tabela de valores oficial */}
                  <div className="mt-4 mb-5 space-y-1.5">
                    {p.priceOptions && p.priceOptions.length > 0 ? (
                      p.priceOptions.map((opt) => (
                        <div key={opt.label} className="flex items-baseline gap-2">
                          <span className="font-heading uppercase tracking-wider text-[10px] sm:text-xs text-muted-foreground shrink-0">
                            {opt.label}
                          </span>
                          <span className="flex-1 border-b border-dotted border-[#d9a441]/30 -translate-y-[3px]" />
                          <span className="font-display text-base sm:text-xl text-gold-gradient whitespace-nowrap">
                            {brl(opt.price)}
                          </span>
                        </div>
                      ))
                    ) : p.price !== null ? (
                      <p className="font-display text-2xl sm:text-4xl text-gold-gradient">
                        {brl(p.price)}
                        {p.period && (
                          <span className="text-xs sm:text-sm font-heading uppercase tracking-wider text-muted-foreground">
                            {" "}
                            /{p.period}
                          </span>
                        )}
                      </p>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <Hourglass className="w-5 h-5 text-[#d9a441] shrink-0" />
                        <p className="font-heading uppercase tracking-wider text-xs text-[#d9a441]">
                          Consulte na recepção
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSubscribe(p.id)}
                    className={`mt-auto w-full h-10 sm:h-12 font-heading uppercase tracking-wider font-bold text-[11px] sm:text-sm transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 ${
                      p.highlighted
                        ? "clip-arrow-r bg-gold-gradient hover:brightness-110 text-black"
                        : "-skew-x-[10deg] bg-[#1a1a1a] border border-[#d9a441]/50 text-[#d9a441] hover:bg-[#d9a441] hover:text-black"
                    }`}
                  >
                    <span className={`flex items-center justify-center gap-2 ${p.highlighted ? "" : "skew-x-[10deg]"}`}>
                      <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Quero esse plano
                    </span>
                  </button>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="mt-12 border border-dashed border-[#2a2a2a] p-12 text-center text-muted-foreground">
            Nenhum plano nesta categoria no momento.
          </div>
        )}

        <Reveal delay={0.2}>
          <p className="mt-8 text-center text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Info className="w-4 h-4 text-[#d9a441] shrink-0" />
            Ao assinar, o dono da academia recebe seu pedido e entra em contato para finalizar.
          </p>
        </Reveal>

        {/* Descontos oficiais + estacionamento grátis */}
        <Reveal delay={0.25}>
          <div className="mt-12 border border-[#262626] bg-[#0b0b0b]">
            <div className="bg-[#111] border-b border-[#262626] px-6 py-4 flex items-center justify-center">
              <h3 className="font-display uppercase text-xl sm:text-2xl tracking-wide">
                Descontos e <span className="text-gold-gradient">vantagens</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#262626]">
              {convenios.map((c, i) => (
                <div key={c.name} className="bg-[#0b0b0b] px-5 py-6 text-center hover:bg-[#111] transition-colors">
                  <span className="clip-hex bg-gold-gradient text-black font-display text-sm w-10 h-10 mx-auto mb-3 flex items-center justify-center">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-heading uppercase tracking-wider text-xs sm:text-sm font-semibold">
                    {c.name}
                  </p>
                  {c.detail && (
                    <p className="mt-1.5 font-heading uppercase tracking-wider text-xs text-[#d9a441] font-semibold">
                      {c.detail}
                    </p>
                  )}
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
                  className="clip-tag bg-[#d9a441]/10 font-display uppercase text-base sm:text-lg tracking-wide px-5 py-1.5 text-[#d9a441]"
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
