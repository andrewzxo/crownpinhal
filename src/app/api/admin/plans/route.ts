import { db } from "@/lib/db";
import { requireRole, unauthorized } from "@/lib/auth";

export async function GET() {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  const plans = await db.plan.findMany({ orderBy: { order: "asc" } });
  return Response.json({
    plans: plans.map((p) => ({ ...p, features: JSON.parse(p.features || "[]") })),
  });
}

export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const b = await req.json();
    const name = String(b.name ?? "").trim();
    if (!name) return Response.json({ error: "Nome é obrigatório." }, { status: 400 });

    const plan = await db.plan.create({
      data: {
        name,
        description: String(b.description ?? ""),
        features: JSON.stringify(Array.isArray(b.features) ? b.features : []),
        price: b.price === null || b.price === "" || b.price === undefined ? null : Number(b.price),
        period: b.period || null,
        badge: b.badge || null,
        highlighted: Boolean(b.highlighted),
        order: Number(b.order) || 0,
        active: b.active ?? true,
      },
    });
    return Response.json({ plan: { ...plan, features: JSON.parse(plan.features) } }, { status: 201 });
  } catch (e) {
    console.error("[admin/plans:POST]", e);
    return Response.json({ error: "Erro ao criar plano." }, { status: 500 });
  }
}
