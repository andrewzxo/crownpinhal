"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppStore } from "@/lib/store";
import AccountMenu from "./AccountMenu";

const LINKS = [
  { href: "inicio", label: "Início" },
  { href: "modalidades", label: "Modalidades" },
  { href: "horarios", label: "Horários" },
  { href: "empresas", label: "Empresas" },
  { href: "planos", label: "Planos" },
  { href: "eventos", label: "Eventos" },
  { href: "contato", label: "Contato" },
];

export default function Navbar() {
  const user = useAppStore((s) => s.user);
  const openAuthModal = useAppStore((s) => s.openAuthModal);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function go(href: string) {
    setOpen(false);
    document.getElementById(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#101013]/90 backdrop-blur-xl border-b border-white/10 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => go("inicio")}
          aria-label="Ir para o início"
          className="flex items-center cursor-pointer shrink-0"
        >
          <img
            src="/logo.png"
            alt="Logo CROWN Academia"
            className={`w-auto transition-all duration-300 ${
              scrolled ? "h-11" : "h-14"
            }`}
          />
        </button>

        {/* Links desktop */}
        <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="px-3 py-2 font-heading uppercase text-sm tracking-wider text-zinc-300 hover:text-[#d9a441] transition-colors relative group cursor-pointer"
            >
              {l.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold-gradient group-hover:w-2/3 transition-all duration-300" />
            </button>
          ))}
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-3">
          {user ? (
            <AccountMenu />
          ) : (
            <Button
              onClick={() => openAuthModal(undefined, "login")}
              className="hidden sm:inline-flex h-10 bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-semibold text-sm"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </Button>
          )}

          {/* Menu mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Abrir menu"
                className="lg:hidden w-11 h-11 flex items-center justify-center border border-[#2b2b31] bg-[#17171b] text-zinc-100 hover:text-white hover:border-[#52525b] transition-colors"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#141418] border-[#2b2b31] w-72 p-0"
            >
              <SheetHeader className="p-5 border-b border-[#2b2b31]">
                <SheetTitle className="flex items-center">
                  <img
                    src="/logo.png"
                    alt="Logo CROWN Academia"
                    className="h-10 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Menu mobile" className="flex flex-col p-4 gap-1">
                {LINKS.map((l) => (
                  <button
                    key={l.href}
                    onClick={() => go(l.href)}
                    className="text-left px-4 py-3 font-heading uppercase tracking-wider text-sm text-zinc-300 hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-zinc-400 transition-colors cursor-pointer"
                  >
                    {l.label}
                  </button>
                ))}
                {!user && (
                  <Button
                    onClick={() => {
                      setOpen(false);
                      openAuthModal(undefined, "login");
                    }}
                    className="mt-4 h-11 bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-semibold"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
