import { db } from "@/lib/db";
import { getSessionUser, unauthorized } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized("Faça login para assinar um plano.");

  try {
    const body = await req.json();
    const planId = String(body.planId ?? "");
    const notes = String(body.notes ?? "").trim() || null;
    const optionLabel = String(body.optionLabel ?? "").trim() || null;

    const plan = await db.plan.findFirst({ where: { id: planId, active: true } });
    if (!plan) {
      return Response.json({ error: "Plano não encontrado." }, { status: 404 });
    }

    // Evita pedidos duplicados pendentes/ativos para o mesmo plano
    const existing = await db.subscription.findFirst({
      where: {
        userId: user.id,
        planId,
        status: { in: ["PENDING", "ACTIVE"] },
      },
    });
    if (existing) {
      return Response.json(
        { error: "Você já possui um pedido para este plano." },
        { status: 409 }
      );
    }

    const subscription = await db.subscription.create({
      data: { userId: user.id, planId, notes, optionLabel },
      include: { plan: true },
    });

    return Response.json(
      {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          notes: subscription.notes,
          optionLabel: subscription.optionLabel,
          createdAt: subscription.createdAt,
          plan: {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            features: JSON.parse(plan.features || "[]"),
            price: plan.price,
            period: plan.period,
            badge: plan.badge,
            highlighted: plan.highlighted,
            order: plan.order,
            active: plan.active,
          },
        },
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("[subscriptions:POST]", e);
    return Response.json({ error: "Erro ao criar pedido." }, { status: 500 });
  }
}
