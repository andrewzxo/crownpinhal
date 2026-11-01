/**
 * Cria o schema no Turso e roda o seed (não-destrutivo).
 *
 * Uso (depois de criar o banco em turso.tech):
 *   DATABASE_URL="libsql://seu-banco-org.turso.io" \
 *   DATABASE_AUTH_TOKEN="seu-token" \
 *   bun scripts/setup-turso.ts
 */
import { createClient } from "@libsql/client";
import { execSync } from "child_process";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url?.startsWith("libsql://")) {
  console.error(
    "Defina DATABASE_URL (libsql://…) e DATABASE_AUTH_TOKEN antes de rodar."
  );
  process.exit(1);
}

async function main() {
  const client = createClient({ url: url!, authToken: authToken || undefined });

  // 1. Gera o SQL completo do schema atual (prisma/schema.prisma)
  const sql = execSync(
    "bunx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
    { encoding: "utf8", cwd: process.cwd() }
  );

  // 2. Cria todas as tabelas no Turso
  await client.executeMultiple(sql);
  console.log("✓ Schema criado no Turso");

  // 3. Seed não-destrutivo (usuários demo, modalidades, planos, galeria, settings)
  await import("../prisma/seed");
  console.log("✓ Seed concluído (conteúdo inicial no Turso)");

  process.exit(0);
}

main().catch((e) => {
  console.error("ERRO:", e instanceof Error ? e.message : e);
  process.exit(1);
});
