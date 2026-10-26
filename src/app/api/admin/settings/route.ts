import { db } from "@/lib/db";
import { requireRole, unauthorized } from "@/lib/auth";

export async function PUT(req: Request) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const body = (await req.json()) as Record<string, string>;
    for (const [key, value] of Object.entries(body)) {
      if (typeof value !== "string") continue;
      await db.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[admin/settings:PUT]", e);
    return Response.json({ error: "Erro ao salvar configurações." }, { status: 500 });
  }
}
