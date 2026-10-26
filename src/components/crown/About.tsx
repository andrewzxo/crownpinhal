"use client";

import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import { CalendarCheck, Clock, Dumbbell, Sunrise } from "lucide-react";

export default function About() {
  const settings = useAppStore((s) => s.content?.settings);
  const gallery = useAppStore((s) => s.content?.gallery) ?? [];

  const stats = [
    { icon: Dumbbell, value: settings?.statsModalities || "12", label: "Modalidades" },
    { icon: CalendarCheck, value: settings?.statsMembers || "47", label: "Aulas por semana" },
    { icon: Clock, value: settings?.statsTrainers || "7", label: "Dias por semana" },
    { icon: Sunrise, value: settings?.statsYears || "5h", label: "Abertura" },
  ];

  const imgs = [
    gallery[0]?.url || "/img/real-entrada.png",
    gallery[2]?.url || "/img/gallery-pesos.jpg",
    gallery[1]?.url || "/img/real-interior.png",
  ];

  const aboutTitle = settings?.aboutTitle || "MAIS QUE UMA ACADEMIA. SEU FITNESS & LIFESTYLE.";
  const titleParts = aboutTitle.split(". ");
  const lastPart = titleParts.pop() || aboutTitle;
  const prePart = titleParts.length ? titleParts.join(". ") + "." : "";
  const hoursLines = (
    settings?.hoursText || "MUSCULAÇÃO: Seg a Sex 5h-22h • Sáb 8h-16h • Dom 8h-14h"
  )
    .replace("MUSCULAÇÃO:", "")
    .trim()
    .split("•")
    .map((h) => h.trim())
    .filter(Boolean);

  return (
    <section id="sobre" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Texto */}
          <div>
            <SectionTitle
              align="left"
              eyebrow="Sobre a vibe CROWN"
              title={prePart}
              highlight={lastPart}
            />
            <Reveal delay={0.15}>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed border-l-2 border-[#d9a441]/40 pl-5">
                {settings?.aboutText ||
                  "Um ambiente acolhedor, focado em rotina e comunidade — ambiente inteiro na mesma energia. Conectando pessoas através do fitness: treino, saúde e convivência além do ferro. Treina na CROWN, joga nas quadras de areia e fecha o dia no Arena Beach Bar."}
              </p>
            </Reveal>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-px bg-[#262626] border border-[#262626]">
              {stats.map((st, i) => (
                <Reveal key={st.label} delay={0.1 + i * 0.08} className="bg-[#0d0d0d]">
                  <div className="group p-5 hover:bg-[#121212] transition-colors duration-300 h-full">
                    <span className="clip-hex bg-gold-gradient w-11 h-11 mb-3 flex items-center justify-center">
                      <span className="clip-hex bg-[#0d0d0d] w-[calc(100%-2px)] h-[calc(100%-2px)] flex items-center justify-center">
                        <st.icon className="w-5 h-5 text-[#d9a441]" />
                      </span>
                    </span>
                    <p className="font-display text-3xl sm:text-4xl text-gold-gradient">
                      {st.value}
                    </p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                      {st.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Colagem de imagens — cortes exclusivos */}
          <Reveal delay={0.2} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative overflow-hidden clip-blade group">
                  <img
                    src={imgs[0]}
                    alt="Recepção da academia CROWN"
                    className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 to-transparent" />
                </div>
                <div className="relative overflow-hidden border border-[#2a2a2a] group">
                  <img
                    src={imgs[1]}
                    alt="Área de treino da CROWN"
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 to-transparent" />
                </div>
              </div>
              <div className="pt-12 space-y-4">
                <div className="relative overflow-hidden border border-[#2a2a2a] group">
                  <img
                    src={imgs[2]}
                    alt="Sala de musculação da CROWN"
                    className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 to-transparent" />
                </div>
                <div className="clip-peak bg-gold-gradient px-4 py-5 text-black flex flex-col items-center justify-center text-center h-40 sm:h-48">
                  <Clock className="w-8 h-8 mb-2 shrink-0" />
                  <p className="font-display uppercase text-base sm:text-lg leading-snug">
                    {hoursLines.map((line, i) => (
                      <span key={line}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
