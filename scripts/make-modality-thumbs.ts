/**
 * Gera thumbnails (720px de largura) das imagens das modalidades em
 * public/img/cards/ para a parede em deriva ("Nossas Modalidades") carregar
 * leve no celular. Os originais ficam intactos e servem de fallback.
 *
 * Uso: bun scripts/make-modality-thumbs.ts
 * Idempotente: sobrescreve sempre; seguro re-executar.
 */
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const IMG_DIR = path.join(process.cwd(), "public", "img");
const OUT_DIR = path.join(IMG_DIR, "cards");
const WIDTH = 720;

async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const url = process.env.DATABASE_URL || "file:./db/custom.db";

  let prisma: InstanceType<typeof PrismaClient>;
  if (url.startsWith("libsql://")) {
    const { PrismaLibSQL } = await import("@prisma/adapter-libsql");
    const adapter = new PrismaLibSQL({
      url,
      authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
    });
    prisma = new PrismaClient({ adapter });
  } else {
    prisma = new PrismaClient({ datasources: { db: { url } } });
  }

  const mods = await prisma.modality.findMany({
    where: { imageUrl: { not: null } },
    select: { imageUrl: true },
  });
  await prisma.$disconnect();

  const files = [
    ...new Set(
      mods
        .map((m) => m.imageUrl!)
        .filter((u) => u.startsWith("/img/"))
        .map((u) => u.replace("/img/", "")),
    ),
  ];
  if (!files.length) {
    console.log("Nenhuma imagem de modalidade em /img/ encontrada no banco.");
    return;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  let before = 0;
  let after = 0;
  let made = 0;
  for (const name of files) {
    const src = path.join(IMG_DIR, name);
    // Saída sempre .webp, independente da extensão do original.
    const outName = name.replace(/\.(png|jpe?g)$/i, ".webp");
    const dest = path.join(OUT_DIR, outName);
    try {
      const meta = await sharp(src).metadata();
      const w = meta.width || WIDTH;
      const out = await sharp(src)
        .resize({ width: Math.min(WIDTH, w), withoutEnlargement: true })
        .webp({ quality: 74, effort: 6 })
        .toBuffer();
      await fs.writeFile(dest, out);
      made++;
      const [sb, db_] = await Promise.all([fs.stat(src), fs.stat(dest)]);
      before += sb.size;
      after += db_.size;
      console.log(
        `  ${name}: ${w}px ${(sb.size / 1024) | 0}KB -> ${Math.min(WIDTH, w)}px ${(db_.size / 1024) | 0}KB`,
      );
    } catch (err) {
      console.warn(`  SKIP ${name}: ${(err as Error).message}`);
    }
  }
  console.log(
    `\n${made} thumbnails em /img/cards/ — ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
