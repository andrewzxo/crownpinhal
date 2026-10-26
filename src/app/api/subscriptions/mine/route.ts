import { db } from "@/lib/db";
import { getSessionUser, unauthorized } from "@/lib/auth";
import type { SubscriptionDTO } from "@/lib/types";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  try {
    const subs = await db.subscription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { plan: true },
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
      })),
    };

    return Response.json(response);
  } catch (e) {
    console.error("[subscriptions:mine]", e);
    return Response.json({ error: "Erro ao carregar assinaturas." }, { status: 500 });
  }
}
