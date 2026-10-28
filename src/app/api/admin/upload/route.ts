import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireRole, unauthorized } from "@/lib/auth";

/**
 * Upload de imagens do painel administrativo.
 * Limite de 50 MB — aceita fotos e imagens pesadas sem esforço.
 */
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "img", "uploads");

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Nenhuma imagem recebida." }, { status: 400 });
    }
    if (!MIME_EXT[file.type]) {
      return Response.json(
        { error: "Formato inválido. Aceitamos JPG, PNG, WEBP, GIF ou AVIF." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return Response.json(
        {
          error:
            "Imagem muito grande. O limite é 50 MB — comprima a foto e tente novamente.",
        },
        { status: 413 }
      );
    }

    const ext = MIME_EXT[file.type];
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, name), bytes);

    return Response.json({ url: `/img/uploads/${name}` }, { status: 201 });
  } catch (e) {
    console.error("[admin/upload:POST]", e);
    return Response.json(
      { error: "Erro ao enviar imagem. Tente novamente." },
      { status: 500 }
    );
  }
}
