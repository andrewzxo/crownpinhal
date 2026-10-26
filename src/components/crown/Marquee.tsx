"use client";

import { useAppStore } from "@/lib/store";
import { CrownEdge } from "./CrownShapes";

export default function Marquee() {
  const marqueeItems = useAppStore((s) => s.content?.settings.marqueeItems);
  const items =
    marqueeItems ||
    "MUSCULAÇÃO • CROSS • HYROX • CROWN RUN • DANCE • BIKE • JUMP • PILATES • MUAY THAI • BOXE • BEACH TENNIS • FUTEVÔLEI";
  const tokens = items.split("•").map((t) => t.trim()).filter(Boolean);

  const row = (
    <div className="flex items-center shrink-0">
      {tokens.map((t, i) => (
        <span key={`${t}-${i}`} className="flex items-center shrink-0">
          <span
            className={`font-display uppercase text-2xl sm:text-3xl tracking-wide px-5 sm:px-7 whitespace-nowrap ${
              i % 2 === 0 ? "text-foreground" : "text-outline-gold"
            }`}
          >
            {t}
          </span>
          <span className="w-2 h-2 bg-[#d9a441] rotate-45 shrink-0" aria-hidden />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative z-20" aria-hidden>
      {/* Borda superior — picos de coroa */}
      <CrownEdge fill="#070707" stroke="rgba(217,164,65,0.45)" height={22} />
      <div className="bg-[#070707] py-4 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {row}
          {row}
        </div>
      </div>
      {/* Borda inferior — picos invertidos */}
      <CrownEdge fill="#070707" stroke="rgba(217,164,65,0.45)" height={22} flip />
    </div>
  );
}
