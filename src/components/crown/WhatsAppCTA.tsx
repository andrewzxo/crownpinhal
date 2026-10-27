"use client";

import { useAppStore } from "@/lib/store";
import { WhatsAppIcon } from "./CtaSection";

/**
 * Botão de WhatsApp com mensagem pronta e contextual.
 * A mensagem que chega no WhatsApp já vem preenchida com o assunto
 * em que o botão foi clicado ("tire suas dúvidas sobre o assunto com a CROWN").
 */
export default function WhatsAppCTA({
  subject,
  message,
  className = "",
}: {
  /** Assunto do botão — ex.: "as modalidades", "os planos e valores" */
  subject: string;
  /** Mensagem pronta customizada (opcional). Por padrão menciona o assunto. */
  message?: string;
  className?: string;
}) {
  const whatsapp =
    useAppStore((s) => s.content?.settings?.whatsapp) || "5519991504548";
  const text =
    message || `Olá! Vim pelo site da CROWN e quero tirar dúvidas sobre ${subject}.`;
  const href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Tire suas dúvidas sobre ${subject} com a CROWN pelo WhatsApp`}
      className={`inline-flex items-center justify-center gap-2.5 border border-[#25D366]/50 bg-[#25D366]/5 text-[#25D366] hover:bg-[#25D366]/15 hover:border-[#25D366] px-5 sm:px-7 min-h-11 py-2 font-heading uppercase tracking-wider text-[11px] sm:text-sm transition-all ${className}`}
    >
      <WhatsAppIcon className="w-4 h-4 shrink-0" />
      <span className="text-center leading-snug">
        Tire suas dúvidas sobre {subject} com a CROWN
      </span>
    </a>
  );
}
