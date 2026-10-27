"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { SubscriptionDTO } from "@/lib/types";

const STATUS = {
  PENDING: { label: "Pendente", cls: "bg-[#d9a441]/15 text-[#d9a441] border-[#d9a441]/40" },
  ACTIVE: { label: "Ativa", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40" },
  CANCELLED: { label: "Cancelada", cls: "bg-red-500/15 text-red-400 border-red-500/40" },
} as const;

const fmtDate = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function SubsList() {
  const [subs, setSubs] = useState<SubscriptionDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<{ subscriptions: SubscriptionDTO[] }>("/api/subscriptions/mine")
      .then((d) => {
        if (!cancelled) setSubs(d.subscriptions);
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : "Erro ao carregar pedidos.";
        if (!cancelled) setError(msg);
        toast.error(msg);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="py-10 text-center text-zinc-400">
        Não foi possível carregar seus pedidos. Tente novamente.
      </div>
    );
  }

  if (subs === null) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full bg-[#1a1a1a]" />
        ))}
      </div>
    );
  }

  if (subs.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-zinc-400">
          Você ainda não fez nenhum pedido de plano.
        </p>
        <p className="text-sm text-zinc-500">Escolha um plano para assinar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
      {subs.map((s) => {
        const st = STATUS[s.status];
        return (
          <div
            key={s.id}
            className="border border-[#2b2b31] bg-[#0a0a0a] p-4 flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="font-display uppercase tracking-wide text-lg">{s.plan.name}</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {fmtDate.format(new Date(s.createdAt))}
              </p>
              {s.notes && (
                <p className="text-xs text-zinc-400 mt-2 italic line-clamp-2">
                  “{s.notes}”
                </p>
              )}
            </div>
            <span
              className={`shrink-0 inline-flex items-center border px-3 py-1 text-xs font-heading uppercase tracking-wider ${st.cls}`}
            >
              {st.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function MySubscriptionsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141418] border-[#2b2b31] text-zinc-100 max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl uppercase tracking-wide text-white">
            Meus <span className="text-gold-gradient">pedidos</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Acompanhe o status das suas assinaturas na CROWN.
          </DialogDescription>
        </DialogHeader>
        {open && <SubsList />}
      </DialogContent>
    </Dialog>
  );
}
