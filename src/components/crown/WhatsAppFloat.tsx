"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { WhatsAppIcon } from "./CtaSection";

export default function WhatsAppFloat() {
  const settings = useAppStore((s) => s.content?.settings);
  const whatsapp = settings?.whatsapp || "5519991504548";
  const phoneLabel = "(19) 99150-4548";
  const message =
    settings?.whatsappMsg || "Olá! Quero agendar meus 7 dias grátis na CROWN.";

  return (
    <motion.a
      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar com a CROWN no WhatsApp ${phoneLabel}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 16 }}
      className="group fixed bottom-5 right-5 z-50 flex items-center"
    >
      {/* Etiqueta flutuante (desktop) */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center whitespace-nowrap rounded-full border border-[#25D366]/50 bg-black/85 backdrop-blur px-4 py-2 text-xs font-heading uppercase tracking-wider text-white opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
        {phoneLabel}
      </span>

      {/* Balão redondo */}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-black shadow-lg transition-transform duration-300 group-hover:scale-110">
        <WhatsAppIcon className="relative w-7 h-7" />
      </span>
    </motion.a>
  );
}
