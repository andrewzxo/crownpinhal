"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  BarChart3,
  Check,
  Clock,
  Crown,
  Dumbbell,
  ImagePlus,
  Images,
  Loader2,
  MapPin,
  Megaphone,
  Pencil,
  Plus,
  Settings,
  Sparkles,
  Star,
  Trash2,
  Upload,
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
  AlertDialogTrigger,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api, uploadImage } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import type {
  ContentResponse,
  GalleryDTO,
  ModalityDTO,
  PlanDTO,
  ScheduleDTO,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  AccessDeniedCard,
  ActiveBadge,
  DAY_NAMES,
  DAY_ORDER,
  EmptyState,
  FieldLabel,
  formatPriceBR,
  formatTime,
  goldButtonClass,
  ListSkeleton,
  outlineButtonClass,
  PanelHeader,
  PanelNav,
  scrollbarY,
  type PanelTab,
} from "./panel-shared";

type TabId = "modalities" | "schedules" | "plans" | "gallery" | "settings";

const TABS: PanelTab[] = [
  { id: "modalities", label: "Modalidades", icon: Dumbbell },
  { id: "schedules", label: "Horários", icon: Clock },
  { id: "plans", label: "Planos", icon: Crown },
  { id: "gallery", label: "Galeria", icon: Images },
  { id: "settings", label: "Configurações", icon: Settings },
];

function errMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

/* ==================================================================== */
/* TAB 1 — MODALIDADES                                                  */
/* ==================================================================== */

interface ModalityForm {
  name: string;
  description: string;
  imageUrl: string;
  icon: string;
  order: number;
  active: boolean;
}

