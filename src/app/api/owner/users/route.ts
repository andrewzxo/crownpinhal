import { db } from "@/lib/db";
import { requireRole, unauthorized } from "@/lib/auth";
import type { OwnerUserDTO } from "@/lib/types";

export async function GET() {
  const owner = await requireRole(["OWNER"]);
  if (!owner) return unauthorized();

  try {
    const users = await db.user.findMany({ orderBy: { createdAt: "desc" } });
    const response: { users: OwnerUserDTO[] } = {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role as OwnerUserDTO["role"],
        passwordPlain: u.passwordPlain,
        createdAt: u.createdAt.toISOString(),
      })),
    };
    return Response.json(response);
  } catch (e) {
    console.error("[owner/users]", e);
    return Response.json({ error: "Erro ao carregar usuários." }, { status: 500 });
  }
}
