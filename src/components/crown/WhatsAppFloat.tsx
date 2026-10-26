"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { WhatsAppIcon } from "./CtaSection";

export default function WhatsAppFloat() {
  const whatsapp = useAppStore((s) => s.content?.settings.whatsapp) || "5519991504548";
  const phoneLabel = "(19) 99150-4548";

  return (
    <motion.a
      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
        "Olá! Vim pelo site da CROWN e quero saber mais sobre os treinos."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar com a CROWN no WhatsApp ${phoneLabel}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-0 h-14 w-14 sm:hover:w-auto sm:hover:gap-3 overflow-hidden bg-[#25D366] text-black px-4 font-heading uppercase tracking-wider text-sm font-bold shadow-[0_8px_30px_-6px_rgba(37,211,102,0.55)] transition-all duration-300 hover:brightness-110"
    >
      <WhatsAppIcon className="w-7 h-7 shrink-0" />
      <span className="hidden sm:inline whitespace-nowrap max-w-0 group-hover:max-w-[220px] group-hover:inline transition-all duration-300 overflow-hidden">
        {phoneLabel}
      </span>
    </motion.a>
  );
}
