"use client";

export async function api<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as { error?: string }).error || "Ocorreu um erro inesperado.";
    throw new Error(message);
  }
  return data as T;
}

export interface UploadResult {
  url: string;
}

/**
 * Comprime fotos grandes no navegador antes do upload:
 * redimensiona para até 2200px no lado maior e exporta JPEG 85%.
 * Assim qualquer foto de celular entra no limite de 4 MB do banco.
 */
async function recompress(file: File): Promise<File> {
  if (file.type === "image/gif") return file; // GIF animado: não mexe
  if (file.size <= 3.5 * 1024 * 1024) return file; // já cabe
  try {
    const bmp = await createImageBitmap(file);
    const maxSide = 2200;
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85)
    );
    if (!blob || blob.size >= file.size) return file; // compressão não valeu
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
      type: "image/jpeg",
    });
  } catch {
    return file; // se falhar, segue com o original
  }
}

export async function uploadImage(file: File): Promise<string> {
  const ready = await recompress(file);
  if (ready.size > 4 * 1024 * 1024) {
    throw new Error(
      "Imagem muito grande (máx. 4 MB). Tente outra foto ou reduza a imagem."
    );
  }
  const form = new FormData();
  form.append("file", ready);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };
  if (!res.ok || !data.url) throw new Error(data.error || "Erro ao enviar imagem.");
  return data.url;
}
