"use client";

import { Building2, Check, CreditCard, Users, type LucideIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import WhatsAppCTA from "./WhatsAppCTA";

type CorporateCard = {
  icon: LucideIcon;
  name: string;
  tagline?: string;
  highlighted?: boolean;
  bullets: string[];
};

export default function Empresas() {
  const cards: CorporateCard[] = [
    {
      icon: Building2,
      name: "WELLHUB",
      tagline: "antigo Gympass",
      highlighted: true,
      bullets: [
        "Musculação e Bodybuilding funcional inclusos a partir do plano Basic",
        "Aulas em grupo e CROSS liberados a partir do Basic+ e Silver",
        "Sem reserva prévia: chega, escaneia e treina",
      ],
    },
    {
      icon: CreditCard,
      name: "TOTALPASS",
      bullets: [
        "TotalPass aceito na CROWN Pinhal",
        "Treine com o benefício corporativo da sua empresa",
        "Confirme os planos elegíveis na recepção",
      ],
    },
    {
      icon: Users,
      name: "PLANO EMPRESA",
      bullets: [
        "Condições especiais para equipes conveniadas",
        "Plano família e horário econômico também disponíveis",
        "Fale com a recepção e leve a CROWN para a sua empresa",
      ],
    },
  ];

  return (
    <section id="empresas" className="relative py-24 sm:py-32 bg-[#1a1a21] border-y border-[#23232a] scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="Benefícios corporativos"
          title="TRABALHA E QUER TREINAR?"
          highlight="TREINAR?"
          subtitle="A CROWN aceita Wellhub (antigo Gympass) e TotalPass. Se a sua empresa oferece um desses benefícios, você treina na CROWN — e sem reserva prévia."
        />

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 items-stretch">
          {cards.map((card, i) => (
            <Reveal key={card.name} delay={i * 0.12} className={card.highlighted ? "col-span-2 lg:col-span-1" : ""}>
              <article
                className={`relative h-full clip-blade border p-5 sm:p-7 flex flex-col transition-all duration-300 ${
                  card.highlighted
                    ? "border-[#d9a441] bg-[#141418]"
                    : "border-[#2b2b31] bg-[#212129] hover:border-[#3a3a42]"
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="w-11 h-12 bg-[#101013] border border-[#2b2b31] flex items-center justify-center shrink-0">
                    <card.icon className="w-5 h-5 text-[#d9a441]" />
                  </span>
                  <div>
                    <h3 className="font-display uppercase text-xl sm:text-2xl tracking-wide text-zinc-100">
                      {card.name}
                    </h3>
                    {card.tagline && (
                      <p className="text-xs font-heading uppercase tracking-widest text-zinc-500 mt-0.5">
                        {card.tagline}
                      </p>
                    )}
                  </div>
                </div>

                <ul className="mt-5 sm:mt-7 space-y-3 sm:space-y-4 flex-1">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      <Check className="mt-0.5 w-4 h-4 shrink-0 text-[#d9a441]" />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.35}>
          <div className="mt-12 flex justify-center">
            <WhatsAppCTA
              subject="os planos corporativos"
              message="Olá! Trabalho em uma empresa e quero saber mais sobre o Wellhub e o TotalPass na CROWN."
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
