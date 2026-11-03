"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import WhatsAppCTA from "./WhatsAppCTA";
import DuotoneTeamRoster, { type TeamMember } from "@/components/ui/duotone-team-roster";
import type { ModalityDTO } from "@/lib/types";

// Paleta CROWN (preto + ouro) aplicada ao tritone do roster (desktop)
const CROWN_PALETTE = {
  ground: "#070604",
  deep: "#241a0a",
  hot: "#d9a441",
  glow: "#f5d488",
  ink: "#faf3e0",
  shadow: "#150f05",
  highlight: "#ffe9bd",
};

const DAY_ABBR = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Comprime dias consecutivos: [1,2,3,4,5] → "Seg a Sex"; [6,0] → "Sáb e Dom". */
function daysSummary(days: number[]): string {
  const uniq = [...new Set(days)];
  if (uniq.length === 7) return "Todos os dias";
  const sorted = uniq.sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
  const runs: number[][] = [];
  for (const d of sorted) {
    const last = runs[runs.length - 1];
    if (last && (last[last.length - 1] + 1) % 7 === d) last.push(d);
    else runs.push([d]);
  }
  return runs
    .map((r) =>
      r.length > 2
        ? `${DAY_ABBR[r[0]]} a ${DAY_ABBR[r[r.length - 1]]}`
        : r.map((d) => DAY_ABBR[d]).join(" e "),
    )
    .join(", ");
}

/** Resumo real da grade da modalidade: "Seg a Sex • 06:00 às 19:30". */
function scheduleSummary(m: ModalityDTO): string {
  const sch = m.schedules ?? [];
  if (!sch.length) return "Consulte a recepção";
  const days = daysSummary(sch.map((s) => s.dayOfWeek));
  const times = [...new Set(sch.map((s) => s.startTime))].sort();
  const time =
    times.length === 1 ? times[0] : `${times[0]} às ${times[times.length - 1]}`;
  return `${days} • ${time}`;
}

/**
 * true somente em telas ≥ 1024px. Começa em false de propósito: o HTML do
 * servidor (e o primeiro paint em qualquer tela) é a grade básica estática —
 * é isso que o celular carrega. No desktop a parede duotone entra logo após
 * a hidratação. Assim o celular nunca baixa os duo-*.webp nem monta a parede.
 */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

export default function Modalities() {
  const modalities = useAppStore((s) => s.content?.modalities) ?? [];
  const settings = useAppStore((s) => s.content?.settings);
  const whatsapp = settings?.whatsapp || "5519991504548";
  const isDesktop = useIsDesktop();
  const setContentFallback = !modalities.length;

  const waLink = (msg: string) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;

  // Thumbnail colorido 720px (webp leve): base da grade básica no celular.
  const thumbOf = (m: ModalityDTO) => {
    const full = m.imageUrl || "";
    return full.startsWith("/img/")
      ? "/img/cards/" + full.slice(5).replace(/\.(png|jpe?g)$/i, ".webp")
      : full;
  };

  if (isDesktop && !setContentFallback) {
    // A parede em deriva usa duotones pré-queimados (duo-*.webp): o tritone
    // vai gravado no arquivo e a animação vira transform de textura em cache.
    // Fica restrita ao desktop (≥1024px): no celular a seção é a grade básica.
    const members: TeamMember[] = modalities.map((m) => {
      const thumb = thumbOf(m);
      const duo = thumb.startsWith("/img/cards/")
        ? thumb.replace("/img/cards/", "/img/cards/duo-")
        : thumb;
      return {
        name: m.name,
        role: scheduleSummary(m),
        craft:
          m.schedules.length > 0 ? `${m.schedules.length}x/semana` : "Acesso livre",
        bio: m.description,
        photo: duo || undefined,
        photoAlt: thumb || undefined,
        preToned: duo.startsWith("/img/cards/duo-"),
        focus: "50% 30%",
        href: waLink(
          `Olá! Quero saber mais sobre a modalidade ${m.name} na CROWN.`,
        ),
        linkLabel: "Agendar pelo WhatsApp",
      };
    });

    return (
      <div id="modalidades" className="scroll-mt-0">
        <DuotoneTeamRoster
          members={members}
          eyebrow="O que treinar"
          title={"NOSSAS\nMODALIDADES"}
          intro="Do ferro à areia: musculação completa, CROSS, HYROX oficial, lutas, ritmos, corrida e as quadras de areia com o Arena Beach Bar. Toque em uma modalidade para ver os horários e agendar."
          cta={{
            label: "Agendar 7 dias grátis",
            href: waLink(
              settings?.whatsappMsg ||
                "Olá! Quero agendar meus 7 dias grátis na CROWN.",
            ),
          }}
          secondaryCta={{ label: "Ver planos e valores", href: "#planos" }}
          preset="ember"
          palette={CROWN_PALETTE}
          fontFamily="var(--font-anton), 'Arial Black', sans-serif"
          columns={3}
          driftSeconds={6}
          height="100svh"
          labels={{
            pause: "Pausar",
            play: "Retomar",
            team: "Modalidades da CROWN",
            memberLink: "Agendar pelo WhatsApp",
          }}
        />
      </div>
    );
  }

  // Básico (celular/tablet — como era antes da animação): grade estática,
  // sem deriva, sem filtros, sem carrossel. Clique rola até os horários.
  return (
    <section id="modalidades" className="relative py-24 sm:py-32 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="O que treinar"
          title="NOSSAS MODALIDADES"
          highlight="MODALIDADES"
          subtitle={
            setContentFallback
              ? "Em breve as modalidades serão cadastradas pelo nosso time."
              : "Do ferro à areia: musculação completa, CROSS, HYROX oficial, lutas, ritmos, corrida, beach tennis e futevôlei. Tem treino para cada objetivo — e para cada dia da semana."
          }
        />

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {modalities.map((m, i) => (
            <Reveal key={m.id} delay={(i % 4) * 0.08}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative h-60 sm:h-80 overflow-hidden clip-blade bg-[#17171b] border border-[#2b2b31] cursor-pointer"
                onClick={() =>
                  document.getElementById("horarios")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {/* Imagem */}
                {thumbOf(m) ? (
                  <img
                    src={thumbOf(m)}
                    alt={`Modalidade ${m.name}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1b1b20] to-[#3a3a42]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#101013] via-[#101013]/40 to-transparent" />

                {/* Conteúdo */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5">
                  <h3 className="font-display uppercase text-lg sm:text-2xl text-white">
                    {m.name}
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-zinc-300 line-clamp-2">
                    {m.description}
                  </p>
                  <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-heading uppercase tracking-wider text-zinc-300">
                    {m.schedules.length > 0
                      ? `${m.schedules.length} horários disponíveis`
                      : "Consulte a recepção"}
                  </p>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10 flex justify-center">
            <WhatsAppCTA subject="as modalidades e os treinos" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
