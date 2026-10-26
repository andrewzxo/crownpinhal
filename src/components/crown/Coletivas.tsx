"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";

const COLETIVAS = ["CROWN DANCE", "BIKE", "JUMP", "PILATES"];

const DAY_LABELS: Record<number, string> = {
  1: "SEGUNDA-FEIRA",
  2: "TERÇA-FEIRA",
  3: "QUARTA-FEIRA",
  4: "QUINTA-FEIRA",
  5: "SEXTA-FEIRA",
  6: "SÁBADO",
  0: "DOMINGO",
};

const BENEFITS = [
  "MAIS SAÚDE E DISPOSIÇÃO",
  "QUEIMA DE CALORIAS",
  "AMBIENTE MOTIVADOR",
  "BEM-ESTAR E QUALIDADE DE VIDA",
];

export default function Coletivas() {
  const modalities = useAppStore((s) => s.content?.modalities) ?? [];

  // Aulas coletivas agrupadas por dia (a partir das modalidades cadastradas)
  const days = useMemo(() => {
    const coletivaIds = new Set(
      modalities.filter((m) => COLETIVAS.includes(m.name.toUpperCase())).map((m) => m.name)
    );

    const grouped = new Map<number, { time: string; name: string }[]>();
    modalities
      .filter((m) => coletivaIds.has(m.name))
      .forEach((m) =>
        m.schedules.forEach((s) => {
          const list = grouped.get(s.dayOfWeek) ?? [];
          list.push({ time: s.startTime, name: m.name });
          grouped.set(s.dayOfWeek, list);
        })
      );

    return [...grouped.entries()]
      .sort((a, b) => {
        const order = [1, 2, 3, 4, 5, 6, 0];
        return order.indexOf(a[0]) - order.indexOf(b[0]);
      })
      .map(([day, classes]) => ({
        day,
        label: DAY_LABELS[day] ?? "",
        classes: classes.sort((a, b) => a.time.localeCompare(b.time)),
      }));
  }, [modalities]);

  return (
    <section id="coletivas" className="relative py-24 sm:py-32 overflow-hidden border-t border-[#1c1c1c]">
      {/* Fundo com a textura da marca */}
      <img
        src="/img/texture-gold.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/85 to-[#050505]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="Aulas coletivas"
          title="TREINE JUNTO, EVOLUA JUNTO"
          highlight="JUNTO"
          subtitle="Você, aluno da musculação, também tem o benefício de participar das nossas aulas coletivas. Escolha sua aula e vem."
        />

        {/* Grade por dia */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {days.map((d, i) => (
            <Reveal key={d.day} delay={i * 0.08}>
              <div className="clip-blade bg-[#d9a441]/30 p-px h-full hover:bg-[#d9a441]/80 transition-colors duration-300">
                <div className="clip-blade bg-[#0b0b0b] h-full flex flex-col">
                  <p className="bg-gold-gradient text-black font-display uppercase text-lg px-4 py-3">
                    {d.label}
                  </p>
                  <div className="p-4 space-y-3 flex-1">
                    {d.classes.map((c) => (
                      <div key={`${d.day}-${c.name}-${c.time}`} className="flex items-center gap-3">
                        <span className="font-display text-2xl text-gold-gradient w-20 shrink-0">
                          {c.time.replace(":", "h")}
                        </span>
                        <span className="flex-1 h-px bg-[#d9a441]/25" />
                        <span className="font-heading uppercase tracking-wider text-sm text-foreground text-right">
                          {c.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {days.length === 0 && (
          <div className="mt-12 border border-dashed border-[#2a2a2a] p-12 text-center text-muted-foreground">
            A grade de aulas coletivas será publicada em breve.
          </div>
        )}

        {/* Benefícios */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#d9a441]/20 border border-[#d9a441]/20">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-[#080808] px-5 py-6 flex items-center gap-4 hover:bg-[#0e0d0a] transition-colors"
            >
              <span className="clip-shield w-9 h-10 shrink-0 bg-gold-gradient text-black font-display text-sm flex items-center justify-center pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-heading uppercase tracking-wider text-sm font-semibold">
                {b}
              </p>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 flex items-center justify-center gap-3 text-center font-heading uppercase tracking-widest text-[#d9a441]">
            <Check className="w-5 h-5" />
            Resultados de verdade
            <Check className="w-5 h-5" />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
