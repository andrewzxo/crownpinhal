/**
 * Indica se o login com Google está configurado no servidor.
 * Retorna apenas um booleano — nenhum segredo é exposto.
 * O botão "Entrar com Google" usa isso para dar feedback imediato,
 * sem recarregar a página quando o Google ainda não foi configurado.
 */
export async function GET() {
  const configured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
  return Response.json({ configured });
}
