"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import WhatsAppCTA from "./WhatsAppCTA";

const DAYS = [
  { value: 1, label: "Seg", full: "Segunda-feira" },
  { value: 2, label: "Ter", full: "Terça-feira" },
  { value: 3, label: "Qua", full: "Quarta-feira" },
  { value: 4, label: "Qui", full: "Quinta-feira" },
  { value: 5, label: "Sex", full: "Sexta-feira" },
  { value: 6, label: "Sáb", full: "Sábado" },
  { value: 0, label: "Dom", full: "Domingo" },
];

export default function ScheduleSection() {
  const modalities = useAppStore((s) => s.content?.modalities) ?? [];
  const today = new Date().getDay();

  // Hoje (se tiver aula), senão segunda
  const defaultDay = useMemo(() => {
    const hasToday = modalities.some((m) => m.schedules.some((s) => s.dayOfWeek === today));
    return hasToday ? today : 1;
  }, [modalities, today]);

  const entries = useMemo(
    () =>
      DAYS.map((d) => ({
        ...d,
        classes: modalities
          .flatMap((m) =>
            m.schedules
              .filter((s) => s.dayOfWeek === d.value)
              .map((s) => ({ ...s, modalityName: m.name }))
          )
          .sort((a, b) => a.startTime.localeCompare(b.startTime)),
      })),
    [modalities]
  );

  const totalClasses = entries.reduce((acc, e) => acc + e.classes.length, 0);

  return (
    <section
      id="horarios"
      className="relative py-24 sm:py-32 bg-[#1a1a21] border-y border-[#23232a] scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <SectionTitle
          eyebrow="Grade semanal"
          title="HORÁRIOS DAS AULAS"
          highlight="HORÁRIOS"
          subtitle={
            totalClasses > 0
              ? `${totalClasses} aulas por semana para você montar sua rotina. Escolha o dia e apareça!`
              : "A grade de horários será publicada em breve."
          }
        />

        <Reveal delay={0.15} className="mt-12">
          <Tabs defaultValue={String(defaultDay)} className="w-full">
            <TabsList className="w-full grid grid-cols-7 h-auto bg-[#212129] border border-[#2b2b31] p-1.5 gap-1 overflow-x-auto">
              {DAYS.map((d) => (
                <TabsTrigger
                  key={d.value}
                  value={String(d.value)}
                  className={`font-heading uppercase tracking-wider text-xs sm:text-sm py-2.5 rounded-none cursor-pointer data-[state=active]:bg-[#d9a441] dark:data-[state=active]:bg-[#d9a441] data-[state=active]:text-black dark:data-[state=active]:text-black data-[state=active]:font-bold ${
                    d.value === today ? "text-[#d9a441]" : "text-muted-foreground"
                  }`}
                >
                  {d.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {entries.map((d) => (
              <TabsContent key={d.value} value={String(d.value)} className="mt-6">
                <p className="font-display uppercase text-xl text-zinc-100 mb-4">
                  {d.full}
                </p>

                {d.classes.length === 0 ? (
                  <div className="border border-dashed border-[#3a3a42] p-10 text-center text-muted-foreground">
                    Nenhuma aula programada para este dia. Aproveite para treinar por conta!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-[60vh] overflow-y-auto pr-1 sm:pr-2">
                    {d.classes.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.05 }}
                        className="group border border-[#2b2b31] bg-[#212129] p-3.5 sm:p-5 hover:border-[#3a3a42] hover:bg-[#26262e] transition-all duration-300"
                      >
                        <div className="flex items-center justify-between gap-2 sm:gap-3">
                          <span className="bg-[#101013] border border-[#2b2b31] text-white font-display text-sm sm:text-lg tracking-wide px-3 py-1 sm:px-3.5 inline-block">
                            {c.startTime}
                          </span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground font-heading uppercase tracking-wider">
                            até {c.endTime}
                          </span>
                        </div>
                        <p className="mt-2 sm:mt-3 font-heading uppercase tracking-wider text-sm sm:text-lg text-zinc-100 group-hover:text-[#d9a441] transition-colors">
                          {c.modalityName}
                        </p>
                        {c.instructor && (
                          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                            {c.instructor}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <WhatsAppCTA subject="os horários" />
          </div>
        </Reveal>
        </div>
      </section>
  );
}
