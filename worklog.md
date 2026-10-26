# CROWN Academia - Worklog

Projeto: Site completo da academia CROWN (Pinhal-SP), tema preto + dourado, Next.js 16 SPA na rota `/`.

## Contratos compartilhados (Task 1 - orchestrator)

### Tipos (src/lib/types.ts)
- `SessionUser`: { id, name, email, phone?, role: 'CLIENT'|'ADMIN'|'OWNER' }
- `ScheduleDTO`: { id, dayOfWeek, startTime, endTime, instructor? }
- `ModalityDTO`: { id, name, description, imageUrl?, icon?, order, active, schedules: ScheduleDTO[] }
- `PlanDTO`: { id, name, description, features: string[], price: number|null, period?, badge?, highlighted, order, active }
- `GalleryDTO`: { id, url, title?, order, active }
- `ContentResponse`: { settings: Record<string,string>, modalities: ModalityDTO[], plans: PlanDTO[], gallery: GalleryDTO[] }

### APIs ( todas retornam JSON; erro = { error: string } + status )
- POST /api/auth/register {name,email,password,phone} → {user: SessionUser}
- POST /api/auth/login {email,password} → {user: SessionUser}
- POST /api/auth/logout → {ok}
- GET  /api/auth/me → {user|null}
- GET  /api/content → ContentResponse
- POST /api/subscriptions {planId, notes?} (requer login) → {subscription}
- GET  /api/subscriptions/mine → {subscriptions}
- Admin (role ADMIN ou OWNER): /api/admin/modalities (+ /api/admin/modalities/[id] PUT/DELETE), /api/admin/schedules (+[id]), /api/admin/plans (+[id]), /api/admin/gallery (+[id]), PUT /api/admin/settings, POST /api/admin/upload (multipart, campo "file") → {url}
- Owner (role OWNER): GET /api/owner/stats, GET /api/owner/users, PUT/DELETE /api/owner/users/[id], GET /api/owner/subscriptions, PUT/DELETE /api/owner/subscriptions/[id]

### Design System CROWN
- Cores: fundo #050505/#0A0A0A, superfícies #111/#161616, borda #262626, ouro #D9A441 (gradiente #F5D488→#C98F2D), texto #FAFAFA/#A3A3A3
- Fontes: Anton (display, uppercase), Oswald (labels/botões uppercase tracking-wide), Inter (corpo)
- Tailwind vars customizadas no globals.css; classes utilitárias: .font-display, .text-gold-gradient, .gold-border, .grain-overlay
- shadcn/ui disponível em src/components/ui; toast via sonner (Toaster em layout)
- Layout: footer sticky (mt-auto), mobile-first, sem azul/indigo

### Credenciais seed
- dono@crown.com / crown123 (OWNER)
- admin@crown.com / admin123 (ADMIN)
- cliente@crown.com / cliente123 (CLIENT)

---
Task ID: 1
Agent: orchestrator (Z.ai Code)
Task: Setup inicial do projeto CROWN

Work Log:
- Copiadas logos enviadas pelo usuário para public/logo-vertical.jpg e public/logo-horizontal.jpg
- Criado prisma/schema.prisma: User, Session, Modality, Schedule, Plan, GalleryImage, Subscription, Setting
- Criado prisma/seed.ts com usuários (OWNER/ADMIN/CLIENT), 8 modalidades com horários, 3 planos sem preço, 4 imagens de galeria, settings padrão
- Pendente: db push + seed (após gerar imagens)

Stage Summary:
- Banco modelado, contratos de API e design system definidos acima para uso por todos os agentes

---
Task ID: 6
Agent: Z.ai Code (admin-panel agent)
Task: Painel Admin + Dashboard do Dono

