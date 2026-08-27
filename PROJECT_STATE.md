# Estado do Projeto — Plataforma de Inglês

> **Para uma sessão nova do Claude Code**: leia este ficheiro primeiro, depois `docs/decisions.md` (histórico de decisões técnicas) e `docs/10-scope-mvp1.md` (o que está dentro/fora do MVP1). Este ficheiro deve ser atualizado sempre que houver uma mudança relevante na app — não deixar desatualizado.

Última atualização: 2026-08-26, **mega expansão de conteúdo** (pedido explícito: vocabulário +20000 palavras, gramática, verbos, construção frásica) — banco de vocabulário standalone (~135 palavras, ~159 no total), verbos irregulares (`/practice/verbs`, 51 verbos + verbo do dia), construção frásica (`/practice/patterns`, 8 padrões de ordem de palavras). **20.000 palavras não é realista escrever à mão numa sessão** — decisão de honestidade explicada ao utilizador e em `docs/decisions.md`, expansão real em vez de volume fabricado. Antes disso: 2ª lição A2 (Must/Have To/Should). Antes disso: **lista de 19 melhorias fechada** (pedido explícito: "todas de uma só vez") — Modo Imersão, Leitura Facilitada, Cultura (`/practice/culture`), Idioma do Dia (`/practice/idioms`), voz mais natural no PlayTranscript, entrevista por setor, analytics básico (`AnalyticsEvent` finalmente usado), certificação interna (`/verify/[code]`, sem QR real — sem lib disponível), PWA com cache do shell estático, fundação de A2 (9ª lição). Ver `docs/decisions.md` para o que ficou honestamente por fazer (#19 comunidade, #6 A2 "completo") e porquê. **Nenhum commit desde `b583b7a` foi validado por build real** (deploys pausados, ver aviso abaixo) — revistos com cuidado extra, confirmar com um build assim que possível.

### ⚠️ Deploys da Netlify pausados até 2026-09-01 (créditos gratuitos esgotados)
O plano Free da Netlify tem 300 créditos/mês; esgotaram-se hoje (muitos deploys triggados nesta sessão longa). Commit `3753fb3` (e todos os seguintes) ficam "Canceled" em vez de publicar — **o código está no GitHub, só não constrói**. O site continua online normalmente na última versão publicada (`b583b7a`). Reinicia automaticamente a 1 de setembro de 2026 (ciclo de faturação corre 1-31 de cada mês) — nenhuma ação necessária, os pushes acumulados publicam-se sozinhos assim que os créditos renovarem. Alternativa (não usada, quebraria o requisito de custo zero): upgrade de plano, só com autorização explícita do utilizador. **Numa sessão nova antes de 2026-09-01**: não há forma de verificar deploys ao vivo — continuar a codificar/commitar/fazer push normalmente, mas rever o código com mais cuidado (sem o build da Netlify a apanhar erros de TypeScript em tempo real) e avisar já no início da sessão que os deploys estão pausados, sem repetir esta investigação.

### UX dos quizzes (correção de UX pedida pelo utilizador após testar)
Feedback imediato (Verificar → correto/incorreto + resposta certa → Seguinte) no Desafio Diário e Diagnóstico Semanal, TRANSLATION deixou de ficar de fora dos testes (vira pergunta de texto), Sheets de tema (`/practice/topic`) para escolher o que praticar, cor por pilar nos quizzes. Ver `docs/decisions.md`.

### Nota técnica — clicar em elementos da UI da Netlify via browser automation
A navegação por `find`/`ref` na consola da Netlify revelou-se instável (refs ficam obsoletos entre re-renders, timeouts de screenshot frequentes nesta página em concreto). **Solução mais fiável**: usar `javascript_tool` para localizar e clicar elementos diretamente no DOM (`document.querySelectorAll`, filtrar por `offsetParent !== null` para apanhar só o elemento visível/ativo, `.click()`), e para editar inputs React controlados usar o setter nativo do `HTMLInputElement.prototype` antes de disparar o evento `input` (`Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, valor)`). Preferir este método a `find`/`computer` para esta consola específica.

## 1. O que é isto

App de aprendizagem de inglês para adultos falantes de português, CEFR Pre-A1→C2 (MVP1 cobre Pre-A1/A1). Ver `docs/00-visao-proposta-valor.md` para a visão completa e `docs/10-scope-mvp1.md` para o scope exato.

O utilizador (dono do projeto) **não instala nada localmente** — não tem Node.js, não sabe programar, Netlify, Supabase nem GitHub. Todo o ciclo de trabalho é: Claude edita código → `git push` → Netlify constrói e publica automaticamente → Claude verifica o log de build via browser e corrige o que falhar → repete até passar.

## 2. Estado atual (o que já está em produção)

- **Site em produção**: https://english-platafform.netlify.app (projeto Netlify renomeado pelo utilizador; o nome interno do site pode aparecer como `english-platafform` nalguns URLs da consola Netlify)
- **Repositório**: https://github.com/armandolacerda19-dotcom/EnglishClass (branch `main`, deploy contínuo automático a cada push)
- **Base de dados**: Supabase (`ingles-platafform`, projeto `cuvvsmqicvyewisshjoo`), Postgres via Prisma
- **IA**: Google Gemini (`gemini-2.0-flash`) — nível gratuito, ver `docs/decisions.md` (pivot de custo zero)
- **Speech-to-text e text-to-speech**: 100% no browser (Web Speech API), sem custo, sem serviço externo
- **Deploy**: `netlify.toml` corre `npx prisma generate && npx prisma db push --accept-data-loss && npx tsx prisma/seed.ts && npm run build` a cada push para `main`

### Fluxo funcional confirmado em produção (testado pelo utilizador)
- Landing page, signup, login
- Onboarding (objetivo, Standard/Intensive, tempo disponível, perfil)
- Placement test adaptativo (8 pilares)
- Currículo: **5 lições completas** seedadas (ver secção 4)
- AI Tutor ("The Coach") via Gemini
- Progress (octógono de competência, XP, streak, conquistas, checkpoints)
- Desafio Diário de vocabulário + Micro-Desafios (deploy `c67143e`/seguintes — ainda não confirmado pelo utilizador em produção, ver secção 6)
- Privacidade RGPD (exportar/eliminar dados)
- Instalação como app (PWA) — manifest + service worker mínimo, confirmado publicado e a funcionar (service worker registado em produção)
- Revisão espaçada real (SRS/SM-2) — `/practice/review`
- Octógono de competência vivo (atualiza com a prática, já não fica congelado no placement test)
- Diagnóstico Semanal (`/practice/weekly-test`), AI Tutor com 4 personalidades (`/speak`), collocations visíveis, 6 conquistas novas

### Histórico de deploy — lições aprendidas (não repetir)
Passámos por vários ciclos de build falhado antes do primeiro deploy bem-sucedido. Erros já corrigidos, não os reintroduzir:
1. `DIRECT_URL`/`DATABASE_URL` vazias → sempre confirmar que as env vars da Netlify têm mesmo valor (não só o nome criado) antes de assumir que um erro é de código.
2. Erro de tipo Prisma: `goal` do `IntensivePlan.update()` era `string`, não o enum `Goal` — usar cast explícito (`as any`) quando se passa um objeto solto a um `update`/`create` do Prisma cujos campos são enums.
3. `noUncheckedIndexedAccess` (tsconfig) torna `array[index]` em `T | undefined` — qualquer acesso posicional (`PLACEMENT_QUESTIONS[index]`, `lesson.steps[stepIndex]`) precisa de `!` ou de um guard explícito.
4. Callbacks `setAll(cookiesToSet)` do Supabase SSR precisam de tipo explícito (`{ name: string; value: string; options: CookieOptions }[]`) — TS estrito não infere `any` automaticamente.
5. Um valor colado manualmente numa env var da Netlify pode ficar corrompido (ex. caráter "•" residual do campo mascarado) — se aparecer um erro tipo "Cannot convert argument to a ByteString", suspeitar logo de env var corrompida, não de bug de código.

## 3. Stack e onde encontrar cada coisa

| Camada | Ferramenta | Ficheiro/pasta chave |
|---|---|---|
| Frontend/Backend | Next.js 14 App Router | `src/app/` |
| BD | Prisma + Supabase Postgres | `prisma/schema.prisma` |
| Auth | Supabase Auth (SSR) | `src/lib/supabase/`, `src/middleware.ts` |
| IA | Google Gemini | `src/lib/ai/gemini.ts` |
| Conteúdo curricular | JSON versionado | `content/curriculum/*.json`, seed em `prisma/seed.ts` |
| Design system | Tailwind + tokens | `tailwind.config.ts`, `docs/09-sistema-design.md` |
| Documentação Fase 0 | — | `docs/00-*.md` a `docs/11-*.md` |
| Decisões (log vivo) | — | `docs/decisions.md` — **atualizar sempre que uma decisão técnica mudar** |
| Deploy | Netlify | `netlify.toml` |

## 4. Conteúdo curricular seedado (10 lições — 8× A1 + 2× A2)

| Sublevel | Módulo | Conceito de gramática | Erro PT→EN destacado |
|---|---|---|---|
| Pre-A1 | First Words | Verbo "to be" | "I have 38 years" → "I am 38 years old" |
| A1.1 | Daily Life | Present Simple | Esquecer o -s na 3ª pessoa |
| A1.1 | About Me | Perguntas com Do/Does | "You like coffee?" → "Do you like coffee?" |
| A1.2 | Shopping | There is/There are | "há" invariável em PT vs. singular/plural em EN |
| A1.3 | Comparing Things | Comparativos | "more cheap" → "cheaper"; "more good" → "better" |
| A1.2 | At the Restaurant | Pedidos educados (Can/Could) | "I want a coffee" → "Can I have a coffee, please?" |
| A1.3 | Yesterday | Past Simple (regular/irregular) | "I go to the beach yesterday" → "I went to the beach yesterday" |
| A1.3 | Making Plans | Futuro com "going to" | "I going to travel" → "I am going to travel" |
| A2.1 | Life Experiences | Present Perfect (experiência) | "I visited Paris" (sem data) → "I have visited Paris" |
| A2.1 | Rules and Obligations | Must/Have To/Should | "You must drink more water" (conselho leve) → "You should drink more water" |

**Nota sobre A2**: só 2 módulos — é o início do nível, não um currículo A2 completo (isso é o item #6 da lista de melhorias, sinalizado como "fundação, não conclusão" em `docs/decisions.md`). `levels.json` já tem A2.1/A2.2/A2.3 definidos, prontos para mais módulos numa sessão futura.

~24 itens de vocabulário nestes módulos + **~135 no banco standalone** (`content/curriculum/vocabulary-bank.json`, `seedVocabularyBank()` em `prisma/seed.ts`) = **~159 no total**. Ver `content/curriculum/` para o JSON completo de cada um. Cada módulo novo alimenta automaticamente o Diagnóstico Semanal e as Sheets de tema (`/practice/topic`), que reutilizam os `Exercise` já seedados — mais conteúdo = mais variedade nesses dois sítios sem precisar de código novo. O banco standalone alimenta diretamente o Desafio Diário e a Revisão (SRS), sem precisar de lição/módulo associado — ver `docs/decisions.md` para a decisão de não fabricar 20.000 palavras sem verificação.

Também: **verbos irregulares** (`src/content/irregularVerbs.ts`, `/practice/verbs`, 51 verbos) e **construção frásica** (`src/content/sentencePatterns.ts`, `/practice/patterns`, 8 padrões de ordem de palavras) — conteúdo estático, mesmo padrão de `readingPassages.ts`/`culturalTips.ts`, sem precisar de schema/seed.

## 5. Variáveis de ambiente na Netlify (nomes, não os valores — ver gestor de password/Netlify para os valores reais)

`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL` (deve ser `https://english-platafform.netlify.app`), `GEMINI_API_KEY`.

**Regra de segurança que o Claude segue sempre**: nunca escrever passwords/API keys/tokens em campos de formulários (Netlify, Supabase, etc.), mesmo com autorização explícita do utilizador. Só o utilizador cola esses valores. Claude pode e deve fazer todo o resto por browser automation (criar variáveis vazias com o nome certo, navegar, disparar deploys, ler logs).

## 6. Próximos passos pedidos pelo utilizador (2026-08-26)

- [x] Documento do projeto/fases/atualizações — entregue como `.rtf` (não `.docx`: sem Node/Python/pandoc nesta máquina, ver `docs/decisions.md`), enviado ao utilizador via `SendUserFile`. **Não está no repositório** — se for pedido de novo, o script fonte ficou em `PROJECT_STATE.md` (esta secção) como referência do conteúdo; recriar a partir das secções deste ficheiro + `docs/`.
- [x] Desafio Diário de vocabulário (5-10 palavras, escolha múltipla, + frases de exemplo) — `src/lib/dailyChallenge.ts`, rota `/practice/daily-challenge`.
- [x] Checkpoints diários/semanais/mensais — `src/lib/checkpoints.ts`, cartão em `/progress`.
- [x] Micro-Desafios ("5 Minutos Matinais", "Casa de Banho", "Sofá") — implementados diretamente (utilizador pediu para avançar sem esperar confirmação): `src/lib/microChallenges.ts`, rota `/practice/micro-challenges`.
- [x] 6ª lição adicional (A1.2 "At the Restaurant" — pedidos educados Can/Could) — para reforçar a profundidade do currículo enquanto havia orçamento de tokens.
- [x] `NEXT_PUBLIC_SITE_URL` corrigido para `https://english-platafform.netlify.app` e redeploy confirmado publicado.
- [ ] **Por confirmar pelo utilizador em produção**: clicar em Desafio Diário e Micro-Desafios no site real (deploy `ea0214e` já publicado, deploy código-fonte confirmado sem erros; falta só confirmação visual/funcional do próprio utilizador).
- [x] App instalável no Android (PWA) — `public/manifest.webmanifest`, `public/icon.svg`, `public/icon-maskable.svg`, `public/sw.js`, `src/components/PwaRegister.tsx`, `src/app/layout.tsx`, `src/middleware.ts` (exclusão do matcher). Ver `docs/decisions.md` 2026-08-26. Deploy confirmado publicado, manifest/ícone/service worker verificados em produção. **Nota**: ícones em SVG, não PNG — considerar gerar PNGs (192×192, 512×512) numa sessão futura com Node/Python disponível. Falta só o utilizador confirmar no telemóvel: Chrome Android → menu (⋮) → "Adicionar ao ecrã principal".
- [x] **SRS real (SM-2)** — crítica dura ao produto pedida pelo utilizador (2026-08-26), priorizado por ele como #1: `src/lib/srs/sm2.ts` (algoritmo), `src/lib/srs/schedule.ts` (agendamento/consulta), `/practice/review` (fila estilo Anki). Ligado ao Desafio Diário (cada palavra agenda revisão) e aos erros de exercícios de lição (dedupe por `errorType`, agenda revisão do erro). Badge de pendentes em Home e Prática. Deploy `49164d0` confirmado publicado.
- [x] **Octógono de competência deixa de ficar congelado** — `src/lib/skillProfile.ts` (`updateSkillScore`, EMA α=0.25), ligado a exercícios/writing/speaking/translation/Desafio Diário/revisões SM-2. Também preenche `WritingAttempt.score`/`SpeakingAttempt.fluencyScore` (existiam no schema, nunca usados) via parsing de `SCORE: NN` na resposta do Gemini. Ver `docs/decisions.md`.
- [ ] **Lista de melhorias priorizada com o utilizador (crítica de 2026-08-26), por ordem de prioridade acordada**:
  1. ~~SRS (repetição espaçada real)~~ — feito.
  2. ~~Octógono de competência vivo~~ — feito (descoberto durante a continuação "updates com mais impacto"). Deploy `2982d6a` confirmado publicado.
  3. ~~Testes/exames periódicos~~ — feito: Diagnóstico Semanal (`/practice/weekly-test`, `src/lib/weeklyTest.ts`).
  4. ~~Inglês profissional genérico cedo~~ — feito: `interviewer`/`conversation_partner`/`native_friend` desbloqueados em `/speak` (`src/lib/ai/personalities.ts`).
  5. Expansão de vocabulário e currículo (A2+), phrasal verbs/idiomas novos (distintos dos `related_forms` já existentes, agora mostrados), listening mais natural, leitura extensiva — itens de custo mais alto, ver crítica completa na conversa de 2026-08-26 para a lista completa com custo/impacto.
- [x] **5 updates adicionais (pedido "faça no mínimo 5 updates")**: Diagnóstico Semanal, AI Tutor multi-personalidade, collocations visíveis, 6 novas conquistas, entry points em Home/Practice. Ver `docs/decisions.md` 2026-08-26 para detalhe de cada um. Deploy `b5f6400` confirmado publicado.
- [x] **Correção de UX pós-teste do utilizador**: feedback imediato por pergunta (não silencioso), TRANSLATION deixou de faltar nos testes (vira texto livre em vez de MC), Sheets de tema (`/practice/topic/[pillar]`, `src/lib/practiceQuestions.ts`), cor por pilar (`src/lib/pillarDisplay.ts`) nos quizzes. Ver `docs/decisions.md` para o porquê de o redesenho visual mais amplo ("cores pesadas" no fundo/hero) ter ficado por fazer nesta ronda — precisa de iteração com screenshots, não de uma mudança às cegas.
- [x] **Lista de 19 melhorias — fechada** (pedido explícito: "termina todas as atualizações das 19 que ainda não estão feitas... quero todas de uma só vez"). Estado final de cada item, ver tabela completa na conversa e detalhe em `docs/decisions.md`:
  - Feitos nesta ronda final: #3 (idiomas dedicado), #8 (voz mais natural), #9 (cultura), #12 (Modo Imersão), #13 (PWA offline parcial), #14 (entrevista por setor), #16 (analytics básico), #17 (certificação sem QR real), #18 (leitura facilitada, parcial).
  - Já feitos antes: #1 (SRS), #2/#5 (conteúdo — parcial, 9 lições), #4 (roleplay), #10 (multi-personalidade), #15 (Diagnóstico Semanal).
  - **Genuinamente não feito, com justificação em `docs/decisions.md`**: #6 (A2 "completo" — só a fundação foi feita), #19 (comunidade — incompatível com o modelo 1:1 atual, precisaria de infraestrutura nova).
  - #7 (writing "completo") já estava razoavelmente bom (score numérico); não recebeu trabalho extra nesta ronda por ser melhoria incremental, não gap em falta.

Ver o corpo da conversa da sessão de 2026-08-26 para o pedido exato.

## 7. Convenções a manter

- Interface em português europeu.
- Sem comentários supérfluos no código — só onde a razão não é óbvia.
- Toda a decisão de arquitetura nova → registar em `docs/decisions.md` com data.
- Toda a mudança relevante na app → atualizar este ficheiro (`PROJECT_STATE.md`).
- Nunca expandir scope sem avisar o utilizador primeiro (regra do master prompt original).
- Antes de um deploy, confirmar mentalmente riscos de `noUncheckedIndexedAccess` e tipos de enum do Prisma (ver secção 2, "lições aprendidas").
