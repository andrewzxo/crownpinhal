"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import WhatsAppCTA from "./WhatsAppCTA";

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
    <section id="coletivas" className="relative py-24 sm:py-32 overflow-hidden scroll-mt-28">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="Modalidades coletivas"
          title="AULAS COLETIVAS"
          highlight="COLETIVAS"
          subtitle="CROWN DANCE, BIKE, JUMP e PILATES. Confira os dias e horários de cada aula."
        />

        {/* Grade por dia */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {days.map((d) => (
            <Reveal key={d.day} delay={0.08}>
              <div className="clip-blade bg-[#2b2b31] p-px h-full hover:bg-[#d9a441] transition-colors duration-300">
                <div className="clip-blade bg-[#17171b] h-full flex flex-col">
                  <p className="bg-[#141418] border-b border-[#2b2b31] text-white font-display uppercase text-sm sm:text-lg px-3 py-2.5 sm:px-4 sm:py-3">
                    {d.label}
                  </p>
                  <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3 flex-1">
                    {d.classes.map((c) => (
                      <div key={`${d.day}-${c.name}-${c.time}`} className="flex items-center gap-2 sm:gap-3">
                        <span className="font-display text-base sm:text-2xl text-[#d9a441] w-14 sm:w-20 shrink-0">
                          {c.time.replace(":", "h")}
                        </span>
                        <span className="flex-1 h-px bg-[#2b2b31]" />
                        <span className="font-heading uppercase tracking-wider text-[11px] sm:text-sm text-zinc-300 text-right">
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
          <div className="mt-12 border border-dashed border-[#3a3a42] p-12 text-center text-muted-foreground">
            A grade de aulas coletivas será publicada em breve.
          </div>
        )}

        {/* Benefícios */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#2b2b31] border border-[#2b2b31]">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-[#17171b] px-4 py-5 sm:px-5 sm:py-6 flex items-center gap-3 sm:gap-4 hover:bg-[#1b1b20] transition-colors"
            >
              <span className="w-9 h-10 shrink-0 bg-[#101013] border border-[#2b2b31] text-[#d9a441] font-display text-sm flex items-center justify-center">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-heading uppercase tracking-wider text-[11px] sm:text-sm font-semibold text-zinc-300">
                {b}
              </p>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <WhatsAppCTA subject="as aulas coletivas" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