Work Log:
- Lido worklog.md, src/lib/types.ts, src/lib/store.ts e src/lib/api.ts para alinhar contratos
- Criado src/components/crown/admin/panel-shared.tsx: helpers compartilhados (PanelHeader sticky, PanelNav sidebar/mobile-scroll, FieldLabel dourada, EmptyState, ListSkeleton, TableSkeleton, AccessDeniedCard, ActiveBadge, formatadores pt-BR Intl, DAY_NAMES/DAY_ORDER, classes utilitárias de scrollbar e botões gold/outline)
- Criado src/components/crown/admin/AdminPanel.tsx (default export): 5 tabs funcionais — Modalidades (CRUD + upload com preview, ordem, switch ativo, badge de status/horários), Horários (seletor de modalidade, agrupado por dia Seg→Sáb+Dom, CRUD, inputs type=time), Planos (CRUD, features uma por linha, price vazio=null, delete trata {deactivated:true} com toast.info), Galeria (grid com switch ativa via PUT, upload ou URL manual, delete com AlertDialog), Configurações (form agrupado em 4 seções Hero/Marquee-Sobre/Estatísticas/Contato, heroImageUrl com upload, PUT /api/admin/settings com objeto inteiro)
- Criado src/components/crown/admin/OwnerDashboard.tsx (default export): Tabs Visão Geral/Pedidos/Usuários; KPIs com font-display text-4xl (pedidos pendentes dourados + animate-pulse-gold se >0), Últimos Pedidos (5 recentes, Intl.DateTimeFormat pt-BR), tabela de Pedidos (Table + DropdownMenu Ativar/Pendente/Cancelar/Excluir, recarrega stats), tabela de Usuários com senha em font-mono dourado (Eye/EyeOff global, "—" se null), busca client-side, Redefinir Senha (Dialog → PUT {newPassword}), Alterar Papel (Dialog + Select → PUT {role}), Excluir (AlertDialog → DELETE, toast.error com mensagem do servidor)
- Corrigido lint: removido eslint-disable no-img-element desnecessário (regra off no config) e substituído padrão async/await no useEffect do OverviewTab por .then/.catch com flag cancelled (regra react-hooks/set-state-in-effect)
- Validação: bunx tsc --noEmit sem erros em components/crown; bun run lint 100% limpo (0 erros, 0 warnings)

Stage Summary:
- Arquivos criados: src/components/crown/admin/panel-shared.tsx, src/components/crown/admin/AdminPanel.tsx, src/components/crown/admin/OwnerDashboard.tsx
- Decisões: (1) shared helpers em arquivo irmão para evitar duplicação entre os dois painéis; (2) nenhuma dependência nova — apenas shadcn/ui + lucide-react + sonner + store/api existentes; (3) Guardas de acesso: AdminPanel exige ADMIN/OWNER, OwnerDashboard exige OWNER, ambos com AccessDeniedCard (ShieldAlert + Voltar ao Site); (4) toda mutação chama refreshContent() do store + reload da lista local; (5) datas/números sempre Intl pt-BR; (6) tabs desmontam ao trocar (re-fetch garante dados frescos); (7) listas longas com max-h-[60vh] e scroll customizado; dialogs com max-h-[85vh] overflow-y-auto
- Integração pendente (orquestrador): renderizar <AdminPanel/> quando view==='admin' e <OwnerDashboard/> quando view==='owner' a partir do orquestrador da rota /

---
Task ID: 3,4,5,7
Agent: orchestrator (Z.ai Code)
Task: APIs, design system, site público e integração

Work Log:
- Criadas todas as rotas de API: auth (register/login/logout/me), content, subscriptions (+mine), admin (modalities, schedules, plans, gallery, settings, upload), owner (stats, users, subscriptions)
- Criado src/lib/auth.ts (sessões com token + cookie httpOnly, scrypt), src/lib/types.ts, src/lib/api.ts (helper + uploadImage), src/lib/store.ts (Zustand)
- globals.css com tema CROWN (preto/dourado), layout.tsx com fontes Anton/Oswald/Inter + sonner
- Componentes públicos: AuthGate, AuthModal, SubscribeModal, Navbar, AccountMenu, MySubscriptionsModal, Hero, Marquee, Reveal/SectionTitle, About, Modalities, ScheduleSection, Plans, Gallery, CtaSection, Footer, SiteView
- page.tsx integrado: Splash → AuthGate → SiteView/AdminPanel/OwnerDashboard
- 13 imagens geradas por IA em public/img/ (hero 1344x768, 8 modalidades, 4 galeria)
- Lint: 0 erros 0 warnings; tsc limpo (exceto exemplos/skills pré-existentes)

