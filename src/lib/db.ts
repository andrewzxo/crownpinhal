import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Um único DATABASE_URL para qualquer ambiente:
 * - file:./db/custom.db  → SQLite local (dev) — engine padrão
 * - libsql://…           → Turso (Vercel/Render) — driver adapter HTTP
 * A Vercel não tem disco gravável, então lá o banco TEM que ser remoto.
 */
export function createDb(): PrismaClient {
  const url = process.env.DATABASE_URL || 'file:./db/custom.db'

  if (url.startsWith('libsql://') || url.startsWith('https://')) {
    const adapter = new PrismaLibSQL({
      url,
      authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
    })
    return new PrismaClient({ adapter })
  }

  return new PrismaClient()
}

export const db = globalForPrisma.prisma ?? createDb()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
