"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

/** Nomes dos dias da semana indexados por dayOfWeek (0 = Domingo). */
export const DAY_NAMES = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

/** Ordem de exibição: Segunda a Sábado, depois Domingo. */
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

/** Cor de ouro CROWN. */
export const GOLD = "#d9a441";

/* ------------------------------------------------------------------ */
/* Utilitários de scroll                                               */
/* ------------------------------------------------------------------ */

export const scrollbarY =
  "overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#262626] [&::-webkit-scrollbar-track]:bg-transparent";

export const scrollbarX =
  "overflow-x-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#262626] [&::-webkit-scrollbar-track]:bg-transparent";

/* ------------------------------------------------------------------ */
/* Formatadores pt-BR                                                  */
/* ------------------------------------------------------------------ */

const dateTimeFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const numberFmt = new Intl.NumberFormat("pt-BR");

const priceFmt = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatDateTimeBR(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return dateTimeFmt.format(date);
}

export function formatNumberBR(value: number): string {
  return numberFmt.format(value);
}

export function formatPriceBR(value: number): string {
  return priceFmt.format(value);
}

/** Normaliza "07:00:00" → "07:00". */
export function formatTime(hhmmss: string): string {
  return typeof hhmmss === "string" ? hhmmss.slice(0, 5) : hhmmss;
}

/* ------------------------------------------------------------------ */
/* Painel: header fixo                                                 */
/* ------------------------------------------------------------------ */

interface PanelHeaderProps {
  titleA?: string;
  titleB: string;
  subtitle: string;
  children?: ReactNode;
}

export function PanelHeader({ titleA, titleB, subtitle, children }: PanelHeaderProps) {
  const setView = useAppStore((s) => s.setView);
  return (
    <header className="sticky top-0 z-40 border-b border-[#d9a441]/25 bg-[#050505]/95 backdrop-blur supports-[backdrop-filter]:bg-[#050505]/80">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <h1 className="font-display truncate text-xl uppercase tracking-wide text-foreground sm:text-2xl">
            {titleA ? `${titleA} ` : ""}
            <span className="text-gold-gradient">{titleB}</span>
          </h1>
          <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {children}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView("site")}
            aria-label="Voltar ao site"
            className="border-[#d9a441]/40 bg-transparent text-[#d9a441] hover:bg-[#d9a441]/10 hover:text-[#d9a441]"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Voltar ao Site</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Painel: navegação de abas                                           */
/* ------------------------------------------------------------------ */

export interface PanelTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface PanelNavProps {
  tabs: PanelTab[];
  active: string;
  onChange: (id: string) => void;
  ariaLabel: string;
}

export function PanelNav({ tabs, active, onChange, ariaLabel }: PanelNavProps) {
  return (
    <nav aria-label={ariaLabel} className="shrink-0 md:w-52">
      <div
        className={cn(
          "flex gap-2 pb-2 md:flex-col md:gap-1 md:pb-0",
          scrollbarX,
          "md:overflow-visible"
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors md:w-full",
                "border-l-2",
                isActive
                  ? "border-[#d9a441]/40 border-l-[#d9a441] bg-[#d9a441]/10 text-[#d9a441]"
                  : "border-transparent border-l-transparent text-muted-foreground hover:bg-[#141414] hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span className="font-heading uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Formulário: label dourada                                           */
/* ------------------------------------------------------------------ */

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-heading block text-xs uppercase tracking-wider text-[#d9a441]"
    >
      {children}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Estados: vazio, loading, acesso restrito                            */
/* ------------------------------------------------------------------ */

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <Icon className="size-10 text-[#d9a441]/40" aria-hidden />
      <p className="font-heading uppercase tracking-wide text-muted-foreground">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground/80">{description}</p>
      ) : null}
    </div>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full bg-[#141414]" />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, height = "h-12" }: { rows?: number; height?: string }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={cn("w-full bg-[#141414]", height)} />
      ))}
    </div>
  );
}

export function AccessDeniedCard() {
  const setView = useAppStore((s) => s.setView);
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-4">
      <Card className="w-full max-w-sm border-[#262626] bg-[#101010]">
        <CardContent className="flex flex-col items-center gap-4 px-6 text-center">
          <ShieldAlert className="size-12 text-[#d9a441]" aria-hidden />
          <div>
            <h2 className="font-display text-2xl uppercase text-foreground">Acesso restrito</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Você não tem permissão para acessar esta área do sistema.
            </p>
          </div>
          <Button
            onClick={() => setView("site")}
            className="w-full bg-gold-gradient font-heading uppercase tracking-wider text-black hover:opacity-90"
          >
            Voltar ao Site
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Botão dourado padrão                                                */
/* ------------------------------------------------------------------ */

export const goldButtonClass =
  "bg-gold-gradient font-heading uppercase tracking-wider text-black hover:opacity-90";

export const outlineButtonClass =
  "border-[#262626] bg-transparent text-foreground hover:bg-[#1a1a1a] hover:text-foreground";

/* ------------------------------------------------------------------ */
/* Badges de status compartilhados                                     */
/* ------------------------------------------------------------------ */

export function ActiveBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
      Ativa
    </span>
  ) : (
    <span className="inline-flex items-center rounded-md border border-[#262626] bg-transparent px-2 py-0.5 text-xs font-medium text-muted-foreground">
      Inativa
    </span>
  );
}
