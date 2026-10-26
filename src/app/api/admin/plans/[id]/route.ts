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
    if (b.name !== undefined) data.name = String(b.name).trim();
    if (b.description !== undefined) data.description = String(b.description);
    if (b.features !== undefined)
      data.features = JSON.stringify(Array.isArray(b.features) ? b.features : []);
    if (b.price !== undefined)
      data.price = b.price === null || b.price === "" ? null : Number(b.price);
    if (b.period !== undefined) data.period = b.period || null;
    if (b.badge !== undefined) data.badge = b.badge || null;
    if (b.highlighted !== undefined) data.highlighted = Boolean(b.highlighted);
    if (b.order !== undefined) data.order = Number(b.order) || 0;
    if (b.active !== undefined) data.active = Boolean(b.active);

    const plan = await db.plan.update({ where: { id }, data });
    return Response.json({ plan: { ...plan, features: JSON.parse(plan.features) } });
  } catch (e) {
    console.error("[admin/plans:PUT]", e);
    return Response.json({ error: "Erro ao atualizar plano." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const { id } = await ctx.params;
    const subs = await db.subscription.count({ where: { planId: id } });
    if (subs > 0) {
      await db.plan.update({ where: { id }, data: { active: false } });
      return Response.json({ ok: true, deactivated: true });
    }
    await db.plan.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[admin/plans:DELETE]", e);
    return Response.json({ error: "Erro ao excluir plano." }, { status: 500 });
  }
}
