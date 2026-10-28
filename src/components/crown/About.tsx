"use client";

import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";

export default function About() {
  const settings = useAppStore((s) => s.content?.settings);
  const gallery = useAppStore((s) => s.content?.gallery) ?? [];

  const stats = [
    { value: settings?.statsModalities || "12", label: "Modalidades" },
    { value: settings?.statsMembers || "47", label: "Aulas por semana" },
    { value: settings?.statsTrainers || "7", label: "Dias por semana" },
    { value: settings?.statsYears || "5h", label: "Abertura" },
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
  return (
    <section id="sobre" className="relative py-24 sm:py-32 overflow-hidden scroll-mt-28">
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
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed border-l-2 border-[#d9a441]/60 pl-5">
                {settings?.aboutText ||
                  "Um ambiente acolhedor, focado em rotina e comunidade — ambiente inteiro na mesma energia. Conectando pessoas através do fitness: treino, saúde e convivência além do ferro. Treina na CROWN, joga nas quadras de areia e fecha o dia no Arena Beach Bar."}
              </p>
            </Reveal>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-px bg-[#2b2b31] border border-[#2b2b31]">
              {stats.map((st, i) => (
                <Reveal key={st.label} delay={0.1 + i * 0.08} className="bg-[#17171b]">
                  <div className="group p-5 hover:bg-[#1b1b20] transition-colors duration-300 h-full">
                    <p className="font-display text-3xl sm:text-4xl text-foreground">
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
                <div className="relative overflow-hidden clip-blade group border border-[#d9a441]/40 shadow-[0_0_45px_-14px_rgba(217,164,65,0.55)] hover:border-[#d9a441] hover:shadow-[0_0_60px_-10px_rgba(217,164,65,0.75)] transition-all duration-500">
                  <img
                    src={imgs[0]}
                    alt="Recepção da academia CROWN"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101013]/70 to-transparent" />
                </div>
                <div className="relative overflow-hidden border border-[#d9a441]/40 shadow-[0_0_45px_-14px_rgba(217,164,65,0.55)] group hover:border-[#d9a441] hover:shadow-[0_0_60px_-10px_rgba(217,164,65,0.75)] transition-all duration-500">
                  <img
                    src={imgs[1]}
                    alt="Área de treino da CROWN"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101013]/70 to-transparent" />
                </div>
              </div>
              <div className="pt-12 space-y-4">
                <div className="relative overflow-hidden border border-[#d9a441]/40 shadow-[0_0_45px_-14px_rgba(217,164,65,0.55)] group hover:border-[#d9a441] hover:shadow-[0_0_60px_-10px_rgba(217,164,65,0.75)] transition-all duration-500">
                  <img
                    src={imgs[2]}
                    alt="Sala de musculação da CROWN"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101013]/70 to-transparent" />
                </div>
                <div className="clip-peak bg-[#141418] border border-[#2b2b31] px-4 py-5 flex flex-col items-center justify-center text-center h-40 sm:h-48">
                  <p className="font-heading uppercase tracking-[0.25em] text-[10px] text-[#d9a441] mb-2">
                    Vibe CROWN
                  </p>
                  <p className="font-display uppercase text-base sm:text-lg leading-snug text-white">
                    Treino, quadras
                    <br />
                    de areia e
                    <br />
                    Arena Beach Bar
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
