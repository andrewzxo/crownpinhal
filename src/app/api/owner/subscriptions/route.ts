import { db } from "@/lib/db";
import { requireRole, unauthorized } from "@/lib/auth";
import type { SubscriptionDTO } from "@/lib/types";

export async function GET() {
  const owner = await requireRole(["OWNER"]);
  if (!owner) return unauthorized();

  try {
    const subs = await db.subscription.findMany({
      orderBy: { createdAt: "desc" },
      include: { plan: true, user: { select: { id: true, name: true, email: true, phone: true } } },
    });

    const response: { subscriptions: SubscriptionDTO[] } = {
      subscriptions: subs.map((s) => ({
        id: s.id,
        status: s.status as SubscriptionDTO["status"],
        notes: s.notes,
        createdAt: s.createdAt.toISOString(),
        plan: {
          id: s.plan.id,
          name: s.plan.name,
          description: s.plan.description,
          features: JSON.parse(s.plan.features || "[]"),
          price: s.plan.price,
          period: s.plan.period,
          badge: s.plan.badge,
          highlighted: s.plan.highlighted,
          order: s.plan.order,
          active: s.plan.active,
        },
        user: s.user,
      })),
    };
    return Response.json(response);
  } catch (e) {
    console.error("[owner/subscriptions]", e);
    return Response.json({ error: "Erro ao carregar pedidos." }, { status: 500 });
  }
}
