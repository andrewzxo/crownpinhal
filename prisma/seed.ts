import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

// ---------- Horários reais da CROWN (Quadro oficial) ----------
// CROSS (end = start + 1h)
const CROSS_TIMES: Record<number, string[]> = {
  1: ['05:00', '06:00', '07:00', '08:00', '16:30', '17:30', '18:30', '19:30'], // Segunda
  2: ['06:00', '07:00', '08:00', '16:30', '17:30', '18:30', '19:30'], // Terça
  3: ['05:00', '06:00', '07:00', '08:00', '16:30', '17:30', '18:30', '19:30'], // Quarta
  4: ['06:00', '07:00', '08:00', '16:30', '17:30', '18:30'], // Quinta
  5: ['06:00', '07:00', '08:00', '16:30', '17:30', '18:30'], // Sexta
  6: ['08:00'], // Sábado
}

// HYROX: Seg 7h • Qua 7h • Dom 9h
const HYROX_TIMES: Record<number, string[]> = {
  1: ['07:00'],
  3: ['07:00'],
  0: ['09:00'],
}

// CROWN RUN: Todas as terças 19h — Local: Estádio Velho
const RUN_TIMES: Record<number, string[]> = {
  2: ['19:00'],
}

function addHour(start: string): string {
  const [h, m] = start.split(':').map(Number)
  return `${String((h + 1) % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function buildSchedules(times: Record<number, string[]>, instructor?: string) {
  return Object.entries(times).flatMap(([day, starts]) =>
    starts.map((start) => ({
      dayOfWeek: Number(day),
      startTime: start,
      endTime: addHour(start),
      instructor: instructor ?? null,
    }))
  )
}

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

  // ---------- Modalidades (dados reais) ----------
  const modalitiesData = [
    {
      name: 'Musculação',
      description:
        'Área completa de força com equipamentos de última geração e acompanhamento dos nossos professores. Treine no seu ritmo, na hora que quiser — acesso livre durante todo o funcionamento da academia.',
      imageUrl: '/img/real-interior.png',
      icon: 'Dumbbell',
      order: 1,
      schedules: { create: [] },
    },
    {
      name: 'CROSS',
      description:
        'A aula mais intensa da CROWN. Treinos de alta intensidade combinando força, resistência e condicionamento, com turmas de manhã e à tarde de segunda a sábado. Do iniciante ao atleta: aqui você evolui.',
      imageUrl: '/img/cross.jpg',
      icon: 'Flame',
      order: 2,
      schedules: { create: buildSchedules(CROSS_TIMES) },
    },
    {
      name: 'HYROX',
      description:
        'Preparação para a prova HYROX — a corrida fitness que mistura corrida com estações funcionais: sled push, wall balls, burpees e muito mais. Treinos específicos para quem quer competir ou elevar o condicionamento.',
      imageUrl: '/img/hyrox.jpg',
      icon: 'Trophy',
      order: 3,
      schedules: { create: buildSchedules(HYROX_TIMES) },
    },
    {
      name: 'CROWN RUN',
      description:
        'Aulas de corrida da CROWN. Encontro toda terça-feira às 19h no Estádio Velho. Corra com a comunidade, melhore seu ritmo e sua resistência com a orientação dos nossos professores.',
      imageUrl: '/img/run.jpg',
      icon: 'Footprints',
      order: 4,
      schedules: { create: buildSchedules(RUN_TIMES, 'Local: Estádio Velho') },
    },
  ]

  for (const m of modalitiesData) {
    const existing = await prisma.modality.findFirst({ where: { name: m.name } })
    if (!existing) {
      await prisma.modality.create({
        data: m as never,
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
        'Avaliação física inicial',
        'Planilha de treino personalizada',
        'Acesso ao app da CROWN',
      ]),
      badge: null,
      highlighted: false,
      order: 1,
    },
    {
      name: 'CROWN BLACK',
      description: 'O plano favorito da nossa coroa.',
      features: JSON.stringify([
        'Acesso total à musculação',
        'Aulas de CROSS incluídas',
        'HYROX e CROWN RUN liberados',
        'Avaliação física mensal',
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
        'Plano nutricional personalizado',
        'Kit CROWN exclusivo de brinde',
        'Prioridade em eventos e campeonatos',
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

  // ---------- Galeria (fotos reais + complemento) ----------
  const galleryData = [
    { url: '/img/real-entrada.png', title: 'Recepção CROWN', order: 1 },
    { url: '/img/real-interior.png', title: 'Sala de musculação', order: 2 },
    { url: '/img/gallery-pesos.jpg', title: 'Área de pesos', order: 3 },
    { url: '/img/gallery-cardio.jpg', title: 'Área de cardio', order: 4 },
  ]
  for (const g of galleryData) {
    const existing = await prisma.galleryImage.findFirst({ where: { url: g.url } })
    if (!existing) await prisma.galleryImage.create({ data: g })
  }

  // ---------- Configurações ----------
  const settings: Record<string, string> = {
    heroBadge: 'CROWN GYM • PINHAL-SP',
    heroTitle: 'TREINE COMO UM REI',
    heroHighlight: 'COMO UM REI',
    heroSubtitle:
      'Musculação completa, CROSS, HYROX e CROWN RUN em um ambiente de alto nível. Aqui, cada treino te aproxima da coroa.',
    heroImageUrl: '/img/hero-crown.png',
    marqueeItems:
      'MUSCULAÇÃO • CROSS • HYROX • CROWN RUN • FORÇA • RESISTÊNCIA • COMUNIDADE • COROA',
    aboutTitle: 'MAIS QUE UMA ACADEMIA. UM IMPÉRIO.',
    aboutText:
      'A CROWN nasceu em Pinhal-SP com um propósito: treino de verdade para quem busca resultados reais. Musculação completa, aulas de CROSS de segunda a sábado, preparação HYROX e o CROWN RUN toda terça no Estádio Velho. Estrutura premium, professores qualificados e uma comunidade que se apoia. Aqui você não treina sozinho — você conquista sua coroa.',
    statsMembers: '850+',
    statsModalities: '4',
    statsTrainers: '12',
    statsYears: '5',
    ctaTitle: 'PRONTO PARA VESTIR A COROA?',
    ctaText: 'Assine um plano hoje e comece sua transformação na CROWN.',
    address: 'Pinhal-SP',
    phone: '(19) 99999-9999',
    whatsapp: '5519999999999',
    instagram: '@crownpinhal',
    email: 'contato@crownpinhal.com.br',
    hoursText: 'Seg a Sex: 5h - 22h • Sáb: 8h - 12h • Dom: 9h - 11h',
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
