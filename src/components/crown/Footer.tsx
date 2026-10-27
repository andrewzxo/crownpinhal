"use client";

import { Instagram } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { WhatsAppIcon } from "./CtaSection";

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
    { href: "eventos", label: "Eventos" },
    { href: "empresas", label: "Empresas" },
  ];

  const mapsUrl =
    s.mapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=Crown+Pinhal,+Av.+Washington+Lu%C3%ADs,+45,+Esp%C3%ADrito+Santo+do+Pinhal+-+SP";
  const beaconsUrl = s.beaconsUrl || "https://beacons.ai/crownpinhal";
  const ticketbroUrl = s.ticketbroUrl || "https://crown-gym-pinhal.ticketbro.com/";

  return (
    <>
      <footer id="contato" className="relative mt-auto bg-[#0c0c0e] scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Marca */}
          <div>
          <img
            src="/logo.png"
            alt="Logo CROWN Academia"
            className="h-16 w-auto mb-5"
          />
            <p className="text-sm text-zinc-400 leading-relaxed">
              Um espaço completo para o seu Fitness & Lifestyle em Espírito Santo do Pinhal.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={s.instagram ? `https://instagram.com/${s.instagram.replace("@", "")}` : "https://instagram.com/crownpinhal"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-zinc-100 text-black hover:bg-white transition-colors"
              >
                <span className="flex items-center gap-2 px-5 py-3 text-sm font-heading uppercase tracking-wider font-bold">
                  <Instagram className="w-4 h-4" />
                  {s.instagram || "@crownpinhal"}
                </span>
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="font-heading uppercase tracking-[0.25em] text-sm text-zinc-200 mb-5">
              Navegação
            </h3>
            <ul className="space-y-2.5">
              {nav.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => go(l.href)}
                    className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-heading uppercase tracking-[0.25em] text-sm text-zinc-200 mb-5">
              Contato
            </h3>
            <ul className="space-y-3.5 text-sm text-zinc-400">
              <li>
                <span className="block text-zinc-200">{s.address || "Av. Washington Luís, 45 — Espírito Santo do Pinhal-SP"}</span>
                <span className="block mt-0.5 text-xs text-zinc-500">
                  {s.addressNote || "A ~700m da Praça Nestor de Almeida Vergueiro • CEP 13990-000"}
                </span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-heading uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
                >
                  Ver no Google Maps
                </a>
              </li>
              <li>{s.phone || "(19) 99150-4548"}</li>
              {s.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${s.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-1 border border-[#25D366]/50 text-[#25D366] px-4 py-2 text-sm font-heading uppercase tracking-wider font-semibold hover:bg-[#25D366]/10 transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Funcionamento + links */}
          <div>
            <h3 className="font-heading uppercase tracking-[0.25em] text-sm text-zinc-200 mb-5">
              Funcionamento
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {s.hoursText || "Musculação: Seg a Sex 5h-22h • Sáb 8h-16h • Dom 8h-14h"}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={beaconsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Hub de agendamento
              </a>
              <a
                href={ticketbroUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Ingressos e eventos
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-[#1e1e24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 text-center lg:text-left">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Crown Pinhal — Todos os direitos reservados.
          </p>
          <p className="text-[11px] text-zinc-600 mt-1">
            {s.cnpj || "Lrt Atividades em Condicionamento Fisico LTDA • CNPJ 57.249.247/0001-63"}
          </p>
        </div>
      </div>
      </footer>
    </>
  );
}
