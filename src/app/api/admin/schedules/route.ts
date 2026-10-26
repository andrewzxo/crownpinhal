import { db } from "@/lib/db";
import { requireRole, unauthorized } from "@/lib/auth";

export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const b = await req.json();
    const modalityId = String(b.modalityId ?? "");
    const dayOfWeek = Number(b.dayOfWeek);
    const startTime = String(b.startTime ?? "");
    const endTime = String(b.endTime ?? "");

    if (!modalityId || isNaN(dayOfWeek) || !startTime || !endTime) {
      return Response.json(
        { error: "Preencha modalidade, dia e horários." },
        { status: 400 }
      );
    }

    const schedule = await db.schedule.create({
      data: {
        modalityId,
        dayOfWeek,
        startTime,
        endTime,
        instructor: String(b.instructor ?? "").trim() || null,
      },
      include: { modality: true },
    });
    return Response.json({ schedule }, { status: 201 });
  } catch (e) {
    console.error("[admin/schedules:POST]", e);
    return Response.json({ error: "Erro ao criar horário." }, { status: 500 });
  }
}
