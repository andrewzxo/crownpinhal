/**
 * "Assa" o duotone CROWN nos thumbnails das modalidades.
 *
 * A parede em deriva ("Nossas Modalidades") aplicava o tritone via
 * `filter: url(#svg)` em runtime. Como as colunas se movem o tempo todo,
 * o navegador re-rasteriza o filtro SVG a cada frame — isso engasga a
 * thread principal: no desktop a rolagem engole eventos de wheel e no
 * celular a página fica pesada. Com o duotone gravado no próprio arquivo
 * WebP, a animação vira transform de textura em cache (compositor) e a
 * página volta a rodar lisa nas duas plataformas.
 *
 * O resultado é pixel-a-pixel idêntico ao filtro do componente:
 *   1. luminância (feColorMatrix sRGB: 0.2126/0.7152/0.0722)
 *   2. curva de contraste tabela [0, .13, .5, .9, 1] (feComponentTransfer)
 *   3. tritone sombra/meio/alto por canal (type="table", nós 0/.5/1)
 *
 * Uso:  bun scripts/make-duotone-thumbs.ts
 * Gera: public/img/cards/duo-*.webp a partir de public/img/cards/*.webp
 * Idempotente: sobrescreve sempre; seguro re-executar.
 */
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { mixHex, tritoneTables } from "../src/components/ui/duotone-team-roster";

// Paleta CROWN aplicada à parede (mesma de src/components/crown/Modalities.tsx)
const CROWN_PALETTE = {
  ground: "#070604",
  deep: "#241a0a",
  hot: "#d9a441",
  glow: "#f5d488",
  ink: "#faf3e0",
  shadow: "#150f05",
  highlight: "#ffe9bd",
};

const CARDS_DIR = path.join(process.cwd(), "public", "img", "cards");

/** Valor de uma tabela feFunc (nós igualmente espaçados em 0..1). */
function tableValue(knots: number[], t: number): number {
  const segs = knots.length - 1;
  const x = Math.min(1, Math.max(0, t)) * segs;
  let i = Math.floor(x);
  if (i >= segs) i = segs - 1;
  const f = x - i;
  return knots[i] + (knots[i + 1] - knots[i]) * f;
}

async function main() {
  // Mesmos cálculos do componente (mid padrão = mix de hot/highlight 0.35)
  const mid = mixHex(CROWN_PALETTE.hot, CROWN_PALETTE.highlight, 0.35);
  const [tR, tG, tB] = tritoneTables(
    mixHex(CROWN_PALETTE.shadow, CROWN_PALETTE.deep, 0.4),
    mid,
    mixHex(CROWN_PALETTE.highlight, CROWN_PALETTE.ink, 0.5),
  ).map((s) => s.split(" ").map(Number));
  // Curva de contraste comum aos três canais (1º feComponentTransfer)
  const curve = [0, 0.13, 0.5, 0.9, 1];

  const files = (await fs.readdir(CARDS_DIR)).filter(
    (f) => f.endsWith(".webp") && !f.startsWith("duo-"),
  );
  if (!files.length) {
    console.log("Nenhum thumbnail em public/img/cards/ — rode make-modality-thumbs antes.");
    return;
  }

  for (const file of files) {
    const src = path.join(CARDS_DIR, file);
    const out = path.join(CARDS_DIR, "duo-" + file);
    const { data, info } = await sharp(src)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const px = info.width * info.height;
    for (let i = 0; i < px; i++) {
      const o = i * 4;
      // 1) luminância sRGB (0..1)
      const lum =
        (0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2]) / 255;
      // 2) curva de contraste
      const l1 = tableValue(curve, lum);
      // 3) tritone por canal
      data[o] = Math.round(tableValue(tR, l1) * 255);
      data[o + 1] = Math.round(tableValue(tG, l1) * 255);
      data[o + 2] = Math.round(tableValue(tB, l1) * 255);
    }

    await sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 as const },
    })
      // Cards têm no máx. 250px de largura (2-3x DPR ⇒ ~500-750px); 480px
      // cobre com folga e corta ~55% do custo de decodagem/bytes vs 720px.
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(out);

    const kb = Math.round((await fs.stat(out)).size / 1024);
    console.log(`duo-${file}  ${info.width}x${info.height}  ${kb}KB`);
  }
  console.log(`\n${files.length} duotones gerados em public/img/cards/`);
}

main();
