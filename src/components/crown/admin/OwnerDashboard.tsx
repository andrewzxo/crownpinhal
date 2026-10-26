"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BadgeCheck,
  Ban,
  CheckCircle2,
  Clock,
  Crown,
  Dumbbell,
  Eye,
  EyeOff,
  KeyRound,
  LayoutDashboard,
  Loader2,
  MoreVertical,
  Search,
  ShoppingBag,
  Trash2,
  UserCheck,
  UserCog,
  Users,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import type {
  OwnerStatsDTO,
  OwnerUserDTO,
  Role,
  SubscriptionDTO,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  AccessDeniedCard,
  EmptyState,
  formatDateTimeBR,
  formatNumberBR,
  goldButtonClass,
  outlineButtonClass,
  PanelHeader,
  TableSkeleton,
} from "./panel-shared";

type OwnerTab = "overview" | "orders" | "users";

function errMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

/* ------------------------------------------------------------------ */
/* Badges                                                              */
/* ------------------------------------------------------------------ */

function SubscriptionStatusBadge({ status }: { status: SubscriptionDTO["status"] }) {
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
    <Badge className="border border-[#d9a441]/40 bg-[#d9a441]/10 text-[#d9a441]">Pendente</Badge>
  );
}

function RoleBadge({ role }: { role: Role }) {
  if (role === "OWNER") {
    return (
      <Badge className="border border-[#d9a441]/40 bg-[#d9a441]/10 text-[#d9a441]">OWNER</Badge>
    );
  }
  if (role === "ADMIN") {
    return (
      <Badge variant="outline" className="border-zinc-500/50 text-zinc-300">
        ADMIN
      </Badge>
    );
  }
  return <Badge variant="secondary" className="text-muted-foreground">CLIENT</Badge>;
}

/* ==================================================================== */
/* TAB 1 — VISÃO GERAL                                                  */
/* ==================================================================== */

interface KpiItem {
  key: keyof OwnerStatsDTO;
  label: string;
  icon: typeof Users;
  gold?: boolean;
}

const KPIS: KpiItem[] = [
  { key: "totalUsers", label: "Total de Usuários", icon: Users },
  { key: "totalClients", label: "Clientes", icon: UserCheck },
  { key: "pendingSubscriptions", label: "Pedidos Pendentes", icon: Clock, gold: true },
  { key: "activeSubscriptions", label: "Assinaturas Ativas", icon: BadgeCheck },
  { key: "totalModalities", label: "Modalidades", icon: Dumbbell },
  { key: "totalPlans", label: "Planos", icon: Crown },
];

interface OverviewTabProps {
  stats: OwnerStatsDTO | null;
  statsLoading: boolean;
}