Stage Summary:
- Site completo funcional; imagens em /img/*; sizes válidos múltiplos de 32 (1440x720 é inválido); geração em paralelo causa 429 (usar sequencial)

---
Task ID: 8
Agent: orchestrator (Z.ai Code)
Task: Verificação end-to-end com Agent Browser

Work Log:
- AuthGate desktop/mobile: tabs Entrar/Criar conta + visitante ✓
- Fluxo visitante → "Quero esse plano" → AuthModal exigindo cadastro ✓
- Cadastro (Aluno Teste) → assinatura CROWN BLACK → pedido PENDENTE → "Meus pedidos" ✓
- Login dono → Dashboard: KPIs, pedido ativado com sucesso, usuários com senhas visíveis ✓
- Painel Admin: CRUD de modalidade testado (criado e removido), Planos/Galeria/Configurações visuais OK ✓
- Upload API testado via curl ✓; Grade de horários com tabs por dia ✓
- Responsividade: 390px e 1280px validados (hero, menu sheet, footer) ✓
- Console sem erros; dev.log sem erros; lint 0/0 ✓

Stage Summary:
- Site 100% funcional e verificado no navegador. 13 imagens IA em public/img. Credenciais: dono@crown.com/crown123, admin@crown.com/admin123, cliente@crown.com/cliente123

---
Task ID: 9
Agent: orchestrator (Z.ai Code)
Task: Integração dos assets reais da marca (logo nova, hero personalizada, fotos reais, horários oficiais)

Work Log:
- Copiadas fotos reais enviadas pelo usuário: public/img/real-entrada.png (recepção) e real-interior.png (sala de musculação)
- Geradas 6 imagens IA (sequencial): logo-crown.png (logo completa melhorada skull+crown+CROWN PINHAL-SP), logo-emblem.png (emblem p/ navbar/footer/favicon), img/hero-crown.png (hero personalizada coroa dourada na parede), img/cross.jpg, img/hyrox.jpg, img/run.jpg — atenção: 1440x720 é inválido (múltiplos de 32), usar 1344x768
- prisma/seed.ts reescrito com dados REAIS: 4 modalidades (Musculação c/ foto real e acesso livre, CROSS, HYROX, CROWN RUN), horários exatos do quadro oficial (CROSS Seg/Qua 5h-8h+16h30-19h30, Ter/Qui/Sex manhã 6h-8h+tarde, Sáb 8h; HYROX Seg 7h, Qua 7h, Dom 9h; CROWN RUN Ter 19h com instructor='Local: Estádio Velho'), galeria com fotos reais primeiro, settings atualizados (hero-crown.png, marquee, sobre, stats 4 modalidades, funcionamento Seg-Sex 5h-22h)
- DB resetado (rm db/custom.db + db:push + seed) — IMPORTANTE: após resetar SQLite é preciso reiniciar o dev server (descritor de arquivo antigo mantém DB velho vivo)
- Componentes atualizados: Splash/AuthGate usam logo-crown.png; layout favicon=logo-emblem.png; Navbar (desktop+sheet) e Footer com lockup emblem + CROWN Pinhal-SP tipográfico; Modalities ICONS += Trophy, Footprints; AuthGate badge "CROSS • HYROX • RUN"

Stage Summary:
- Site com identidade 100% real da CROWN: logo melhorada, hero personalizada com coroa dourada, fotos reais da recepção/interior na galeria e no card de Musculação, grade oficial de horários (40 aulas/semana) com CROSS/HYROX/CROWN RUN
- Verificado no navegador (desktop 1280px + mobile 390px): AuthGate, visitante, hero, modalidades, horários por dia, galeria, footer sticky, login do dono após reset — tudo OK; lint 0/0; console limpo
- Credenciais mantidas: dono@crown.com/crown123 (OWNER), admin@crown.com/admin123 (ADMIN), cliente@crown.com/cliente123 (CLIENT)

---
Task ID: 10
Agent: orchestrator (Z.ai Code)
Task: Logo oficial do usuário em todo o site (sem gerar imagens)

Work Log:
- Copiado upload/logo-horizontal-removebg-preview.png → public/logo.png (PNG oficial com fundo transparente)
- Aparado o excesso de transparente com PIL (conteúdo era 45% do canvas 500x500 → 428x243) para o logo renderizar grande o suficiente
- Substituídas TODAS as 7 referências (logo-crown.png/logo-emblem.png) por /logo.png: Splash (page.tsx), favicon (layout.tsx), AuthGate desktop (w-80) e mobile (h-20), Navbar desktop (h-14/h-11 ao rolar) e Sheet mobile (h-10), Footer (h-16)
- Removidos borders/rounded das logos (PNG transparente) e criado utilitário .gold-drop-glow (drop-shadow que respeita transparência) em globals.css — o antigo gold-glow é box-shadow e desenharia um retângulo brilhante
- Verificado no navegador: portão de acesso, navbar (topo/rolado), menu mobile, footer — logo oficial nítida em todos; lint 0/0; console sem erros

Stage Summary:
- Identidade visual 100% oficial: o PNG enviado pelo usuário é usado em tudo (abertura, login, navbar, menu, footer, favicon); nenhuma imagem de logo gerada por IA está mais em uso nos componentes
- Arquivos antigos logo-crown.png / logo-emblem.png permanecem em public/ apenas como backup (sem referências no código)

---
Task ID: 11
Agent: orchestrator (Z.ai Code)
Task: Mais horários e informações oficiais + identidade visual única (sem arredondados, sem emojis, sem banner feio) + Instagram @crownpinhal + balão WhatsApp 19 99150-4548

Work Log:
- Geradas 4 imagens sequenciais: img/texture-gold.jpg (textura preta com pinceladas douradas estilo flyer), img/muay-thai.jpg, img/beach-tennis.jpg, img/futevolei.jpg
- seed.ts atualizado com dados oficiais: 12 modalidades (Musculação, CROSS, HYROX, CROWN RUN, CROWN DANCE, BIKE, JUMP, PILATES, MUAY THAI, BOXE, BEACH TENNIS, FUTEVÔLEI); CROSS Seg-Sex 6h/7h/8h + 16h30-19h30, Sáb 8h, Dom 9h (quadro oficial); coletivas do flyer (Seg 18h Dance + 18h15 Bike, Ter 18h Jump + 19h Pilates, Qua 18h15 Bike, Qui 18h Jump); 47 aulas/semana; settings com whatsapp 5519991504548, phone (19) 99150-4548, instagram @crownpinhal, hoursText Musculação Seg-Sex 5h-22h/Sáb 8h-16h/Dom 8h-14h, convenios (Família|Empresa|Horário Econômico|Oficiais Militares), partners (Gympass|TotalPass|Wellhub), ctaTitle #VEMPRA CROWN
- globals.css: --radius 0rem (tudo quadrado), utilitários clip-notch/notch-sm/notch-lg/clip-slant/diagonal-stripes, scrollbar quadrada
- Marquee redesenhado: faixa reta (sem rotação, sem fundo dourado grito) com texto Anton alternando sólido/contorno e separador "//" dourado
- Hero: removido Zap (raio) da faixa lateral (agora losangos quadrados), badge quadrado com borda esquerda dourada, stats com borda esquerda
- About: cards de stats em grade com gap-px, imagens quadradas, selo "Desde 2020" quadrado, título com ponto corrigido
- Modalities: cards quadrados com barra dourada no topo no hover, chip de ícone quadrado, "Consulte a recepção" para modalidades sem grade, Medal adicionado ao ICONS
- NOVA seção Coletivas (id=coletivas): grade por dia com cards chanfrados (clip-notch) + fundo texture-gold + benefícios numerados do flyer + "Resultados de verdade"
- ScheduleSection: tabs e cards quadrados com borda esquerda dourada
- Plans: cards quadrados, badges quadrados, checks quadrados + NOVO painel CONVÊNIOS E DESCONTOS (4 itens numerados) + ACEITAMOS Gympass/TotalPass/Wellhub
- CtaSection: fundo texture-gold, título gigante #VEMPRA CROWN, botões CHAMAR NO WHATSAPP + SEGUIR NO INSTAGRAM, WhatsAppIcon SVG oficial exportado
- WhatsAppFloat: balão fixo inferior direito quadrado verde #25D366 com ícone oficial WhatsApp, expande com telefone (19) 99150-4548 no hover desktop, link wa.me com mensagem pré-preenchida
- Footer/Navbar/AuthGate/AccountMenu/modais: todos quadrados; Zap removido do botão Entrar; badge AuthGate "12 MODALIDADES"
- DB resetado (rm + db:push + seed) e dev server reiniciado; login dono testado OK
- Verificado no navegador (1280px + 390px): AuthGate, hero, marquee, sobre, modalidades, coletivas, horários (aba DOM = Cross 9h + Hyrox 9h), planos + convênios, galeria, CTA, footer, menu mobile, balão WhatsApp; links wa.me/5519991504548 e instagram.com/crownpinhal confirmados; lint 0/0; console e dev.log sem erros

Stage Summary:
- Site com identidade brutalista própria preto/dourado: cantos 100% retos com chanfros assinatura, tipografia Anton gigante, marquee reto elegante, textura grunge dourada gerada por IA nas seções
- Informações oficiais completas: 12 modalidades do flyer, 47 aulas/semana do quadro oficial, coletivas com benefícios, convênios/descontos, Gympass/TotalPass/Wellhub, #VemPraCrown
- Contato real: balão WhatsApp fixo (5519991504548) + Instagram @crownpinhal em footer e CTA
- Sem emojis, sem ícones de raio/faísca, sem banner rotacionado, sem cantos arredondados

---
Task ID: 12
Agent: orchestrator (Z.ai Code)
Task: Balão WhatsApp redondo + abandonar o 100% quadrado — formatos e identidade visual únicos (silhueta de coroa)

Work Log:
- Criado src/components/crown/CrownShapes.tsx: CrownEdge (divisor zigue-zague de picos de coroa com stroke dourado opcional e flip), CrownGlyph (3 picos, assinatura dos títulos) e CrownWatermark (coroa grande em traço para fundos)
- globals.css: novos utilitários clip-blade (cortes opostos), clip-tag (chanfro), clip-shield (brasão), clip-peak (pico no topo), clip-hex (joia), clip-arrow-r (flecha), bg-crown-pattern (padrão sutil de picos) e animate-ping-slow
- Sistema de formas coerente: flecha = CTAs primários preenchidos; paralelogramo skew = CTAs outline; chanfro = chips pequenos; escudo = ícones/números; hexágono = stats/convênios; losango = checks/separadores
- WhatsAppFloat redesenhado: balão REDONDO (exceção autorizada) com anel pulsante animate-ping-slow e etiqueta (19) 99150-4548 que desliza no hover desktop
- Hero: marca d'água de coroa gigante, badge/CTAs/stats em paralelogramos com borda preservada (técnica skew + counter-skew)
- Marquee: banda com bordas zigue-zague coroa (stroke dourado) topo+base e separadores de losango dourado
- SectionTitle: CrownGlyph dourado como assinatura sob todos os títulos
- About: ícones em chips hexagonais 2 camadas, 1ª imagem clip-blade, bloco "Treine como rei" com pico de coroa (clip-peak), selo "Desde 2020" inclinado
- Modalities: cards clip-blade sem borda + ícones em escudos dourados
- Coletivas: cards blade 2 camadas (moldura ouro no hover), números de benefícios em escudos
- ScheduleSection: CrownEdge no topo, padrão bg-crown-pattern, aba ativa chanfrada via clip-path, horários em chips clip-tag ouro
- Plans: cards blade 2 camadas (moldura ouro no destacado com gold-drop-glow que respeita o recorte), badges inclinados, checks em losangos, convênios numerados em hexágonos, pills Gympass/TotalPass/Wellhub chanfradas
- CtaSection: CrownEdge topo, watermark central, botão WhatsApp em flecha + Instagram em paralelogramo
- Gallery: fotos clip-blade sem borda + CrownEdge no topo
- Footer: CrownEdge com stroke dourado coroando o rodapé, Instagram @crownpinhal em botão ouro inclinado + botão WhatsApp verde inclinado, bloco CROWN PINHAL-SP inclinado
- AuthGate: card blade 2 camadas, glifos de coroa, botão submit em flecha, visitante em paralelogramo, watermark no painel da marca
- Verificações: grep sem emojis em src e seed; lint 0/0; browser desktop 1280px (AuthGate, hero, marquee, sobre, modalidades, coletivas, horários com padrão, planos, galeria, CTA, footer com edge coroa, login dono OK) e mobile 390px (hero, CTA, menu Sheet, balão redondo); console e dev.log sem erros

Stage Summary:
- Identidade visual própria consolidada: a silhueta de COROA (zigue-zague de picos) costura todas as seções, e um sistema de formatos angulares exclusivos (lâmina, escudo, hexágono, losango, flecha, paralelogramo) substituiu o visual 100% quadrado
- Único elemento redondo do site: o balão do WhatsApp (19 99150-4548), conforme autorizado pelo cliente
- Nenhum rounded-* reintroduzido; emojis continuam zerados; Instagram e WhatsApp mantidos em destaque

---
Task ID: 13
Agent: orchestrator (Z.ai Code)
Task: Splash sem quadrado de fundo (só a logo PNG) + remoção de TODOS os bordões inventados — somente informações reais

Work Log:
- Splash (page.tsx): removido wrapper animate-pulse-gold (box-shadow desenhava o retângulo brilhante ao redor da logo); agora é apenas <img src="/logo.png"> transparente com gold-drop-glow (drop-shadow que segue a forma da marca) + animate-pulse de opacidade; texto "Carregando o império..." → "Carregando..." (funcional)
- Bordões inventados removidos e substituídos por informações reais:
  - page.tsx: "Carregando o império..." → "Carregando..."
  - layout.tsx: meta description sem "Treine como um rei"
  - AuthGate: "Bem-vindo ao império" → "Bem-vindo à CROWN"; h1 "Sua coroa não se ganha. Ela se conquista." → "12 modalidades. 7 dias por semana."; removido "academia mais completa de Pinhal-SP"; chip "Academia completa" → "7 DIAS POR SEMANA"
  - Hero: heroTitle "TREINE COMO UM REI" → "CROWN\nPINHAL-SP" (quebra limpa com whitespace-pre-line); subtitle factual; stats 850+ alunos/12 treinadores → 47 aulas por semana / 12 modalidades / 7 dias por semana
  - About: título "ACADEMIA COMPLETA. RESULTADO DE VERDADE." → "ACADEMIA COMPLETA. TUDO EM UM SÓ LUGAR."; texto factual (modalidades + convênios); bloco "Treine como rei" → bloco dourado clip-peak com HORÁRIOS REAIS (dinâmico de settings.hoursText); selo "Desde 2020" removido; ícones dos stats atualizados (Dumbbell/CalendarCheck/Clock/Sunrise)
  - Coletivas: "TREINE JUNTO, EVOLUA JUNTO" → "AULAS COLETIVAS"; subtitle factual; linha "Resultados de verdade" removida
  - Plans: eyebrow "Invista em você" → "Planos CROWN"; subtitle factual; descrições dos 3 planos sem bordões ("O plano favorito da nossa coroa" / "sem limites" → descrições factuais); seed agora atualiza planos existentes (update por nome)
  - CtaSection: "#VEMPRA CROWN" (hashtag inventada) → "VENHA TREINAR NA CROWN" (última palavra em ouro, "#" hardcoded removido); ctaText factual
  - Footer: description factual; fallback de endereço "Av. dos Reis, 1234" (FAKE) → "Pinhal-SP"; telefone fallback real (19) 99150-4548; e-mail inventado contato@crownpinhal.com.br removido (seed email='' e linha só renderiza se preenchida); "Sua coroa não se ganha..." → "CROSS • HYROX • CROWN RUN"; rodapé "Treine como um rei" → "12 modalidades • 7 dias por semana"
  - MySubscriptionsModal: "Escolha um plano e vista a coroa!" → "Escolha um plano para assinar."
  - OwnerDashboard: "Visão geral do império CROWN" → "Visão geral CROWN"
  - AdminPanel: placeholder "ex.: Desde 2005" → "ex.: ACADEMIA CROWN • PINHAL-SP"; labels dos stats atualizados (Aulas por Semana / Modalidades / Dias por Semana / Abertura)
- seed.ts: comentário "bordões NÃO permitidos — somente informações reais"; settings com valores reais; upsert com update:{value} para re-seed atualizar o DB existente (antes update:{} mantinha dados velhos); re-seed executado 2x (settings + planos)
- Verificação: grep sem bordões em src (só comentários técnicos de design restam); API /api/content retorna dados reais; browser desktop 1280px (AuthGate, hero CROWN/PINHAL-SP em 2 linhas, sobre com bloco de horários, coletivas, planos, CTA "VENHA TREINAR NA CROWN", footer completo) + mobile 390px (hero, footer até a barra final, balão redondo); splash capturada em aba nova — logo transparente sem retângulo + "CARREGANDO..."; lint 0/0; console e dev.log sem erros

Stage Summary:
- Splash = apenas a logo oficial em PNG transparente (sem quadrado, sem box-shadow) + "Carregando..."
- Site 100% livre de bordões inventados: todo texto é informação real (nome CROWN Pinhal-SP, 12 modalidades, 47 aulas/semana, 7 dias, horários oficiais, contatos reais, convênios e parceiros do flyer)
- Números falsos (850+ alunos, 12 treinadores, 5 anos), ano fictício (Desde 2020), endereço fake (Av. dos Reis) e e-mail não confirmado removidos do site
- IMPORTANTE para próximos agentes: nunca criar bordões/frases de marketing — só usar dados reais fornecidos pelo cliente; settings agora se atualizam no re-seed (update:{value}); planos idem (update por nome)
