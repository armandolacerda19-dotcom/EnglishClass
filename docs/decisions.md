# Registo de Decisões de Arquitetura

Log vivo — atualizar sempre que uma decisão de stack, schema ou convenção for tomada, para que fases futuras (ou outra sessão) não repitam a análise.

## 2026-08-26 — Confirmação de stack (Fase 0)

| Camada | Proposta do master prompt | Decisão | Justificação |
|---|---|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind | **Confirmado** | Padrão sólido para app premium com SSR/SEO na landing pública e boa DX. |
| Backend | API routes Next.js ou serviço Node separado | **API routes Next.js no MVP1**, extrair para serviço separado só se/quando a carga de IA (streaming, filas de Content QA) justificar | Evita complexidade de infraestrutura prematura. Reavaliar em MVP2 se latência de IA em API routes se tornar um problema. |
| Base de dados | PostgreSQL (Supabase ou Neon) + Prisma | **Supabase (Postgres gerido)** | Combina DB + Auth + Storage (para áudio de speaking) num único fornecedor, reduz peças móveis no MVP1. |
| Auth | Supabase Auth ou Auth.js | **Supabase Auth** | Consistente com a escolha de BD acima; evita gerir dois sistemas de sessão. |
| IA de texto/tutoria | API Anthropic (Claude) | **Confirmado** | Alinhado com o motor de raciocínio pedagógico, correção e Content QA. |
| Speech-to-text | Whisper API vs Web Speech API | **Whisper API desde o MVP1** — ver "Decisão discutida" abaixo | Web Speech API tem suporte inconsistente entre browsers (fraco/ausente em Firefox e Safari), inaceitável para um produto premium cujo diferenciador é speaking. |
| Text-to-speech | ElevenLabs vs Azure/Google TTS | **Azure Neural TTS por omissão**, reavaliar ElevenLabs para vozes do AI Tutor se/quando houver tutoria por voz (pós-MVP1) | Custo por caractere muito mais baixo a volume (necessário para cobrir vocabulário/listening de 21 subníveis); qualidade neural nativa é suficiente para áudio de vocabulário/listening. ElevenLabs fica em avaliação para interações de voz mais "de personagem" (personalidades do AI Tutor) quando essa feature entrar em scope. |
| Hosting | Vercel + BD gerida | **Confirmado** | Coerente com Next.js. |

### Decisão discutida: Speech-to-text no MVP1

O master prompt sugeria "avaliar" Web Speech API no MVP1 por custo/latência, com pronunciation scoring avançado só em MVP2/3. **Recomendação alternativa aplicada**: usar Whisper API já no MVP1 apenas para transcrição (não scoring fonético), porque:
1. Web Speech API não funciona de forma fiável em Safari/iOS, que é uma fatia significativa do público-alvo adulto/profissional em mobile.
2. A funcionalidade central do MVP1 ("speaking básico: gravação + feedback de IA") depende de uma transcrição minimamente fiável — se a transcrição falhar por limitação do browser, o feedback de IA fica comprometido, não é o scoring fonético que fica em risco.
3. Custo por minuto do Whisper é baixo o suficiente para o volume esperado do MVP1 (sessões curtas, não uso ilimitado).

Scoring fonético avançado (fonema a fonema, tipo ELSA) continua fora do MVP1, conforme o master prompt — só entra em MVP3 com shadowing.

## 2026-08-26 — Hosting sem instalação local (Netlify + Supabase)

O utilizador optou por não instalar Node.js localmente em momento nenhum do desenvolvimento. Decisão: todo o ciclo de build/migração/seed corre na infraestrutura da Netlify, não localmente.

| Ponto | Decisão | Justificação |
|---|---|---|
| Hosting | **Netlify** (`@netlify/plugin-nextjs`) | Já era a stack proposta (secção 3 do master prompt previa Vercel; Netlify é equivalente e foi o pedido explícito do utilizador) |
| Migração de schema | **`prisma db push`** no build da Netlify, não `prisma migrate dev/deploy` | Gerar ficheiros de migração SQL versionados exige correr `prisma migrate dev` localmente com Node e ligação à BD — inviável sem instalar nada. `db push` sincroniza o schema diretamente a partir de `prisma/schema.prisma`, sem esse passo local. **Trade-off aceite conscientemente**: perde-se histórico de migrações reversível. Aceitável para o MVP1 sem dados de produção; revisitar antes de haver utilizadores reais (ver `docs/11-deploy-netlify-supabase.md`). |
| Seed de conteúdo | Corre a cada build (`npx tsx prisma/seed.ts` no `netlify.toml`) | O seed usa `upsert` em todo o lado (idempotente), por isso correr em cada deploy é seguro e mantém o conteúdo curricular sincronizado com o que está versionado em `content/curriculum/`. |
| Connection string do Supabase | **Duas variáveis**: `DATABASE_URL` (pooled, pgbouncer, porta 6543) para runtime das Netlify Functions; `DIRECT_URL` (direta, porta 5432) só para o `prisma db push` no build | Funções serverless abrem muitas ligações concorrentes de curta duração — sem pooling esgotam rapidamente o limite de ligações do Postgres do Supabase. `db push`/migrações preferem ligação direta. Ver `datasource db` em `prisma/schema.prisma`. |
| Deploy contínuo | Repositório no GitHub, importado na Netlify (\"Import from Git\") | Netlify precisa de um repositório Git para deploy contínuo sem intervenção manual; `git` (sem Node) é a única ferramenta de linha de comandos usada localmente, só para o `git push` inicial e seguintes. |

Guia passo a passo (só browser + `git`, sem `npm`/`node`): `docs/11-deploy-netlify-supabase.md`.

## Convenções de código e schema

- IDs: `cuid()` em todas as entidades.
- Timestamps: `createdAt`/`updatedAt` (Prisma `@default(now())` / `@updatedAt`) em todas as entidades com ciclo de vida.
- Enums em `PascalCase` com valores em `SCREAMING_SNAKE_CASE`.
- Conteúdo curricular (Levels → Sublevels → Modules → Units → Lessons/GrammarConcepts/VocabularyItems/Exercises) vive como **ficheiros JSON versionados em `/content/`**, aplicados à BD por script de seed idempotente — não editado diretamente em produção. Ver `07-schema-dados.md` e `08-schema-json-conteudo.md`.
- Todo conteúdo gerado por IA passa por `generatedByAi` + `qaApproved`/`qa_status` antes de ser servido a utilizadores reais (ver `06-arquitetura-ia.md`).
- Interface em português europeu (evitar PT-BR, salvo comparação linguística explícita) — ver secção 10 do master prompt.

## Pontos em aberto para decidir antes/durante MVP1

- Algoritmo exato de spaced repetition (`ReviewScheduleItem.easeFactor`/`intervalDays`): proposto tipo SM-2 como ponto de partida; afinar com dados reais de retenção a partir do MVP2.
- % de amostragem humana no Content QA por nível (secção "Content Engine" de `06-arquitetura-ia.md`) — a decidir com o especialista CEFR antes do seeding de A1.
- Limiar de mastery agregado exigido para elegibilidade de certificação de nível (`05-avaliacao-certificacao.md`) — a calibrar antes do MVP3.
