import { db } from "@/lib/db";
import type { ContentResponse } from "@/lib/types";

export async function GET() {
  try {
    const [settings, modalities, plans, gallery] = await Promise.all([
      db.setting.findMany(),
      db.modality.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
        include: { schedules: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] } },
      }),
      db.plan.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
      db.galleryImage.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    ]);

    const response: ContentResponse = {
      settings: Object.fromEntries(settings.map((s) => [s.key, s.value])),
      modalities: modalities.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        imageUrl: m.imageUrl,
        icon: m.icon,
        order: m.order,
        active: m.active,
        schedules: m.schedules,
      })),
      plans: plans.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        features: JSON.parse(p.features || "[]"),
        price: p.price,
        period: p.period,
        priceOptions: p.priceOptions ? JSON.parse(p.priceOptions) : null,
        badge: p.badge,
        highlighted: p.highlighted,
        order: p.order,
        active: p.active,
      })),
      gallery: gallery.map((g) => ({
        id: g.id,
        url: g.url,
        title: g.title,
        order: g.order,
        active: g.active,
      })),
    };

    return Response.json(response);
  } catch (e) {
    console.error("[content]", e);
    return Response.json({ error: "Erro ao carregar conteúdo." }, { status: 500 });
  }
}
