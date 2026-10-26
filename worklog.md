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
