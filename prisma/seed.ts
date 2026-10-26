import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

const DAYS = [
  { day: 1, slots: [['06:00', '07:00'], ['09:00', '10:00'], ['18:00', '19:00'], ['20:00', '21:00']] },
  { day: 2, slots: [['07:00', '08:00'], ['10:00', '11:00'], ['19:00', '20:00']] },
  { day: 3, slots: [['06:00', '07:00'], ['09:00', '10:00'], ['18:00', '19:00'], ['20:00', '21:00']] },
  { day: 4, slots: [['07:00', '08:00'], ['10:00', '11:00'], ['19:00', '20:00']] },
  { day: 5, slots: [['06:00', '07:00'], ['09:00', '10:00'], ['18:00', '19:00'], ['20:00', '21:00']] },
  { day: 6, slots: [['08:00', '09:00'], ['10:00', '11:00']] },
]

async function main() {
  // ---------- Usuários ----------
  await prisma.user.upsert({
    where: { email: 'dono@crown.com' },
    update: {},
    create: {
      email: 'dono@crown.com',
      name: 'Dono Crown',
      password: hashPassword('crown123'),
      passwordPlain: 'crown123',
      role: 'OWNER',
      phone: '(19) 99999-0000',
    },
  })
  await prisma.user.upsert({
    where: { email: 'admin@crown.com' },
    update: {},
    create: {
      email: 'admin@crown.com',
      name: 'Administrador',
      password: hashPassword('admin123'),
      passwordPlain: 'admin123',
      role: 'ADMIN',
      phone: '(19) 99999-1111',
    },
  })
  await prisma.user.upsert({
    where: { email: 'cliente@crown.com' },
    update: {},
    create: {
      email: 'cliente@crown.com',
      name: 'Cliente Exemplo',
      password: hashPassword('cliente123'),
      passwordPlain: 'cliente123',
      role: 'CLIENT',
      phone: '(19) 99999-2222',
    },
  })

  // ---------- Modalidades ----------
  const modalitiesData = [
    {
      name: 'Musculação',
      description:
        'Área completa de força com equipamentos de última geração. Treinos personalizados para hipertrofia, emagrecimento ou condicionamento, com acompanhamento dos nossos professores.',
      imageUrl: '/img/musculacao.jpg',
      icon: 'Dumbbell',
      order: 1,
    },
    {
      name: 'CrossFit',
      description:
        'Treinos de alta intensidade combinando força, resistência e agilidade. WODs diários em um box estruturado para todos os níveis, do iniciante ao atleta.',
      imageUrl: '/img/crossfit.jpg',
      icon: 'Flame',
      order: 2,
    },
    {
      name: 'Boxe & Muay Thai',
      description:
        'Aprenda técnicas de golpe, defesa e condicionamento com treinadores experientes. Aulas que desenvolvem disciplina, coordenação e autoconfiança.',
      imageUrl: '/img/boxe.jpg',
      icon: 'Swords',
      order: 3,
    },
    {
      name: 'Spinning',
      description:
        'Aulas energéticas de ciclismo indoor com iluminação e som imersivos. Queime até 600 calorias por aula pedalando ao ritmo da música.',
      imageUrl: '/img/spinning.jpg',
      icon: 'Bike',
      order: 4,
    },
    {
      name: 'Treino Funcional',
      description:
        'Movimentos que trabalham o corpo como um todo, melhorando força, equilíbrio e flexibilidade. Circuits dinâmicos com kettlebells, cordas e muito mais.',
      imageUrl: '/img/funcional.jpg',
      icon: 'Activity',
      order: 5,
    },
    {
      name: 'Dança & Zumba',
      description:
        'Aulas coletivas animadas que unem ritmo, diversão e queima calórica. Dança latina, ritmos brasileiros e muito mais em um ambiente descontraído.',
      imageUrl: '/img/zumba.jpg',
      icon: 'Music',
      order: 6,
    },
    {
      name: 'Jump',
      description:
        'Aulas de ginástica em mini trampolins: exercício de baixo impacto, alto gasto calórico e muita diversão. Fortalece pernas, glúteos e sistema cardiovascular.',
      imageUrl: '/img/jump.jpg',
      icon: 'Zap',
      order: 7,
    },
    {
      name: 'Alongamento & Pilates',
      description:
        'Melhore postura, flexibilidade e consciência corporal. Aulas tranquilas que complementam treinos intensos e aliviam o estresse do dia a dia.',
      imageUrl: '/img/pilates.jpg',
      icon: 'Sparkles',
      order: 8,
    },
  ]

  for (const m of modalitiesData) {
    const existing = await prisma.modality.findFirst({ where: { name: m.name } })
    if (!existing) {
      await prisma.modality.create({
        data: {
          ...m,
          schedules: {
            create: DAYS.flatMap((d, di) =>
              d.slots.slice(0, di % 2 === 0 ? 3 : 2).map((s, si) => ({
                dayOfWeek: d.day,
                startTime: s[0],
                endTime: s[1],
                instructor: ['Prof. Carlos', 'Profa. Ana', 'Prof. Rafael', 'Profa. Júlia', 'Prof. Diego'][(di + si) % 5],
              }))
            ),
          },
        },
      })
    }
  }

  // ---------- Planos ----------
  const plansData = [
    {
      name: 'CROWN START',
      description: 'Ideal para quem está começando a jornada.',
      features: JSON.stringify([
        'Acesso livre à musculação',
        'Aulas coletivas incluídas',
        'Avaliação física inicial',
        'App de treinos CROWN',
      ]),
      badge: null,
      highlighted: false,
      order: 1,
    },
    {
      name: 'CROWN BLACK',
      description: 'O plano favorito dos nossos alunos.',
      features: JSON.stringify([
        'Acesso total a todas as modalidades',
        'Aulas coletivas ilimitadas',
        'Avaliação física mensal',
        'Plano nutricional personalizado',
        'Acesso à sala de CrossFit',
        'Convite para 1 amigo por mês',
      ]),
      badge: 'MAIS POPULAR',
      highlighted: true,
      order: 2,
    },
    {
      name: 'CROWN GOLD',
      description: 'Experiência completa, sem limites.',
      features: JSON.stringify([
        'Tudo do plano CROWN BLACK',
        'Personal trainer 2x por semana',
        'Acesso VIP 24 horas',
        'Estacionamento exclusivo',
        'Kit CROWN de brinde',
        'Desconto na loja de suplementos',
      ]),
      badge: 'VIP',
      highlighted: false,
      order: 3,
    },
  ]

  for (const p of plansData) {
    const existing = await prisma.plan.findFirst({ where: { name: p.name } })
    if (!existing) await prisma.plan.create({ data: p })
  }

  // ---------- Galeria ----------
  const galleryData = [
    { url: '/img/gallery-hall.jpg', title: 'Hall de entrada', order: 1 },
    { url: '/img/gallery-pesos.jpg', title: 'Área de pesos', order: 2 },
    { url: '/img/gallery-cardio.jpg', title: 'Área de cardio', order: 3 },
    { url: '/img/gallery-recepcao.jpg', title: 'Recepção', order: 4 },
  ]
  for (const g of galleryData) {
    const existing = await prisma.galleryImage.findFirst({ where: { url: g.url } })
    if (!existing) await prisma.galleryImage.create({ data: g })
  }

  // ---------- Configurações ----------
  const settings: Record<string, string> = {
    heroBadge: 'ACADEMIA CROWN • PINHAL-SP',
    heroTitle: 'TREINE COMO UM REI',
    heroHighlight: 'COMO UM REI',
    heroSubtitle:
      'Musculação, CrossFit, lutas e aulas coletivas em um espaço feito para você evoluir. Aqui, cada gota de suor te aproxima da coroa.',
    heroImageUrl: '/img/hero.jpg',
    marqueeItems:
      'MUSCULAÇÃO • CROSSFIT • BOXE • MUAY THAI • SPINNING • FUNCIONAL • ZUMBA • JUMP • PILATES',
    aboutTitle: 'MAIS QUE UMA ACADEMIA. UM IMPÉRIO.',
    aboutText:
      'A CROWN nasceu em Pinhal-SP com um propósito: oferecer um ambiente de alto nível para quem busca resultados reais. Estrutura premium, treinadores qualificados e uma comunidade que se apoia. Aqui você não treina sozinho, você faz parte de algo maior.',
    statsMembers: '850+',
    statsModalities: '8',
    statsTrainers: '12',
    statsYears: '5',
    ctaTitle: 'PRONTO PARA VESTIR A COROA?',
    ctaText: 'Assine um plano hoje e comece sua transformação na CROWN.',
    address: 'Av. dos Reis, 1234 - Centro, Pinhal-SP',
    phone: '(19) 99999-9999',
    whatsapp: '5519999999999',
    instagram: '@crownpinhal',
    email: 'contato@crownpinhal.com.br',
    hoursText: 'Seg a Sex: 5h30 - 23h • Sáb: 8h - 14h • Dom: 8h - 12h',
  }

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } })
  }

  console.log('Seed concluído!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
