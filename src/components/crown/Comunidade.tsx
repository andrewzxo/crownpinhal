"use client";

import { ArrowUpRight, CalendarCheck, Target, Umbrella, type LucideIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";

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
    <section id="eventos" className="relative py-24 sm:py-32 scroll-mt-28 bg-[#1a1a21] border-y border-[#23232a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="Comunidade & eventos"
          title="A ENERGIA NÃO PARA NO TREINO."
          highlight="NO TREINO."
          subtitle="Campeonato, desafios e convivência: na CROWN o treino é só o começo."
        />

        {/* Card destaque — CROWN GAMES */}
        <Reveal delay={0.15}>
          <div className="mt-16 relative clip-blade border border-[#d9a441]/60 bg-[#101013]">
            <div className="clip-blade grid lg:grid-cols-2 overflow-hidden">
              {/* Texto */}
              <div className="relative p-6 sm:p-12">
                <p className="font-heading uppercase tracking-[0.35em] text-xs text-zinc-400">
                  Competição regional
                </p>
                <h3 className="mt-4 font-display uppercase text-3xl sm:text-5xl leading-[0.95] text-white">
                  CROWN GAMES <span className="text-[#d9a441]">— EDIÇÃO PINHAL</span>
                </h3>
                <p className="mt-5 text-zinc-400 leading-relaxed max-w-md">
                  A competição regional de condicionamento físico que movimenta atletas de várias
                  cidades. Escolha sua categoria e venha testar seu treino na arena.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["INICIANTE", "SCALED", "RX"].map((cat) => (
                    <span
                      key={cat}
                      className="bg-white/10 border border-white/15 font-display uppercase text-xs sm:text-sm tracking-wide px-3.5 sm:px-4 py-1 text-zinc-100"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <a
                  href={ticketbroUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex clip-arrow-r bg-[#d9a441] hover:brightness-110 text-black px-8 h-12 items-center font-heading uppercase tracking-wider font-bold text-sm transition-all hover:scale-[1.03]"
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
                <div className="absolute inset-0 bg-gradient-to-r from-[#101013] via-[#101013]/30 to-transparent hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101013] via-transparent to-transparent lg:hidden" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Cards de comunidade */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={0.1 + i * 0.1}>
              <article className="h-full clip-blade border border-[#2b2b31] bg-[#212129] p-4 sm:p-7 flex flex-col hover:border-[#3a3a42] transition-all duration-300">
                <span className="w-11 h-12 bg-[#101013] border border-[#2b2b31] flex items-center justify-center shrink-0">
                  <card.icon className="w-5 h-5 text-[#d9a441]" />
                </span>
                <h4 className="mt-3.5 sm:mt-5 font-display uppercase text-base sm:text-xl tracking-wide text-zinc-100">
                  {card.title}
                </h4>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">
                  {card.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
