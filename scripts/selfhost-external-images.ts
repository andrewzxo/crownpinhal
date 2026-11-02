/**
 * Auto-hospeda imagens externas usadas no conteúdo (hoje: links do Pinterest
 * em Modality.imageUrl e GalleryImage.url). Baixa cada URL externa, converte
 * para WebP (máx. 1200px, q80) em public/img/mod-*.webp / gallery-*.webp e
 * atualiza o banco. Remove dependência de hotlink (quebra de imagem, latência
 * e impossibilidade de gerar thumbnails leves para a parede de modalidades).
 *
 * Uso:   bun scripts/selfhost-external-images.ts          # banco local
 *   DATABASE_URL="libsql://…" DATABASE_AUTH_TOKEN="…" bun scripts/selfhost-external-images.ts
 */
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { db } from "../src/lib/db";

const IMG_DIR = path.join(process.cwd(), "public", "img");
const MAX_W = 1200;

async function fetchImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CrownSite/1.0)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.warn(`  FAIL ${url}: HTTP ${res.status}`);
      return null;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (e) {
    console.warn(`  FAIL ${url}: ${(e as Error).message}`);
    return null;
  }
}

async function main() {
  const [modalities, gallery] = await Promise.all([
    db.modality.findMany({ select: { id: true, name: true, imageUrl: true } }),
    db.galleryImage.findMany({ select: { id: true, order: true, url: true } }),
  ]);

  const externals = new Map<string, string>(); // url externa -> caminho local /img/…
  for (const m of modalities)
    if (m.imageUrl && /^https?:/i.test(m.imageUrl))
      externals.set(m.imageUrl, `/img/mod-${slug(m.name)}.webp`);
  for (const g of gallery)
    if (g.url && /^https?:/i.test(g.url) && !externals.has(g.url))
      externals.set(g.url, `/img/gallery-${g.order}.webp`);

  if (!externals.size) {
    console.log("Nenhuma imagem externa para auto-hospedar.");
    return;
  }

  for (const [url, local] of externals) {
    const buf = await fetchImage(url);
    if (!buf) continue;
    const out = await sharp(buf)
      .resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toBuffer();
    await fs.writeFile(path.join(IMG_DIR, path.basename(local)), out);
    console.log(
      `  ${url.slice(0, 60)}… -> ${local} (${(out.length / 1024) | 0}KB)`,
    );

    for (const m of modalities)
      if (m.imageUrl === url)
        await db.modality.update({ where: { id: m.id }, data: { imageUrl: local } });
    for (const g of gallery)
      if (g.url === url)
        await db.galleryImage.update({ where: { id: g.id }, data: { url: local } });
  }
  console.log("✓ Imagens externas auto-hospedadas e banco atualizado.");
}

function slug(s: string) {
  return (
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "x"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
