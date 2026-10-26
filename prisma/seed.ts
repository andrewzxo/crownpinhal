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
    if (!existing) {
      // seed é NÃO destrutivo: só cria o que falta. Edições feitas no admin NUNCA são sobrescritas.
      await prisma.modality.create({
        data: m as never,
      })
    }
  }

  // ---------- Planos (PREÇOS REAIS — flyer oficial "Planos e Valores" + "Planos Crown Club") ----------
  const plansData = [
    {
      name: 'CROWN GOLD',
      description: 'CROSS + Musculação | CROSS + Artes Marciais | Musculação + Arte Marcial',
      features: JSON.stringify([
        'CROSS + Musculação',
        'CROSS + Artes Marciais',
        'Musculação + Arte Marcial',
      ]),
      price: 269,
      period: 'mês',
      priceOptions: JSON.stringify([
        { label: 'MENSAL', price: 269 },
        { label: 'SEMESTRAL', price: 209 },
        { label: 'ANUAL', price: 189 },
      ]),
      badge: '2 MODALIDADES',
      highlighted: true,
      order: 1,
    },
    {
      name: 'MUSCULAÇÃO LIVRE',
      description: 'Musculação com acesso livre durante todo o funcionamento da academia.',
      features: JSON.stringify([
        'Acesso livre à musculação',
        'Seg a Sex 5h às 22h',
        'Sáb 8h-16h • Dom 8h-14h',
      ]),
      price: 159,
      period: 'mês',
      priceOptions: JSON.stringify([
        { label: 'MENSAL', price: 159 },
        { label: 'SEMESTRAL', price: 139 },
        { label: 'ANUAL', price: 119 },
      ]),
      badge: null,
      highlighted: false,
      order: 2,
    },
    {
      name: 'CROSS 2X NA SEMANA',
      description: 'Cross Training com 2 aulas por semana na grade oficial.',
      features: JSON.stringify([
        '2 aulas de CROSS por semana',
        'Programação @herculesfunctional',
      ]),
      price: 149,
      period: 'mês',
      priceOptions: JSON.stringify([
        { label: 'MENSAL', price: 149 },
        { label: 'SEMESTRAL', price: 119 },
        { label: 'ANUAL', price: 109 },
      ]),
      badge: null,
      highlighted: false,
      order: 3,
    },
    {
      name: 'CROSS ILIMITADO',
      description: 'Cross Training ilimitado: treine em todos os horários da grade.',
      features: JSON.stringify([
        'CROSS ilimitado na grade semanal',
        'Programação @herculesfunctional',
      ]),
      price: 209,
      period: 'mês',
      priceOptions: JSON.stringify([
        { label: 'MENSAL', price: 209 },
        { label: 'SEMESTRAL', price: 169 },
        { label: 'ANUAL', price: 149 },
      ]),
      badge: null,
      highlighted: false,
      order: 4,
    },
    {
      name: 'ARTES MARCIAIS',
      description: 'Boxe e/ou Muay Thai — escolha uma modalidade ou faça as duas.',
      features: JSON.stringify(['Boxe', 'Muay Thai', 'Uma ou as duas modalidades']),
      price: 159,
      period: 'mês',
      priceOptions: JSON.stringify([
        { label: 'MENSAL', price: 159 },
        { label: 'TRIMESTRAL', price: 119 },
      ]),
      badge: null,
      highlighted: false,
      order: 5,
    },
    {
      name: 'CROWN CYCLING',
      description: 'Aula de Spinning (cycling indoor) da CROWN.',
      features: JSON.stringify(['Aulas de spinning (cycling indoor)']),
      price: 109,
      period: 'mês',
      priceOptions: JSON.stringify([
        { label: 'MENSAL', price: 109 },
        { label: 'TRIMESTRAL', price: 99 },
      ]),
      badge: null,
      highlighted: false,
      order: 6,
    },
    {
      name: 'BEACH TENNIS',
      description: 'Quadras de areia da CROWN, com 1x ou 2x na semana.',
      features: JSON.stringify([
        'Quadras de areia da CROWN',
        'Pós-jogo no Arena Beach Bar',
      ]),
      price: 199,
      period: 'mês',
      priceOptions: JSON.stringify([
        { label: 'MENSAL • 1X/SEM', price: 199 },
        { label: 'MENSAL • 2X/SEM', price: 299 },
        { label: 'TRIMESTRAL • 1X/SEM', price: 169 },
        { label: 'TRIMESTRAL • 2X/SEM', price: 259 },
      ]),
      badge: null,
      highlighted: false,
      order: 7,
    },
    {
      name: 'FUTEVÔLEI',
      description: 'Quadras de areia da CROWN, com 1x ou 2x na semana.',
      features: JSON.stringify([
        'Quadras de areia da CROWN',
        'Pós-jogo no Arena Beach Bar',
      ]),
      price: 139,
      period: 'mês',
      priceOptions: JSON.stringify([
        { label: 'MENSAL • 1X/SEM', price: 139 },
        { label: 'MENSAL • 2X/SEM', price: 199 },
        { label: 'TRIMESTRAL • 1X/SEM', price: 119 },
        { label: 'TRIMESTRAL • 2X/SEM', price: 179 },
      ]),
      badge: null,
      highlighted: false,
      order: 8,
    },
    {
      name: 'CROWN CLUB A',
      description: 'Musculação + CROSS + Artes Marciais',
      features: JSON.stringify(['Musculação', 'CROSS', 'Artes Marciais']),
      price: 379,
      period: 'mês',
      priceOptions: JSON.stringify([
        { label: 'MENSAL', price: 379 },
        { label: 'SEMESTRAL', price: 329 },
        { label: 'ANUAL', price: 269 },
      ]),
      badge: '3 MODALIDADES',
      highlighted: false,
      order: 9,
    },
    {
      name: 'CROWN CLUB B',
      description: 'Musculação + CROSS + Areia',
      features: JSON.stringify(['Musculação', 'CROSS', 'Areia']),
      price: 409,
      period: 'mês',
      priceOptions: JSON.stringify([
        { label: 'MENSAL', price: 409 },
        { label: 'SEMESTRAL', price: 359 },
        { label: 'ANUAL', price: 319 },
      ]),
      badge: '3 MODALIDADES',
      highlighted: false,
      order: 10,
    },
    {
      name: 'CROWN CLUB C',
      description: 'Musculação + CROSS + Artes Marciais + Areia',
      features: JSON.stringify(['Musculação', 'CROSS', 'Artes Marciais', 'Areia']),
      price: 519,
      period: 'mês',
      priceOptions: JSON.stringify([
        { label: 'MENSAL', price: 519 },
        { label: 'SEMESTRAL', price: 469 },
        { label: 'ANUAL', price: 399 },
      ]),
      badge: '4 MODALIDADES',
      highlighted: false,
      order: 11,
    },
    {
      name: 'CROWN CLUB D',
      description: 'Musculação + Areia | ou Arte Marcial + Areia | ou CROSS + Areia',
      features: JSON.stringify([
        'Musculação + Areia',
        'Ou Arte Marcial + Areia',
        'Ou CROSS + Areia',
      ]),
      price: 289,
      period: 'mês',
      priceOptions: JSON.stringify([
        { label: 'MENSAL', price: 289 },
        { label: 'SEMESTRAL', price: 269 },
        { label: 'ANUAL', price: 229 },
      ]),
      badge: '2 MODALIDADES',
      highlighted: false,
      order: 12,
    },
    {
      name: 'DAY USE',
      description: 'Acesso à academia por hora, sem mensalidade.',
      features: JSON.stringify([]),
      price: 100,
      period: 'day use',
      priceOptions: JSON.stringify([
        { label: '1 HORA', price: 100 },
        { label: '2 HORAS', price: 170 },
        { label: '3 HORAS', price: 250 },
      ]),
      badge: null,
      highlighted: false,
      order: 13,
    },
  ]

  for (const p of plansData) {
    const existing = await prisma.plan.findFirst({ where: { name: p.name } })
    if (!existing) {
      // seed é NÃO destrutivo: só cria o que falta. Preços editados no admin ficam intactos.
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
  // NÃO destrutivo: settings editados pelo admin NUNCA são sobrescritos pelo seed.
  const settings: Record<string, string> = {
    // HERO — slogan real da CROWN ("Conectando pessoas através do fitness")
    heroBadge: 'FITNESS & LIFESTYLE • ESPÍRITO SANTO DO PINHAL-SP',
    heroTitle: 'CONECTANDO\nPESSOAS\nATRAVÉS DO\nFITNESS',
    heroHighlight: 'FITNESS',
    heroSubtitle:
      'Um espaço completo para o seu Fitness & Lifestyle: treino, saúde e convivência no coração de Pinhal.',
    heroImageUrl: '/img/hero-crown.png',
    // SOBRE A VIBE CROWN — conceito real: "Um espaço completo para o seu Fitness & Lifestyle. Conectando pessoas através do fitness."
    aboutTitle: 'MAIS QUE UMA ACADEMIA. SEU FITNESS & LIFESTYLE.',
    aboutText:
      'Um ambiente acolhedor, focado em rotina e comunidade — ambiente inteiro na mesma energia. Conectando pessoas através do fitness: treino, saúde e convivência além do ferro. Treina na CROWN, joga nas quadras de areia e fecha o dia no Arena Beach Bar.',
    statsMembers: '47',
    statsModalities: '12',
    statsTrainers: '7',
    statsYears: '5h',
    // CTA — campanha real "7 Dias Grátis"
    ctaEyebrow: 'CROWN PINHAL-SP',
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
    convenios:
      'PLANO FAMÍLIA / PLANO EMPRESA → 10% DE DESCONTO|HORÁRIO ECONÔMICO (SEG A SEX 13H ÀS 16H • FINS DE SEMANA LIVRES) → 30% DE DESCONTO|OFICIAIS MILITARES → 20% DE DESCONTO|ESTACIONAMENTO → GRÁTIS PARA OS ALUNOS CROWN',
    partners: 'WELLHUB (ANTIGO GYMPASS)|TOTALPASS',
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