function ModalitiesTab() {
  const refreshContent = useAppStore((s) => s.refreshContent);
  const content = useAppStore((s) => s.content);

  const [items, setItems] = useState<ModalityDTO[]>(() => content?.modalities ?? []);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ModalityDTO | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<ModalityForm>({
    name: "",
    description: "",
    imageUrl: "",
    icon: "",
    order: 0,
    active: true,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<{ modalities: ModalityDTO[] }>("/api/admin/modalities");
      setItems(data.modalities);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao carregar modalidades."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      imageUrl: "",
      icon: "",
      order: items.length,
      active: true,
    });
    setDialogOpen(true);
  }

  function openEdit(modality: ModalityDTO) {
    setEditing(modality);
    setForm({
      name: modality.name,
      description: modality.description,
      imageUrl: modality.imageUrl ?? "",
      icon: modality.icon ?? "",
      order: modality.order,
      active: modality.active,
    });
    setDialogOpen(true);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
      toast.success("Imagem enviada com sucesso.");
    } catch (err) {
      toast.error(errMessage(err, "Erro ao enviar imagem."));
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!form.name.trim()) {
      toast.error("Informe o nome da modalidade.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim() || null,
        icon: form.icon.trim() || null,
        order: Number.isFinite(form.order) ? form.order : 0,
        active: form.active,
      };
      if (editing) {
        await api(`/api/admin/modalities/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Modalidade atualizada com sucesso.");
      } else {
        await api("/api/admin/modalities", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Modalidade criada com sucesso.");
      }
      setDialogOpen(false);
      await Promise.all([load(), refreshContent()]);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao salvar modalidade."));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      await api(`/api/admin/modalities/${id}`, { method: "DELETE" });
      toast.success("Modalidade excluída.");
      await Promise.all([load(), refreshContent()]);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao excluir modalidade."));
    }
  }

  return (
    <Card className="gap-4 border-[#262626] bg-card py-4">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 px-4 [.border-b]:pb-0">
        <div>
          <CardTitle className="font-display text-lg uppercase tracking-wide">
            Modalidades
          </CardTitle>
          <CardDescription>Cadastre e organize as modalidades da academia.</CardDescription>
        </div>
        <Button onClick={openCreate} className={goldButtonClass} aria-label="Nova modalidade">
          <Plus className="size-4" />
          Nova Modalidade
        </Button>
      </CardHeader>
      <CardContent className="px-4">
        {loading ? (
          <ListSkeleton rows={4} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Dumbbell}
            title="Nenhuma modalidade cadastrada"
            description="Clique em “Nova Modalidade” para criar a primeira."
          />
        ) : (
          <ul className={cn("max-h-[60vh] space-y-2 pr-1", scrollbarY)}>
            {items.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 rounded-lg border border-[#262626] bg-[#0d0d0d] p-3"
              >
                {m.imageUrl ? (
                  <img
                    src={m.imageUrl}
                    alt={`Imagem da modalidade ${m.name}`}
                    className="size-16 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-md bg-[#141414]">
                    <Dumbbell className="size-6 text-[#d9a441]/50" aria-hidden />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading uppercase tracking-wide">{m.name}</span>
                    <ActiveBadge active={m.active} />
                    <span className="text-xs text-muted-foreground">Ordem {m.order}</span>
                    <span className="text-xs text-muted-foreground">
                      {m.schedules?.length ?? 0} horário(s)
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{m.description}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Editar modalidade ${m.name}`}
                    onClick={() => openEdit(m)}
                    className="text-muted-foreground hover:bg-[#d9a441]/10 hover:text-[#d9a441]"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Excluir modalidade ${m.name}`}
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-[#262626] bg-[#101010]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-display uppercase tracking-wide">
                          Excluir modalidade?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir “{m.name}”? Esta ação não pode ser
                          desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() => void remove(m.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-[#262626] bg-[#101010] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">
              {editing ? "Editar Modalidade" : "Nova Modalidade"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Atualize as informações da modalidade."
                : "Cadastre uma nova modalidade para a academia."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <FieldLabel htmlFor="modality-name">Nome</FieldLabel>
              <Input
                id="modality-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ex.: Musculação"
                className="border-[#262626] bg-[#0d0d0d]"
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="modality-description">Descrição</FieldLabel>
              <Textarea
                id="modality-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Descrição exibida no site"
                rows={3}
                className="border-[#262626] bg-[#0d0d0d]"
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Imagem</FieldLabel>
              <div className="flex items-center gap-3">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="Pré-visualização da imagem da modalidade"
                    className="size-16 rounded-md border border-[#262626] object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-md border border-dashed border-[#262626]">
                    <ImagePlus className="size-6 text-muted-foreground" aria-hidden />
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) void handleUpload(file);
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className={outlineButtonClass}
                >
                  {uploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                  {uploading ? "Enviando..." : "Enviar imagem"}
                </Button>
                {form.imageUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                    className="text-muted-foreground"
                  >
                    Remover
                  </Button>
                ) : null}
              </div>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="ou cole uma URL de imagem"
                className="border-[#262626] bg-[#0d0d0d]"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <FieldLabel htmlFor="modality-icon">Ícone (opcional)</FieldLabel>
                <Input
                  id="modality-icon"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="Ex.: dumbbell"
                  className="border-[#262626] bg-[#0d0d0d]"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="modality-order">Ordem</FieldLabel>
                <Input
                  id="modality-order"
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))
                  }
                  className="border-[#262626] bg-[#0d0d0d]"
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#262626] bg-[#0d0d0d] px-3 py-2.5">
              <Label htmlFor="modality-active" className="cursor-pointer text-sm">
                Modalidade ativa
              </Label>
              <Switch
                id="modality-active"
                checked={form.active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className={outlineButtonClass}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className={goldButtonClass}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                {editing ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ==================================================================== */
/* TAB 2 — HORÁRIOS                                                     */
/* ==================================================================== */

interface ScheduleForm {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  instructor: string;
}

function SchedulesTab() {
  const refreshContent = useAppStore((s) => s.refreshContent);

  const [modalities, setModalities] = useState<ModalityDTO[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ScheduleDTO | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ScheduleForm>({
    dayOfWeek: 1,
    startTime: "07:00",
    endTime: "08:00",
    instructor: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<{ modalities: ModalityDTO[] }>("/api/admin/modalities");
      setModalities(data.modalities);
      setSelectedId((prev) => prev || data.modalities[0]?.id || "");
    } catch (err) {
      toast.error(errMessage(err, "Erro ao carregar modalidades."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = modalities.find((m) => m.id === selectedId) ?? null;

  const grouped = useMemo(() => {
    const list = selected?.schedules ?? [];
    return DAY_ORDER.map((day) => ({
      day,
      schedules: list
        .filter((s) => s.dayOfWeek === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    })).filter((g) => g.schedules.length > 0);
  }, [selected]);

  function openCreate() {
    setEditing(null);
    setForm({ dayOfWeek: 1, startTime: "07:00", endTime: "08:00", instructor: "" });
    setDialogOpen(true);
  }

  function openEdit(schedule: ScheduleDTO) {
    setEditing(schedule);
    setForm({
      dayOfWeek: schedule.dayOfWeek,
      startTime: formatTime(schedule.startTime),
      endTime: formatTime(schedule.endTime),
      instructor: schedule.instructor ?? "",
    });
    setDialogOpen(true);
  }

  async function save() {
    if (!selected) return;
    if (!form.startTime || !form.endTime) {
      toast.error("Informe os horários de início e fim.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        modalityId: selected.id,
        dayOfWeek: form.dayOfWeek,
        startTime: form.startTime,
        endTime: form.endTime,
        instructor: form.instructor.trim() || null,
      };
      if (editing) {
        await api(`/api/admin/schedules/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Horário atualizado com sucesso.");
      } else {
        await api("/api/admin/schedules", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Horário criado com sucesso.");
      }
      setDialogOpen(false);
      await Promise.all([load(), refreshContent()]);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao salvar horário."));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      await api(`/api/admin/schedules/${id}`, { method: "DELETE" });
      toast.success("Horário excluído.");
      await Promise.all([load(), refreshContent()]);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao excluir horário."));
    }
  }

  return (
    <Card className="gap-4 border-[#262626] bg-card py-4">
      <CardHeader className="px-4 [.border-b]:pb-0">
        <CardTitle className="font-display text-lg uppercase tracking-wide">Horários</CardTitle>
        <CardDescription>Gerencie os horários de cada modalidade.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-1.5">
            <FieldLabel htmlFor="schedule-modality">Modalidade</FieldLabel>
            <Select
              value={selectedId}
              onValueChange={(v) => setSelectedId(v)}
              disabled={loading || modalities.length === 0}
            >
              <SelectTrigger
                id="schedule-modality"
                className="w-full border-[#262626] bg-[#0d0d0d]"
              >
                <SelectValue placeholder="Selecione uma modalidade" />
              </SelectTrigger>
              <SelectContent className="border-[#262626] bg-[#101010]">
                {modalities.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={openCreate}
            disabled={!selected}
            className={goldButtonClass}
            aria-label="Novo horário"
          >
            <Plus className="size-4" />
            Novo Horário
          </Button>
        </div>

        {loading ? (
          <ListSkeleton rows={4} />
        ) : !selected ? (
          <EmptyState
            icon={Clock}
            title="Nenhuma modalidade disponível"
            description="Crie uma modalidade antes de cadastrar horários."
          />
        ) : grouped.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Nenhum horário cadastrado"
            description={`Adicione o primeiro horário de ${selected.name}.`}
          />
        ) : (
          <div className={cn("max-h-[60vh] space-y-5 pr-1", scrollbarY)}>
            {grouped.map((group) => (
              <div key={group.day}>
                <h4 className="font-heading mb-2 text-xs uppercase tracking-widest text-[#d9a441]">
                  {DAY_NAMES[group.day]}
                  <span className="ml-2 text-muted-foreground">({group.schedules.length})</span>
                </h4>
                <div className="space-y-2">
                  {group.schedules.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-[#262626] bg-[#0d0d0d] px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="font-heading text-sm uppercase tracking-wider text-[#d9a441]">
                          {formatTime(s.startTime)} - {formatTime(s.endTime)}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {s.instructor || "Sem instrutor"}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Editar horário de ${formatTime(s.startTime)} (${DAY_NAMES[s.dayOfWeek]})`}
                          onClick={() => openEdit(s)}
                          className="text-muted-foreground hover:bg-[#d9a441]/10 hover:text-[#d9a441]"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Excluir horário de ${formatTime(s.startTime)} (${DAY_NAMES[s.dayOfWeek]})`}
                              className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-[#262626] bg-[#101010]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-display uppercase tracking-wide">
                                Excluir horário?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {DAY_NAMES[s.dayOfWeek]} às {formatTime(s.startTime)} —{" "}
                                {s.instructor || "sem instrutor"}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => void remove(s.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-[#262626] bg-[#101010] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">
              {editing ? "Editar Horário" : "Novo Horário"}
            </DialogTitle>
            <DialogDescription>
              {selected ? `Modalidade: ${selected.name}` : "Selecione uma modalidade."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <FieldLabel>Dia da semana</FieldLabel>
              <Select
                value={String(form.dayOfWeek)}
                onValueChange={(v) => setForm((f) => ({ ...f, dayOfWeek: Number(v) }))}
              >
                <SelectTrigger className="w-full border-[#262626] bg-[#0d0d0d]">
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent className="border-[#262626] bg-[#101010]">
                  {DAY_ORDER.map((day) => (
                    <SelectItem key={day} value={String(day)}>
                      {DAY_NAMES[day]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel htmlFor="schedule-start">Início</FieldLabel>
                <Input
                  id="schedule-start"
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  className="border-[#262626] bg-[#0d0d0d]"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="schedule-end">Fim</FieldLabel>
                <Input
                  id="schedule-end"
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                  className="border-[#262626] bg-[#0d0d0d]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="schedule-instructor">Instrutor</FieldLabel>
              <Input
                id="schedule-instructor"
                value={form.instructor}
                onChange={(e) => setForm((f) => ({ ...f, instructor: e.target.value }))}
                placeholder="Nome do instrutor (opcional)"
                className="border-[#262626] bg-[#0d0d0d]"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className={outlineButtonClass}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className={goldButtonClass}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                {editing ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ==================================================================== */
/* TAB 3 — PLANOS                                                       */
/* ==================================================================== */

interface PlanForm {
  name: string;
  description: string;
  featuresText: string;
  priceText: string;
  period: string;
  badge: string;
  highlighted: boolean;
  order: number;
  active: boolean;
}

function planToForm(plan: PlanDTO): PlanForm {
  return {
    name: plan.name,
    description: plan.description,
    featuresText: plan.features.join("\n"),
    priceText: plan.price != null ? String(plan.price) : "",
    period: plan.period ?? "",
    badge: plan.badge ?? "",
    highlighted: plan.highlighted,
    order: plan.order,
    active: plan.active,
  };
}

function PlansTab() {
  const refreshContent = useAppStore((s) => s.refreshContent);
  const content = useAppStore((s) => s.content);

  const [items, setItems] = useState<PlanDTO[]>(() => content?.plans ?? []);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PlanDTO | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PlanForm>({
    name: "",
    description: "",
    featuresText: "",
    priceText: "",
    period: "",
    badge: "",
    highlighted: false,
    order: 0,
    active: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<{ plans: PlanDTO[] }>("/api/admin/plans");
      setItems(data.plans);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao carregar planos."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      featuresText: "",
      priceText: "",
      period: "mês",
      badge: "",
      highlighted: false,
      order: items.length,
      active: true,
    });
    setDialogOpen(true);
  }

  function openEdit(plan: PlanDTO) {
    setEditing(plan);
    setForm(planToForm(plan));
    setDialogOpen(true);
  }

  async function save() {
    if (!form.name.trim()) {
      toast.error("Informe o nome do plano.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        features: form.featuresText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        price: form.priceText.trim() === "" ? null : Number(form.priceText),
        period: form.period.trim() || null,
        badge: form.badge.trim() || null,
        highlighted: form.highlighted,
        order: Number.isFinite(form.order) ? form.order : 0,
        active: form.active,
      };
      if (editing) {
        await api(`/api/admin/plans/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Plano atualizado com sucesso.");
      } else {
        await api("/api/admin/plans", { method: "POST", body: JSON.stringify(payload) });
        toast.success("Plano criado com sucesso.");
      }
      setDialogOpen(false);
      await Promise.all([load(), refreshContent()]);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao salvar plano."));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      const res = await api<{ deactivated?: boolean }>(`/api/admin/plans/${id}`, {
        method: "DELETE",
      });
      if (res?.deactivated) {
        toast.info("O plano possui pedidos vinculados e foi desativado em vez de excluído.");
      } else {
        toast.success("Plano excluído.");
      }
      await Promise.all([load(), refreshContent()]);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao excluir plano."));
    }
  }

  return (
    <Card className="gap-4 border-[#262626] bg-card py-4">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 px-4 [.border-b]:pb-0">
        <div>
          <CardTitle className="font-display text-lg uppercase tracking-wide">Planos</CardTitle>
          <CardDescription>Gerencie os planos oferecidos pela academia.</CardDescription>
        </div>
        <Button onClick={openCreate} className={goldButtonClass} aria-label="Novo plano">
          <Plus className="size-4" />
          Novo Plano
        </Button>
      </CardHeader>
      <CardContent className="px-4">
        {loading ? (
          <ListSkeleton rows={3} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Crown}
            title="Nenhum plano cadastrado"
            description="Clique em “Novo Plano” para criar o primeiro."
          />
        ) : (
          <div className={cn("max-h-[60vh] overflow-y-auto pr-1", scrollbarY)}>
            <div className="grid gap-4 lg:grid-cols-2">
              {items.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-lg border bg-[#0d0d0d] p-4",
                    p.highlighted ? "border-[#d9a441]/50" : "border-[#262626]"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl uppercase tracking-wide">{p.name}</h3>
                    <div className="flex items-center gap-2">
                      {p.badge ? (
                        <Badge className="bg-gold-gradient text-black">{p.badge}</Badge>
                      ) : null}
                      {p.highlighted ? (
                        <Star
                          className="size-5 fill-[#d9a441] text-[#d9a441]"
                          aria-label="Plano destaque"
                        />
                      ) : null}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                  {p.features.length > 0 ? (
                    <ul className="space-y-1">
                      {p.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-[#d9a441]"
                            aria-hidden
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                    {p.price != null ? (
                      <span className="font-heading text-lg text-[#d9a441]">
                        {formatPriceBR(p.price)}
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          / {p.period ?? "período"}
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Preço não definido</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#1c1c1c] pt-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <ActiveBadge active={p.active} />
                      <Badge
                        variant="outline"
                        className="border-[#262626] text-muted-foreground"
                      >
                        Ordem {p.order}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Editar plano ${p.name}`}
                        onClick={() => openEdit(p)}
                        className="text-muted-foreground hover:bg-[#d9a441]/10 hover:text-[#d9a441]"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Excluir plano ${p.name}`}
                            className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-[#262626] bg-[#101010]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-display uppercase tracking-wide">
                              Excluir plano?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir “{p.name}”? Se o plano possuir
                              pedidos vinculados, ele será apenas desativado.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() => void remove(p.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-[#262626] bg-[#101010] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">
              {editing ? "Editar Plano" : "Novo Plano"}
            </DialogTitle>
            <DialogDescription>
              {editing ? "Atualize as informações do plano." : "Cadastre um novo plano."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <FieldLabel htmlFor="plan-name">Nome</FieldLabel>
              <Input
                id="plan-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ex.: Plano Black"
                className="border-[#262626] bg-[#0d0d0d]"
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="plan-description">Descrição</FieldLabel>
              <Textarea
                id="plan-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="border-[#262626] bg-[#0d0d0d]"
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="plan-features">Benefícios (um por linha)</FieldLabel>
              <Textarea
                id="plan-features"
                value={form.featuresText}
                onChange={(e) => setForm((f) => ({ ...f, featuresText: e.target.value }))}
                rows={4}
                placeholder={"Acesso livre à academia\nAulas coletivas"}
                className="border-[#262626] bg-[#0d0d0d]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel htmlFor="plan-price">Preço (R$)</FieldLabel>
                <Input
                  id="plan-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.priceText}
                  onChange={(e) => setForm((f) => ({ ...f, priceText: e.target.value }))}
                  placeholder="vazio = sem preço"
                  className="border-[#262626] bg-[#0d0d0d]"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="plan-period">Período</FieldLabel>
                <Input
                  id="plan-period"
                  value={form.period}
                  onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                  placeholder="ex.: mês"
                  className="border-[#262626] bg-[#0d0d0d]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel htmlFor="plan-badge">Badge</FieldLabel>
                <Input
                  id="plan-badge"
                  value={form.badge}
                  onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                  placeholder="ex.: Mais popular"
                  className="border-[#262626] bg-[#0d0d0d]"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="plan-order">Ordem</FieldLabel>
                <Input
                  id="plan-order"
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))
                  }
                  className="border-[#262626] bg-[#0d0d0d]"
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#262626] bg-[#0d0d0d] px-3 py-2.5">
              <Label htmlFor="plan-highlighted" className="cursor-pointer text-sm">
                Plano destaque
              </Label>
              <Switch
                id="plan-highlighted"
                checked={form.highlighted}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, highlighted: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#262626] bg-[#0d0d0d] px-3 py-2.5">
              <Label htmlFor="plan-active" className="cursor-pointer text-sm">
                Plano ativo
              </Label>
              <Switch
                id="plan-active"
                checked={form.active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className={outlineButtonClass}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className={goldButtonClass}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                {editing ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ==================================================================== */
/* TAB 4 — GALERIA                                                      */
/* ==================================================================== */

function GalleryTab() {
  const refreshContent = useAppStore((s) => s.refreshContent);
  const content = useAppStore((s) => s.content);

  const [items, setItems] = useState<GalleryDTO[]>(() => content?.gallery ?? []);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [form, setForm] = useState({ url: "", title: "", order: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<{ gallery: GalleryDTO[] }>("/api/admin/gallery");
      setItems(data.gallery);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao carregar galeria."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setForm({ url: "", title: "", order: items.length });
    setDialogOpen(true);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, url }));
      toast.success("Imagem enviada com sucesso.");
    } catch (err) {
      toast.error(errMessage(err, "Erro ao enviar imagem."));
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!form.url.trim()) {
      toast.error("Envie uma imagem ou informe uma URL.");
      return;
    }
    setSaving(true);
    try {
      await api("/api/admin/gallery", {
        method: "POST",
        body: JSON.stringify({
          url: form.url.trim(),
          title: form.title.trim() || null,
          order: Number.isFinite(form.order) ? form.order : 0,
        }),
      });
      toast.success("Imagem adicionada à galeria.");
      setDialogOpen(false);
      await Promise.all([load(), refreshContent()]);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao adicionar imagem."));
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: GalleryDTO, active: boolean) {
    setTogglingId(item.id);
    try {
      await api(`/api/admin/gallery/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ active }),
      });
      setItems((list) => list.map((g) => (g.id === item.id ? { ...g, active } : g)));
      toast.success(active ? "Imagem ativada." : "Imagem desativada.");
      await refreshContent();
    } catch (err) {
      toast.error(errMessage(err, "Erro ao atualizar imagem."));
    } finally {
      setTogglingId(null);
    }
  }

  async function remove(id: string) {
    try {
      await api(`/api/admin/gallery/${id}`, { method: "DELETE" });
      toast.success("Imagem excluída.");
      await Promise.all([load(), refreshContent()]);
    } catch (err) {
      toast.error(errMessage(err, "Erro ao excluir imagem."));
    }
  }

  return (
    <Card className="gap-4 border-[#262626] bg-card py-4">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 px-4 [.border-b]:pb-0">
        <div>
          <CardTitle className="font-display text-lg uppercase tracking-wide">Galeria</CardTitle>
          <CardDescription>Imagens exibidas na seção de galeria do site.</CardDescription>
        </div>
        <Button onClick={openCreate} className={goldButtonClass} aria-label="Adicionar imagem">
          <Plus className="size-4" />
          Adicionar Imagem
        </Button>
      </CardHeader>
      <CardContent className="px-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-40 w-full animate-pulse rounded-lg bg-[#141414]"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Images}
            title="Galeria vazia"
            description="Adicione a primeira imagem da galeria."
          />
        ) : (
          <div className={cn("max-h-[60vh] overflow-y-auto pr-1", scrollbarY)}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((g) => (
                <div
                  key={g.id}
                  className="overflow-hidden rounded-lg border border-[#262626] bg-[#0d0d0d]"
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={g.url}
                      alt={g.title || "Imagem da galeria"}
                      className="size-full object-cover"
                    />
                    {!g.active ? (
                      <span className="font-heading absolute inset-0 flex items-center justify-center bg-black/60 text-xs uppercase tracking-widest text-muted-foreground">
                        Inativa
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="truncate text-sm font-medium">{g.title || "Sem título"}</p>
                    <p className="text-xs text-muted-foreground">Ordem {g.order}</p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={g.active}
                          disabled={togglingId === g.id}
                          onCheckedChange={(checked) => void toggleActive(g, checked)}
                          aria-label={`${g.active ? "Desativar" : "Ativar"} imagem ${g.title || "sem título"}`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {g.active ? "Ativa" : "Inativa"}
                        </span>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Excluir imagem ${g.title || "sem título"}`}
                            className="size-8 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-[#262626] bg-[#101010]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-display uppercase tracking-wide">
                              Excluir imagem?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              A imagem “{g.title || "sem título"}” será removida da galeria.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() => void remove(g.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-[#262626] bg-[#101010] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">
              Adicionar Imagem
            </DialogTitle>
            <DialogDescription>Envie um arquivo ou informe uma URL.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <FieldLabel>Upload</FieldLabel>
              <div className="flex items-center gap-3">
                {form.url ? (
                  <img
                    src={form.url}
                    alt="Pré-visualização da imagem"
                    className="h-16 w-24 rounded-md border border-[#262626] object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-24 items-center justify-center rounded-md border border-dashed border-[#262626]">
                    <ImagePlus className="size-6 text-muted-foreground" aria-hidden />
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) void handleUpload(file);
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className={outlineButtonClass}
                >
                  {uploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                  {uploading ? "Enviando..." : "Enviar imagem"}
                </Button>
              </div>
              <Input
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="ou cole uma URL de imagem"
                className="border-[#262626] bg-[#0d0d0d]"
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="gallery-title">Título</FieldLabel>
              <Input
                id="gallery-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Título da imagem (opcional)"
                className="border-[#262626] bg-[#0d0d0d]"
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="gallery-order">Ordem</FieldLabel>
              <Input
                id="gallery-order"
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))}
                className="border-[#262626] bg-[#0d0d0d]"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className={outlineButtonClass}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className={goldButtonClass}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ==================================================================== */
/* TAB 5 — CONFIGURAÇÕES                                                */
/* ==================================================================== */

interface SettingField {
  key: string;
  label: string;
  type?: "text" | "textarea" | "image";
  placeholder?: string;
}

interface SettingSection {
  title: string;
  icon: typeof Sparkles;
  fields: SettingField[];
}

const SETTING_SECTIONS: SettingSection[] = [
  {
    title: "Hero",
    icon: Sparkles,
    fields: [
      { key: "heroBadge", label: "Badge do Hero", placeholder: "ex.: Desde 2005" },
      { key: "heroTitle", label: "Título do Hero" },
      { key: "heroHighlight", label: "Palavra Destacada (ouro)" },
      { key: "heroSubtitle", label: "Subtítulo", type: "textarea" },
      { key: "heroImageUrl", label: "Imagem do Hero", type: "image" },
    ],
  },
  {
    title: "Marquee / Sobre",
    icon: Megaphone,
    fields: [
      { key: "marqueeItems", label: "Itens do Marquee (separados por vírgula)" },
      { key: "aboutTitle", label: "Título do Sobre" },
      { key: "aboutText", label: "Texto do Sobre", type: "textarea" },
      { key: "ctaTitle", label: "Título do CTA" },
      { key: "ctaText", label: "Texto do CTA", type: "textarea" },
    ],
  },
  {
    title: "Estatísticas",
    icon: BarChart3,
    fields: [
      { key: "statsMembers", label: "Alunos Ativos" },
      { key: "statsModalities", label: "Modalidades" },
      { key: "statsTrainers", label: "Treinadores" },
      { key: "statsYears", label: "Anos de História" },
    ],
  },
  {
    title: "Contato",
    icon: MapPin,
    fields: [
      { key: "address", label: "Endereço" },
      { key: "phone", label: "Telefone" },
      { key: "whatsapp", label: "WhatsApp" },
      { key: "instagram", label: "Instagram" },
      { key: "email", label: "E-mail" },
      { key: "hoursText", label: "Horário de Funcionamento", type: "textarea" },
    ],
  },
];

function SettingsTab() {
  const refreshContent = useAppStore((s) => s.refreshContent);
  const content = useAppStore((s) => s.content);

  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (content?.settings) {
          if (!cancelled) setValues(content.settings);
        } else {
          const data = await api<ContentResponse>("/api/content");
          if (!cancelled) setValues(data.settings);
        }
      } catch (err) {
        if (!cancelled) toast.error(errMessage(err, "Erro ao carregar configurações."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [content]);

  function setValue(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setValue("heroImageUrl", url);
      toast.success("Imagem enviada com sucesso.");
    } catch (err) {
      toast.error(errMessage(err, "Erro ao enviar imagem."));
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      await api("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      toast.success("Configurações salvas com sucesso.");
      await refreshContent();
    } catch (err) {
      toast.error(errMessage(err, "Erro ao salvar configurações."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card className="gap-4 border-[#262626] bg-card py-4">
        <CardHeader className="px-4 [.border-b]:pb-0">
          <CardTitle className="font-display text-lg uppercase tracking-wide">
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          <ListSkeleton rows={5} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-4 border-[#262626] bg-card py-4">
      <CardHeader className="px-4 [.border-b]:pb-0">
        <CardTitle className="font-display text-lg uppercase tracking-wide">
          Configurações
        </CardTitle>
        <CardDescription>
          Textos e imagens exibidos no site. Salve para aplicar as alterações.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
          className="space-y-6"
        >
          {SETTING_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <section
                key={section.title}
                className="rounded-lg border border-[#262626] bg-[#0d0d0d] p-4"
                aria-label={`Seção ${section.title}`}
              >
                <h3 className="font-heading mb-4 flex items-center gap-2 text-sm uppercase tracking-widest text-[#d9a441]">
                  <Icon className="size-4" aria-hidden />
                  {section.title}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.fields.map((field) => (
                    <div
                      key={field.key}
                      className={cn("space-y-1.5", field.type === "textarea" && "sm:col-span-2")}
                    >
                      <FieldLabel htmlFor={`setting-${field.key}`}>{field.label}</FieldLabel>
                      {field.type === "image" ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            {values[field.key] ? (
                              <img
                                src={values[field.key]}
                                alt="Pré-visualização da imagem do hero"
                                className="h-16 w-28 rounded-md border border-[#262626] object-cover"
                              />
                            ) : (
                              <div className="flex h-16 w-28 items-center justify-center rounded-md border border-dashed border-[#262626]">
                                <ImagePlus className="size-5 text-muted-foreground" aria-hidden />
                              </div>
                            )}
                            <input
                              ref={fileRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files?.[0];
                                if (file) void handleUpload(file);
                                e.target.value = "";
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={uploading}
                              onClick={() => fileRef.current?.click()}
                              className={outlineButtonClass}
                            >
                              {uploading ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Upload className="size-4" />
                              )}
                              {uploading ? "Enviando..." : "Enviar"}
                            </Button>
                          </div>
                          <Input
                            id={`setting-${field.key}`}
                            value={values[field.key] ?? ""}
                            onChange={(e) => setValue(field.key, e.target.value)}
                            placeholder="URL da imagem"
                            className="border-[#262626] bg-[#141414]"
                          />
                        </div>
                      ) : field.type === "textarea" ? (
                        <Textarea
                          id={`setting-${field.key}`}
                          value={values[field.key] ?? ""}
                          onChange={(e) => setValue(field.key, e.target.value)}
                          rows={3}
                          className="border-[#262626] bg-[#141414]"
                        />
                      ) : (
                        <Input
                          id={`setting-${field.key}`}
                          value={values[field.key] ?? ""}
                          onChange={(e) => setValue(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="border-[#262626] bg-[#141414]"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
          <Button
            type="submit"
            disabled={saving}
            className={cn(goldButtonClass, "w-full")}
            aria-label="Salvar configurações"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            Salvar Configurações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/* ==================================================================== */
/* AdminPanel                                                           */
/* ==================================================================== */

export default function AdminPanel() {
  const user = useAppStore((s) => s.user);
  const [tab, setTab] = useState<TabId>("modalities");

  if (!user || (user.role !== "ADMIN" && user.role !== "OWNER")) {
    return <AccessDeniedCard />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-foreground">
      <PanelHeader
        titleA="PAINEL"
        titleB="ADMIN"
        subtitle="Gerenciamento de conteúdo da CROWN"
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <PanelNav
            tabs={TABS}
            active={tab}
            onChange={(id) => setTab(id as TabId)}
            ariaLabel="Seções do painel admin"
          />
          <div className="min-w-0 flex-1">
            {tab === "modalities" ? <ModalitiesTab /> : null}
            {tab === "schedules" ? <SchedulesTab /> : null}
            {tab === "plans" ? <PlansTab /> : null}
            {tab === "gallery" ? <GalleryTab /> : null}
            {tab === "settings" ? <SettingsTab /> : null}
          </div>
        </div>
      </main>
    </div>
  );
}
