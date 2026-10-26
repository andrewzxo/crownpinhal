"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bike,
  CalendarClock,
  Dumbbell,
  Flame,
  Music,
  Sparkles,
  Swords,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";

const ICONS: Record<string, LucideIcon> = {
  Dumbbell,
  Flame,
  Swords,
  Bike,
  Activity,
  Music,
  Zap,
  Sparkles,
};

export default function Modalities() {
  const modalities = useAppStore((s) => s.content?.modalities) ?? [];
  const setContentFallback = !modalities.length;

  return (
    <section id="modalidades" className="relative py-24 sm:py-32">
      <div className="absolute top-0 -left-40 w-[450px] h-[450px] rounded-full bg-[#d9a441]/8 blur-[130px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="O que treinar"
          title="NOSSAS MODALIDADES"
          highlight="MODALIDADES"
          subtitle={
            setContentFallback
              ? "Em breve as modalidades serão cadastradas pelo nosso time."
              : "Escolha seu estilo de treino. São várias opções para você alcanzar seus objetivos, do condicionamento à força."
          }
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modalities.map((m, i) => (
            <Reveal key={m.id} delay={(i % 4) * 0.08}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative h-80 rounded-2xl overflow-hidden border border-[#262626] bg-[#0d0d0d] cursor-pointer hover:border-[#d9a441]/50 transition-colors duration-300"
                onClick={() =>
                  document.getElementById("horarios")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {/* Imagem */}
                {m.imageUrl ? (
                  <img
                    src={m.imageUrl}
                    alt={`Modalidade ${m.name}`}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#050505]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#d9a441]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Conteúdo */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 gold-glow-sm">
                    {(() => {
                      const Icon = (m.icon && ICONS[m.icon]) || Dumbbell;
                      return <Icon className="w-5 h-5 text-black" />;
                    })()}
                  </div>
                  <h3 className="font-display uppercase text-2xl text-foreground group-hover:text-gold-gradient transition-all">
                    {m.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 opacity-90">
                    {m.description}
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs font-heading uppercase tracking-wider text-[#d9a441] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CalendarClock className="w-3.5 h-3.5" />
                    {m.schedules.length} horários disponíveis
                  </p>
                </div>

                {/* Número decorativo */}
                <span className="absolute top-4 right-4 font-display text-4xl text-outline-gold opacity-40">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
