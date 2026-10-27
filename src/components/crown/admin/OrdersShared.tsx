"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Ban,
  CheckCircle2,
  Clock,
  Loader2,
  MoreVertical,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import type { SubscriptionDTO } from "@/lib/types";
import { EmptyState, formatDateTimeBR, TableSkeleton } from "./panel-shared";

function errMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function SubscriptionStatusBadge({
  status,
}: {
  status: SubscriptionDTO["status"];
}) {
  if (status === "ACTIVE") {
    return (
      <Badge className="border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
        Ativa
      </Badge>
    );
  }
  if (status === "CANCELLED") {
    return <Badge variant="destructive">Cancelada</Badge>;
  }
  return (
    <Badge className="border border-[#d9a441]/40 bg-[#d9a441]/10 text-[#d9a441]">
      Pendente
    </Badge>
  );
}

function statusActionLabel(status: SubscriptionDTO["status"]): string {
  if (status === "ACTIVE") return "Pedido ativado.";
  if (status === "PENDING") return "Pedido marcado como pendente.";
  return "Pedido cancelado.";
}

/**
 * Tabela de pedidos (assinaturas) — compartilhada entre o Dashboard do Dono
 * e o Painel Admin (ADMIN e OWNER têm acesso aos pedidos).
 */
export default function OrdersTab({ onChanged }: { onChanged?: () => void }) {
  const [items, setItems] = useState<SubscriptionDTO[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SubscriptionDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api<{ subscriptions: SubscriptionDTO[] }>(
        "/api/owner/subscriptions"
      );
      const sorted = [...data.subscriptions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setItems(sorted);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao carregar pedidos."));
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(id: string, status: SubscriptionDTO["status"]) {
    setBusyId(id);
    try {
      await api(`/api/owner/subscriptions/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      toast.success(statusActionLabel(status));
      await Promise.all([load(), onChanged?.()]);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao atualizar pedido."));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    setDeleting(true);
    try {
      await api(`/api/owner/subscriptions/${id}`, { method: "DELETE" });
      toast.success("Pedido excluído.");
      await Promise.all([load(), onChanged?.()]);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao excluir pedido."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="gap-4 border-[#2b2b31] bg-card py-4">
      <CardHeader className="px-4 [.border-b]:pb-0">
        <CardTitle className="font-display text-lg uppercase tracking-wide">
          Pedidos
        </CardTitle>
        <CardDescription>
          Todos os pedidos de assinatura recebidos pela academia.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        {items === null ? (
          <TableSkeleton rows={6} height="h-14" />
        ) : items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Nenhum pedido encontrado"
            description="Quando um cliente assinar um plano, o pedido aparecerá aqui."
          />
        ) : (
          <div className="max-h-[60vh] overflow-auto rounded-md border border-[#2b2b31] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#2b2b31]">
            <Table>
              <TableHeader>
                <TableRow className="border-[#2b2b31] hover:bg-transparent">
                  <TableHead className="text-[#d9a441]">Data</TableHead>
                  <TableHead className="text-[#d9a441]">Cliente</TableHead>
                  <TableHead className="text-[#d9a441]">Plano</TableHead>
                  <TableHead className="text-[#d9a441]">Período</TableHead>
                  <TableHead className="text-[#d9a441]">Status</TableHead>
                  <TableHead className="text-[#d9a441]">Observações</TableHead>
                  <TableHead className="text-right text-[#d9a441]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((s) => (
                  <TableRow key={s.id} className="border-[#2b2b31]">
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDateTimeBR(s.createdAt)}
                    </TableCell>
                    <TableCell>
                      <p className="whitespace-nowrap text-sm font-medium">
                        {s.user?.name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.user?.email}</p>
                      {s.user?.phone ? (
                        <p className="text-xs text-muted-foreground">{s.user.phone}</p>
                      ) : null}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {s.plan.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {s.optionLabel ? (
                        <span className="font-heading uppercase tracking-wider text-xs font-bold text-[#d9a441]">
                          {s.optionLabel}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <SubscriptionStatusBadge status={s.status} />
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">
                      {s.notes || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Ações do pedido de ${s.user?.name ?? "cliente"}`}
                            disabled={busyId === s.id}
                            className="text-muted-foreground hover:bg-[#d9a441]/10 hover:text-[#d9a441]"
                          >
                            {busyId === s.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <MoreVertical className="size-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-[#2b2b31] bg-[#1a1a20]"
                        >
                          <DropdownMenuItem
                            onClick={() => void setStatus(s.id, "ACTIVE")}
                            className="gap-2"
                          >
                            <CheckCircle2 className="size-4 text-emerald-400" aria-hidden />
                            Ativar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => void setStatus(s.id, "PENDING")}
                            className="gap-2"
                          >
                            <Clock className="size-4 text-[#d9a441]" aria-hidden />
                            Marcar Pendente
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => void setStatus(s.id, "CANCELLED")}
                            className="gap-2"
                          >
                            <Ban className="size-4 text-red-400" aria-hidden />
                            Cancelar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#2b2b31]" />
                          <DropdownMenuItem
                            onClick={() => setConfirmDelete(s)}
                            className="gap-2 text-red-400 focus:text-red-300"
                          >
                            <Trash2 className="size-4" aria-hidden />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDelete(null);
        }}
      >
        <AlertDialogContent className="border-[#2b2b31] bg-[#1a1a20]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display uppercase tracking-wide">
              Excluir pedido?
            </AlertDialogTitle>
            <AlertDialogDescription>
              O pedido de {confirmDelete?.user?.name ?? "cliente"} no plano{" "}
              {confirmDelete?.plan.name ?? "—"} será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleting}
              onClick={() => {
                const target = confirmDelete;
                setConfirmDelete(null);
                if (target) void remove(target.id);
              }}
            >
              {deleting ? <Loader2 className="size-4 animate-spin" /> : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
