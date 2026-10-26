"use client";

import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import Reveal from "./Reveal";

export default function CtaSection() {
  const settings = useAppStore((s) => s.content?.settings);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden grain-overlay">
      {/* Fundo */}
      <img
        src="/img/crossfit.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-[#050505]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#d9a441]/12 blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <Reveal>
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center gold-glow mb-8 rotate-3">
            <Crown className="w-9 h-9 text-black" />
          </div>
          <h2 className="font-display uppercase text-4xl sm:text-6xl lg:text-7xl leading-[0.95]">
            {(settings?.ctaTitle || "PRONTO PARA VESTIR A COROA?").split("A COROA?").map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <span className="text-gold-gradient">A COROA?</span>
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {settings?.ctaText ||
              "Assine um plano hoje e comece sua transformação na CROWN."}
          </p>
          <Button
            size="lg"
            onClick={() => document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-10 h-14 px-10 bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-bold text-base gold-glow transition-all hover:scale-[1.03]"
          >
            <Crown className="w-5 h-5 mr-2" />
            Ver planos
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
