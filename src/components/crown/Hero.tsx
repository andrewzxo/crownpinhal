"use client";

import { motion } from "framer-motion";
import { ChevronDown, Crown, MapPin, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { CrownWatermark } from "./CrownShapes";

export default function Hero() {
  const content = useAppStore((s) => s.content);
  const s = content?.settings ?? {};
  const heroTitle = s.heroTitle || "CROWN\nPINHAL-SP";
  const heroHighlight = s.heroHighlight || "PINHAL-SP";

  const [pre, post] = (() => {
    const idx = heroHighlight ? heroTitle.indexOf(heroHighlight) : -1;
    if (idx === -1) return ["", heroTitle];
    return [heroTitle.slice(0, idx), heroTitle.slice(idx + heroHighlight.length)];
  })();

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden grain-overlay">
      {/* Fundo com parallax */}
      <motion.img
        src={s.heroImageUrl || "/img/hero.jpg"}
        alt="Interior da academia CROWN"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/75 to-[#050505]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60" />

      {/* Marca d'água — coroa gigante */}
      <CrownWatermark className="pointer-events-none absolute -right-16 top-20 z-[1] hidden w-[460px] text-[#d9a441] opacity-[0.09] lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl"
        >
          {/* Badge — paralelogramo */}
          <div className="mb-8 inline-flex -skew-x-12">
            <div className="flex items-center gap-3 skew-x-12 border border-[#d9a441]/40 bg-black/60 backdrop-blur pl-4 pr-6 py-2">
              <MapPin className="w-4 h-4 shrink-0 text-[#d9a441]" />
              <span className="font-heading uppercase tracking-[0.25em] text-xs text-[#d9a441]">
                {s.heroBadge || "ACADEMIA CROWN • PINHAL-SP"}
              </span>
            </div>
          </div>

          {/* Título gigante */}
          <h1 className="font-display uppercase leading-[0.95] whitespace-pre-line text-[clamp(3rem,9vw,7rem)]">
            {pre && <span className="text-foreground">{pre}</span>}
            <span className="text-gold-gradient drop-shadow-[0_0_30px_rgba(217,164,65,0.35)]">
              {heroHighlight}
            </span>
            {post && <span className="text-foreground">{post}</span>}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed"
          >
            {s.heroSubtitle ||
              "Academia completa em Pinhal-SP: musculação, CROSS, HYROX, CROWN RUN, aulas coletivas, lutas, beach tennis e futevôlei."}
          </motion.p>

          {/* CTAs — paralelogramos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <div className="-skew-x-[10deg]">
              <Button
                size="lg"
                onClick={() => document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" })}
                className="h-14 px-10 skew-x-[10deg] bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-bold text-base transition-all hover:scale-[1.02]"
              >
                <span className="flex items-center gap-2 skew-x-[10deg]">
                  <Crown className="w-5 h-5" />
                  Ver planos
                </span>
              </Button>
            </div>
            <div className="-skew-x-[10deg]">
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("modalidades")?.scrollIntoView({ behavior: "smooth" })}
                className="h-14 px-10 skew-x-[10deg] bg-[#050505]/40 backdrop-blur border-[#d9a441]/40 hover:bg-[#d9a441]/10 hover:text-[#d9a441] hover:border-[#d9a441] font-heading uppercase tracking-wider font-semibold text-base transition-all"
              >
                <span className="flex items-center gap-2 skew-x-[10deg]">
                  <Play className="w-5 h-5" />
                  Modalidades
                </span>
              </Button>
            </div>
          </motion.div>

          {/* Mini stats — chips inclinados */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-14 flex flex-wrap gap-3"
          >
            {[
              { value: s.statsMembers || "47", label: "Aulas por semana" },
              { value: s.statsModalities || "12", label: "Modalidades" },
              { value: s.statsTrainers || "7", label: "Dias por semana" },
            ].map((st) => (
              <div
                key={st.label}
                className="-skew-x-12 border border-[#d9a441]/30 bg-black/50 backdrop-blur px-5 py-3"
              >
                <div className="skew-x-12">
                  <p className="font-display text-2xl sm:text-3xl text-gold-gradient">{st.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                    {st.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.button
        aria-label="Rolar para baixo"
        onClick={() => document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.4 }, y: { repeat: Infinity, duration: 1.8 } }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[#d9a441] cursor-pointer"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>

      {/* Faixa lateral decorativa */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3">
        <span className="w-px h-24 bg-gradient-to-b from-transparent to-[#d9a441]/60" />
        <span className="w-2 h-2 bg-[#d9a441] rotate-45" />
        <span className="font-heading uppercase tracking-[0.4em] text-[10px] text-[#d9a441]/70 [writing-mode:vertical-rl]">
          CROWN • PINHAL-SP
        </span>
        <span className="w-2 h-2 bg-[#d9a441] rotate-45" />
        <span className="w-px h-24 bg-gradient-to-t from-transparent to-[#d9a441]/60" />
      </div>
    </section>
  );
}