function OverviewTab({ stats, statsLoading }: OverviewTabProps) {
  const [recent, setRecent] = useState<SubscriptionDTO[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void api<{ subscriptions: SubscriptionDTO[] }>("/api/owner/subscriptions")
      .then((data) => {
        if (cancelled) return;
        const sorted = [...data.subscriptions].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecent(sorted.slice(0, 5));
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(errMessage(err, "Erro ao carregar últimos pedidos."));
        setRecent([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          const value = stats ? stats[kpi.key] : null;
          const isGold = Boolean(kpi.gold);
          const highlighted = isGold && (stats?.pendingSubscriptions ?? 0) > 0;
          return (
            <Card
              key={kpi.key}
              className={cn(
                "gap-2 border-[#262626] bg-card py-4",
                highlighted && "border-[#d9a441]/50"
              )}
            >
              <CardContent className="px-4">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon
                    className={cn("size-4 shrink-0", isGold && "text-[#d9a441]")}
                    aria-hidden
                  />
                  <span className="truncate">{kpi.label}</span>
                </p>
                {statsLoading || value == null ? (
                  <Skeleton className="mt-2 h-9 w-16 bg-[#141414]" />
                ) : (
                  <p
                    className={cn(
                      "font-display mt-1 text-4xl leading-none",
                      isGold && "text-[#d9a441]",
                      highlighted && "animate-pulse-gold"
                    )}
                  >
                    {formatNumberBR(value)}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Últimos pedidos */}
      <Card className="gap-4 border-[#262626] bg-card py-4">
        <CardHeader className="px-4 [.border-b]:pb-0">
          <CardTitle className="font-display text-lg uppercase tracking-wide">
            Últimos Pedidos
          </CardTitle>
          <CardDescription>Os 5 pedidos de assinatura mais recentes.</CardDescription>
        </CardHeader>
        <CardContent className="px-4">
          {recent === null ? (
            <TableSkeleton rows={5} height="h-14" />
          ) : recent.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Nenhum pedido ainda"
              description="Os pedidos de assinatura aparecerão aqui."
            />
          ) : (
            <ul className="divide-y divide-[#1c1c1c]">
              {recent.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {s.user?.name ?? "Cliente"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.plan.name} • {formatDateTimeBR(s.createdAt)}
                    </p>
                  </div>
                  <SubscriptionStatusBadge status={s.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ==================================================================== */
/* TAB 2 — PEDIDOS                                                      */
/* ==================================================================== */

function statusActionLabel(status: SubscriptionDTO["status"]): string {
  if (status === "ACTIVE") return "Pedido ativado.";
  if (status === "PENDING") return "Pedido marcado como pendente.";
  return "Pedido cancelado.";
}

function OrdersTab({ onChanged }: { onChanged: () => void }) {
  const [items, setItems] = useState<SubscriptionDTO[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SubscriptionDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api<{ subscriptions: SubscriptionDTO[] }>("/api/owner/subscriptions");
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
      await Promise.all([load(), onChanged()]);
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
      await Promise.all([load(), onChanged()]);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao excluir pedido."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="gap-4 border-[#262626] bg-card py-4">
      <CardHeader className="px-4 [.border-b]:pb-0">
        <CardTitle className="font-display text-lg uppercase tracking-wide">Pedidos</CardTitle>
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
          <div className="max-h-[60vh] overflow-auto rounded-md border border-[#262626] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#262626]">
            <Table>
              <TableHeader>
                <TableRow className="border-[#262626] hover:bg-transparent">
                  <TableHead className="text-[#d9a441]">Data</TableHead>
                  <TableHead className="text-[#d9a441]">Cliente</TableHead>
                  <TableHead className="text-[#d9a441]">Plano</TableHead>
                  <TableHead className="text-[#d9a441]">Status</TableHead>
                  <TableHead className="text-[#d9a441]">Observações</TableHead>
                  <TableHead className="text-right text-[#d9a441]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((s) => (
                  <TableRow key={s.id} className="border-[#262626]">
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
                          className="border-[#262626] bg-[#101010]"
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
                          <DropdownMenuSeparator className="bg-[#262626]" />
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
        <AlertDialogContent className="border-[#262626] bg-[#101010]">
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

/* ==================================================================== */
/* TAB 3 — USUÁRIOS                                                     */
/* ==================================================================== */

function UsersTab() {
  const [users, setUsers] = useState<OwnerUserDTO[] | null>(null);
  const [query, setQuery] = useState("");
  const [showPasswords, setShowPasswords] = useState(true);

  // Redefinir senha
  const [resetTarget, setResetTarget] = useState<OwnerUserDTO | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  // Alterar papel
  const [roleTarget, setRoleTarget] = useState<OwnerUserDTO | null>(null);
  const [newRole, setNewRole] = useState<Role>("CLIENT");
  const [changingRole, setChangingRole] = useState(false);

  // Excluir
  const [confirmDelete, setConfirmDelete] = useState<OwnerUserDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api<{ users: OwnerUserDTO[] }>("/api/owner/users");
      setUsers(data.users);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao carregar usuários."));
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = (users ?? []).filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  function openReset(user: OwnerUserDTO) {
    setResetTarget(user);
    setNewPassword("");
  }

  async function submitReset() {
    if (!resetTarget) return;
    if (newPassword.trim().length < 4) {
      toast.error("A nova senha deve ter pelo menos 4 caracteres.");
      return;
    }
    setResetting(true);
    try {
      await api(`/api/owner/users/${resetTarget.id}`, {
        method: "PUT",
        body: JSON.stringify({ newPassword: newPassword.trim() }),
      });
      toast.success(`Senha de ${resetTarget.name} redefinida com sucesso.`);
      setResetTarget(null);
      await load();
    } catch (err) {
      toast.error(errMessage(err, "Erro ao redefinir senha."));
    } finally {
      setResetting(false);
    }
  }

  function openRole(user: OwnerUserDTO) {
    setRoleTarget(user);
    setNewRole(user.role);
  }

  async function submitRole() {
    if (!roleTarget) return;
    setChangingRole(true);
    try {
      await api(`/api/owner/users/${roleTarget.id}`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });
      toast.success(`Papel de ${roleTarget.name} alterado para ${newRole}.`);
      setRoleTarget(null);
      await load();
    } catch (err) {
      toast.error(errMessage(err, "Erro ao alterar papel."));
    } finally {
      setChangingRole(false);
    }
  }

  async function removeUser(id: string) {
    setDeleting(true);
    try {
      await api(`/api/owner/users/${id}`, { method: "DELETE" });
      toast.success("Usuário excluído.");
      setConfirmDelete(null);
      await load();
    } catch (err) {
      toast.error(errMessage(err, "Erro ao excluir usuário."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="gap-4 border-[#262626] bg-card py-4">
      <CardHeader className="px-4 [.border-b]:pb-0">
        <CardTitle className="font-display text-lg uppercase tracking-wide">Usuários</CardTitle>
        <CardDescription>
          Contas cadastradas, credenciais de acesso e permissões.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              aria-label="Buscar usuários por nome ou e-mail"
              className="border-[#262626] bg-[#0d0d0d] pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label={showPasswords ? "Ocultar senhas" : "Mostrar senhas"}
            onClick={() => setShowPasswords((v) => !v)}
            className={outlineButtonClass}
          >
            {showPasswords ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>

        {users === null ? (
          <TableSkeleton rows={5} height="h-14" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={query ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
            description={
              query ? "Tente buscar por outro nome ou e-mail." : undefined
            }
          />
        ) : (
          <div className="max-h-[60vh] overflow-auto rounded-md border border-[#262626] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#262626]">
            <Table>
              <TableHeader>
                <TableRow className="border-[#262626] hover:bg-transparent">
                  <TableHead className="text-[#d9a441]">Nome</TableHead>
                  <TableHead className="text-[#d9a441]">E-mail</TableHead>
                  <TableHead className="text-[#d9a441]">Telefone</TableHead>
                  <TableHead className="text-[#d9a441]">Papel</TableHead>
                  <TableHead className="text-[#d9a441]">Senha</TableHead>
                  <TableHead className="text-[#d9a441]">Cadastro</TableHead>
                  <TableHead className="text-right text-[#d9a441]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id} className="border-[#262626]">
                    <TableCell className="whitespace-nowrap text-sm font-medium">
                      {u.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {u.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={u.role} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-sm">
                      <span className="text-[#d9a441]/80">
                        {showPasswords ? u.passwordPlain ?? "—" : "••••••"}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDateTimeBR(u.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Ações do usuário ${u.name}`}
                            className="text-muted-foreground hover:bg-[#d9a441]/10 hover:text-[#d9a441]"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-[#262626] bg-[#101010]"
                        >
                          <DropdownMenuItem
                            onClick={() => openReset(u)}
                            className="gap-2"
                          >
                            <KeyRound className="size-4 text-[#d9a441]" aria-hidden />
                            Redefinir Senha
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openRole(u)}
                            className="gap-2"
                          >
                            <UserCog className="size-4 text-[#d9a441]" aria-hidden />
                            Alterar Papel
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#262626]" />
                          <DropdownMenuItem
                            onClick={() => setConfirmDelete(u)}
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

      {/* Dialog: Redefinir senha */}
      <Dialog
        open={resetTarget !== null}
        onOpenChange={(open) => {
          if (!open) setResetTarget(null);
        }}
      >
        <DialogContent className="border-[#262626] bg-[#101010] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">
              Redefinir Senha
            </DialogTitle>
            <DialogDescription>
              Defina uma nova senha para {resetTarget?.name ?? "este usuário"}.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submitReset();
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label
                htmlFor="new-password"
                className="font-heading text-xs uppercase tracking-wider text-[#d9a441]"
              >
                Nova senha
              </Label>
              <Input
                id="new-password"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                autoFocus
                className="border-[#262626] bg-[#0d0d0d] font-mono"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetTarget(null)}
                className={outlineButtonClass}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={resetting} className={goldButtonClass}>
                {resetting ? <Loader2 className="size-4 animate-spin" /> : null}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Alterar papel */}
      <Dialog
        open={roleTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRoleTarget(null);
        }}
      >
        <DialogContent className="border-[#262626] bg-[#101010] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">
              Alterar Papel
            </DialogTitle>
            <DialogDescription>
              Defina o nível de acesso de {roleTarget?.name ?? "este usuário"}.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submitRole();
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label
                htmlFor="user-role"
                className="font-heading text-xs uppercase tracking-wider text-[#d9a441]"
              >
                Papel
              </Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                <SelectTrigger id="user-role" className="w-full border-[#262626] bg-[#0d0d0d]">
                  <SelectValue placeholder="Selecione o papel" />
                </SelectTrigger>
                <SelectContent className="border-[#262626] bg-[#101010]">
                  <SelectItem value="CLIENT">CLIENT</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="OWNER">OWNER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRoleTarget(null)}
                className={outlineButtonClass}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={changingRole} className={goldButtonClass}>
                {changingRole ? <Loader2 className="size-4 animate-spin" /> : null}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: Excluir usuário */}
      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDelete(null);
        }}
      >
        <AlertDialogContent className="border-[#262626] bg-[#101010]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display uppercase tracking-wide">
              Excluir usuário?
            </AlertDialogTitle>
            <AlertDialogDescription>
              A conta de {confirmDelete?.name ?? "usuário"} ({confirmDelete?.email ?? "—"}) será
              removida permanentemente.
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
                if (target) void removeUser(target.id);
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

/* ==================================================================== */
/* OwnerDashboard                                                       */
/* ==================================================================== */

export default function OwnerDashboard() {
  const user = useAppStore((s) => s.user);
  const setView = useAppStore((s) => s.setView);

  const [tab, setTab] = useState<OwnerTab>("overview");
  const [stats, setStats] = useState<OwnerStatsDTO | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await api<OwnerStatsDTO>("/api/owner/stats");
      setStats(data);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao carregar estatísticas."));
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  if (!user || user.role !== "OWNER") {
    return <AccessDeniedCard />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-foreground">
      <PanelHeader
        titleB="DASHBOARD"
        subtitle="Visão geral do império CROWN"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setView("admin")}
          aria-label="Abrir painel admin"
          className="border-[#d9a441]/40 bg-transparent text-[#d9a441] hover:bg-[#d9a441]/10 hover:text-[#d9a441]"
        >
          <LayoutDashboard className="size-4" />
          <span className="hidden sm:inline">Painel Admin</span>
        </Button>
      </PanelHeader>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as OwnerTab)} className="w-full">
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-md border border-[#262626] bg-[#101010] p-1 [scrollbar-width:thin] sm:w-fit [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#262626]">
            <TabsTrigger
              value="overview"
              className="gap-2 px-3 py-1.5 data-[state=active]:bg-[#d9a441]/10 data-[state=active]:text-[#d9a441]"
            >
              <LayoutDashboard className="size-4" aria-hidden />
              <span className="font-heading uppercase tracking-wider">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="gap-2 px-3 py-1.5 data-[state=active]:bg-[#d9a441]/10 data-[state=active]:text-[#d9a441]"
            >
              <ShoppingBag className="size-4" aria-hidden />
              <span className="font-heading uppercase tracking-wider">Pedidos</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="gap-2 px-3 py-1.5 data-[state=active]:bg-[#d9a441]/10 data-[state=active]:text-[#d9a441]"
            >
              <Users className="size-4" aria-hidden />
              <span className="font-heading uppercase tracking-wider">Usuários</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <OverviewTab stats={stats} statsLoading={statsLoading} />
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <OrdersTab onChanged={() => void loadStats()} />
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            <UsersTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
