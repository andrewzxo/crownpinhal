"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import WhatsAppCTA from "./WhatsAppCTA";

export default function Modalities() {
  const modalities = useAppStore((s) => s.content?.modalities) ?? [];
  const setContentFallback = !modalities.length;

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
                {m.imageUrl ? (
                  <img
                    src={m.imageUrl}
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
