/**
 * Task 28 — Migra as URLs de imagens do banco para .webp
 * (Modality.imageUrl, GalleryImage.url, Setting.heroImageUrl).
 * Não-destrutivo: só troca a extensão de caminhos /img/*.jpg|png;
 * imagens enviadas pelo admin (/api/media/...) não são tocadas.
 *
 * Uso:
 *   bun scripts/db-urls-to-webp.ts                                    # banco local (file:)
 *   DATABASE_URL="libsql://…" DATABASE_AUTH_TOKEN="…" bun scripts/db-urls-to-webp.ts   # Turso
 */
import { db } from "../src/lib/db";

const isOldImg = (u: string | null | undefined) =>
  Boolean(u && u.startsWith("/img/") && /\.(jpe?g|png)$/i.test(u));

const toWebp = (u: string) => u.replace(/\.(jpe?g|png)$/i, ".webp");

async function main() {
  const modalities = await db.modality.findMany({ select: { id: true, imageUrl: true } });
  const gallery = await db.galleryImage.findMany({ select: { id: true, url: true } });
  const hero = await db.setting.findUnique({ where: { key: "heroImageUrl" } });

  let count = 0;

  for (const m of modalities) {
    if (isOldImg(m.imageUrl)) {
      await db.modality.update({ where: { id: m.id }, data: { imageUrl: toWebp(m.imageUrl!) } });
      count++;
    }
  }

  for (const g of gallery) {
    if (isOldImg(g.url)) {
      await db.galleryImage.update({ where: { id: g.id }, data: { url: toWebp(g.url) } });
      count++;
    }
  }

  if (isOldImg(hero?.value)) {
    await db.setting.update({ where: { key: "heroImageUrl" }, data: { value: toWebp(hero!.value) } });
    count++;
  }

  console.log(`✓ ${count} URLs atualizadas para .webp`);
  await db.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error("ERRO:", e instanceof Error ? e.message : e);
  process.exit(1);
});
