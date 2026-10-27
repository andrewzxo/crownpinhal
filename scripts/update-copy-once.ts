/**
 * One-off: atualiza textos no banco vivo (seed agora é create-only).
 * - heroSubtitle curto (sem enumeração redundante de modalidades)
 * - ctaEyebrow = "CROWN PINHAL-SP" (Projeto Verão já tem card próprio na seção Eventos)
 * - remove marqueeItems (faixa rotativa foi removida do site) e heroCtaNote (redundante)
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.setting.upsert({
    where: { key: 'heroSubtitle' },
    update: { value: 'Um espaço completo para o seu Fitness & Lifestyle: treino, saúde e convivência no coração de Pinhal.' },
    create: { key: 'heroSubtitle', value: 'Um espaço completo para o seu Fitness & Lifestyle: treino, saúde e convivência no coração de Pinhal.' },
  })
  await prisma.setting.upsert({
    where: { key: 'ctaEyebrow' },
    update: { value: 'CROWN PINHAL-SP' },
    create: { key: 'ctaEyebrow', value: 'CROWN PINHAL-SP' },
  })
  await prisma.setting.deleteMany({ where: { key: { in: ['marqueeItems', 'heroCtaNote'] } } })
  console.log('Copy atualizada no banco vivo!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
