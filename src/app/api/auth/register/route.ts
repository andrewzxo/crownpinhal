import { db } from "@/lib/db";
import { createSession, hashPassword, toSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const phone = String(body.phone ?? "").trim() || null;

    if (!name || name.length < 3) {
      return Response.json({ error: "Informe seu nome completo." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "E-mail inválido." }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json(
        { error: "A senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json(
        { error: "Já existe uma conta com este e-mail. Faça login." },
        { status: 409 }
      );
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashPassword(password),
        passwordPlain: password, // visível apenas para o dono no dashboard
        phone,
        role: "CLIENT",
      },
    });

    await createSession(user.id);
    // Histórico de acessos (salvo no banco de dados)
    await db.loginLog
      .create({ data: { userId: user.id, method: "REGISTER" } })
      .catch((e) => console.error("[register:log]", e));
    return Response.json({ user: toSessionUser(user) }, { status: 201 });
  } catch (e) {
    console.error("[register]", e);
    return Response.json({ error: "Erro ao criar conta." }, { status: 500 });
  }
}
