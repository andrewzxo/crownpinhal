import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

// ---------- Horários reais da CROWN (Quadro oficial) ----------
// CROSS: Seg a Sex 6h/7h/8h + 16h30/17h30/18h30/19h30 • Sáb 8h • Dom 9h (end = start + 1h)
const CROSS_TIMES: Record<number, string[]> = {
  1: ['06:00', '07:00', '08:00', '16:30', '17:30', '18:30', '19:30'], // Segunda
  2: ['06:00', '07:00', '08:00', '16:30', '17:30', '18:30', '19:30'], // Terça
  3: ['06:00', '07:00', '08:00', '16:30', '17:30', '18:30', '19:30'], // Quarta
  4: ['06:00', '07:00', '08:00', '16:30', '17:30', '18:30', '19:30'], // Quinta
  5: ['06:00', '07:00', '08:00', '16:30', '17:30', '18:30', '19:30'], // Sexta
  6: ['08:00'], // Sábado
  0: ['09:00'], // Domingo
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

// AULAS COLETIVAS (flyer oficial)
// Seg: 18h CROWN DANCE + 18h15 BIKE • Ter: 18h JUMP + 19h PILATES
// Qua: 18h15 BIKE • Qui: 18h JUMP
const DANCE_TIMES: Record<number, string[]> = { 1: ['18:00'] }
const BIKE_TIMES: Record<number, string[]> = { 1: ['18:15'], 3: ['18:15'] }
const JUMP_TIMES: Record<number, string[]> = { 2: ['18:00'], 4: ['18:00'] }
const PILATES_TIMES: Record<number, string[]> = { 2: ['19:00'] }

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
        'Academia completa com área de força e cardio. Acompanhamento dos nossos professores e acesso livre durante todo o funcionamento: Seg a Sex 5h às 22h • Sáb 8h às 16h • Dom 8h às 14h.',
      imageUrl: '/img/real-interior.png',
      icon: 'Dumbbell',
      order: 1,
      schedules: { create: [] },
    },
    {
      name: 'CROSS',
      description:
        'A aula mais intensa da CROWN. Treinos de alta intensidade combinando força, resistência e condicionamento. Manhã e tarde, de segunda a sexta — mais sábados e domingos.',
      imageUrl: '/img/cross.jpg',
      icon: 'Flame',
      order: 2,
      schedules: { create: buildSchedules(CROSS_TIMES) },
    },
    {
      name: 'HYROX',
      description:
        'Preparação para a prova HYROX — corrida misturada com estações funcionais: sled push, wall balls, burpees e muito mais. Para quem quer competir ou explodir o condicionamento.',
      imageUrl: '/img/hyrox.jpg',
      icon: 'Trophy',
      order: 3,
      schedules: { create: buildSchedules(HYROX_TIMES) },
    },
    {
      name: 'CROWN RUN',
      description:
        'O treino de corrida da CROWN. Toda terça-feira às 19h no Estádio Velho. Corra com a comunidade, melhore seu ritmo e sua resistência com os nossos professores.',
      imageUrl: '/img/run.jpg',
      icon: 'Footprints',
      order: 4,
      schedules: { create: buildSchedules(RUN_TIMES, 'Local: Estádio Velho') },
    },
    {
      name: 'CROWN DANCE',
      description:
        'Aula coletiva de dança: cardio, ritmo e diversão em uma aula que queima calorias sem parecer treino. Toda segunda-feira às 18h.',
      imageUrl: '/img/zumba.jpg',
      icon: 'Music',
      order: 5,
      schedules: { create: buildSchedules(DANCE_TIMES) },
    },
    {
      name: 'BIKE',
      description:
        'Cycling indoor com trilha e energia lá em cima. Pedaladas intensas para queimar calorias e ganhar fôlego. Segunda e quarta às 18h15.',
      imageUrl: '/img/spinning.jpg',
      icon: 'Bike',
      order: 6,
      schedules: { create: buildSchedules(BIKE_TIMES) },
    },
    {
      name: 'JUMP',
      description:
        'Aula no mini trampolim: cardio de alto impacto com baixo impacto nas articulações. Terça e quinta às 18h.',
      imageUrl: '/img/jump.jpg',
      icon: 'Activity',
      order: 7,
      schedules: { create: buildSchedules(JUMP_TIMES) },
    },
    {
      name: 'PILATES',
      description:
        'Força, flexibilidade, postura e respiração. Aula coletiva para equilibrar o corpo e a mente. Toda terça-feira às 19h.',
      imageUrl: '/img/pilates.jpg',
      icon: 'Sparkles',
      order: 8,
      schedules: { create: buildSchedules(PILATES_TIMES) },
    },
    {
      name: 'MUAY THAI',
      description:
        'Arte marcial tailandesa completa: golpes, joelhadas e condicionamento de atleta. Aulas para todos os níveis — consulte horários na recepção.',
      imageUrl: '/img/muay-thai.jpg',
      icon: 'Swords',
      order: 9,
      schedules: { create: [] },
    },
    {
      name: 'BOXE',
      description:
        'Técnica de punhos, footwork e condicionamento em treinos que desafiam de verdade. Consulte horários na recepção.',
      imageUrl: '/img/boxe.jpg',
      icon: 'Zap',
      order: 10,
      schedules: { create: [] },
    },
    {
      name: 'BEACH TENNIS',
      description:
        'A moda que conquistou o Brasil — raquete, areia e muita diversão. Turmas e horários na recepção.',
      imageUrl: '/img/beach-tennis.jpg',
      icon: 'Medal',
      order: 11,
      schedules: { create: [] },
    },
    {
      name: 'FUTEVÔLEI',
      description:
        'Quadra de areia para treinar o esporte que mistura futebol e vôlei. Aulas e horários na recepção.',
      imageUrl: '/img/futevolei.jpg',
      icon: 'Medal',
      order: 12,
      schedules: { create: [] },
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
        'Aulas coletivas: Dance, Bike, Jump e Pilates',
        'HYROX e CROWN RUN liberados',
        'Avaliação física mensal',
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
    { url: '/img/cross.jpg', title: 'Aula de CROSS', order: 5 },
    { url: '/img/muay-thai.jpg', title: 'Muay Thai', order: 6 },
    { url: '/img/futevolei.jpg', title: 'Futevôlei', order: 7 },
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
      'Academia completa: musculação, CROSS, HYROX, aulas coletivas, lutas, beach tennis e futevôlei. Aqui, cada treino te aproxima da coroa.',
    heroImageUrl: '/img/hero-crown.png',
    marqueeItems:
      'MUSCULAÇÃO • CROSS • HYROX • CROWN RUN • CROWN DANCE • BIKE • JUMP • PILATES • MUAY THAI • BOXE • BEACH TENNIS • FUTEVÔLEI',
    aboutTitle: 'ACADEMIA COMPLETA. RESULTADO DE VERDADE.',
    aboutText:
      'A CROWN é a academia mais completa de Pinhal-SP: musculação com acesso livre, aulas de CROSS de segunda a domingo, preparação HYROX, coletivas (Dance, Bike, Jump e Pilates), Muay Thai, Boxe, Beach Tennis e Futevôlei. Aceitamos Gympass, TotalPass e Wellhub. Aqui você não treina sozinho — você conquista sua coroa.',
    statsMembers: '850+',
    statsModalities: '12',
    statsTrainers: '12',
    statsYears: '5',
    ctaTitle: '#VEMPRA CROWN',
    ctaText:
      'Escolha sua aula e venha treinar com a gente. Chama no WhatsApp, fala com a recepção e começa sua transformação hoje.',
    address: 'Pinhal-SP',
    phone: '(19) 99150-4548',
    whatsapp: '5519991504548',
    instagram: '@crownpinhal',
    email: 'contato@crownpinhal.com.br',
    hoursText: 'MUSCULAÇÃO: Seg a Sex 5h-22h • Sáb 8h-16h • Dom 8h-14h',
    convenios: 'PLANO FAMÍLIA|PLANO EMPRESA|PLANO HORÁRIO ECONÔMICO|OFICIAIS MILITARES',
    partners: 'GYMPASS|TOTALPASS|WELLHUB',
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
