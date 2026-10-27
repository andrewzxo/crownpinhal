import crypto from "crypto";
import { cookies } from "next/headers";

/** Origin real da requisição (respeita proxy/gateway via x-forwarded-*). */
function originFromReq(req: Request): string {
  const h = req.headers;
  const host = h.get("x-forwarded-host") || h.get("host");
  if (host) {
    const proto =
      h.get("x-forwarded-proto") ||
      (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return new URL(req.url).origin;
}

/**
 * Inicia o login com Google (OAuth 2.0).
 * Requer GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.
 * Sem as credenciais, redireciona de volta com ?googleError=config.
 */
export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const origin = originFromReq(req);

  if (!clientId || !clientSecret) {
    return Response.redirect(`${origin}/?googleError=config`, 302);
  }

  const state = crypto.randomBytes(16).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return Response.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    302
  );
}
