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
    if (b.url !== undefined) data.url = String(b.url).trim();
    if (b.title !== undefined) data.title = String(b.title ?? "").trim() || null;
    if (b.order !== undefined) data.order = Number(b.order) || 0;
    if (b.active !== undefined) data.active = Boolean(b.active);

    const image = await db.galleryImage.update({ where: { id }, data });
    return Response.json({ image });
  } catch (e) {
    console.error("[admin/gallery:PUT]", e);
    return Response.json({ error: "Erro ao atualizar imagem." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const { id } = await ctx.params;
    await db.galleryImage.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[admin/gallery:DELETE]", e);
    return Response.json({ error: "Erro ao excluir imagem." }, { status: 500 });
  }
}
