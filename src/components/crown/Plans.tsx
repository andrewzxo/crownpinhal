"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import type { PlanDTO } from "@/lib/types";
import Reveal, { SectionTitle } from "./Reveal";
import WhatsAppCTA from "./WhatsAppCTA";

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
                  className={`shrink-0 px-4 sm:px-5 py-2 font-heading uppercase tracking-wider text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#d9a441] text-black font-bold"
                      : "bg-[#17171b] border border-[#2b2b31] text-zinc-300 hover:text-white hover:border-[#3a3a42]"
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
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`relative h-full flex flex-col p-4 sm:p-6 transition-all duration-300 ${
                  p.highlighted
                    ? "border border-[#d9a441]/70 bg-zinc-900 text-white"
                    : "border border-[#2b2b31] bg-[#17171b] hover:border-[#3a3a42]"
                }`}
              >
                {/* Badge no fluxo do card — nunca cortado */}
                {p.badge && (
                  <span
                    className={`self-start mb-3 px-2.5 py-1 font-heading uppercase tracking-widest text-[10px] sm:text-xs font-bold ${
                      p.highlighted
                        ? "bg-[#d9a441] text-black"
                        : "bg-[#1b1b20] border border-[#2b2b31] text-zinc-400"
                    }`}
                  >
                    {p.badge}
                  </span>
                )}

                <h3 className={`font-display uppercase text-lg sm:text-2xl tracking-wide leading-tight ${
                  p.highlighted ? "text-white" : "text-zinc-100"
                }`}>
                  {p.name}
                </h3>
                <p className={`mt-1.5 text-[11px] sm:text-sm line-clamp-2 ${
                  p.highlighted ? "text-zinc-400" : "text-muted-foreground"
                }`}>
                  {p.description}
                </p>

                {/* Tabela de valores oficial — label e preço em linhas separadas (sem sobreposição) */}
                <div className="mt-4 mb-5 space-y-2.5">
                  {p.priceOptions && p.priceOptions.length > 0 ? (
                    p.priceOptions.map((opt) => (
                      <div key={opt.label} className="flex flex-col gap-0.5">
                        <span className={`font-heading uppercase tracking-wider text-[10px] sm:text-[11px] leading-tight ${
                          p.highlighted ? "text-zinc-400" : "text-zinc-500"
                        }`}>
                          {opt.label}
                        </span>
                        <span className={`font-display text-lg sm:text-xl whitespace-nowrap ${
                          p.highlighted ? "text-[#d9a441]" : "text-[#d9a441]"
                        }`}>
                          {brl(opt.price)}
                        </span>
                      </div>
                    ))
                  ) : p.price !== null ? (
                    <p className={`font-display text-2xl sm:text-4xl ${
                      p.highlighted ? "text-[#d9a441]" : "text-[#d9a441]"
                    }`}>
                      {brl(p.price)}
                      {p.period && (
                        <span className={`text-xs sm:text-sm font-heading uppercase tracking-wider ${
                          p.highlighted ? "text-zinc-400" : "text-muted-foreground"
                        }`}>
                          {" "}
                          /{p.period}
                        </span>
                      )}
                    </p>
                  ) : (
                    <p className="font-heading uppercase tracking-wider text-xs text-zinc-500">
                      Consulte na recepção
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleSubscribe(p.id)}
                  className={`mt-auto w-full h-10 sm:h-12 font-heading uppercase tracking-wider font-bold text-[11px] sm:text-sm transition-all cursor-pointer flex items-center justify-center ${
                    p.highlighted
                      ? "bg-[#d9a441] hover:brightness-110 text-black"
                      : "bg-[#1b1b20] border border-[#2b2b31] text-zinc-100 hover:border-[#d9a441]/60 hover:text-[#d9a441]"
                  }`}
                >
                  Quero esse plano
                </button>
              </motion.article>
            </Reveal>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="mt-12 border border-dashed border-[#3a3a42] p-12 text-center text-muted-foreground">
            Nenhum plano nesta categoria no momento.
          </div>
        )}

        <Reveal delay={0.2}>
          <p className="mt-8 text-center text-xs sm:text-sm text-muted-foreground">
            Ao assinar, o dono da academia recebe seu pedido e entra em contato para finalizar.
          </p>
        </Reveal>

        {/* Descontos oficiais + estacionamento grátis */}
        <Reveal delay={0.25}>
          <div className="mt-12 border border-[#2b2b31] bg-[#17171b]">
            <div className="bg-[#141418] border-b border-[#2b2b31] px-6 py-4 flex items-center justify-center">
              <h3 className="font-display uppercase text-xl sm:text-2xl tracking-wide text-white">
                Descontos e <span className="text-[#d9a441]">vantagens</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2b2b31]">
              {convenios.map((c) => (
                <div key={c.name} className="bg-[#17171b] px-5 py-6 text-center hover:bg-[#1b1b20] transition-colors">
                  <p className="font-heading uppercase tracking-wider text-xs sm:text-sm font-semibold text-zinc-100">
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
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex justify-center">
            <WhatsAppCTA subject="os planos e valores" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
