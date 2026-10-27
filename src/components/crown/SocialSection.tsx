"use client";

import { Instagram, MapPin } from "lucide-react";
import { useAppStore } from "@/lib/store";
import Reveal, { SectionTitle } from "./Reveal";

/** Gradiente oficial do Instagram (mesma identidade da marca). */
const IG_GRADIENT =
  "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)";

export default function SocialSection() {
  const settings = useAppStore((s) => s.content?.settings);
  const instagram = (settings?.instagram || "@crownpinhal").replace("@", "");
  const mapsUrl =
    settings?.mapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=Crown+Pinhal,+Av.+Washington+Lu%C3%ADs,+45,+Esp%C3%ADrito+Santo+do+Pinhal+-+SP";
  const address =
    settings?.address ||
    "Av. Washington Luís, 45 — Espírito Santo do Pinhal-SP";

  return (
    <section id="redes" className="relative py-24 sm:py-32 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="Redes sociais"
          title="SIGA E NOS ENCONTRE"
          highlight="SIGA"
          subtitle="Postamos treinos, eventos e o dia a dia da comunidade — e a fachada da academia já está no Maps."
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
          {/* Instagram — design exclusivo com a paleta do Instagram */}
          <Reveal>
            <div
              className="relative h-full rounded-3xl p-7 sm:p-10 flex flex-col items-start overflow-hidden"
              style={{ background: IG_GRADIENT }}
            >
              <span className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center">
                <Instagram className="w-7 h-7 text-white" aria-hidden />
              </span>
              <h3 className="mt-6 font-display uppercase text-2xl sm:text-4xl leading-[1.1] text-white">
                Acompanhe postagens diretamente do nosso Instagram
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/90 max-w-md">
                Treinos, eventos, bastidores e a energia da comunidade CROWN —
                todos os dias no feed{" "}
                <span className="font-bold text-white">@{instagram}</span>.
              </p>
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir o Instagram da CROWN (@${instagram})`}
                className="mt-8 inline-flex items-center gap-2.5 h-12 px-7 rounded-xl bg-white font-heading uppercase tracking-wider font-bold text-sm transition-transform hover:scale-[1.04]"
              >
                <Instagram className="w-5 h-5 shrink-0" aria-hidden />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: IG_GRADIENT }}
                >
                  Seguir @{instagram}
                </span>
              </a>
            </div>
          </Reveal>

          {/* Google Maps — veja a fachada da academia */}
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border border-[#2b2b31] bg-[#17171b] p-7 sm:p-10 flex flex-col items-start">
              <span className="w-14 h-14 rounded-2xl bg-[#EA4335]/15 border border-[#EA4335]/40 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-[#EA4335]" aria-hidden />
              </span>
              <h3 className="mt-6 font-display uppercase text-2xl sm:text-4xl leading-[1.1] text-white">
                Veja nossa fachada no Maps
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-md">
                {address}. Abra a rota no Google Maps e venha nos conhecer de
                perto.
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir a localização da CROWN no Google Maps"
                className="mt-8 inline-flex items-center gap-2.5 h-12 px-7 rounded-xl bg-white text-black font-heading uppercase tracking-wider font-bold text-sm transition-colors hover:bg-zinc-200"
              >
                <MapPin className="w-5 h-5 shrink-0 text-[#EA4335]" aria-hidden />
                Abrir no Google Maps
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
