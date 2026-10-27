"use client";

import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";
import WhatsAppCTA from "./WhatsAppCTA";

export default function Gallery() {
  const gallery = useAppStore((s) => s.content?.gallery) ?? [];

  return (
    <section id="galeria" className="relative py-24 sm:py-32 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="Conheça o espaço"
          title="NOSSA ESTRUTURA"
          highlight="ESTRUTURA"
          subtitle="Fotos reais da estrutura da CROWN em Pinhal-SP."
        />

        {gallery.length === 0 ? (
          <div className="mt-12 border border-dashed border-[#3a3a42] p-12 text-center text-muted-foreground">
            As fotos da estrutura serão publicadas em breve.
          </div>
        ) : (
          <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
            {gallery.map((g, i) => (
              <Reveal key={g.id} delay={(i % 3) * 0.08} className="mb-4 break-inside-avoid">
                <figure className="group relative overflow-hidden clip-blade bg-[#17171b] border border-[#2b2b31] cursor-pointer">
                  <img
                    src={g.url}
                    alt={g.title || "Foto da estrutura da academia CROWN"}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101013]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {g.title && (
                    <figcaption className="absolute bottom-0 inset-x-0 p-4 font-heading uppercase tracking-wider text-sm text-zinc-100 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                      {g.title}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={0.15}>
          <div className="mt-12 flex justify-center">
            <WhatsAppCTA
              subject="a estrutura"
              message="Olá! Vim pelo site e quero agendar uma visita para conhecer a estrutura da CROWN."
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
