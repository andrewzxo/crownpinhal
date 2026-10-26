"use client";

import { Building2, Check, CreditCard, Users, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import { WhatsAppIcon } from "./CtaSection";

type CorporateCard = {
  icon: LucideIcon;
  name: string;
  tagline?: string;
  highlighted?: boolean;
  bullets: string[];
};

function waLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function Empresas() {
  const settings = useAppStore((s) => s.content?.settings);
  const whatsapp = settings?.whatsapp || "5519991504548";

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
    <section id="empresas" className="relative py-24 sm:py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="Benefícios corporativos"
          title="TRABALHA E QUER TREINAR?"
          highlight="TREINAR?"
          subtitle="A CROWN aceita Wellhub (antigo Gympass) e TotalPass. Se a sua empresa oferece um desses benefícios, você treina na CROWN — e sem reserva prévia."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {cards.map((card, i) => (
            <Reveal key={card.name} delay={i * 0.12} className={card.highlighted ? "lg:-mt-4" : ""}>
              <article
                className={`relative h-full clip-blade p-px transition-all duration-300 ${
                  card.highlighted
                    ? "bg-gold-gradient gold-drop-glow"
                    : "bg-[#262626] hover:bg-[#d9a441]/50"
                }`}
              >
                <div
                  className={`clip-blade h-full p-7 flex flex-col ${
                    card.highlighted ? "bg-[#101010]" : "bg-[#0d0d0d]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="clip-shield w-12 h-14 bg-gold-gradient flex items-center justify-center shrink-0">
                      <card.icon className="w-6 h-6 text-black" />
                    </span>
                    <div>
                      <h3 className="font-display uppercase text-2xl tracking-wide text-foreground">
                        {card.name}
                      </h3>
                      {card.tagline && (
                        <p className="text-xs font-heading uppercase tracking-widest text-[#d9a441] mt-0.5">
                          {card.tagline}
                        </p>
                      )}
                    </div>
                  </div>

                  <ul className="mt-7 space-y-4 flex-1">
                    {card.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-foreground/85 leading-relaxed">
                        <span className="mt-0.5 w-[16px] h-[16px] shrink-0 rotate-45 bg-[#d9a441]/15 border border-[#d9a441]/50 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-[#d9a441] -rotate-45" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  {card.highlighted && (
                    <p className="mt-6 text-xs font-heading uppercase tracking-widest text-[#d9a441]/80 border-t border-[#262626] pt-4">
                      Vantagem do plano Basic: musculação já inclusa
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.35}>
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground text-center max-w-xl">
              Funcionário de empresa conveniada? Apresente seu benefício na recepção ou tire dúvidas
              direto com o nosso time.
            </p>
            <div className="-skew-x-[10deg]">
              <Button
                size="lg"
                asChild
                className="h-12 px-8 skew-x-[10deg] bg-transparent border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366] font-heading uppercase tracking-wider font-semibold text-sm transition-all"
              >
                <a
                  href={waLink(whatsapp, "Olá! Trabalho em uma empresa e quero saber mais sobre o Wellhub e o TotalPass na CROWN.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex items-center gap-2 skew-x-[10deg]">
                    <WhatsAppIcon className="w-4 h-4" />
                    Tirar dúvidas no WhatsApp
                  </span>
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
