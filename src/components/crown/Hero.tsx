"use client";

import { motion } from "framer-motion";
import { ChevronDown, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { WhatsAppIcon } from "./CtaSection";

export default function Hero() {
  const content = useAppStore((s) => s.content);
  const s = content?.settings ?? {};
  const heroTitle = s.heroTitle || "CONECTANDO\nPESSOAS\nATRAVÉS DO\nFITNESS";
  const heroHighlight = s.heroHighlight || "FITNESS";
  const whatsapp = s.whatsapp || "5519991504548";
  const waMessage = s.whatsappMsg || "Olá! Quero agendar meus 7 dias grátis na CROWN.";
  const waLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`;

  const [pre, post] = (() => {
    const idx = heroHighlight ? heroTitle.indexOf(heroHighlight) : -1;
    if (idx === -1) return ["", heroTitle];
    return [heroTitle.slice(0, idx), heroTitle.slice(idx + heroHighlight.length)];
  })();

  return (
    <section id="inicio" className="relative min-h-[92vh] flex items-center overflow-hidden scroll-mt-28">
      {/* Fundo */}
      <motion.img
        src={s.heroImageUrl || "/img/hero.jpg"}
        alt="Interior da academia CROWN"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#101013] via-[#101013]/80 to-[#101013]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101013] via-transparent to-[#101013]/50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <div className="mb-8 inline-flex -skew-x-12">
            <div className="flex items-center gap-3 skew-x-12 border border-white/15 bg-black/50 backdrop-blur pl-4 pr-6 py-2">
              <span className="w-2 h-2 bg-[#d9a441] rotate-45 shrink-0" aria-hidden />
              <span className="font-heading uppercase tracking-[0.25em] text-xs text-zinc-300">
                {s.heroBadge || "ACADEMIA CROWN • PINHAL-SP"}
              </span>
            </div>
          </div>

          {/* Título */}
          <h1 className="font-display uppercase leading-[0.95] whitespace-pre-line text-[clamp(3rem,9vw,7rem)]">
            {pre && <span className="text-white">{pre}</span>}
            <span className="text-gold-gradient">{heroHighlight}</span>
            {post && <span className="text-white">{post}</span>}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-xl leading-relaxed"
          >
            {s.heroSubtitle ||
              "Um espaço completo para o seu Fitness & Lifestyle: treino, saúde e convivência no coração de Pinhal."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <div className="-skew-x-[10deg]">
              <Button
                size="lg"
                asChild
                className="h-14 px-10 skew-x-[10deg] bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-bold text-base transition-all hover:scale-[1.02]"
              >
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <span className="flex items-center gap-2 skew-x-[10deg]">
                    <WhatsAppIcon className="w-5 h-5" />
                    Agendar 7 dias grátis
                  </span>
                </a>
              </Button>
            </div>
            <div className="-skew-x-[10deg]">
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("modalidades")?.scrollIntoView({ behavior: "smooth" })}
                className="h-14 px-10 skew-x-[10deg] bg-[#101013]/40 backdrop-blur border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40 font-heading uppercase tracking-wider font-semibold text-base transition-all"
              >
                <span className="flex items-center gap-2 skew-x-[10deg]">
                  <Dumbbell className="w-5 h-5" />
                  Modalidades
                </span>
              </Button>
            </div>
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-zinc-400 hover:text-white cursor-pointer"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  );
}
