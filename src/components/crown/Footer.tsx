"use client";

import { Clock, Crown, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CrownEdge } from "./CrownShapes";

export default function Footer() {
  const settings = useAppStore((s) => s.content?.settings);
  const s = settings ?? {};

  function go(href: string) {
    document.getElementById(href)?.scrollIntoView({ behavior: "smooth" });
  }

  const nav = [
    { href: "inicio", label: "Início" },
    { href: "modalidades", label: "Modalidades" },
    { href: "horarios", label: "Horários" },
    { href: "planos", label: "Planos" },
    { href: "galeria", label: "Galeria" },
  ];

  return (
    <>
      {/* Picos de coroa coroando o rodapé */}
      <CrownEdge fill="#070707" stroke="rgba(217,164,65,0.5)" height={26} />
      <footer id="contato" className="relative mt-auto bg-[#070707]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Marca */}
          <div>
          <img
            src="/logo.png"
            alt="Logo CROWN Academia"
            className="h-16 w-auto gold-drop-glow mb-5"
          />
            <p className="text-sm text-muted-foreground leading-relaxed">
              A academia mais completa de Pinhal-SP. Estrutura premium, treinadores
              qualificados e uma comunidade que treina junto.
            </p>
            <a
              href={s.instagram ? `https://instagram.com/${s.instagram.replace("@", "")}` : "https://instagram.com/crownpinhal"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex -skew-x-12 bg-gold-gradient text-black hover:brightness-110 transition-all"
            >
              <span className="flex items-center gap-2 skew-x-12 px-5 py-3 text-sm font-heading uppercase tracking-wider font-bold">
                <Instagram className="w-4 h-4" />
                {s.instagram || "@crownpinhal"}
              </span>
            </a>
            {s.whatsapp && (
              <a
                href={`https://wa.me/${s.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da CROWN"
                className="ml-3 mt-5 inline-flex -skew-x-12 border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
              >
                <span className="flex items-center gap-2 skew-x-12 px-4 py-3 text-sm font-heading uppercase tracking-wider font-bold">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </span>
              </a>
            )}
          </div>

          {/* Navegação */}
          <div>
            <h3 className="font-heading uppercase tracking-[0.25em] text-sm text-[#d9a441] mb-5">
              Navegação
            </h3>
            <ul className="space-y-2.5">
              {nav.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => go(l.href)}
                    className="text-sm text-muted-foreground hover:text-[#d9a441] transition-colors cursor-pointer"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-heading uppercase tracking-[0.25em] text-sm text-[#d9a441] mb-5">
              Contato
            </h3>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-[#d9a441] shrink-0" />
                {s.address || "Av. dos Reis, 1234 - Centro, Pinhal-SP"}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d9a441] shrink-0" />
                {s.phone || "(19) 99999-9999"}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d9a441] shrink-0" />
                {s.email || "contato@crownpinhal.com.br"}
              </li>
              {s.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${s.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-1 bg-gold-gradient text-black px-4 py-2 text-sm font-heading uppercase tracking-wider font-semibold hover:brightness-110 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Horários */}
          <div>
            <h3 className="font-heading uppercase tracking-[0.25em] text-sm text-[#d9a441] mb-5">
              Funcionamento
            </h3>
            <p className="text-sm text-muted-foreground flex items-start gap-2.5 leading-relaxed">
              <Clock className="w-4 h-4 mt-0.5 text-[#d9a441] shrink-0" />
              {s.hoursText || "Musculação: Seg a Sex 5h-22h • Sáb 8h-16h • Dom 8h-14h"}
            </p>
            <div className="mt-6 -skew-x-12">
              <div className="skew-x-12 bg-[#0d0d0d] border-l-2 border-[#d9a441] p-4">
                <p className="font-display uppercase text-sm text-gold-gradient flex items-center gap-2">
                  <Crown className="w-4 h-4" /> CROWN PINHAL-SP
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Sua coroa não se ganha. Ela se conquista.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} CROWN Academia — Pinhal-SP. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground/50 font-heading uppercase tracking-widest">
            Treine como um rei
          </p>
        </div>
      </div>
      </footer>
    </>
  );
}
