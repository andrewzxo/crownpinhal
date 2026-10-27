import { db } from "@/lib/db";
import { createSession, toSessionUser, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return Response.json(
        { error: "Informe e-mail e senha." },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.password)) {
      return Response.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
    }

    await createSession(user.id);
    // Histórico de acessos (salvo no banco de dados)
    await db.loginLog
      .create({ data: { userId: user.id, method: "EMAIL" } })
      .catch((e) => console.error("[login:log]", e));
    return Response.json({ user: toSessionUser(user) });
  } catch (e) {
    console.error("[login]", e);
    return Response.json({ error: "Erro ao fazer login." }, { status: 500 });
  }
}
