"use client";

import { useAppStore } from "@/lib/store";
import { SectionTitle } from "./Reveal";
import DuotoneTeamRoster, { type TeamMember } from "@/components/ui/duotone-team-roster";
import type { ModalityDTO } from "@/lib/types";

// Paleta CROWN (preto + ouro) aplicada ao tritone do roster
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

export default function Modalities() {
  const modalities = useAppStore((s) => s.content?.modalities) ?? [];
  const settings = useAppStore((s) => s.content?.settings);
  const whatsapp = settings?.whatsapp || "5519991504548";

  // Sem conteúdo cadastrado ainda: mantém o aviso atual.
  if (!modalities.length) {
    return (
      <section id="modalidades" className="relative py-24 sm:py-32 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle
            eyebrow="O que treinar"
            title="NOSSAS MODALIDADES"
            highlight="MODALIDADES"
            subtitle="Em breve as modalidades serão cadastradas pelo nosso time."
          />
        </div>
      </section>
    );
  }

  const waLink = (msg: string) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;

  // A parede em deriva usa duotones pré-queimados (duo-*.webp, 720px): o
  // tritone vai gravado no arquivo, então a animação vira transform de
  // textura em cache — sem filter SVG por frame (era isso que engasgava a
  // rolagem no desktop e pesava no celular). O thumbnail colorido fica de
  // reserva: se o duotone faltar, ele entra com o filtro em runtime.
  const members: TeamMember[] = modalities.map((m) => {
    const full = m.imageUrl || "";
    const thumb = full.startsWith("/img/")
      ? "/img/cards/" + full.slice(5).replace(/\.(png|jpe?g)$/i, ".webp")
      : full;
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
