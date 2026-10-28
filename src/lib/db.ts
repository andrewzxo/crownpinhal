import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Fallback de URL garante que o build nunca quebre por falta de env
// (ex.: deploy na Render) — em runtime prevalece sempre a DATABASE_URL.
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || 'file:./db/custom.db',
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db