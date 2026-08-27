# Estado do Projeto — Plataforma de Inglês

> **Para uma sessão nova do Claude Code**: leia este ficheiro primeiro, depois `docs/decisions.md` (histórico de decisões técnicas) e `docs/10-scope-mvp1.md` (o que está dentro/fora do MVP1). Este ficheiro deve ser atualizado sempre que houver uma mudança relevante na app — não deixar desatualizado.

Última atualização: 2026-08-26, PWA (instalação Android) adicionada — manifest, ícones SVG, service worker mínimo. Ainda por confirmar publicação em produção (ver secção 6).

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
- Instalação como app (PWA) — manifest + service worker mínimo, ver secção 6 (deploy pendente)

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

## 4. Conteúdo curricular seedado (6 lições)

| Sublevel | Módulo | Conceito de gramática | Erro PT→EN destacado |
|---|---|---|---|
| Pre-A1 | First Words | Verbo "to be" | "I have 38 years" → "I am 38 years old" |
| A1.1 | Daily Life | Present Simple | Esquecer o -s na 3ª pessoa |
| A1.1 | About Me | Perguntas com Do/Does | "You like coffee?" → "Do you like coffee?" |
| A1.2 | Shopping | There is/There are | "há" invariável em PT vs. singular/plural em EN |
| A1.3 | Comparing Things | Comparativos | "more cheap" → "cheaper"; "more good" → "better" |
| A1.2 | At the Restaurant | Pedidos educados (Can/Could) | "I want a coffee" → "Can I have a coffee, please?" |

~15 itens de vocabulário no total, distribuídos por estes módulos. Ver `content/curriculum/` para o JSON completo de cada um.

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
- [x] App instalável no Android (PWA) — `public/manifest.webmanifest`, `public/icon.svg`, `public/icon-maskable.svg`, `public/sw.js`, `src/components/PwaRegister.tsx`, `src/app/layout.tsx`, `src/middleware.ts` (exclusão do matcher). Ver `docs/decisions.md` 2026-08-26. **Nota**: ícones em SVG, não PNG (sem ferramenta de imagem nesta máquina) — funciona no Chrome/Android mas considerar gerar PNGs (192×192, 512×512) numa sessão futura com Node/Python disponível, para compatibilidade máxima. Falta confirmar no telemóvel do utilizador: abrir o site no Chrome Android → menu (⋮) → "Adicionar ao ecrã principal" / "Instalar app".

Ver o corpo da conversa da sessão de 2026-08-26 para o pedido exato.

## 7. Convenções a manter

- Interface em português europeu.
- Sem comentários supérfluos no código — só onde a razão não é óbvia.
- Toda a decisão de arquitetura nova → registar em `docs/decisions.md` com data.
- Toda a mudança relevante na app → atualizar este ficheiro (`PROJECT_STATE.md`).
- Nunca expandir scope sem avisar o utilizador primeiro (regra do master prompt original).
- Antes de um deploy, confirmar mentalmente riscos de `noUncheckedIndexedAccess` e tipos de enum do Prisma (ver secção 2, "lições aprendidas").
