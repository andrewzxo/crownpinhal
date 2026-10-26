"use client";

import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import { Crown, HeartPulse, Medal, Users } from "lucide-react";

export default function About() {
  const settings = useAppStore((s) => s.content?.settings);
  const gallery = useAppStore((s) => s.content?.gallery) ?? [];

  const stats = [
    { icon: Users, value: settings?.statsMembers || "850+", label: "Alunos ativos" },
    { icon: Crown, value: settings?.statsModalities || "8", label: "Modalidades" },
    { icon: Medal, value: settings?.statsTrainers || "12", label: "Treinadores" },
    { icon: HeartPulse, value: settings?.statsYears || "5", label: "Anos de história" },
  ];

  const imgs = [
    gallery[0]?.url || "/img/gallery-hall.jpg",
    gallery[1]?.url || "/img/gallery-pesos.jpg",
    gallery[2]?.url || "/img/gallery-cardio.jpg",
  ];

  const aboutTitle = settings?.aboutTitle || "MAIS QUE UMA ACADEMIA. UM IMPÉRIO.";
  const titleParts = aboutTitle.split(". ");
  const lastPart = titleParts.pop() || aboutTitle;
  const prePart = titleParts.join(". ");

  return (
    <section id="sobre" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full bg-[#d9a441]/8 blur-[120px]" />
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
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {settings?.aboutText ||
                  "A CROWN nasceu em Pinhal-SP com um propósito: oferecer um ambiente de alto nível para quem busca resultados reais."}
              </p>
            </Reveal>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {stats.map((st, i) => (
                <Reveal key={st.label} delay={0.1 + i * 0.08}>
                  <div className="group rounded-xl border border-[#262626] bg-[#0d0d0d] p-5 hover:border-[#d9a441]/40 transition-all duration-300 hover:-translate-y-1">
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
                <div className="relative rounded-2xl overflow-hidden border border-[#2a2a2a] group">
                  <img
                    src={imgs[0]}
                    alt="Ambiente da academia CROWN"
                    className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 to-transparent" />
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-[#2a2a2a] group">
                  <img
                    src={imgs[1]}
                    alt="Área de treino da CROWN"
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 to-transparent" />
                </div>
              </div>
              <div className="pt-12 space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-[#2a2a2a] group">
                  <img
                    src={imgs[2]}
                    alt="Área de cardio da CROWN"
                    className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 to-transparent" />
                </div>
                <div className="rounded-2xl bg-gold-gradient p-6 text-black flex flex-col items-center justify-center text-center h-40 sm:h-48">
                  <Crown className="w-10 h-10 mb-2" />
                  <p className="font-display uppercase text-2xl leading-tight">
                    Treine
                    <br />
                    como rei
                  </p>
                </div>
              </div>
            </div>

            {/* Selo flutuante */}
            <div className="absolute -top-5 -left-5 rounded-full bg-gold-gradient text-black px-5 py-3 font-display uppercase text-sm gold-glow animate-pulse-gold hidden sm:block">
              Desde 2020
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
