"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Clock, Crown, PackageOpen, XCircle } from "lucide-react";
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
  PENDING: { label: "Pendente", cls: "bg-[#d9a441]/15 text-[#d9a441] border-[#d9a441]/40", icon: Clock },
  ACTIVE: { label: "Ativa", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40", icon: BadgeCheck },
  CANCELLED: { label: "Cancelada", cls: "bg-red-500/15 text-red-400 border-red-500/40", icon: XCircle },
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
      <div className="py-10 text-center text-muted-foreground">
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
        <PackageOpen className="w-12 h-12 mx-auto text-[#d9a441]/40" />
        <p className="mt-4 text-muted-foreground">
          Você ainda não fez nenhum pedido de plano.
        </p>
        <p className="text-sm text-muted-foreground/60">Escolha um plano e vista a coroa!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
      {subs.map((s) => {
        const st = STATUS[s.status];
        const Icon = st.icon;
        return (
          <div
            key={s.id}
            className="border border-[#262626] bg-[#0a0a0a] p-4 flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="font-display uppercase tracking-wide text-lg">{s.plan.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {fmtDate.format(new Date(s.createdAt))}
              </p>
              {s.notes && (
                <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">
                  “{s.notes}”
                </p>
              )}
            </div>
            <span
              className={`shrink-0 inline-flex items-center gap-1.5 border px-3 py-1 text-xs font-heading uppercase tracking-wider ${st.cls}`}
            >
              <Icon className="w-3.5 h-3.5" />
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
      <DialogContent className="bg-[#0d0d0d] border-[#2a2a2a] max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl uppercase tracking-wide flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#d9a441]" />
            Meus <span className="text-gold-gradient">pedidos</span>
          </DialogTitle>
          <DialogDescription>
            Acompanhe o status das suas assinaturas na CROWN.
          </DialogDescription>
        </DialogHeader>
        {open && <SubsList />}
      </DialogContent>
    </Dialog>
  );
}
