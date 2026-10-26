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
    if (b.imageUrl !== undefined) data.imageUrl = b.imageUrl || null;
    if (b.icon !== undefined) data.icon = b.icon || null;
    if (b.order !== undefined) data.order = Number(b.order) || 0;
    if (b.active !== undefined) data.active = Boolean(b.active);

    const modality = await db.modality.update({ where: { id }, data });
    return Response.json({ modality });
  } catch (e) {
    console.error("[admin/modalities:PUT]", e);
    return Response.json({ error: "Erro ao atualizar modalidade." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const { id } = await ctx.params;
    await db.modality.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[admin/modalities:DELETE]", e);
    return Response.json({ error: "Erro ao excluir modalidade." }, { status: 500 });
  }
}
