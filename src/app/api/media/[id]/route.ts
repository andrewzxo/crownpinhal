import { db } from "@/lib/db";

/**
 * Serve imagens gravadas no banco (tabela Media) — uploads do painel admin.
 * Cache eterno: cada imagem tem id único e o conteúdo nunca muda.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const media = await db.media.findUnique({ where: { id } });
    if (!media) {
      return new Response("Imagem não encontrada.", { status: 404 });
    }

    return new Response(new Uint8Array(media.bytes), {
      headers: {
        "Content-Type": media.mime,
        "Content-Length": String(media.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    console.error("[media:GET]", e);
    return new Response("Erro ao carregar imagem.", { status: 500 });
  }
}
