import { db } from "@/lib/db";
import { requireRole, unauthorized } from "@/lib/auth";
import type { LoginLogDTO } from "@/lib/types";

/**
 * Histórico de acessos (logins) — todas as entradas ficam salvas no banco
 * de dados (tabela LoginLog) e são exibidas no Dashboard do Dono.
 */
export async function GET() {
  const owner = await requireRole(["OWNER"]);
  if (!owner) return unauthorized();

  try {
    const logs = await db.loginLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    const response: { logs: LoginLogDTO[] } = {
      logs: logs.map((l) => ({
        id: l.id,
        method: l.method as LoginLogDTO["method"],
        createdAt: l.createdAt.toISOString(),
        user: l.user,
      })),
    };
    return Response.json(response);
  } catch (e) {
    console.error("[owner/login-logs]", e);
    return Response.json({ error: "Erro ao carregar histórico de acessos." }, { status: 500 });
  }
}
