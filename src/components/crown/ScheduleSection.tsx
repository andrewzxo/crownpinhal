"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import { CrownEdge } from "./CrownShapes";

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
    <>
      <CrownEdge fill="#080808" height={20} />
      <section
        id="horarios"
        className="relative py-24 sm:py-32 bg-[#080808] overflow-hidden scroll-mt-28"
      >
        {/* Padrão de coroa no fundo */}
        <div className="absolute inset-0 bg-crown-pattern pointer-events-none" aria-hidden />
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
            <TabsList className="w-full grid grid-cols-7 h-auto bg-[#0d0d0d] border border-[#262626] p-1.5 gap-1 overflow-x-auto">
              {DAYS.map((d) => (
                <TabsTrigger
                  key={d.value}
                  value={String(d.value)}
                  className={`font-heading uppercase tracking-wider text-xs sm:text-sm py-2.5 rounded-none cursor-pointer data-[state=active]:bg-gold-gradient data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:[clip-path:polygon(9px_0,100%_0,calc(100%_-_9px)_100%,0_100%)] ${
                    d.value === today ? "text-[#d9a441]" : "text-muted-foreground"
                  }`}
                >
                  {d.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {entries.map((d) => (
              <TabsContent key={d.value} value={String(d.value)} className="mt-6">
                <p className="font-display uppercase text-xl text-muted-foreground mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#d9a441]" />
                  {d.full}
                </p>

                {d.classes.length === 0 ? (
                  <div className="border border-dashed border-[#2a2a2a] p-10 text-center text-muted-foreground">
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
                        className="group border border-[#262626] bg-[#0d0d0d] p-3.5 sm:p-5 hover:border-[#d9a441]/60 hover:bg-[#111] transition-all duration-300 border-l-2 border-l-[#d9a441]/60"
                      >
                        <div className="flex items-center justify-between gap-2 sm:gap-3">
                          <span className="clip-tag bg-gold-gradient text-black font-display text-sm sm:text-lg tracking-wide px-3 py-1 sm:px-3.5 inline-block">
                            {c.startTime}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground font-heading uppercase tracking-wider">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            até {c.endTime}
                          </span>
                        </div>
                        <p className="mt-2 sm:mt-3 font-heading uppercase tracking-wider text-sm sm:text-lg group-hover:text-[#d9a441] transition-colors">
                          {c.modalityName}
                        </p>
                        {c.instructor && (
                          <p className="mt-1 text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#d9a441]/70" />
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
        </div>
      </section>
    </>
  );
}
