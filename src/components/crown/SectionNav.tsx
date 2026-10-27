"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Barra de navegação por ÁREAS do site.
 * Aparece depois do Hero (fixa abaixo da Navbar) e permite pular
 * direto para a visualização de cada área com um clique.
 * Ordem = ordem real das seções na página.
 */
const AREAS = [
  { href: "inicio", label: "Início" },
  { href: "sobre", label: "A Academia" },
  { href: "modalidades", label: "Modalidades" },
  { href: "coletivas", label: "Coletivas" },
  { href: "horarios", label: "Horários" },
  { href: "empresas", label: "Empresas" },
  { href: "planos", label: "Planos" },
  { href: "galeria", label: "Estrutura" },
  { href: "eventos", label: "Eventos" },
  { href: "contato", label: "Contato" },
];

export default function SectionNav() {
  const [active, setActive] = useState("inicio");
  const [visible, setVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.55);
        // Área ativa = seção mais próxima ACIMA da linha de corte
        const probe = 150;
        let current = AREAS[0].href;
        let best = -Infinity;
        for (const a of AREAS) {
          const el = document.getElementById(a.href);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (top <= probe && top > best) {
            best = top;
            current = a.href;
          }
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function go(href: string) {
    document.getElementById(href)?.scrollIntoView({ behavior: "smooth" });
  }

  // Centraliza o chip da área ativa na barra (mobile)
  useEffect(() => {
    const c = scrollRef.current;
    if (!c) return;
    const btn = c.querySelector<HTMLElement>(`[data-area="${active}"]`);
    if (!btn) return;
    const target = btn.offsetLeft - c.clientWidth / 2 + btn.clientWidth / 2;
    c.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="Navegação por áreas do site"
      className={`fixed inset-x-0 top-[60px] z-40 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-[140%] opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-[#101013]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.9)]">
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <div ref={scrollRef} className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2">
            {AREAS.map((a) => {
              const isActive = active === a.href;
              return (
                <button
                  key={a.href}
                  data-area={a.href}
                  onClick={() => go(a.href)}
                  aria-current={isActive ? "location" : undefined}
                  className={`shrink-0 px-3.5 py-1.5 font-heading uppercase tracking-wider text-xs transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#d9a441] text-black font-bold"
                      : "bg-[#1b1b20] border border-[#2b2b31] text-zinc-300 hover:text-white hover:border-[#52525b]"
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
