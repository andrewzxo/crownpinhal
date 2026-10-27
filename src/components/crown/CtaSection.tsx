"use client";

import { ExternalLink, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import Reveal from "./Reveal";

export default function CtaSection() {
  const settings = useAppStore((s) => s.content?.settings);
  const instagram = (settings?.instagram || "@crownpinhal").replace("@", "");
  const whatsapp = settings?.whatsapp || "5519991504548";
  const beaconsUrl = settings?.beaconsUrl || "https://beacons.ai/crownpinhal";
  const waMessage = settings?.whatsappMsg || "Olá! Quero agendar meus 7 dias grátis na CROWN.";
  const waLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`;

  const ctaTitle = settings?.ctaTitle || "COMEÇA COM 7 DIAS GRÁTIS";
  const ctaWords = ctaTitle.split(" ");
  const ctaLast = ctaWords.pop() || "";
  const ctaPre = ctaWords.join(" ");

  return (
    <section className="relative py-24 sm:py-32 bg-[#101013] overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <Reveal>
          <p className="font-heading uppercase tracking-[0.3em] text-xs text-zinc-400 mb-6">
            {settings?.ctaEyebrow || "Aula experimental"}
          </p>
          <h2 className="font-display uppercase text-5xl sm:text-7xl lg:text-8xl leading-[0.95]">
            {ctaPre && <span className="text-white">{ctaPre} </span>}
            <span className="text-[#d9a441]">{ctaLast}</span>
          </h2>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            {settings?.ctaText ||
              "Novos alunos testam toda a estrutura das 5h às 16h. Agende sua aula experimental pelo WhatsApp ou pelo hub da CROWN — é rápido."}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="h-14 px-10 rounded-none bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-bold text-base transition-all hover:scale-[1.03]"
            >
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Agendar pelo WhatsApp
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 px-10 bg-transparent border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40 font-heading uppercase tracking-wider font-semibold text-base transition-all"
            >
              <a href={beaconsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Hub da CROWN
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 px-10 bg-transparent border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40 font-heading uppercase tracking-wider font-semibold text-base transition-all"
            >
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-4 h-4 mr-2" />
                {settings?.instagram || "@crownpinhal"}
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
