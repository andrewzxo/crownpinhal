"use client";

import { useAppStore } from "@/lib/store";

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
          <span className="font-display text-xl text-[#d9a441] select-none" aria-hidden>
            {"//"}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="relative border-y border-[#d9a441]/25 bg-[#070707] py-4 overflow-hidden z-20"
      aria-hidden
    >
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  );
}
