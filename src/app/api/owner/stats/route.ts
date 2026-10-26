import { db } from "@/lib/db";
import { requireRole, unauthorized } from "@/lib/auth";
import type { OwnerStatsDTO } from "@/lib/types";

export async function GET() {
  const owner = await requireRole(["OWNER"]);
  if (!owner) return unauthorized();

  try {
    const [totalUsers, totalClients, pendingSubscriptions, activeSubscriptions, totalSubscriptions, totalModalities, totalPlans] =
      await Promise.all([
        db.user.count(),
        db.user.count({ where: { role: "CLIENT" } }),
        db.subscription.count({ where: { status: "PENDING" } }),
        db.subscription.count({ where: { status: "ACTIVE" } }),
        db.subscription.count(),
        db.modality.count(),
        db.plan.count(),
      ]);

    const stats: OwnerStatsDTO = {
      totalUsers,
      totalClients,
      pendingSubscriptions,
      activeSubscriptions,
      totalSubscriptions,
      totalModalities,
      totalPlans,
    };
    return Response.json(stats);
  } catch (e) {
    console.error("[owner/stats]", e);
    return Response.json({ error: "Erro ao carregar estatísticas." }, { status: 500 });
  }
}
