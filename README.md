# Plataforma de Inglês — MVP1

Código-fonte escrito para o MVP1 (ver [`docs/10-scope-mvp1.md`](docs/10-scope-mvp1.md)). **Este código nunca foi instalado, compilado ou executado** — por opção do utilizador, não é instalado Node.js localmente em nenhuma fase; o build, a migração de schema e o seed de conteúdo correm exclusivamente na infraestrutura da Netlify. Trate-o como um primeiro rascunho a validar em produção, não como testado localmente.

## Como correr — só no browser, via Netlify + Supabase

Ver o guia passo a passo completo em [`docs/11-deploy-netlify-supabase.md`](docs/11-deploy-netlify-supabase.md): criar o projeto Supabase, enviar o código para o GitHub (`git push`, sem `npm`/`node`) e ligar o repositório à Netlify. A Netlify instala tudo e corre `prisma generate && prisma db push && seed && next build` automaticamente a cada deploy (ver [`netlify.toml`](netlify.toml)).

## O que validar assim que o primeiro deploy correr

Erros de build são prováveis — nenhuma verificação de tipos (`tsc`) nem lint foi corrida neste código antes deste deploy. Pontos a validar com prioridade, lendo o log de build da Netlify:

1. Erros de TypeScript/build reportados no log da Netlify.
2. O fluxo completo do DoD do MVP1 (`docs/10-scope-mvp1.md`): signup → onboarding → placement test → lição A1 completa → AI Tutor → progress → export/delete de dados.
3. Os exercícios de listening já não dependem de ficheiros de áudio (não existiam) — usam `transcript` + Web Speech API do browser (`src/components/ui/PlayTranscript.tsx`), solução interina até haver TTS real (ver `docs/decisions.md`). Testar num browser com suporte a `speechSynthesis` (Chrome/Edge/Safari desktop; alguns browsers móveis variam).
4. Middleware de auth (`src/middleware.ts`) assume cookies do Supabase SSR — testar o fluxo de login/logout com atenção, e confirmar as **Redirect URLs** configuradas no Supabase (passo 4 do guia de deploy).

## Desvios de implementação face aos documentos da Fase 0

- Sitemap (`docs/03-sitemap-arquitetura-informacao.md`) descrevia rotas de lição aninhadas por nível/módulo/unidade (`/learn/[level]/[module]/[unit]/[lesson]`); o código usa `/learn/lesson/[id]` — mais simples de implementar sem testes automatizados, e suficiente enquanto o currículo é pequeno. Revisitar se o sitemap aninhado passar a ser necessário para SEO/navegação em MVP2.
- Onboarding é um único componente cliente com wizard interno (`OnboardingWizard`), não páginas separadas por passo do sitemap — reduz risco de perda de estado entre navegações sem uma store dedicada.

## Estrutura

- `docs/` — Fase 0 (visão, arquitetura, decisões).
- `prisma/schema.prisma` — schema de dados completo (todas as entidades da secção 6 do master prompt).
- `prisma/seed.ts` — popula Pre-A1/A1 e o módulo "Daily Life" a partir de `content/curriculum/`.
- `content/curriculum/` — conteúdo curricular versionado (JSON), formato definido em `docs/08-schema-json-conteudo.md`.
- `src/app/` — rotas Next.js App Router.
- `src/components/` — componentes de UI e de fluxo (lição, placement, tutor, onboarding).
- `src/lib/` — Prisma client, Supabase, IA (Anthropic), placement scoring, geração de plano.
