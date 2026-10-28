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

export async function uploadImage(file: File): Promise<string> {
  // Pré-checa no cliente: evita enviar 50 MB pra cima e falhar
  if (file.size > 50 * 1024 * 1024) {
    throw new Error(
      "Imagem muito grande. O limite é 50 MB — comprima a foto e tente novamente."
    );
  }
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };
  if (!res.ok || !data.url) throw new Error(data.error || "Erro ao enviar imagem.");
  return data.url;
}
