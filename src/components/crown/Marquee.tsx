"use client";

import { Sparkle } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function Marquee() {
  const marqueeItems = useAppStore((s) => s.content?.settings.marqueeItems);
  const items =
    marqueeItems ||
    "MUSCULAÇÃO • CROSSFIT • BOXE • MUAY THAI • SPINNING • FUNCIONAL • ZUMBA • JUMP • PILATES";
  const tokens = items.split("•").map((t) => t.trim()).filter(Boolean);

  const row = (
    <div className="flex items-center shrink-0">
      {tokens.map((t, i) => (
        <span key={`${t}-${i}`} className="flex items-center">
          <span className="font-display uppercase text-xl sm:text-2xl tracking-wide px-4 whitespace-nowrap">
            {t}
          </span>
          <Sparkle className="w-4 h-4 shrink-0 opacity-70" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative -rotate-1 bg-gold-gradient py-3 overflow-hidden shadow-[0_10px_40px_-10px_rgba(217,164,65,0.4)] z-20">
      <div className="flex w-max animate-marquee text-black">
        {row}
        {row}
      </div>
    </div>
  );
}
