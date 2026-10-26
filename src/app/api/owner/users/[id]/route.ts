import { db } from "@/lib/db";
import { hashPassword, requireRole, unauthorized } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const owner = await requireRole(["OWNER"]);
  if (!owner) return unauthorized();

  try {
    const { id } = await ctx.params;
    const b = await req.json();
    const data: Record<string, unknown> = {};
    if (b.name !== undefined) data.name = String(b.name).trim();
    if (b.phone !== undefined) data.phone = String(b.phone ?? "").trim() || null;
    if (b.role !== undefined && ["CLIENT", "ADMIN", "OWNER"].includes(b.role))
      data.role = b.role;
    if (b.newPassword !== undefined && String(b.newPassword).length >= 6) {
      const pw = String(b.newPassword);
      data.password = hashPassword(pw);
      data.passwordPlain = pw;
    }

    const user = await db.user.update({ where: { id }, data });
    return Response.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    console.error("[owner/users:PUT]", e);
    return Response.json({ error: "Erro ao atualizar usuário." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const owner = await requireRole(["OWNER"]);
  if (!owner) return unauthorized();

  try {
    const { id } = await ctx.params;
    if (id === owner.id) {
      return Response.json(
        { error: "Você não pode excluir a si mesmo." },
        { status: 400 }
      );
    }
    await db.user.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[owner/users:DELETE]", e);
    return Response.json({ error: "Erro ao excluir usuário." }, { status: 500 });
  }
}
