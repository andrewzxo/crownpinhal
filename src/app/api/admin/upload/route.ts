import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { requireRole, unauthorized } from "@/lib/auth";

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  const admin = await requireRole(["ADMIN", "OWNER"]);
  if (!admin) return unauthorized();

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "Envie um arquivo." }, { status: 400 });
    }
    const ext = ALLOWED.get(file.type);
    if (!ext) {
      return Response.json(
        { error: "Formato inválido. Use JPG, PNG, WEBP ou GIF." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return Response.json({ error: "Imagem muito grande (máx. 10MB)." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${crypto.randomBytes(8).toString("hex")}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    return Response.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (e) {
    console.error("[admin/upload]", e);
    return Response.json({ error: "Erro ao enviar imagem." }, { status: 500 });
  }
}
