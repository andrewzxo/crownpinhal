"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import Reveal from "./Reveal";

interface HourRange {
  label: string;
  time: string;
  /** Intervalo em horas para o cálculo de "aberto agora" */
  from: number;
  to: number;
  days: number[]; // 0 = domingo
}

/** Horários reais da CROWN (fallback caso hoursText não exista). */
const FALLBACK: HourRange[] = [
  { label: "Segunda a sexta", time: "5h às 22h", from: 5, to: 22, days: [1, 2, 3, 4, 5] },
  { label: "Sábado", time: "8h às 16h", from: 8, to: 16, days: [6] },
  { label: "Domingo", time: "8h às 14h", from: 8, to: 14, days: [0] },
];

/**
 * Interpreta o texto de horários do banco
 * (ex.: "MUSCULAÇÃO: Seg a Sex 5h-22h • Sáb 8h-16h • Dom 8h-14h").
 */
function parseHours(text: string | undefined): HourRange[] {
  if (!text) return FALLBACK;
  const lines = text
    .replace("MUSCULAÇÃO:", "")
    .split("•")
    .map((l) => l.trim())
    .filter(Boolean);
  const parsed: HourRange[] = [];
  for (const line of lines) {
    const m = line.match(/(\d{1,2})\s*h?\s*[-–]\s*(\d{1,2})\s*h?/);
    const from = m ? parseInt(m[1], 10) : null;
    const to = m ? parseInt(m[2], 10) : null;
    if (from === null || to === null) continue;
    const dayPart = line.slice(0, m.index ?? 0).trim().toLowerCase();
    let days: number[] = [1, 2, 3, 4, 5];
    if (/s[áa]b/.test(dayPart)) days = [6];
    else if (/dom/.test(dayPart)) days = [0];
    else if (/seg/.test(dayPart) || /sex/.test(dayPart)) days = [1, 2, 3, 4, 5];
    const label = (line.slice(0, m.index ?? 0).trim() || "Segunda a sexta")
      .replace(/^Seg a Sex$/i, "Segunda a sexta")
      .replace(/^S[áa]b$/i, "Sábado")
      .replace(/^Dom$/i, "Domingo");
    parsed.push({
      label,
      time: `${from}h às ${to}h`,
      from,
      to,
      days,
    });
  }
  return parsed.length ? parsed : FALLBACK;
}

export default function HoursBand() {
  const settings = useAppStore((s) => s.content?.settings);
  const ranges = parseHours(settings?.hoursText);

  // "Aberto agora" calculado só no cliente para evitar divergência de hidratação
  const [openNow, setOpenNow] = useState<boolean | null>(null);

  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours() + now.getMinutes() / 60;
      setOpenNow(
        ranges.some((r) => r.days.includes(day) && hour >= r.from && hour < r.to)
      );
    };
    compute();
    const t = setInterval(compute, 60_000);
    return () => clearInterval(t);
  }, [settings?.hoursText]);

  return (
    <section
      id="funcionamento"
      aria-label="Horários de funcionamento da academia"
      className="relative scroll-mt-28 border-y border-[#d9a441]/30 bg-[#101013] overflow-hidden"
    >
      {/* Brilho dourado de fundo */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,164,65,0.09),transparent_65%)]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <Reveal>
          <div className="flex flex-col items-center text-center gap-3">
            <p className="font-heading uppercase tracking-[0.35em] text-xs text-[#d9a441]">
              Funcionamento
            </p>
            <h2 className="font-display uppercase text-3xl sm:text-5xl tracking-wide text-white leading-[1.1]">
              Aberto <span className="text-[#d9a441]">todos os dias</span>
            </h2>

            {/* Selo ABERTO/FECHADO calculado em tempo real */}
            {openNow !== null && (
              <p
                className={`mt-1 inline-flex items-center gap-2 border px-4 py-1.5 font-heading uppercase tracking-widest text-xs font-bold ${
                  openNow
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-500/50 bg-zinc-500/10 text-zinc-400"
                }`}
              >
                <span
                  aria-hidden
                  className={`inline-block w-2 h-2 rounded-full ${
                    openNow ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
                  }`}
                />
                {openNow ? "Aberto agora" : "Fechado agora"}
              </p>
            )}

            <p className="mt-2 max-w-xl text-sm sm:text-base text-zinc-400 leading-relaxed">
              Uma das poucas academias da região com essa duração — de madrugada até a
              noite, todos os dias da semana.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 max-w-4xl mx-auto">
          {ranges.map((r, i) => (
            <Reveal key={r.label + r.time} delay={0.1 + i * 0.08}>
              <div className="h-full border border-[#d9a441]/35 bg-[#141418] px-5 py-6 text-center shadow-[0_0_40px_-16px_rgba(217,164,65,0.5)] hover:border-[#d9a441]/70 hover:shadow-[0_0_50px_-12px_rgba(217,164,65,0.7)] transition-all duration-500">
                <p className="font-heading uppercase tracking-widest text-xs text-zinc-400">
                  {r.label}
                </p>
                <p className="mt-2 font-display uppercase text-2xl sm:text-3xl text-[#d9a441] leading-[1.1] whitespace-nowrap">
                  {r.time}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
