import { db } from "@/lib/db";
import { requireRole, unauthorized } from "@/lib/auth";

export async function GET() {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  const modalities = await db.modality.findMany({
    orderBy: { order: "asc" },
    include: { schedules: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] } },
  });
  return Response.json({ modalities });
}

export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const b = await req.json();
    const name = String(b.name ?? "").trim();
    const description = String(b.description ?? "").trim();
    if (!name) return Response.json({ error: "Nome é obrigatório." }, { status: 400 });

    const modality = await db.modality.create({
      data: {
        name,
        description,
        imageUrl: b.imageUrl || null,
        icon: b.icon || null,
        order: Number(b.order) || 0,
        active: b.active ?? true,
      },
    });
    return Response.json({ modality }, { status: 201 });
  } catch (e) {
    console.error("[admin/modalities:POST]", e);
    return Response.json({ error: "Erro ao criar modalidade." }, { status: 500 });
  }
}
