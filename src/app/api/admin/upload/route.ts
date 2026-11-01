import { db } from "@/lib/db";
import { requireRole, unauthorized } from "@/lib/auth";

/**
 * Upload de imagens do painel administrativo.
 * Grava no BANCO (tabela Media) e serve via /api/media/[id] — funciona na
 * Vercel e na Render, que não têm disco gravável permanente.
 * Fotos grandes são recomprimidas automaticamente no navegador (src/lib/api.ts).
 */
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB após recompressão

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Nenhuma imagem recebida." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return Response.json(
        { error: "Formato inválido. Aceitamos JPG, PNG, WEBP, GIF ou AVIF." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return Response.json(
        {
          error:
            "Imagem muito grande (máx. 4 MB). Fotos de celular são comprimidas automaticamente — tente novamente ou reduza a imagem.",
        },
        { status: 413 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const media = await db.media.create({
      data: { mime: file.type, size: bytes.length, bytes },
    });

    return Response.json({ url: `/api/media/${media.id}` }, { status: 201 });
  } catch (e) {
    console.error("[admin/upload:POST]", e);
    return Response.json(
      { error: "Erro ao enviar imagem. Tente novamente." },
      { status: 500 }
    );
  }
}
