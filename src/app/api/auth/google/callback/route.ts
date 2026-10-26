import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

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
 * Callback do OAuth do Google: troca o código por tokens, busca o perfil,
 * cria (ou vincula) a conta e abre a sessão CROWN.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const origin = originFromReq(req);

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return Response.redirect(`${origin}/?googleError=config`, 302);
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  if (!code || !state || !savedState || state !== savedState) {
    return Response.redirect(`${origin}/?googleError=state`, 302);
  }

  try {
    // Troca o código por um access_token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) throw new Error("token_exchange_failed");
    const tokens = (await tokenRes.json()) as { access_token?: string };
    if (!tokens.access_token) throw new Error("no_access_token");

    // Perfil do Google (e-mail verificado)
    const profRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!profRes.ok) throw new Error("profile_failed");
    const profile = (await profRes.json()) as {
      email?: string;
      name?: string;
      email_verified?: boolean;
    };
    if (!profile.email) throw new Error("no_email");

    // Cria ou vincula a conta CROWN
    let user = await db.user.findUnique({ where: { email: profile.email } });
    if (!user) {
      // senha aleatória inutilizável (login do Google não usa senha)
      user = await db.user.create({
        data: {
          email: profile.email,
          name: profile.name || profile.email.split("@")[0],
          password: crypto.randomBytes(32).toString("hex"),
          role: "CLIENT",
        },
      });
    }

    await createSession(user.id);

    return Response.redirect(`${origin}/?googleSuccess=1`, 302);
  } catch (e) {
    console.error("[auth/google/callback]", e);
    return Response.redirect(`${origin}/?googleError=auth`, 302);
  }
}
