import { db } from "@/lib/db";
import { requireRole, unauthorized } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const user = await requireRole(["OWNER", "ADMIN"]);
  if (!user) return unauthorized();

  try {
    const { id } = await ctx.params;
    const b = await req.json();
    if (!["PENDING", "ACTIVE", "CANCELLED"].includes(b.status)) {
      return Response.json({ error: "Status inválido." }, { status: 400 });
    }
    const subscription = await db.subscription.update({
      where: { id },
      data: { status: b.status },
    });
    return Response.json({ subscription });
  } catch (e) {
    console.error("[owner/subscriptions:PUT]", e);
    return Response.json({ error: "Erro ao atualizar pedido." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const user = await requireRole(["OWNER", "ADMIN"]);
  if (!user) return unauthorized();

  try {
    const { id } = await ctx.params;
    await db.subscription.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[owner/subscriptions:DELETE]", e);
    return Response.json({ error: "Erro ao excluir pedido." }, { status: 500 });
  }
}
