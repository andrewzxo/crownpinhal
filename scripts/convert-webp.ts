/**
 * Task 28 — Pipeline de imagens leves:
 * 1. Gera public/img/og-cover.jpg (1200x630 p/ Open Graph — JPG pois WhatsApp não suporta webp em og:image)
 * 2. Gera src/app/icon.png (512) e src/app/apple-icon.png (180) — convenção de favicon do Next
 * 3. Converte TODAS as imagens de public/img e public/logo.png para .webp (q82) e apaga os originais
 *
 * Rodar: bun scripts/convert-webp.ts
 */
import sharp from "sharp";
import { readdirSync, statSync, unlinkSync, existsSync } from "fs";
import path from "path";

const IMG_DIR = "public/img";
const GOLD = "#d9a441";

const fmt = (n: number) => `${(n / 1024).toFixed(0)}KB`;

async function fileSize(p: string): Promise<number> {
  return statSync(p).size;
}

// ---------- 1. OG cover (precisa do hero.jpg ANTES da conversão) ----------
async function makeOgCover() {
  const out = path.join(IMG_DIR, "og-cover.jpg");
  const W = 1200;
  const H = 630;

  // Overlay: gradiente escuro + selo CROWN (SVG; fontes do sistema, sem deps extras)
  const overlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#050505" stop-opacity="0.25"/>
          <stop offset="0.55" stop-color="#050505" stop-opacity="0.45"/>
          <stop offset="1" stop-color="#050505" stop-opacity="0.92"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
      <rect x="60" y="${H - 210}" width="70" height="4" fill="${GOLD}"/>
      <text x="60" y="${H - 140}" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold"
            font-size="92" fill="#fafafa" letter-spacing="6">CROWN</text>
      <text x="60" y="${H - 90}" font-family="DejaVu Sans, Arial, sans-serif"
            font-size="30" fill="${GOLD}" letter-spacing="10">ACADEMIA • PINHAL-SP</text>
      <text x="60" y="${H - 48}" font-family="DejaVu Sans, Arial, sans-serif"
            font-size="24" fill="#a3a3a3" letter-spacing="2">Conectando pessoas através do fitness</text>
    </svg>`);

  await sharp(path.join(IMG_DIR, "hero.jpg"))
    .resize(W, H, { fit: "cover", position: "centre" })
    .composite([{ input: overlay }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(out);
  console.log(`✓ og-cover.jpg (${fmt(await fileSize(out))})`);
}

// ---------- 2. Favicons pela convenção do Next (src/app/icon.png + apple-icon.png) ----------
async function makeIcons() {
  const logo = "public/logo.png";
  const bg = { r: 16, g: 16, b: 19, alpha: 1 }; // #101013 (fundo do portão)

  await sharp(logo)
    .resize(512, 512, { fit: "contain", background: bg })
    .png({ compressionLevel: 9 })
    .toFile("src/app/icon.png");
  console.log(`✓ src/app/icon.png (512×512, ${fmt(await fileSize("src/app/icon.png"))})`);

  await sharp(logo)
    .resize(180, 180, { fit: "contain", background: bg })
    .png({ compressionLevel: 9 })
    .toFile("src/app/apple-icon.png");
  console.log(`✓ src/app/apple-icon.png (180×180, ${fmt(await fileSize("src/app/apple-icon.png"))})`);
}

// ---------- 3. Conversão geral p/ WebP ----------
async function convertAll() {
  const targets: string[] = [];

  // public/img/*.{jpg,png}
  for (const f of readdirSync(IMG_DIR)) {
    if (/\.(jpe?g|png)$/i.test(f) && !f.startsWith("og-cover")) {
      targets.push(path.join(IMG_DIR, f));
    }
  }
  // public/logo.png → public/logo.webp
  if (existsSync("public/logo.png")) targets.push("public/logo.png");

  let before = 0;
  let after = 0;
  for (const src of targets) {
    const out = src.replace(/\.(jpe?g|png)$/i, ".webp");
    await sharp(src).webp({ quality: 82, effort: 6 }).toFile(out);
    const b = await fileSize(src);
    const a = await fileSize(out);
    before += b;
    after += a;
    console.log(`  ${path.basename(src)} → ${path.basename(out)}: ${fmt(b)} → ${fmt(a)}`);
    unlinkSync(src);
  }
  console.log(`✓ ${targets.length} imagens convertidas — total ${fmt(before)} → ${fmt(after)}`);
}

async function main() {
  await makeOgCover();
  await makeIcons();
  await convertAll();
  console.log("✓ Pipeline de imagens concluído");
  process.exit(0);
}

main().catch((e) => {
  console.error("ERRO:", e instanceof Error ? e.message : e);
  process.exit(1);
});
