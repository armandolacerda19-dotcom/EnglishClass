# Deploy — Netlify + Supabase (sem instalar nada localmente)

Este guia não usa o terminal nem instala Node.js. Todos os passos são feitos no browser; a Netlify instala o Node e corre tudo (migração de schema, seed de conteúdo, build) na infraestrutura dela, conforme configurado em [`netlify.toml`](../netlify.toml).

A única ferramenta local usada é o `git`, já instalado nesta máquina, só para enviar o código para o GitHub — sem isso a Netlify não tem de onde importar o projeto continuamente.

## 1. Criar o projeto Supabase

1. Em [supabase.com](https://supabase.com), criar um novo projeto (nome sugerido: `ingles-platform`), escolher região e definir a password da base de dados — guarde-a.
2. Em **Project Settings → API**, copiar:
   - `Project URL` → vai ser `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (nunca expor no frontend)
3. Em **Project Settings → Database → Connection string**:
   - Modo **Transaction** (porta `6543`, com `pgbouncer=true`) → `DATABASE_URL`
   - Modo **Session/Direct** (porta `5432`) → `DIRECT_URL`
   - Ver `.env.example` para o formato exato de cada uma.

Não é preciso correr nenhum SQL manualmente — o `netlify.toml` corre `prisma db push` no build, que cria todas as tabelas a partir de `prisma/schema.prisma`.

## 2. Enviar o código para o GitHub

A Netlify precisa de um repositório Git para fazer deploy contínuo. Passos:

1. Criar um repositório vazio em [github.com/new](https://github.com/new) (ex.: `ingles-platform`), sem README/gitignore (o projeto já os tem).
2. No terminal desta máquina (só `git`, sem Node), a partir da pasta `ingles-platform/`:

```bash
git init
git add .
git commit -m "MVP1: onboarding, placement, lição A1, AI Tutor, deploy Netlify+Supabase"
git branch -M main
git remote add origin https://github.com/<o-seu-utilizador>/ingles-platform.git
git push -u origin main
```

(Substituir `<o-seu-utilizador>` pelo seu utilizador do GitHub. Se preferir, eu posso correr estes comandos por si assim que me confirmar o URL do repositório.)

## 3. Criar o site na Netlify

1. Em [app.netlify.com](https://app.netlify.com), **Add new site → Import an existing project → GitHub**, autorizar e escolher o repositório `ingles-platform`.
2. A Netlify deteta o `netlify.toml` automaticamente (build command e plugin Next.js já configurados) — não é preciso alterar nada no ecrã de configuração de build.
3. Antes do primeiro deploy, ir a **Site configuration → Environment variables** e adicionar:
   - `DATABASE_URL`, `DIRECT_URL` (Supabase, passo 1)
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Supabase, passo 1)
   - `NEXT_PUBLIC_SITE_URL` — o domínio que a Netlify vai atribuir (ex. `https://ingles-platform.netlify.app`; pode confirmar/editar depois do primeiro deploy, no separador **Domain management**, e voltar a esta variável para o corrigir se mudar)
   - `GEMINI_API_KEY` (Google Gemini — nível gratuito permanente, criar em [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey); ver `docs/decisions.md` para a justificação da troca face à Anthropic)
4. **Deploy site**. A Netlify instala dependências, corre `prisma generate`, `prisma db push`, o seed do currículo A1, e o build do Next.js — tudo na cloud.

## 4. Configurar autenticação no Supabase

Em **Authentication → URL Configuration** no painel do Supabase, definir:
- **Site URL**: o domínio dado pela Netlify (ex. `https://ingles-platform.netlify.app`)
- **Redirect URLs**: o mesmo domínio (+ `http://localhost:3000` só se um dia vier a testar localmente)

Sem isto, o login/signup falha em produção com erro de redirect não autorizado.

## 5. Verificar

Abrir o URL da Netlify e percorrer o fluxo do DoD do MVP1 (`docs/10-scope-mvp1.md`): signup → onboarding → placement test → lição A1 → AI Tutor → progress → export/eliminação de dados.

## Deploys seguintes

Qualquer `git push` para `main` dispara um novo deploy automático na Netlify, que volta a correr `prisma db push` (idempotente — só aplica alterações de schema) e o seed (também idempotente, via `upsert`). Não é preciso repetir os passos 1–4 depois da primeira vez, só o passo 2 (`git push`) sempre que o código mudar.

## Nota sobre `prisma db push`

Optámos por `prisma db push` em vez de `prisma migrate deploy` (ver `docs/decisions.md`) porque não há forma de gerar ficheiros de migração SQL sem correr `prisma migrate dev` localmente com Node — o que o utilizador optou por evitar. `db push` sincroniza o schema diretamente, sem histórico de migrações versionado. **Isto é aceitável para o MVP1** (sem dados de produção a proteger ainda), mas deve ser revisto antes de haver utilizadores reais em produção: nessa altura, gerar migrações versionadas (localmente ou via GitHub Actions com Node) passa a ser recomendado, para poder reverter alterações de schema com segurança.
