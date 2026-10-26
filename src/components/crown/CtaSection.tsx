"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import Reveal from "./Reveal";
import { CrownEdge, CrownWatermark } from "./CrownShapes";

export default function CtaSection() {
  const settings = useAppStore((s) => s.content?.settings);
  const instagram = (settings?.instagram || "@crownpinhal").replace("@", "");
  const whatsapp = settings?.whatsapp || "5519991504548";

  return (
    <>
      <CrownEdge fill="#050505" height={20} />
      <section className="relative py-24 sm:py-32 overflow-hidden grain-overlay">
      {/* Fundo com a textura da marca */}
      <img
        src="/img/texture-gold.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-[#050505]" />

      {/* Marca d'água coroa */}
      <CrownWatermark className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] text-[#d9a441] opacity-[0.06]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <Reveal>
          <p className="font-heading uppercase tracking-[0.4em] text-xs text-[#d9a441] mb-6">
            Escolha sua aula
          </p>
          <h2 className="font-display uppercase text-5xl sm:text-7xl lg:text-8xl leading-[0.95]">
            <span className="text-foreground">#</span>
            <span className="text-gold-gradient drop-shadow-[0_0_30px_rgba(217,164,65,0.35)]">
              {(settings?.ctaTitle || "#VEMPRA CROWN").replace("#", "")}
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {settings?.ctaText ||
              "Escolha sua aula e venha treinar com a gente. Chama no WhatsApp e começa sua transformação hoje."}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="h-14 px-10 rounded-none clip-arrow-r bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-bold text-base transition-all hover:scale-[1.03]"
            >
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Chamar no WhatsApp
              </a>
            </Button>
            <div className="-skew-x-[10deg]">
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-10 skew-x-[10deg] bg-transparent border-[#d9a441]/50 hover:bg-[#d9a441]/10 hover:text-[#d9a441] hover:border-[#d9a441] font-heading uppercase tracking-wider font-semibold text-base transition-all"
              >
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-block skew-x-[10deg]">Seguir no Instagram</span>
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
      </section>
    </>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
