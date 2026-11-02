/**
 * Compara o conteúdo do banco local (file:) com o Turso e, com --push,
 * sincroniza conteúdo local -> Turso (tabelas de conteúdo apenas; Users,
 * Sessions, Subscriptions, Media e LoginLog nunca são tocados).
 *
 * Uso:
 *   DATABASE_URL="libsql://…" DATABASE_AUTH_TOKEN="…" bun scripts/sync-content-turso.ts            # só comparar
 *   DATABASE_URL="libsql://…" DATABASE_AUTH_TOKEN="…" bun scripts/sync-content-turso.ts --push     # sincronizar
 *
 * Idempotente: apaga e recria Modalities (+Schedules) e GalleryImage do Turso
 * com os ids/conteúdo do local; Settings e Plans por upsert.
 */
import { PrismaClient as LocalClient } from "@prisma/client";
import path from "path";

const push = process.argv.includes("--push");
const tursoUrl = process.env.DATABASE_URL;
const tursoToken = process.env.DATABASE_AUTH_TOKEN;

if (!tursoUrl?.startsWith("libsql://") || !tursoToken) {
  console.error("Defina DATABASE_URL (libsql://…) e DATABASE_AUTH_TOKEN.");
  process.exit(1);
}

async function turso() {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaLibSQL } = await import("@prisma/adapter-libsql");
  const adapter = new PrismaLibSQL({ url: tursoUrl, authToken: tursoToken });
  return { p: new PrismaClient({ adapter }) };
}

const local = new LocalClient({
  datasources: { db: { url: "file:" + path.resolve("db/custom.db") } },
});

async function main() {
  const { p: rem } = await turso();

  const [lSet, lMod, lGal, lPlan] = await Promise.all([
    local.setting.findMany(),
    local.modality.findMany({ include: { schedules: true }, orderBy: { name: "asc" } }),
    local.galleryImage.findMany({ orderBy: { order: "asc" } }),
    local.plan.findMany({ orderBy: { order: "asc" } }),
  ]);
  const [rSet, rMod, rGal, rPlan] = await Promise.all([
    rem.setting.findMany(),
    rem.modality.findMany({ include: { schedules: true }, orderBy: { name: "asc" } }),
    rem.galleryImage.findMany({ orderBy: { order: "asc" } }),
    rem.plan.findMany({ orderBy: { order: "asc" } }),
  ]);

  const brief = (m: { name: string; imageUrl: string | null; schedules: unknown[] }) =>
    `${m.name}|${m.imageUrl}|${m.schedules.length}h`;
  const diff = {
    settings: lSet.length !== rSet.length || JSON.stringify(lSet) !== JSON.stringify(rSet.sort((a, b) => a.key.localeCompare(b.key))),
    modalities: JSON.stringify(lMod.map(brief)) !== JSON.stringify(rMod.map(brief)),
    gallery: JSON.stringify(lGal.map((g) => `${g.id}|${g.order}|${g.url}`)) !== JSON.stringify(rGal.map((g) => `${g.id}|${g.order}|${g.url}`)),
    plans: JSON.stringify(lPlan) !== JSON.stringify(rPlan),
  };
  console.log("Diferenças local vs Turso:", JSON.stringify(diff));
  console.log(`  local: ${lSet.length} settings, ${lMod.length} modalidades, ${lGal.length} galeria, ${lPlan.length} planos`);
  console.log(`  turso: ${rSet.length} settings, ${rMod.length} modalidades, ${rGal.length} galeria, ${rPlan.length} planos`);

  if (!push) {
    console.log("(sem --push: nada foi alterado)");
    return;
  }

  // --- Sync (local -> Turso) ---
  // Ordem: limpar filhos antes dos pais. Plans não têm filhos diretos, mas
  // Subscription referencia Plan — aborta se houver assinaturas ativas.
  const subs = await rem.subscription.count();
  if (subs > 0) {
    console.error(
      `ABORTADO: existem ${subs} assinatura(s) no Turso referenciando planos. ` +
        `Sincronize manualmente para não quebrar as referências.`,
    );
    process.exit(1);
  }
  await rem.schedule.deleteMany();
  await rem.modality.deleteMany();
  await rem.galleryImage.deleteMany();
  await rem.plan.deleteMany();
  for (const m of lMod) {
    const { schedules, ...head } = m;
    await rem.modality.create({ data: { ...head, schedules: { create: schedules.map(({ modalityId: _ignored, ...s }) => s) } } });
  }
  for (const g of lGal) await rem.galleryImage.create({ data: g });
  for (const s of lSet) await rem.setting.upsert({ where: { key: s.key }, update: { ...s, key: undefined }, create: s });
  for (const pl of lPlan) await rem.plan.create({ data: pl });

  const [r2Set, r2Mod, r2Gal, r2Plan] = await Promise.all([
    rem.setting.count(), rem.modality.count(), rem.galleryImage.count(), rem.plan.count(),
  ]);
  console.log(`✓ Turso sincronizado: ${r2Set} settings, ${r2Mod} modalidades, ${r2Gal} galeria, ${r2Plan} planos`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => local.$disconnect());
