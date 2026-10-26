import { db } from "@/lib/db";
import { requireRole, unauthorized } from "@/lib/auth";

export async function GET() {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  const gallery = await db.galleryImage.findMany({ orderBy: { order: "asc" } });
  return Response.json({ gallery });
}

export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const b = await req.json();
    const url = String(b.url ?? "").trim();
    if (!url) return Response.json({ error: "URL da imagem é obrigatória." }, { status: 400 });

    const image = await db.galleryImage.create({
      data: {
        url,
        title: String(b.title ?? "").trim() || null,
        order: Number(b.order) || 0,
        active: b.active ?? true,
      },
    });
    return Response.json({ image }, { status: 201 });
  } catch (e) {
    console.error("[admin/gallery:POST]", e);
    return Response.json({ error: "Erro ao adicionar imagem." }, { status: 500 });
  }
}
