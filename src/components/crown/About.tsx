"use client";

import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import { Crown, HeartPulse, Medal, Users } from "lucide-react";

export default function About() {
  const settings = useAppStore((s) => s.content?.settings);
  const gallery = useAppStore((s) => s.content?.gallery) ?? [];

  const stats = [
    { icon: Users, value: settings?.statsMembers || "850+", label: "Alunos ativos" },
    { icon: Crown, value: settings?.statsModalities || "12", label: "Modalidades" },
    { icon: Medal, value: settings?.statsTrainers || "12", label: "Treinadores" },
    { icon: HeartPulse, value: settings?.statsYears || "5", label: "Anos de história" },
  ];

  const imgs = [
    gallery[0]?.url || "/img/real-entrada.png",
    gallery[2]?.url || "/img/gallery-pesos.jpg",
    gallery[1]?.url || "/img/real-interior.png",
  ];

  const aboutTitle = settings?.aboutTitle || "ACADEMIA COMPLETA. RESULTADO DE VERDADE.";
  const titleParts = aboutTitle.split(". ");
  const lastPart = titleParts.pop() || aboutTitle;
  const prePart = titleParts.length ? titleParts.join(". ") + "." : "";

  return (
    <section id="sobre" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Texto */}
          <div>
            <SectionTitle
              align="left"
              eyebrow="Sobre a Crown"
              title={prePart}
              highlight={lastPart}
            />
            <Reveal delay={0.15}>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed border-l-2 border-[#d9a441]/40 pl-5">
                {settings?.aboutText ||
                  "A CROWN é a academia mais completa de Pinhal-SP. Treino de verdade, estrutura premium e uma comunidade que treina junto."}
              </p>
            </Reveal>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-px bg-[#262626] border border-[#262626]">
              {stats.map((st, i) => (
                <Reveal key={st.label} delay={0.1 + i * 0.08} className="bg-[#0d0d0d]">
                  <div className="group p-5 hover:bg-[#121212] transition-colors duration-300 h-full">
                    <st.icon className="w-6 h-6 text-[#d9a441] mb-3" />
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

          {/* Colagem de imagens */}
          <Reveal delay={0.2} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative overflow-hidden border border-[#2a2a2a] group">
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
                <div className="bg-gold-gradient p-6 text-black flex flex-col items-center justify-center text-center h-40 sm:h-48">
                  <Crown className="w-10 h-10 mb-2" />
                  <p className="font-display uppercase text-2xl leading-tight">
                    Treine
                    <br />
                    como rei
                  </p>
                </div>
              </div>
            </div>

            {/* Selo */}
            <div className="absolute -top-5 -left-5 bg-[#050505] border-2 border-[#d9a441] text-[#d9a441] px-4 py-2 font-display uppercase text-sm gold-glow-sm hidden sm:block">
              Desde 2020
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
