"use client";

import { ArrowUpRight, CalendarCheck, Target, Umbrella, type LucideIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import { CrownWatermark } from "./CrownShapes";

type EventCard = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export default function Comunidade() {
  const settings = useAppStore((s) => s.content?.settings);
  const ticketbroUrl =
    settings?.ticketbroUrl || "https://crown-gym-pinhal.ticketbro.com/";

  const cards: EventCard[] = [
    {
      icon: CalendarCheck,
      title: "DESAFIO 12 CHECK-INS",
      text: "Quem treina 12 vezes no mês entra na disputa de prêmios — como fones JBL. Aqui, constância é recompensada.",
    },
    {
      icon: Target,
      title: "PROJETO VERÃO CROWN",
      text: "90 dias pra mudar: a campanha oficial da casa, com treino e nutrição combinados do início ao fim.",
    },
    {
      icon: Umbrella,
      title: "ARENA BEACH BAR",
      text: "Porções e bebidas servidas no próprio local, depois do treino ou da partida. O jogo acaba, a conversa continua.",
    },
  ];

  return (
    <section id="eventos" className="relative py-24 sm:py-32 bg-[#050505] scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="Comunidade & eventos"
          title="A ENERGIA NÃO PARA NO TREINO."
          highlight="NO TREINO."
          subtitle="Campeonato, desafios e convivência: na CROWN o treino é só o começo."
        />

        {/* Card destaque — CROWN GAMES */}
        <Reveal delay={0.15}>
          <div className="mt-16 relative clip-blade p-px bg-gold-gradient gold-drop-glow">
            <div className="clip-blade bg-[#0f0f0f] grid lg:grid-cols-2 overflow-hidden">
              {/* Texto */}
              <div className="relative p-6 sm:p-12">
                <CrownWatermark className="pointer-events-none absolute -bottom-10 -left-10 w-64 text-[#d9a441] opacity-[0.07]" />
                <p className="font-heading uppercase tracking-[0.35em] text-xs text-[#d9a441]">
                  Competição regional
                </p>
                <h3 className="mt-4 font-display uppercase text-3xl sm:text-5xl leading-[0.95] text-foreground">
                  CROWN GAMES <span className="text-gold-gradient">— EDIÇÃO PINHAL</span>
                </h3>
                <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">
                  A competição regional de condicionamento físico que movimenta atletas de várias
                  cidades. Escolha sua categoria e venha testar seu treino na arena.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["INICIANTE", "SCALED", "RX"].map((cat) => (
                    <span
                      key={cat}
                      className="clip-tag bg-[#d9a441]/10 font-display uppercase text-xs sm:text-sm tracking-wide px-3.5 sm:px-4 py-1 text-[#d9a441]"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <a
                  href={ticketbroUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex clip-arrow-r bg-gold-gradient hover:brightness-110 text-black px-8 h-12 items-center font-heading uppercase tracking-wider font-bold text-sm transition-all hover:scale-[1.03]"
                >
                  Garantir ingresso
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </a>
              </div>

              {/* Imagem */}
              <div className="relative min-h-64 lg:min-h-full">
                <img
                  src="/img/cross.jpg"
                  alt="Atletas treinando na CROWN para o Crown Games"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent lg:hidden" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Cards de comunidade */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={0.1 + i * 0.1}>
              <article className="h-full clip-blade p-px bg-[#262626] hover:bg-[#d9a441]/50 transition-all duration-300">
                <div className="clip-blade h-full bg-[#0d0d0d] p-4 sm:p-7 flex flex-col">
                  <span className="clip-shield w-10 h-12 sm:w-12 sm:h-14 bg-gold-gradient flex items-center justify-center shrink-0">
                    <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </span>
                  <h4 className="mt-3.5 sm:mt-5 font-display uppercase text-base sm:text-xl tracking-wide text-foreground">
                    {card.title}
                  </h4>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">
                    {card.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
