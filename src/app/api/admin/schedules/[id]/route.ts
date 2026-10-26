import { db } from "@/lib/db";
import { requireRole, unauthorized } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const { id } = await ctx.params;
    const b = await req.json();
    const data: Record<string, unknown> = {};
    if (b.dayOfWeek !== undefined) data.dayOfWeek = Number(b.dayOfWeek);
    if (b.startTime !== undefined) data.startTime = String(b.startTime);
    if (b.endTime !== undefined) data.endTime = String(b.endTime);
    if (b.instructor !== undefined)
      data.instructor = String(b.instructor ?? "").trim() || null;

    const schedule = await db.schedule.update({ where: { id }, data });
    return Response.json({ schedule });
  } catch (e) {
    console.error("[admin/schedules:PUT]", e);
    return Response.json({ error: "Erro ao atualizar horário." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const { id } = await ctx.params;
    await db.schedule.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[admin/schedules:DELETE]", e);
    return Response.json({ error: "Erro ao excluir horário." }, { status: 500 });
  }
}
