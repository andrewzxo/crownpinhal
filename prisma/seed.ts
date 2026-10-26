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
        'Musculação completa com área de força e cardio, professores na casa e acesso livre durante todo o funcionamento: Seg a Sex 5h às 22h • Sáb 8h às 16h • Dom 8h às 14h.',
      imageUrl: '/img/real-interior.png',
      icon: 'Dumbbell',
      order: 1,
      schedules: { create: [] },
    },
    {
      name: 'CROSS',
      description:
        'O treino mais intenso da CROWN, com programação de afiliados @herculesfunctional. Força, resistência e condicionamento de verdade — manhã e noite, toda semana.',
      imageUrl: '/img/cross.jpg',
      icon: 'Flame',
      order: 2,
      schedules: { create: buildSchedules(CROSS_TIMES) },
    },
    {
      name: 'HYROX',
      description:
        'A CROWN é afiliada oficial HYROX Brasil. Preparação completa para a prova: corrida, sled push, wall balls, burpees e mais. Para competir ou explodir o condicionamento.',
      imageUrl: '/img/hyrox.jpg',
      icon: 'Trophy',
      order: 3,
      schedules: { create: buildSchedules(HYROX_TIMES) },
    },
    {
      name: 'CROWN RUN',
      description:
        'O treino de corrida da CROWN. Toda terça-feira às 19h no Estádio Velho. Corra com a comunidade, melhore seu ritmo e sua resistência.',
      imageUrl: '/img/run.jpg',
      icon: 'Footprints',
      order: 4,
      schedules: { create: buildSchedules(RUN_TIMES, 'Local: Estádio Velho') },
    },
    {
      name: 'CROWN DANCE',
      description:
        'Ritmos que queimam calorias sem parecer treino. Cardio, dança e energia coletiva em uma aula só. Toda segunda às 18h.',
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
        'Cardio de alto rendimento com leveza para as articulações. A aula divertida que assusta a balança. Terça e quinta às 18h.',
      imageUrl: '/img/jump.jpg',
      icon: 'Activity',
      order: 7,
      schedules: { create: buildSchedules(JUMP_TIMES) },
    },
    {
      name: 'PILATES',
      description:
        'Força, flexibilidade, postura e respiração. A aula que equilibra o corpo e a mente. Toda terça às 19h.',
      imageUrl: '/img/pilates.jpg',
      icon: 'Sparkles',
      order: 8,
      schedules: { create: buildSchedules(PILATES_TIMES) },
    },
    {
      name: 'MUAY THAI',
      description:
        'Lutas na CROWN: arte marcial tailandesa completa — golpes, joelhadas e condicionamento de atleta. Aulas para todos os níveis.',
      imageUrl: '/img/muay-thai.jpg',
      icon: 'Swords',
      order: 9,
      schedules: { create: [] },
    },
    {
      name: 'BOXE',
      description:
        'Técnica de punhos, footwork e condicionamento em treinos que desafiam de verdade. Uma das lutas da CROWN — venha testar.',
      imageUrl: '/img/boxe.jpg',
      icon: 'Zap',
      order: 10,
      schedules: { create: [] },
    },
    {
      name: 'BEACH TENNIS',
      description:
        'Quadras de areia integradas para jogar a modalidade que conquistou o Brasil. E o pós-jogo? Porções e bebidas no Arena Beach Bar.',
      imageUrl: '/img/beach-tennis.jpg',
      icon: 'Medal',
      order: 11,
      schedules: { create: [] },
    },
    {
      name: 'FUTEVÔLEI',
      description:
        'Futebol + vôlei na areia da CROWN. Quadras de areia integradas e o pós-jogo garantido no Arena Beach Bar.',
      imageUrl: '/img/futevolei.jpg',
      icon: 'Medal',
      order: 12,
      schedules: { create: [] },
    },
  ]

  for (const m of modalitiesData) {
    const existing = await prisma.modality.findFirst({ where: { name: m.name } })
    if (existing) {
      // re-seed atualiza descrições/imagens — NÃO toca em schedules (evita duplicar horários)
      await prisma.modality.update({
        where: { id: existing.id },
        data: { description: m.description, imageUrl: m.imageUrl, icon: m.icon, order: m.order, active: true },
      })
    } else {
      await prisma.modality.create({
        data: m as never,
      })
    }
  }

  // ---------- Planos ----------
  const plansData = [
    {
      name: 'CROWN START',
      description: 'Musculação com avaliação física e planilha de treino.',
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
      description: 'Musculação, CROSS, aulas coletivas, HYROX e CROWN RUN.',
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
      description: 'Tudo do CROWN BLACK com personal trainer e nutricionista.',
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
    if (existing) {
      await prisma.plan.update({ where: { id: existing.id }, data: p })
    } else {
      await prisma.plan.create({ data: p })
    }
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
  // IMPORTANTE: bordões/frases de marketing inventadas NÃO são permitidas —
  // somente informações reais da academia (nome, modalidades, horários, contatos).
  const settings: Record<string, string> = {
    // HERO — slogan real da CROWN ("Conectando pessoas através do fitness")
    heroBadge: 'FITNESS & LIFESTYLE • ESPÍRITO SANTO DO PINHAL-SP',
    heroTitle: 'CONECTANDO\nPESSOAS\nATRAVÉS DO\nFITNESS',
    heroHighlight: 'FITNESS',
    heroSubtitle:
      'Musculação, CROSS, HYROX oficial, lutas, aulas coletivas, corrida e quadras de areia. Um espaço completo para o seu Fitness & Lifestyle no coração de Pinhal.',
    heroCtaNote: '7 dias grátis para novos alunos testarem a estrutura • das 5h às 16h',
    heroImageUrl: '/img/hero-crown.png',
    marqueeItems:
      'MUSCULAÇÃO • CROSS • HYROX • CROWN RUN • CROWN DANCE • BIKE • JUMP • PILATES • MUAY THAI • BOXE • BEACH TENNIS • FUTEVÔLEI',
    // SOBRE A VIBE CROWN — conceito real: "Um espaço completo para o seu Fitness & Lifestyle. Conectando pessoas através do fitness."
    aboutTitle: 'MAIS QUE UMA ACADEMIA. SEU FITNESS & LIFESTYLE.',
    aboutText:
      'Um ambiente acolhedor, focado em rotina e comunidade — ambiente inteiro na mesma energia. Conectando pessoas através do fitness: treino, saúde e convivência além do ferro. Treina na CROWN, joga nas quadras de areia e fecha o dia no Arena Beach Bar.',
    statsMembers: '47',
    statsModalities: '12',
    statsTrainers: '7',
    statsYears: '5h',
    // CTA — campanha real "7 Dias Grátis" + "Projeto Verão Crown — 90 dias pra mudar"
    ctaEyebrow: 'PROJETO VERÃO CROWN — 90 DIAS PRA MUDAR',
    ctaTitle: 'COMEÇA COM 7 DIAS GRÁTIS',
    ctaText:
      'Novos alunos testam toda a estrutura das 5h às 16h. Agende sua aula experimental pelo WhatsApp ou pelo hub da CROWN — é rápido.',
    // CONTATO E LOCALIZAÇÃO — registros oficiais
    address: 'Av. Washington Luís, 45 — Espírito Santo do Pinhal-SP',
    addressNote: 'A ~700m da Praça Nestor de Almeida Vergueiro • CEP 13990-000',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Crown+Pinhal,+Av.+Washington+Lu%C3%ADs,+45,+Esp%C3%ADrito+Santo+do+Pinhal+-+SP',
    cnpj: 'Lrt Atividades em Condicionamento Fisico LTDA • CNPJ 57.249.247/0001-63',
    phone: '(19) 99150-4548',
    whatsapp: '5519991504548',
    whatsappMsg: 'Olá! Quero agendar meus 7 dias grátis na CROWN.',
    instagram: '@crownpinhal',
    beaconsUrl: 'https://beacons.ai/crownpinhal',
    ticketbroUrl: 'https://crown-gym-pinhal.ticketbro.com/',
    email: '',
    hoursText: 'MUSCULAÇÃO: Seg a Sex 5h-22h • Sáb 8h-16h • Dom 8h-14h',
    convenios: 'PLANO FAMÍLIA|PLANO EMPRESA|PLANO HORÁRIO ECONÔMICO|OFICIAIS MILITARES',
    partners: 'GYMPASS|TOTALPASS|WELLHUB',
  }

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
  }

  console.log('Seed concluído!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
