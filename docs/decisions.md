# Registo de Decisões de Arquitetura

Log vivo — atualizar sempre que uma decisão de stack, schema ou convenção for tomada, para que fases futuras (ou outra sessão) não repitam a análise.

## 2026-08-27 — Fase 13 continuada: Reflexive Pronouns (A1.1)

Gap real na fundação mais básica de gramática: o módulo de pronomes existente (`a1-module-09-pronouns.json`) cobre pronomes objeto e adjetivos possessivos, mas nunca pronomes reflexivos (myself, yourself, himself, herself, itself, ourselves, yourselves, themselves). O português marca a reflexividade diretamente no verbo, com um pronome clítico colado a ele ("levanto-me", "veste-se") — sem um pronome reflexivo à parte como o inglês exige. Isto causa dois erros opostos e igualmente comuns: esquecer o reflexivo quando é mesmo necessário ("I cut" em vez de "I cut myself"), ou adicioná-lo a verbos ingleses do dia a dia que normalmente não precisam dele (wake up, feel, relax, get dressed) por transferência do verbo reflexivo equivalente em português. `a1-module-15-reflexive-pronouns.json`, A1.1, logo a seguir ao módulo de pronomes existente.

Mesmo processo de sempre. **Currículo: 41 → 42 lições.**

## 2026-08-27 — Fase 13 continuada: Indirect Questions (B1.2) e Adjective Order (A2.2)

Mais dois gaps reais, ambos de alto valor prático:

- **Indirect Questions** (`b1-module-13-indirect-questions.json`, B1.2, último módulo B1): pedir informação educadamente ("Could you tell me where the station is?", "Do you know what time it closes?") sem inverter sujeito/verbo e sem `do/does/did` — a estrutura de cortesia mais usada em viagens e atendimento ao público, e nunca tinha módulo próprio. Cobre `could you tell me`/`I wonder`/`would you mind` como vocabulário de apoio.
- **Adjective Order** (`a2-module-12-adjective-order.json`, A2.2): ordem fixa de adjetivos antes do substantivo — opinião → tamanho → idade → forma → cor → origem → material ("a beautiful small old round French wooden table"). O português coloca adjetivos tipicamente depois do substantivo, numa ordem bastante livre, o que leva a ordenar os adjetivos em inglês ao acaso quando há mais do que um — som "estrangeiro" mesmo quando perfeitamente compreensível.

Mesmo processo de sempre. **Currículo: 39 → 41 lições.** Verificação exaustiva repetida sobre os 41 módulos: 535 ids, zero duplicatas, zero `concept_ref`/`vocabulary_ids`/`exercise_ids` partidos.

## 2026-08-27 — Fase 13 continuada: So Do I / Neither Do I (B1.1)

Mais um gap real, encontrado depois de reabrir a revisão de gramática a pedido do utilizador ("pode continuar as atualizações"): a estrutura de concordância curta com auxiliar — "So do I" (concordar com afirmativa), "Neither have I" (concordar com negativa) — nunca teve módulo próprio, apesar de ser uma das construções mais usadas na conversa do dia a dia. É também um ponto onde o português não ajuda: "eu também"/"eu também não" não mudam de estrutura consoante o tempo verbal da frase original, enquanto em inglês o auxiliar usado (do/does/did, have/has, am/is/are, can, will...) tem sempre de corresponder ao da frase que se está a concordar, com inversão obrigatória (auxiliar antes do sujeito, como numa pergunta). `b1-module-12-so-neither-agreement.json`, B1.1, último módulo dessa sublevel.

Mesmo processo de sempre: JSON validado com `ConvertFrom-Json`, ids confirmados únicos por `grep`, `prisma/seed.ts` atualizado. Reverificação exaustiva de todo o currículo depois deste módulo: **509 ids em 39 módulos, zero duplicatas** — confirma que a disciplina de verificação por grep antes de cada commit continua a segurar a integridade dos dados mesmo com o currículo a crescer lote a lote. **Currículo: 38 → 39 lições.**

## 2026-08-27 — Fase 13 continuada: Have/Get Something Done — causativo (B1.2)

Último gap encontrado nesta ronda de revisão de gramática: a estrutura causativa "have/get + objeto + particípio passado" — usada para dizer que outra pessoa faz algo por si ("I had my hair cut", "we're getting the roof fixed") — nunca teve módulo próprio, apesar de ser extremamente comum no dia a dia (cabeleireiro, oficina, obras em casa). É também um ponto onde o português não ajuda nada: usa-se o mesmo verbo na ativa quer a pessoa tenha feito o trabalho pessoalmente quer tenha mandado fazer ("cortei o cabelo" serve para os dois casos), o que faz muitos alunos dizerem "I cut my hair" quando querem dizer que foram ao cabeleireiro — frase que em inglês significa especificamente que a própria pessoa pegou na tesoura. `b1-module-11-causative-have-get.json`, B1.2, último módulo B1 na ordem do seed.

Mesmo processo de verificação: JSON validado com `ConvertFrom-Json`, ids confirmados únicos por `grep` (desta vez sem colisões, ao contrário do lote anterior). **Currículo: 37 → 38 lições.**

Com isto, fecha-se esta ronda de revisão da cobertura de gramática iniciada com o 1º lote da Fase 13 — 8 módulos novos ao todo nesta sessão (numbers/time, modais de capacidade, phrasal verbs, zero conditional, present perfect vs. past simple, present perfect continuous, wish clauses, causativo), currículo de 30 para 38 lições. O resto do alvo de 80-120 lições da Fase 13 continua a ser trabalho de escala para sessões futuras — não faltam mais gaps óbvios de gramática facilmente identificáveis por esta revisão.

## 2026-08-27 — Fase 13 continuada: Wish Clauses (B1.2)

Outro gap real: "wish" (desejo sobre o presente — "I wish I spoke French" — e arrependimento sobre o passado — "I wish I had studied harder") nunca teve módulo próprio, apesar de ser um ponto gramatical B1 clássico, intimamente ligado ao Second Conditional (mesma estrutura "wish + Past Simple" ↔ "if + Past Simple") e ao Third Conditional (mesma estrutura "wish + Past Perfect" ↔ "if + Past Perfect"), já ambos seedados. `b1-module-10-wish-clauses.json`, B1.2, logo a seguir a third-conditional.

**Nota de processo, prova de que a verificação por grep funciona**: o primeiro rascunho definia um item de vocabulário com o id `vocab_b1_regret` — sem verificar, teria colidido com o `vocab_b1_regret` já existente em `b1-module-08-third-conditional.json` (mesma palavra, "regret", já coberta lá). Apanhado pelo grep de verificação de ids feito antes de todo commit de conteúdo nesta sessão; corrigido substituindo por um item novo ("daydream", verbo temático — "sonhar acordado" — que se encaixa bem no tema de desejos/wishes). Isto confirma que vocabulário é uma tabela global partilhada entre módulos (resolvido por id em runtime, não precisa de estar duplicado por módulo) — reaproveitar um id existente teria sido tecnicamente inofensivo (o upsert simplesmente atualizaria a mesma linha), mas ter dois módulos a "possuir" a mesma definição de vocabulário, com texto ligeiramente diferente entre rascunhos, seria confuso de manter.

**Currículo: 36 → 37 lições.**

## 2026-08-27 — Fase 13 continuada: Present Perfect Continuous (B1.1)

Outro gap real encontrado ao rever a cobertura de gramática (mesmo processo dos gaps A2 anteriores): existia Present Perfect Simples (`a2-module-01-experiences.json`) e, adicionado nesta sessão, a distinção Present Perfect vs. Past Simple — mas nunca a forma **contínua** (`have/has been + -ing`), um tempo verbal tipicamente introduzido a B1, sem equivalente direto em português (que usa Presente Simples + "há"/"desde" para a mesma ideia de duração — "trabalho aqui há cinco anos" vs. "I've been working here for five years"). `b1-module-09-present-perfect-continuous.json`, inserido em B1.1 logo a seguir a past-perfect (mesma família "aspeto perfeito"). Cobre `for`/`since`/`lately` como vocabulário de apoio, e contrasta explicitamente com o Present Perfect Simples ("I've painted the fence" = resultado; "I've been painting the fence" = atividade/duração).

Mesmo processo de verificação de todos os lotes anteriores: JSON validado com `ConvertFrom-Json`, ids confirmados únicos por `grep`, `prisma/seed.ts` atualizado. **Currículo: 35 → 36 lições.**

## 2026-08-27 — Fase 14 continuada: mais 4 textos de leitura autênticos

2º lote de textos em `readingPassages.ts`, mesmo processo do 1º (originais, nunca copiados de fonte real, ids confirmados únicos por grep antes do commit):
- `recipe-instructions` (A1, `genre: "instructions"` — 1ª vez que este género é usado)
- `job-interview-dialogue` (B1, `genre: "dialogue"`)
- `gym-membership-email` (A2, `genre: "email"`)
- `weather-warning-news` (B1, `genre: "news"`)

Total de textos de leitura: 63 → 67. Com isto, os 5 géneros declarados na interface `ReadingPassage` (`story`/`dialogue`/`email`/`news`/`instructions`) têm todos pelo menos um exemplo real no currículo.

## 2026-08-27 — Ação #4 (Top 5 imediatas): plano diário liga a sério ao pilar mais fraco

Última das "Top 5 ações imediatas" da auditoria (secção 5.3) ainda por fazer: "Fazer o plano diário cumprir o que promete. Passar `weakAreas` a `generateDailyPlan` e ligar a `/practice/topic/[pillar]` — a rota já existe". Confirmado por leitura: `dailyPlan.ts` gerava o item "Tema à escolha (pilar mais fraco)" mas o texto entre parênteses era decorativo — `generateDailyPlan` nunca recebia `weakAreas`, e o `href` era sempre `/practice/topic` (o seletor genérico), nunca `/practice/topic/[pillar]` (que já existia e já filtra corretamente, desde a Fase 8).

Correção:
- `generateDailyPlan(dailyMinutes, hasDueReviews, weakAreas = [])` — 3º parâmetro opcional e retrocompatível (todos os testes/chamadas existentes continuam a funcionar sem alteração, `weakestPillar` fica `undefined` e o comportamento é exatamente o de antes).
- Nova função interna `topicItem(minutes, weakestPillar)`: com um pilar fraco elegível, devolve `{ label: "Tema à escolha: <nome do pilar>", href: "/practice/topic/<pilar>" }`; sem nenhum, cai no comportamento antigo.
- **Só 5 dos 8 pilares de `weakAreas` são elegíveis**: `/practice/topic/[pillar]` só aceita GRAMMAR/VOCABULARY/LISTENING/READING/TRANSLATION (os que têm banco de `Exercise` de escolha múltipla via `buildQuestionSet`) — SPEAKING/WRITING/PRONUNCIATION dão `notFound()` nessa rota, por não terem esse tipo de conteúdo. `TOPIC_PRACTICE_PILLARS` filtra por isso; se o(s) pilar(es) mais fraco(s) do utilizador forem só destes 3, cai de volta no seletor genérico em vez de linkar para uma página 404.
- `home/page.tsx` (Standard e Intensive) passam `learningProfile.weakAreas`/`weakAreas` na chamada.
- 2 testes novos em `dailyPlan.test.ts`, seguindo o padrão já estabelecido (função pura, verificação por leitura cuidada em vez de build local).

Com isto, as 5 ações imediatas da auditoria estão todas fechadas (as outras 4 — forja de certificados, sanitização de prompt/onboarding, contraste WCAG, try/catch nos runners — já tinham sido feitas em fases anteriores desta sessão; contraste continua deliberadamente por decidir pelo utilizador, é uma decisão de identidade visual, não uma correção técnica).

## 2026-08-27 — 5º eixo da rubrica: Naturalidade

Auditoria (secção "Inglês vivo e rubrica formal"): "os eixos implementados são gramática/vocabulário/coerência/cumprimento da tarefa — fluência e naturalidade não são pontuadas em lado nenhum, apesar de 'naturalness' estar no prompt". Correto: o prompt a `getHolisticFeedback` sempre pediu para "cover grammar, vocabulary, spelling/punctuation, coherence, register and naturalness" e para "explicitly distinguish incorrect from not natural/idiomatic" — mas a rubrica numérica nunca teve um eixo correspondente.

Adicionado `naturalness` como 5º campo de `WritingRubric`, pedido à IA como "how natural and idiomatic it sounds — would a native speaker actually phrase it this way, as opposed to merely being grammatically correct". Posicionado no grupo da rubrica (depois de `TASK_ACHIEVEMENT`, antes de `PRONUNCIATION`/`SCORE`) na instrução de ordem exata das linhas finais já cuidadosamente desambiguada na Fase 10 — como os 4 eixos da rubrica são extraídos por regex multiline independente da posição exata (não pela técnica de "stripping do fim para o início" usada para SCORE/PRONUNCIATION), acrescentar um 5º eixo ao mesmo grupo não introduz nenhuma ambiguidade nova. `stripMarkers` (sanitização de `text`/`prompt`) ganha `NATURALNESS` à lista de marcadores removidos, pelo mesmo motivo de segurança do achado N1 (Fase 8). `WritingStep`/`SpeakingStep` (`LessonRunner.tsx`) não precisaram de nenhuma alteração de UI — já iteram `Object.keys(RUBRIC_LABEL)` em vez de listar os eixos a dedo, por isso a 5ª barra aparece automaticamente ao adicionar a entrada `naturalness: "Naturalidade"` ao mapa.

Com isto, todos os achados concretos e citados textualmente na auditoria de 2026-08-27 estão fechados: Fases 8-12 completas, achado N6 corrigido, rubrica com todos os eixos pedidos. O que resta (Fases 13/14) é trabalho de escala — currículo até 80-120 lições, áudio real, conteúdo autêntico — não lacunas pontuais; cada uma já tem um primeiro lote sólido feito nesta sessão.

## 2026-08-27 — Achado N6 corrigido: seed paralelizado

A auditoria de 2026-08-27 (achados de segurança novos, N6) apontava o `prisma/seed.ts` — que corre a **cada** deploy Netlify (`netlify.toml`) — como ~2.400 upserts 100% sequenciais, zero `createMany`, zero `$transaction`, com risco real de builds lentos ou com timeout. O problema só cresce: entre esta sessão ter começado e este ponto, o currículo passou de 30 para 35 módulos, e o vocabulário standalone já ia em 2.000+ palavras antes disto.

Correção, sem tocar na lógica de upsert em si — só na forma como as chamadas são disparadas:
- Novo `mapWithConcurrency<T>(items, concurrency, fn)`: corre `fn` sobre `items` em lotes de `concurrency` em paralelo (não tudo de uma vez, para não arriscar esgotar o pool de ligações do Postgres).
- `seedVocabularyBank`: os 2.000+ upserts (todos independentes entre si — ids distintos, sem FK) passam a correr em lotes de 25.
- `main()`: os 35 módulos de `MODULE_FILES` (confirmado por grep, ao longo de toda a sessão, que nenhum ficheiro de `content/curriculum/` partilha id com outro) passam a correr em lotes de 4. `lessonOrder` continua calculado do índice do array **antes** de qualquer `await` — por isso a ordem final das lições (`Lesson.order`) não depende da ordem em que os módulos terminam de ser seedados, mesmo correndo em paralelo.
- **Deliberadamente deixado sequencial**: os upserts *dentro* de cada módulo (vocabulário ~3-5 itens, exercícios 6 itens) — são poucos, e os exercícios têm uma FK real (`grammarConceptId`) para o `grammar_concept` do mesmo módulo, que tem de existir primeiro. Paralelizar ali teria risco sem benefício real, ao contrário dos dois casos acima onde os itens são genuinamente independentes.

**[POR CONFIRMAR EM RUNTIME]** — sem Node.js local nem deploy Netlify disponível (pausado até 2026-09-01) para medir o tempo de build real antes/depois desta mudança. Revisto com cuidado extra por leitura completa do ficheiro, exatamente pela mesma razão.

## 2026-08-27 — Fase 13 continuada: Zero Conditional + Present Perfect vs. Past Simple (A2)

Depois do 1º lote da Fase 13 (ver entrada abaixo), continuei a rever a cobertura de gramática à procura de gaps reais — não para "encher" o currículo, só onde havia mesmo uma lacuna genuína:

- **Zero Conditional** (`a2-module-10-zero-conditional.json`, A2.1, logo antes de first-conditional): 1st/2nd/3rd conditional existiam desde a Fase 4/9, mas o Zero Conditional (verdades gerais e hábitos — "If you heat water, it boils") nunca foi seedado, apesar de ser tipicamente o primeiro a ser ensinado, por ser o mais simples (Presente Simples nas duas orações, sem nenhum "would"/"will").
- **Present Perfect vs. Past Simple** (`a2-module-11-present-perfect-vs-past-simple.json`, A2.2, último módulo A2): Present Perfect (`a2-module-01-experiences.json`, "ever been to...") e Past Simple (A1) já existiam isolados, mas nunca a distinção direta entre os dois — provavelmente o ponto gramatical mais confuso para falantes de português especificamente, porque o Pretérito Perfeito Simples português ("já vi", "vi ontem") cobre os dois casos com o mesmo tempo verbal, sem a distinção que o inglês exige (Present Perfect sem data específica vs. Past Simple com data específica). Cobre `ever`/`yet`/`already` como vocabulário de apoio.

Mesmo processo de verificação dos lotes anteriores: JSON validado com `ConvertFrom-Json`, ids confirmados únicos por `grep` contra todo `content/curriculum/`, `prisma/seed.ts` atualizado com import + entrada em `MODULE_FILES` na posição pedagogicamente certa. **Currículo: 33 → 35 lições.**

## 2026-08-27 — Fase 14 (Inglês autêntico), 1º lote: genre/source + 3 formatos de texto novos

A auditoria (secção 5.4, Fase 14) pede: "Notícias e podcasts graduados · letras de música · clipes com legendas em 3 camadas (EN / EN+PT / sem legendas) · campo `genre`/`source` em `ReadingPassage`". Três desses quatro itens (podcasts, clipes com legendas, e notícias/letras REAIS) dependem de áudio/vídeo real — bloqueado desde a Fase 9 por ser uma decisão financeira do utilizador (TTS neural pago), e reproduzir letras de música ou notícias reais levanta um problema de direitos de autor totalmente à parte, que nunca deve ser contornado escrevendo cópias. O único item deste lote genuinamente executável a custo zero e sem risco de direitos de autor é o campo `genre`/`source` — feito.

- `ReadingPassage` (`src/content/readingPassages.ts`) ganha `genre?: "story" | "dialogue" | "email" | "news" | "instructions"` e `source?: string` (sempre `"original"` quando presente — nunca o nome de uma publicação real, para deixar claro que não é conteúdo copiado). Campo opcional e não retroativo: os 60 textos existentes (todos narrativa em 3ª pessoa, o único género usado até agora) continuam válidos sem ele.
- 3 textos novos, **originais**, escritos deliberadamente em formatos que nunca existiam no currículo: `email-to-a-colleague` (B1, email de trabalho sobre reagendar uma reunião), `planning-a-trip-dialogue` (A2, diálogo entre dois amigos a planear uma viagem), `local-news-new-park` (A2, notícia local sobre a abertura de um parque — estilo jornalístico, mas evento e nomes inventados).
- `ReadingRunner.tsx`: o `<p>` que mostra o texto ganhou `whitespace-pre-line` — sem isto, os `\n` usados para separar as falas do diálogo e as linhas do email colapsavam num único parágrafo corrido em HTML. Não afeta nenhum dos 60 textos existentes, que não têm `\n` nenhum (são um único parágrafo contínuo).

**Não feito neste lote, por depender de infraestrutura ainda bloqueada**: notícias/podcasts graduados de verdade (precisam de fontes reais licenciadas ou produção própria), letras de música (direitos de autor — mesmo com áudio pago resolvido, precisaria de licenciamento separado), clipes com legendas em 3 camadas (precisa de vídeo, que a app não tem de todo). Isto fica para quando a Fase 9 for desbloqueada.

## 2026-08-27 — Fase 13 (Currículo até B2), 1º lote: 3 módulos novos

A auditoria pede 30→80-120 lições (~2-3 meses de trabalho, P2 — a fase de conteúdo mais longa do roadmap). Isto não cabe numa sessão; decisão deliberada de começar pelos 3 gaps mais concretos e citados explicitamente na auditoria, em vez de tentar um lote grande genérico:

1. **Pre-A1 tinha só 1 módulo** (contra 14 de A1) — `pre-a1-module-02-numbers-time.json`: números, dias da semana, horas, gramática "there is/there are" (primeira vez que este módulo aparece no currículo, apesar de ser básico e muito usado).
2. **"Módulo de phrasal verbs"** — citado textualmente como item em falta na auditoria (secção 5.4, Fase 13). `a2-module-09-phrasal-verbs.json` (A2.2, último módulo A2): turn off, look after, give up, look into, get back to — 5 phrasal verbs em vez dos 3 habituais por módulo, porque o módulo inteiro é sobre este tópico.
3. **"Modais de capacidade"** — também citado textualmente. `a2-module-08-modals-ability.json` (A2.1, logo a seguir a obligation — must/have to → can/could/be able to, agrupando a família de modais): can/could/be able to, incluindo o erro clássico de falantes de português "I will can drive" em vez de "I will be able to drive" (\"can\" não tem forma de futuro).

Processo de verificação, igual ao usado em todos os lotes de conteúdo anteriores desta sessão (sem Node.js local para correr o seed a sério):
- Os 3 ficheiros seguem exatamente o schema de `docs/08-schema-json-conteudo.md` (confirmado por comparação lado a lado com `a1-module-01-daily-life.json` e `pre-a1-module-01-first-words.json`).
- Validados individualmente com PowerShell `ConvertFrom-Json` antes do commit — todos passaram.
- Ids (`module`, `unit`, `grammar_concept`, `vocabulary[].id`, `exercises[].id`, `lesson.id`) confirmados únicos por `grep` contra todo `content/curriculum/` antes de escrever os ficheiros — zero colisões.
- `prisma/seed.ts`: 3 imports novos + 3 entradas em `MODULE_FILES`, inseridas na posição pedagogicamente certa (logo a seguir ao módulo relacionado da mesma `sublevel_code`), seguindo a convenção já documentada no comentário acima do array.

**Currículo: 30 → 33 lições** (Pre-A1: 1→2, A2: 7→9). **Falta ainda, deliberadamente fora do escopo deste lote**: rebalancear A2 até aproximar de A1 (14 módulos), fonologia de fala ligada (elisão, reduções — o que a auditoria aponta como o que realmente bloqueia a compreensão de filmes), e o currículo B2 completo (B1 tem 8 módulos, B2 ainda não existe no schema como nível seedado). Isto fica para sessões futuras — é trabalho de escala, não uma correção pontual.

## 2026-08-27 — Fase 12 (Retenção): reparação de streak, "porquê", beco sem saída, renomear perfil

4 itens do roadmap, todos pequenos e independentes entre si:

1. **Reparação de streak** (`src/lib/gamification/recordActivity.ts`, novo campo `LearningProfile.streakFreezes`): antes, falhar 1 único dia zerava o streak sempre — sem exceção, mesmo para quem tinha semanas seguidas. Agora ganha-se 1 "congelamento" por cada semana completa de streak (7, 14, 21... dias), até 2 guardados; se faltar **exatamente** 1 dia (não 0, não 2+) e houver algum disponível, o streak continua e o congelamento é gasto automaticamente, sem o utilizador ter de fazer nada. Faltar 2+ dias seguidos continua a resetar sempre, com ou sem congelamentos — isto não é "streak infinito", só perdoa um deslize isolado. Mostrado em `StreakXp.tsx` com um ❄️ quando > 0 (prop opcional, retrocompatível com os 2 sítios que já a usavam sem passar essa prop).
2. **"Porquê" do onboarding em `/progress`**: `goal`/`targetDate` eram capturados no onboarding desde sempre, mas só lidos no prompt oculto do tutor de IA (`buildTutorPrompt.ts`) — nunca devolvidos ao utilizador em nenhum momento visível. Novo `src/lib/goalLabels.ts` (mapa `Goal` → frase em português, duplicado das strings já existentes em `OnboardingWizard.tsx` em vez de partilhado — o wizard é client-only e já verificado, não vale a pena arriscar mexer nele) alimenta um cartão no topo de `/progress`: "Está a aprender inglês para {motivo} — faltam N dias para o seu objetivo." Só aparece quando `goal !== "GENERAL"` (o valor por omissão não carrega motivo nenhum específico).
3. **`/profiles` deixa de ser um beco sem saída**: uma conta com 1 só perfil que chegasse aqui manualmente via "Gerir perfis" via apenas um cartão "Adicionar pessoa", sem nenhuma forma de voltar atrás sem cancelar a navegação do browser. Novo link "← Voltar" para `/home`, mostrado só quando é seguro (não faz *bounce* de volta para `/profiles`): sempre com 1 perfil (`requireUser()` escolhe-o automaticamente), ou com 2+ perfis só se o cookie de perfil ativo já apontar para um válido desta conta.
4. **Renomear perfil** (`src/app/(app)/profile/settings/actions.ts`, nova `renameProfile`): antes o nome de um perfil só podia ser escolhido uma vez, na criação — sem forma de corrigir um erro de digitação. Novo formulário em Definições, `user.id` (que já é o id do Profile ativo da sessão, nunca recebido de fora) como único alvo possível do update. Chama `revalidatePath("/profile/settings")` explicitamente — sem isso, o Server Action grava mas o Server Component da página continuava a mostrar o nome antigo até à próxima navegação, porque `<form action={...}>` sem `redirect()` nem `revalidatePath` não invalida por si só o Router Cache do lado do cliente (confirmado por leitura da documentação do App Router — sem build local para testar ao vivo).

## 2026-08-27 — Fase 11 (Accountability de erros): occurrences passa a agir

Achado da auditoria de 2026-08-27 (secção 3): `UserError.occurrences` era incrementado em 2 sítios mas lido em **exatamente um** — só para imprimir "3x" no ecrã de `/practice`. Nenhum limiar, nenhuma repescagem forçada, e as duas superfícies de "testa-me" da app (Diagnóstico Semanal e Sheets de tema, via `buildQuestionSet`) eram completamente cegas ao histórico de erros.

Quatro correções, todas dentro do que já existia no schema (sem migração):

1. **`getDueReviews` (`src/lib/srs/schedule.ts`) prioriza por `occurrences`**: dentro dos itens já `due`, os que têm mais ocorrências aparecem primeiro (antes: só por `dueAt`, mais antigos primeiro — um erro cometido 12 vezes e um cometido 1 vez eram indistinguíveis).
2. **Repescagem forçada acima de 3 erros**: `UserError` com `occurrences >= 3` e `resolvedAt: null` entram na fila de revisão mesmo que o SM-2 ainda não os tenha marcado como `due` — um erro que se repete tanto merece reforço antes do intervalo normal de esquecimento acabar. Implementado com 2 queries adicionais (erros forçados + os seus `ReviewScheduleItem`), sem alterar a assinatura pública da função nem os seus consumidores.
3. **`buildQuestionSet` (`src/lib/practiceQuestions.ts`) consulta `UserError`**: quando recebe `userId` (novo parâmetro opcional, para não quebrar chamadas existentes sem essa informação), busca os erros não resolvidos do utilizador por pilar e dá prioridade a exercícios cujas `tags` tocam nesse tópico concreto — o resto das vagas continua aleatório como antes. `getWeeklyTest` e a página de Sheets de tema (`/practice/topic/[pillar]`) passam a fornecer `user.id`. Nota: isto torna o Diagnóstico Semanal, antes idêntico para todos os utilizadores na mesma semana (`weekSeed`), agora também influenciado pelos erros de cada um — decisão deliberada, é exatamente o que "accountability" pede.
4. **`errorType` granular para pilares não-gramaticais** (`src/app/(app)/learn/actions.ts`, função `pickErrorType`): antes, `content.tags?.[0]` era sempre a string literal do pilar para VOCABULARY/LISTENING/READING/TRANSLATION (confirmado por grep no `content/curriculum/*.json` — ex. `["vocabulary", "hobbies"]`, `["listening", "work"]`), nunca o tópico concreto. Como `UserError` casa por `(userId, errorType)`, isso colapsava TODOS os erros de vocabulário de sempre numa única linha. Agora usa a 1ª tag que não seja um dos 6 nomes literais de pilar — para GRAMMAR, cuja 1ª tag já era específica (ex. "present-simple-questions"), o comportamento não muda.

Não implementado nesta fase, fora do que a auditoria pediu: `getDueReviewCount` (badge de contagem) continua a contar só `dueAt <= now`, sem incluir os itens de repescagem forçada — decisão deliberada de manter o escopo mínimo (é só um número de badge, não afeta o que é mostrado na fila real).

## 2026-08-27 — Fase 10 (Rubrica e oral a sério): rubrica de 4 eixos estendida a speaking

Achado E da auditoria de 2026-08-27: "rubrica só em writing... a competência mais difícil, e prioridade declarada da app, é a única sem rubrica". `WritingRubric` (grammar/vocabulary/coherence/taskAchievement, 0-100 cada) já existia desde a Fase 4 mas só era pedida/parseada para `kind === "writing"` em `getHolisticFeedback()` (`src/app/(app)/learn/actions.ts`).

Alterações:
- Condição do pedido de rubrica ao Gemini e do parsing da resposta passam de `kind === "writing"` para `kind === "writing" || kind === "speaking"`.
- **Ambiguidade de ordem resolvida antes de acontecer**: para speaking, o prompt já pedia uma linha extra `PRONUNCIATION:` antes de `SCORE:`. Ter duas instruções separadas, cada uma a dizer "linha imediatamente antes de SCORE", ficaria ambíguo para o modelo assim que speaking passasse a pedir rubrica E pronúncia ao mesmo tempo. Reescrito como uma única instrução ordenada: `GRAMMAR → VOCABULARY → COHERENCE → TASK_ACHIEVEMENT → PRONUNCIATION → SCORE`, cada marcador na sua própria linha, SCORE sempre o último.
- **Parsing verificado consistente com essa ordem**: o código extrai/remove de trás para a frente (SCORE primeiro, com `$` sem flag `m` — fim absoluto da string; depois PRONUNCIATION, mesma técnica, agora correto porque já é o novo fim depois do SCORE ser removido; só depois os 4 eixos da rubrica, com flag `m` por linha, independentes da posição exata). Confirmado por leitura cuidada linha a linha (sem build local para correr um teste real desta função — depende da API do Gemini).
- `submitSpeaking()` passa a devolver `rubric` tal como `submitWriting()` já devolvia.
- `SpeakingStep` (`src/components/lesson/LessonRunner.tsx`) ganha o mesmo bloco de 4 barras que `WritingStep` já tinha (reaproveitando o `RUBRIC_LABEL` já existente, definido no módulo antes de qualquer render acontecer — a ordem textual das duas funções no ficheiro não importa).
- Único ponto de chamada de `submitSpeaking()` confirmado por grep: só `LessonRunner.tsx`, nenhum outro sítio a atualizar.

**Canal de voz no AI Tutor (fecha a Fase 10 por completo)**: `TutorChat.tsx` era só texto. Ganhou dois sentidos: `RecordButton` junto ao campo de input preenche a pergunta por reconhecimento de voz (não envia sozinho — o utilizador pode rever/corrigir antes de premir Send, mesmo padrão já usado noutros sítios da app), e cada balão de resposta do tutor ganha um botão "🔊 Ouvir" que sintetiza o texto via `speechSynthesis`, respeitando o sotaque escolhido no onboarding (mesma lógica de preferência BRITISH/AMERICAN da Fase 9). A lógica de escolha de voz foi duplicada em `TutorChat.tsx` (função `speakWithVariant`) em vez de extraída de `PlayTranscript.tsx` para um ficheiro partilhado — é pequena e autocontida, e mexer no `PlayTranscript.tsx` já verificado, sem build local para confirmar a refatoração, era um risco desnecessário para poupar ~10 linhas. Com isto, a Fase 10 do roadmap está concluída.

## 2026-08-27 — Fase 9 (Áudio e Speaking): o que é possível sem custo

A Fase 9 do roadmap ("Áudio real") tem, no seu núcleo, um item que **não pode ser decidido nem executado unilateralmente nesta sessão**: gerar áudio pré-produzido com um TTS neural pago (Azure/ElevenLabs, já avaliados e postos de lado em decisões anteriores por causa do pivot de custo zero pedido explicitamente pelo utilizador). Contratar/pagar um serviço externo é uma decisão financeira — fica registada aqui como bloqueada à espera de confirmação do utilizador, não como "feita" nem "esquecida".

Dito isto, a auditoria (secção C) tinha 3 achados concretos que **são** resolvíveis sem sair do custo zero, porque a app já tinha os dados e a infraestrutura (Web Speech API) — só não os estava a usar corretamente. Os três foram corrigidos nesta sessão:

- **Sotaque nunca respeitado pelo TTS**: `LearningProfile.englishVariant` existia desde a Fase 0, era usado no prompt do tutor, mas nunca influenciava `PlayTranscript.tsx` — toda a gente ouvia sempre a mesma voz americana. Novo `EnglishVariantContext` (Provider em `(app)/layout.tsx` e `onboarding/placement/page.tsx`, os dois sítios com `PlayTranscript` fora do fluxo principal) evita ter de alterar os 11 sítios que já usam o componente; `pickVoice()` passa a preferir `en-GB` para BRITISH e `en-US` para AMERICAN, mantendo o comportamento antigo para INTERNATIONAL ou quando o sotaque pedido não está instalado no browser do utilizador.
- **Shadowing não pontuado de verdade**: `completeMicroChallenge` dava sempre 65 a um desafio "shadow", independentemente do que a pessoa dizia (ou não dizia) ao microfone — "ficar em silêncio dava a mesma nota". Ganhou um 3º parâmetro opcional `transcript`; quando presente, reaproveita `checkDictation` (já testado) para comparar palavra a palavra com a frase alvo e mapear a % de acerto para 30-100. Continua sem ser scoring fonético (não há áudio gravado para isso) — só deixa de ser uma constante cega.
- **`pronunciationScore`/`fluencyScore` nunca chegavam ao ecrã**: eram calculados e gravados desde a Fase 3, mas `submitSpeaking()` só devolvia `{feedback, attemptId}` — o utilizador só via esses números dias depois, como um eixo do octógono em `/progress`, nunca junto da frase que os gerou. `submitSpeaking()` passa a devolver os dois; `SpeakingStep` mostra-os como barras, rotulado "Pronúncia (estimativa)" para manter a honestidade já documentada no código (sinal indireto via transcript, não fonética real).

**O que fica genuinamente por fazer**, sem ambiguidade sobre a razão:
- Áudio pré-produzido / voz humana real — bloqueado, decisão financeira do utilizador.
- Progressão de listening em 5 níveis até filmes/música sem legendas, conteúdo autêntico (notícias/podcasts), fonologia de fala ligada — trabalho de conteúdo grande (Fases 13/14 do roadmap), não tocado nesta ronda.

## 2026-08-27 — Fase 8 (Blindagem): regressão crítica corrigida + endurecimento + primeiros testes

Resposta direta ao achado mais grave da 2ª auditoria (`docs/AUDITORIA-2026-08-27.md`). O utilizador pediu para avançar pelo roadmap sem pausar para perguntas — esta foi a primeira prioridade (P0).

### A regressão

A vulnerabilidade central da 1ª auditoria — notas/certificados forjáveis a partir do browser — tinha sido corrigida a 2026-08-26 (servidor volta a corrigir a partir do `Exercise` real no Diagnóstico Semanal e na prática por tema) e **reaberta na mesma sessão**, no commit `3753fb3`, ao ligar os micro-desafios ao octógono: `completeMicroChallenge(pillar: Pillar, score: number)` era uma Server Action pública que aceitava os dois valores do cliente sem verificação nenhuma (`Pillar` é só uma anotação TypeScript, apagada em runtime). O mesmo padrão tinha sido copiado, sem se aperceber, para mais 4 rotas (`dictation`, `reading`, `daily-challenge`, `idioms`) ao longo da sessão — nenhuma delas tocada pela correção original de 2026-08-26, por serem features novas criadas depois.

### A correção — verificação sempre no servidor, nunca no cliente

Padrão aplicado consistentemente às 5 rotas corrigíveis: o cliente deixa de enviar "o que aconteceu" (pilar, nota, correto/incorreto) e passa a enviar só "o que a pessoa fez" (que opção escolheu, que texto escreveu) — a correção real é recalculada no servidor a partir do conteúdo:

- **micro-challenges**: `completeMicroChallenge(challengeId, selectedIndex?)` — procura o desafio real em `src/lib/microChallenges.ts`, deriva o pilar do `kind` (shadow→SPEAKING, listen→LISTENING) e a nota da comparação `selectedIndex === challenge.correctIndex`.
- **dictation**: recebe `{itemId, given}[]`, recalcula com `checkDictation` contra `content/dictation.ts`.
- **reading**: recebe `{questionId, selected}[]`, recalcula contra `content/readingPassages.ts` (novo export `getReadingPassage`).
- **idioms**: recebe só `selected` — `getIdiomOfTheDay()` é determinístico por data, o servidor não precisa de nenhum id para saber qual é o idioma de hoje.
- **daily-challenge**: `recordVocabExposure` passa a comparar a tradução escolhida com o `VocabularyItem` real da BD; `completeDailyChallenge` teve uma correção mais leve e deliberada — não toca em nenhum pilar do octógono (só cria um registo de checkpoint), por isso só ganhou um clamp (`total` recalculado a partir do desafio real de hoje, `score` limitado a `[0, total]`), não uma reverificação item a item.
- **verbs**: `completeVerbOfTheDay(knewIt: boolean)` ficou **deliberadamente inalterado**. É uma autoavaliação ("sabia esta palavra?"), não uma correção objetiva — não há forma de "verificar" se alguém sabia uma palavra sem a testar, e o mesmo padrão de confiança em booleano já é aceite noutro sítio da app (`SpeakingAttempt.confidenceSelfRating`). Diferente de um score numérico inventado.

### Pilar não verificado no Diagnóstico Semanal e na prática por tema

Achado relacionado, na mesma família: `gradeSubmission.ts` já corrigia respostas a partir do `Exercise` real, mas `weekly-test/actions.ts` e `topic/actions.ts` continuavam a agrupar o resultado pelo `pillar` que o CLIENTE enviava, não pelo pilar real do exercício — submeter a resposta certa de um exercício fácil de GRAMMAR rotulado como WRITING inflacionava `writingScore`. `gradeAnswersOnServer` passou a devolver também o `pillar` real de cada `Exercise`; os dois chamadores agrupam/filtram por esse valor.

### Outros achados fechados nesta ronda

- **Injeção via `prompt`**: `submitWriting`/`submitSpeaking` só limpavam `text` dos marcadores de controlo (`SCORE:`, etc.) — `prompt` (também um argumento de uma Server Action pública) entrava cru na chamada ao Gemini, fora do fence. Os dois passam agora pela mesma cadeia de limpeza, e ambos ficam delimitados (`<lesson_prompt>`/`<learner_response>`).
- **Tutor**: `sessionFocus` não tinha validação nenhuma na API (só a página o gerava com segurança); `ERROR_LOGGED:` não era removido da mensagem do utilizador antes de ir para o Gemini (só o valor já parseado era limpo antes de gravar). Ambos corrigidos.
- **`onboarding/actions.ts`**: reescrito com validação completa — enums contra allowlists, `dailyMinutes` limitado a [1,240], `profession`/`interests` com limite de tamanho, `targetDate` validada como data futura real dentro de 2 anos. Antes não validava nada, e `profession` é injetado verbatim no system prompt do tutor em todas as sessões futuras — era uma injeção persistente.
- **Open redirect**: `safeNext` em `login/actions.ts` bloqueava `//evil.com` mas não `/\evil.com` — browsers normalizam `\` para `/` em esquemas especiais, por isso resolvia na mesma a um redirect externo. Corrigido o regex + limite de tamanho.
- **`checkAiRateLimit` não atómico**: fazia `count()` e `create()` como duas instruções separadas, sem exclusão mútua — pedidos concorrentes liam a mesma contagem e passavam todos. Corrigido com `pg_advisory_xact_lock` (um por utilizador via hash do id, um fixo para o teto global) dentro de uma `$transaction`.
- **IDOR na fila SRS**: `submitReview` só verificava a posse do `userErrorId` quando `itemType === "error"` — o ramo `vocabulary_item` reencaminhava um `userErrorId` não verificado para `scheduleReview`. Corrigido: só é encaminhado depois de confirmado como dono, nunca noutro caso.
- **Error boundaries**: novo `src/app/(app)/error.tsx`; try/catch adicionado aos 10 componentes de exercício que ainda não tinham (o pior caso citado pela auditoria: uma falha de rede a meio de um Diagnóstico Semanal deixava o utilizador preso num botão desativado, sem mensagem, num teste que só se pode repetir daqui a uma semana).

### Primeiros testes automáticos do projeto

Prometidos na Fase 2 original (2026-08-26), nunca feitos — confirmado pela 2ª auditoria. Adicionado `vitest` + `vite-tsconfig-paths` (lê o `paths` do `tsconfig.json`, sem duplicar o mapeamento `@/*`), script `npm test`. 4 ficheiros de teste, todos sobre lógica pura (sem mockar Prisma/BD): `sm2.test.ts` (SRS), `dictation.test.ts` (correção de ditado), `certificate.test.ts` (fronteiras de classificação — `classify` foi exportada para isto), `dailyPlan.test.ts` (plano diário). **A escrever o último, o teste "nunca devolve minutos negativos" falhou contra a implementação real**: para 16-19 minutos com revisões pendentes, `dailyMinutes - 20` dava um valor negativo (revisão 10 + desafio diário 10 = 20, mais do que o total disponível nesses casos), mostrando ao utilizador um item de "-4 min" em `src/lib/plan/dailyPlan.ts`. Corrigido com `Math.max(5, ...)` no mesmo commit — prova concreta de que vale a pena escrever estes testes mesmo sem conseguir correr a suite localmente (a lógica do teste é verificada manualmente linha a linha, mas a própria escrita do teste já obriga a percorrer casos-limite que a implementação original não tinha considerado).

### Verificação

Sem build local (sem Node.js) nem deploy real (Netlify pausada até 2026-09-01) para validar 34 ficheiros de mudanças de segurança, foram usados 2 agentes de revisão independentes antes do commit: um a confirmar cada achado da auditoria por leitura de código antes de começar a corrigir, outro a rever cada correção depois de aplicada (assinaturas de função, chamadores atualizados, ausência de caminhos por validar). Ambos confirmaram sem problemas bloqueantes.

## 2026-08-27 — Fase 7: polimento (acessibilidade, performance, código morto)

Passagem sistemática pelos 3 itens do roadmap da Fase 7 ("Acessibilidade completa · performance · limpar schema morto"). Achados e o que foi feito:

**Acessibilidade — corrigido:**
- `aria-current="page"` no item ativo do `BottomNav` — antes só a cor (verdigris) distinguia o separador ativo, invisível para leitores de ecrã.
- Campo "Nome" do formulário de criar perfil em `/profiles` tinha só `placeholder`, sem `<label>` — inconsistente com o resto da app (login/signup/forgot-password já envolvem sempre os campos num `<label>` com texto visível). Corrigido para o mesmo padrão.
- Confirmado (não precisou de correção): `globals.css` já tem uma regra `:focus-visible` global (outline verdigris, 2px, offset 2px) que cobre TODOS os elementos focáveis da app de forma consistente — cheguei a adicionar um anel de foco específico ao `Button` antes de notar isto e reverti, para não criar dois estilos de foco diferentes.
- Confirmado (não precisou de correção): `<html lang="pt-PT">` já definido; zero `<img>` sem `alt` (a app não usa imagens raster, só SVG/cor); `prefers-reduced-motion` já respeitado desde uma fase anterior.

**Acessibilidade — encontrado, não corrigido (decisão de design, não bug):** o texto na cor `verdigris` (#3E7C6B) sobre fundo `linen` (#F5F2EC) — usado extensivamente como cor de link e de rótulo (`font-mono text-xs uppercase text-verdigris`) — tem uma taxa de contraste calculada de **~4.37:1**, ligeiramente abaixo do mínimo AA de 4.5:1 para texto normal (passa confortavelmente para texto grande, que só precisa de 3:1). A correção seria escurecer ligeiramente o `verdigris` (ex. para algo como #3A7565 dá ~4.8:1) — mas isto é a cor de marca principal, usada em centenas de sítios (botões, links, eyebrows de cards), e mudar identidade visual sem confirmação já foi tratado como decisão do utilizador nesta sessão antes (ver "Redesenho de interação estilo Busuu"). Não alterado sem essa confirmação — fica registado aqui com o número exato para decidir rapidamente numa sessão futura, sem repetir o cálculo.

**Performance — revisto, sem alterações necessárias:** grep por padrões de N+1 (`.map(async` a chamar Prisma dentro de loops) não encontrou nenhum caso real — o único `.map(async)` existente (`api/placement/submit/route.ts`) chama a IA por pergunta de resposta livre, inerente ao scoring individual, não uma query de BD repetida. Proporção de client components (21/72, ~29%) razoável para uma app interativa. Sem forma de medir bundle size real sem build local — não se pode confirmar mais do que isto sem um deploy real.

**Código morto — revisto com um agente dedicado, dado o volume do codebase:** confirmado zero referências residuais aos 5 modelos Prisma já removidos numa fase anterior (`Question`, `UserVocabularyMastery`, `UserConceptMastery`, `Bootcamp`, `BootcampEnrollment`, enum `MasteryState`); zero componentes ou funções de `lib/` nunca importados; zero comentários `TODO`/`FIXME` esquecidos. Único achado: `MicroChallengeKind` (`src/lib/microChallenges.ts`) — um type alias exportado mas nunca importado em lado nenhum (as duas interfaces que o usariam declaram `kind` com literais diretos) — removido.

## 2026-08-27 — Fase 6: perfis múltiplos por conta ("Família", estilo Netflix)

A maior mudança de arquitetura desta sessão. O utilizador foi explicitamente consultado (via pergunta direta, não decisão unilateral) porque isto tinha um perfil de risco muito diferente de tudo o resto feito nesta sessão — em vez de ser aditivo (ficheiros novos, colunas opcionais), tocava potencialmente em ~15 tabelas de progresso e ~47 ficheiros que as consomem. As 3 opções apresentadas: (1) contas separadas por pessoa + um "hub" para trocar rapidamente, baixo risco; (2) perfis reais sob um único login (estilo Netflix), risco maior, exige mudar o schema; (3) adiar a Fase 6 para outra sessão. **O utilizador escolheu a opção 2.**

### Desenho da migração

O princípio orientador foi minimizar a superfície de mudança no código de aplicação, mesmo à custa de o schema ficar um pouco menos "limpo" à primeira vista:

1. **Novo modelo `Profile`**: pertence a um `User` (a conta/login partilhado da família), tem `name`, `avatarColor` (cor sólida, sem upload de imagem — mantém o custo zero), `isChild`.
2. **As ~15 tabelas de progresso** (LearningProfile, ExerciseAttempt, SpeakingAttempt, WritingAttempt, Translation, UserError, ReviewScheduleItem, PlacementTest, AssessmentResult, Certificate, UserAchievement, AIConversation, LearningPlan, IntensivePlan, AnalyticsEvent) **mantiveram o campo escalar `userId` com esse nome** — só a FK passou a apontar para `Profile.id` em vez de `User.id`, e a relação Prisma foi renomeada de `user` para `profile`. Isto significa que **nenhum dos ~47 ficheiros que fazem `where: { userId: ... }` ou `data: { userId: ... }` precisou de ser tocado** — continuam a compilar e a funcionar exatamente como antes, só que agora corretamente isolados por perfil em vez de por conta. Confirmado por grep exaustivo: só 1 sítio no código acedia à relação Prisma pelo nome (`certificate.user.name` em `verify/[code]/page.tsx`), corrigido para `certificate.profile.name`.
3. **`requireUser()` em `src/lib/session.ts` foi reescrita** para devolver o PERFIL ativo (não a conta) com a mesma forma (`id`, `name`, `email`, `createdAt`) que devolvia antes — a conta real fica em `.accountId`/`.accountEmail` para os poucos sítios que precisam mesmo dela (apagar conta, exportação RGPD). Nova `requireAccount()` para autenticação pura, sem resolução de perfil (usada só em `/profiles`, para não criar um ciclo de redirect).
4. **Resolução automática do perfil ativo**: conta nova → cria o primeiro perfil automaticamente com o nome da conta (comportamento idêntico ao de sempre, zero passo extra). Conta com 1 perfil → esse é sempre o ativo, sem seletor. Conta com 2+ perfis → lê um cookie `active_profile_id` (httpOnly); se não corresponder a nenhum perfil válido dessa conta, redireciona para `/profiles`.
5. **`/profiles`** (fora do grupo `(app)`, tal como `/onboarding`): seletor visual (avatares coloridos com inicial) quando há 2+ perfis, e um formulário "Adicionar pessoa" sempre visível (também acessível com 1 só perfil, via "Gerir perfis" em Definições, para criar o segundo). `selectProfile`/`createProfile`/`switchProfile` como Server Actions, com autorização (`findFirst({ where: { id, userId: account.id } })`) para impedir ativar um perfil de outra conta.
6. **Eliminação de dados (RGPD)** — `deleteAccount()` em `profile/privacy/actions.ts` foi reescrita: apaga o PERFIL ativo (cascata já existente no schema trata do resto), e só apaga também a conta + termina sessão se era o último perfil. Antes disto (numa conta com vários perfis), apagar o "meu perfil" apagaria sempre a conta inteira, incluindo o progresso de outros membros da família — exatamente o oposto de "privacidade entre perfis".
7. **AI Tutor ganha consciência de `isChild`** (`buildTutorPrompt.ts`): quando o perfil é marcado como criança no formulário de criação, o prompt do tutor pede vocabulário mais simples, tom mais paciente, e evita temas adultos — sem alterar nível/conteúdo (isso continua a vir do placement test, não da idade autodeclarada). Adicionado porque o checkbox "é uma criança" no formulário já prometia isto na copy — preferível implementar o efeito real a deixar uma promessa vazia na UI.

### Verificação

Sem build local disponível (sem Node.js) e com os deploys da Netlify pausados até 2026-09-01, esta foi a mudança de maior risco de toda a sessão — não há forma de a testar viva antes de chegar a produção. Por isso, ao contrário do resto da sessão (onde uma releitura cuidadosa bastava), foi pedida uma revisão independente por um agente à parte, cobrindo: schema completo (as 15 relações + índices/uniques), `session.ts` linha a linha, grep exaustivo por qualquer acesso remanescente à relação `user` renomeada, os ficheiros novos (`/profiles`), a reescrita de `deleteAccount()`, e todos os pontos de criação de `User` (signup, seed). Veredito: sem problemas estruturais encontrados, seguro para avançar.

### O que fica por fazer (deliberadamente fora desta ronda)

- Sem forma de o utilizador **renomear** um perfil depois de criado (só criar/escolher/apagar). Pequeno, fácil de adicionar depois.
- Sem avatar com imagem — só cor sólida com inicial, para manter custo zero (sem upload/armazenamento de imagens).
- O primeiro perfil de uma conta nova herda o `name` da conta (do metadata do Supabase Auth no signup) — se o titular da conta quiser mudar esse nome depois de criar mais perfis, não há UI para isso ainda (só para os perfis criados depois, via `/profiles`).

## 2026-08-27 — Teto global diário de chamadas à IA + 3 módulos B1 novos (densidade)

Duas correções pequenas, mesma sessão, depois de fechar a leitura graduada.

**Teto global de IA (auditoria ALTO #6, "sem rate limiting... pode esgotar a quota gratuita partilhada", sinalizado como NÃO CORRIGIDO)**: `checkAiRateLimit` já tinha um limite por utilizador (20/10min, desde a Fase 2), mas nada protegia contra vários utilizadores/contas juntos esgotarem a quota diária partilhada do Gemini. Adicionado um teto global de 800 chamadas/24h (todos os utilizadores juntos), mesma tabela `AnalyticsEvent`, mesmo padrão de falha aberta. 800 é uma estimativa conservadora, não confirmada por teste ao vivo (deploys pausados) — o objetivo é nunca chegar perto do limite real, não usá-lo até ao fim. Fecha o último item ALTO da lista de bugs críticos da auditoria original que ainda estava por corrigir.

**3 módulos B1 novos** (`b1-module-06-used-to.json`, `-07-modals-deduction.json`, `-08-third-conditional.json`): B1 tinha só 5 módulos desde a introdução do nível, sinalizado como "menos denso que A1/A2". Agora tem 8 (4 em B1.1, 4 em B1.2): "used to" para hábitos passados, modais de dedução (must/might/could/can't — distintos do "must" de obrigação já ensinado em A2), Third Conditional para arrependimentos sobre o passado. Mesmo formato completo dos módulos existentes (regra + exemplo + erro comum PT + 3 vocab + 6 exercícios + lição de 10 passos). Total de módulos de gramática seedados: 27→30.

## 2026-08-27 — Leitura graduada: alvo de 60 textos atingido (4→60)

Quarto e último lote desta ronda de conteúdo. `readingPassages.ts` tinha 4 textos no início da auditoria de 2026-08-26 (item "leitura graduada (4→60 textos)" explicitamente citado como em falta). Depois de 4 lotes de 20+10+10+7 ao longo desta sessão, chega aos **60 textos**, distribuídos de forma equilibrada: 10 Pre-A1, 17 A1, 17 A2, 16 B1. Últimos 7: `my-favourite-toy`, `at-the-playground` (Pre-A1), `a-rainy-day`, `my-favourite-food` (A1), `starting-a-new-job`, `learning-to-swim` (A2), `the-importance-of-sleep` (B1).

Mesmo processo de verificação em todos os 4 lotes: escrever → grep de ids/títulos duplicados contra TODO o ficheiro (não só o lote novo) → corrigir antes do commit se necessário → só depois commitar. Isto apanhou 1 duplicado real (`the-weekly-market`, ver entrada "Segundo lote" abaixo) antes de chegar ao repositório — prova de que a verificação continua a valer a pena a esta escala, tal como já tinha acontecido com o vocabulário.

**Fecha completamente** o item "leitura graduada" da secção 291 da auditoria original. Não fica nenhum item de conteúdo por fazer da lista original — o que resta agora é aprofundamento (mais textos, mais módulos B1, mais vocabulário ligado a lições), não lacunas estruturais.

## 2026-08-27 — Segundo lote: mais 10 textos de leitura (33→43)

Continuação imediata do lote anterior. Mesmo critério (reforçar módulos gramaticais, variar temas, balancear níveis). **Incidente apanhado pela verificação de rotina**: o rascunho inicial deste lote incluía um texto A1 chamado "The Weekly Market" que, ao correr a verificação de ids duplicados (mesma prática obrigatória desde o incidente de duplicados no vocabulário), revelou ser quase idêntico a um texto já existente com o mesmo título e tema (mercado semanal, do primeiro lote de 20 do fecho da Fase 3). Substituído por "A Trip to the Library" antes do commit — nenhum duplicado chegou a ir para o repositório. Fica registado como lembrete: com 40+ textos já escritos, a probabilidade de reinventar sem querer um tema já usado sobe, por isso a verificação de ids/títulos deixou de ser opcional também para este conteúdo (mesmo raciocínio já aplicado ao vocabulário a partir dos 2.000+ headwords).

Total agora: **43/60** textos do alvo da auditoria ("leitura graduada").

## 2026-08-27 — Mais 10 textos de leitura (leitura graduada, auditoria secção 291)

Continuação da mesma sessão, depois de fechar o balanço da secção 294. "Leitura graduada (4→60 textos)" continua na lista da auditoria — este é mais um incremento, não o fecho do item (33 de um alvo de 60, ver nota de honestidade abaixo). Reforçados os níveis mais fracos: Pre-A1 tinha só 1 texto (agora 3), A1/A2/B1 receberam mais 3/2/3 respetivamente. Cada texto novo foi escolhido para reforçar um ponto gramatical de um módulo já seedado, mesmo critério usado no primeiro lote de 20 (2026-08-27, "Fase 3 fechada"): `learning-a-new-hobby`→Present Perfect, `a-visit-to-the-doctor`→should/have to, `a-difficult-decision`→Past Perfect + condicionais, `how-paper-is-recycled`→Passive Voice (tema diferente de `how-coffee-is-made`, para não repetir o mesmo assunto), `choosing-a-university-course`→modais de possibilidade (might/could), pouco usados noutro conteúdo.

**Nota de honestidade**: 33/60 é mais de metade do alvo original da auditoria, mas ainda não está lá. Ao ritmo de ~10 textos por lote (cada um requer escrever texto + 3 perguntas + verificar manualmente sem `tsc`), fechar os 60 exigiria mais 2-3 lotes semelhantes. Prioridade mais baixa do que os itens estruturais/funcionais da secção 294 (já fechados nesta sessão), porque conteúdo de referência estático tem menor risco e pode ser continuado em qualquer sessão futura sem perder contexto — este ficheiro de decisões documenta o critério (reforçar módulos gramaticais, variar níveis, não repetir temas) para essa continuação não precisar repetir a análise.

## 2026-08-27 — Fase 4: balanço da secção 294 da auditoria (o que ficou e o que falta, com justificação)

Fecho desta ronda de Fase 4. A secção 294 da auditoria listava, em conjunto: "Progressão estruturada · roleplay por cenário (restaurante/hotel/aeroporto/reunião) · scoring de pronúncia · tempo de resposta (automaticidade) · guardar áudio para auto-avaliação · feedback fonético PT→EN · shadowing · conversa livre com objetivo · simulação de entrevista por setor · métrica de confiança". Balanço item a item:

- ✅ **Roleplay por cenário** — feito nesta sessão (personalidade `roleplay`, 4 cenários).
- ✅ **Scoring de pronúncia** — feito numa sessão anterior (sinal indireto via transcript, `PRONUNCIATION:` em `getHolisticFeedback`).
- ✅ **Tempo de resposta (automaticidade)** — feito numa sessão anterior (`responseTimeMs` em `SpeakingAttempt`, capturado em `LessonRunner`). Nota: só grava o dado, não constrói ainda uma feature de "Automaticity Training" dedicada em cima dele (ex. comparar tempos ao longo do tempo, dar feedback sobre velocidade) — o dado está lá para essa feature futura.
- ✅ **Feedback fonético PT→EN** — já existia parcialmente (dicas inline no feedback de speaking); complementado nesta sessão com a referência proativa `/practice/pronunciation`.
- ✅ **Shadowing** — já existia desde a Fase 2/3 (`MICRO_CHALLENGES` tipo `shadow`, 2 frases). Não expandido nesta sessão (ver nota de progressão estruturada abaixo).
- ✅ **Conversa livre com objetivo** — feito nesta sessão (`GOAL_FOCUS` no Conversation Partner).
- ✅ **Simulação de entrevista por setor** — já existia desde 2026-08-26 (`INTERVIEW_SECTORS`).
- ✅ **Métrica de confiança** — feito nesta sessão (`confidenceSelfRating`).
- ✅ **Progressão estruturada** — **feito depois deste balanço, na mesma sessão**: secção "Progressão sugerida" no topo de `/speak`, 4 cartões (Palavra → Frase → Diálogo → Conversa) ligando às rotas já existentes (`/practice/pronunciation`, `/practice/micro-challenges`, roleplay, conversation_partner). Puramente aditivo — sem lógica nova, sem alterar nenhuma rota por baixo, sem remover a lista de personalidades original (continua disponível por baixo, "Ou escolha diretamente"). A avaliação de risco original abaixo (evitar mudanças de UX sem poder testar visualmente) mantém-se válida em geral, mas para uma reorganização puramente aditiva de uma página existente — sem lógica de servidor nova, só uma grelha de links — o risco é baixo o suficiente para avançar mesmo sem preview visual.
- ❌ **Guardar áudio para auto-avaliação** — **deliberadamente não implementado**. Exigiria (1) gravação real de áudio no browser (`MediaRecorder`, não só transcript via Web Speech API), (2) upload e armazenamento (Supabase Storage, o único sítio possível dada a stack atual), e (3) custo de armazenamento a crescer sem limite por utilizador — o que contraria o pivot explícito de "custo zero" desta sessão (ver decisão "Pivot: stack 100% gratuita" mais abaixo neste ficheiro). Não é um esquecimento: é incompatível com a restrição de orçamento até essa restrição ser revista com o utilizador.

Todos os itens ✅/⚠️ estão a par de contexto suficiente para uma sessão futura decidir se vale a pena aprofundar (ex. construir a "Progressão estruturada" visual) sem repetir esta análise.

## 2026-08-27 — Fase 4 (continuação): referência de Sons e Pronúncia PT→EN

Mesma sessão contínua. "Feedback fonético PT→EN" (auditoria secção 294) já tinha uma resposta reativa (dicas inline no feedback de speaking, baseadas no transcript de um erro específico) — faltava a referência proativa, para consultar antes de um erro acontecer. Nova página `/practice/pronunciation` com 8 padrões previsíveis de interferência do português (som TH, consoantes finais engolidas, acento tónico, vogais curtas/longas tipo ship/sheep, R inglês vs. português, letras mudas, clusters S+consoante no início — "eschool" vs. "school" —, as 3 pronúncias de -ED), cada um com palavras de exemplo ouvíveis via `PlayTranscript`. Conteúdo estático (`src/content/pronunciationTips.ts`), mesmo padrão de `culturalTips.ts`/`sentencePatterns.ts`.

## 2026-08-27 — Fase 4 (continuação): conversa livre com objetivo

Mesma sessão contínua. Último item da secção 294 da auditoria a fechar nesta ronda: "conversa livre com objetivo". O Conversation Partner já existia mas começava sempre com um "de que quer falar?" em aberto. Adicionados 4 objetivos rápidos (small talk, contar o fim de semana, dar uma opinião, comentar uma notícia) selecionáveis em `/speak`, mesmo mecanismo de `sessionFocus` já usado para setor/cenário (`GOAL_FOCUS` em `speak/tutor/page.tsx`). Diferença deliberada face ao roleplay: aqui a conversa continua livre e pode divergir do objetivo inicial — só deixa de começar do zero.

## 2026-08-27 — Fase 4 (continuação): rubrica de writing com 4 subscores

Mesma sessão contínua. A auditoria original (secção 291) listava "rubrica de writing" como conteúdo em falta — o feedback de writing já existia (`getHolisticFeedback`), mas dava só um número holístico (`SCORE`), sem dizer ao utilizador ONDE está fraco. Estendido para pedir também `GRAMMAR`/`VOCABULARY`/`COHERENCE`/`TASK_ACHIEVEMENT` (0-100 cada), na mesma técnica de "linha à parte no fim da resposta" já usada para `SCORE`/`PRONUNCIATION` — sem depender de JSON mode da API. `TASK_ACHIEVEMENT` avalia especificamente se a resposta cumpre o que o prompt pedia (tema, tamanho, formato), separado da correção linguística — a rubrica só é montada se as 4 dimensões vierem completas, para nunca mostrar uma rubrica parcial enganosa.

Sanitização do input do utilizador estendida às 4 novas marcas, replicando exatamente a defesa já usada para `SCORE`/`PRONUNCIATION` (sem isso, escrever "...GRAMMAR: 100" na resposta inflaria esse subscore). `submitWriting()` mudou de assinatura de retorno (`string` → `{ feedback, rubric }`); só havia um call site (`WritingStep` em `LessonRunner.tsx`), atualizado no mesmo commit, que agora mostra 4 barras de progresso por baixo do feedback textual. `WritingAttempt.feedbackJson` (campo `Json?`, nunca lido em lado nenhum antes) passou a guardar `{ text, rubric }` em vez de só a string — sem schema change, sem risco.

## 2026-08-27 — Início da Fase 4: roleplay por cenário, ditado, métrica de confiança

Sessão contínua (mesmo pedido do utilizador de 2026-08-27, ver entrada mais abaixo "Fase 3 fechada"), a seguir diretamente ao fecho da Fase 3. Três funcionalidades da secção 294/291/310 da auditoria original:

**Roleplay por cenário** — nova personalidade `roleplay` do AI Tutor (`src/lib/ai/personalities.ts`), com 4 cenários (restaurante, hotel, aeroporto, reunião de trabalho) selecionáveis em `/speak`, cada um com uma instrução de `sessionFocus` que faz o Gemini encarnar a personagem certa e manter a cena focada em vocabulário prático da situação, reaproveitando o mecanismo já existente para o setor do interviewer. **Nota de segurança encontrada e corrigida**: o enum `TutorPersonality` do Prisma schema tinha de ganhar `ROLEPLAY` — sem isso, `personality.toUpperCase() as any` em `route.ts` teria tentado gravar um valor de enum inválido na BD na primeira conversa de roleplay, o que teria falhado em runtime (não em build, já que o cast `as any` esconde o erro de tipo do TypeScript). Apanhado por revisão cuidadosa antes de finalizar, não por erro em produção.

**Ditado** — novo modo `/practice/dictation`: sintetiza uma frase em voz alta (reaproveita `PlayTranscript`/Web Speech API, sem custo) sem mostrar o texto, o utilizador escreve o que ouviu, comparação normalizada (ignora maiúsculas/pontuação/espaços, mantém apóstrofos para não confundir contrações) com feedback palavra-a-palavra. 20 frases estáticas (`src/content/dictation.ts`, Pre-A1→B1), escolhidas propositadamente por pontos que costumam confundir a escrita de falantes de português (homófonos "they're"/"their", "whose"/"who's", contrações, passados irregulares) — não frases genéricas. Seleção diária determinística de 5 frases (mesmo padrão de `dailyChallenge.ts`, hash da data). Conteúdo estático, sem schema novo, à exceção do achievement `first_dictation` (seedado, padrão já estabelecido).

**Métrica de confiança** — depois do feedback de um exercício de speaking numa lição, pergunta-se ao utilizador "Quão confiante se sentiu?" (1-5), gravado em `SpeakingAttempt.confidenceSelfRating` (campo novo, nullable — aditivo, seguro sob `db push --accept-data-loss`). É um sinal subjetivo por natureza (perguntado, não medido), documentado como tal no schema — não fingir que é uma medição objetiva de fluência. `submitSpeaking()` teve de mudar a sua assinatura de retorno de `string` para `{ feedback, attemptId }`, para o pedido seguinte (`submitSpeakingConfidence`) poder atualizar a mesma linha depois de o utilizador escolher a nota; só havia um call site (`LessonRunner.tsx`), atualizado no mesmo commit. Progress mostra a média das últimas 20 autoavaliações quando existir pelo menos uma.

**Nota sobre organização deste ficheiro**: as entradas mais recentes de 2026-08-26 (abaixo) e esta ficam no topo; a entrada "Fase 3 fechada" de 2026-08-27 e as fundações da Fase 0 continuam no fim do ficheiro, por terem sido escritas antes de eu notar a convenção de ordem inversa já em uso aqui. Não reorganizado retroativamente para não arriscar um erro de edição num ficheiro grande sem verificação automática disponível — a informação está toda lá, só a ordem física não é 100% consistente.

## 2026-08-26 — Limpeza do schema morto (5 modelos + 2 enums órfãos)

Continuação da Fase 3/4 (sessão sem o utilizador presente, "avançar sem parar"). A auditoria original tinha identificado 5 modelos Prisma nunca escritos nem lidos por nenhum código: `Question`, `UserVocabularyMastery`, `UserConceptMastery`, `Bootcamp`, `BootcampEnrollment`. Confirmei com grep exaustivo em `src/` e `prisma/` antes de tocar em nada — zero referências a qualquer um destes nomes, incluindo tipos gerados (`Prisma.Question...`, etc.).

Removidos do `prisma/schema.prisma`:
- `Question` — e o campo `Answer.questionId`/`Answer.question` que lhe apontava (já tinha sido tornado opcional na Fase 1, precisamente por causa da FK inválida que este modelo causava; agora deixa de existir de todo).
- `UserVocabularyMastery` e `UserConceptMastery` — e os campos `masteryRecords` em `VocabularyItem`/`GrammarConcept` e `conceptMastery`/`vocabMastery` em `User` que lhes apontavam.
- `Bootcamp` e `BootcampEnrollment` — e o campo `bootcampEnrollments` em `User`, e o valor `BOOTCAMP` do enum `AttemptSource`.
- O enum `MasteryState`, que ficou órfão depois de remover os dois modelos de mastery.

Cada remoção deixou um comentário no schema a explicar o quê e porquê, para não parecer uma omissão acidental numa leitura futura. Isto é seguro por três razões: (1) as tabelas nunca receberam nenhuma escrita, por isso `prisma db push --accept-data-loss` (já usado em todos os deploys) não perde dados reais; (2) zero código de aplicação referencia estes nomes, confirmado por grep; (3) os deploys continuam pausados até 2026-09-01, por isso há tempo de sobra para detetar qualquer problema antes de isto chegar a produção.

## 2026-08-26 — FASE 3 da auditoria (fecho): 2.004 palavras de vocabulário

## 2026-08-26 — FASE 3 da auditoria (fecho): 2.004 palavras de vocabulário

Pedido explícito do utilizador: "pode continuar e agora só parar quando chegar às 2000 palavras de vocabulário." Trabalho contínuo, sem pausas para confirmação, ao longo de **11 novos bancos de vocabulário** (`vocabulary-bank-4.json` a `-19.json`, mais o `-3.json` já existente da entrada de fase 3 anterior), levando o total de **~480 para 2.004 palavras**.

**Categorias cobertas neste fecho:** animais (incl. aves, insetos, criaturas marinhas), cores/formas/padrões, roupa e acessórios, casa (todas as divisões, mobília, eletrodomésticos), transporte e condução, escola/universidade/disciplinas, línguas/nacionalidades, comida e bebida (incluindo pratos específicos, condimentos, texturas/sabores), profissões, geografia, media/comunicação, sociedade/lei/política, tecnologia, saúde/condições médicas, negócios/finanças, desporto (incl. equipamento), música/instrumentos, arte/entretenimento, natureza/ciência, emoções (dezenas de estados distintos), personalidade, tempo/frequência, números/quantidade, e centenas de verbos e adjetivos de uso corrente.

**Processo — reforçado depois do incidente de duplicados do lote anterior:** cada ficheiro foi (1) validado com PowerShell `ConvertFrom-Json`, (2) verificado por grep contra **ids E headwords** de todo o `content/curriculum/`, antes de qualquer ligação ao `seed.ts`. Ainda assim surgiram duplicados pontuais em quase todos os lotes (13 no total, incluindo "swim", "square", "cosy", "carry on", "workout", "hire", "sign up", "gloves", "journalist", "forecast") — todos detetados pela verificação automática e corrigidos por substituição antes do commit, nunca por decisão manual não verificada. Isto confirma que, a esta escala (mais de 2.000 headwords), a verificação automática deixou de ser opcional — é a única forma fiável de garantir zero duplicados.

**Resultado final confirmado:** content/curriculum/ tem **2.274 ids e 2.004 headwords, ambos 100% sem duplicados**. `VOCABULARY_BANKS` em `seed.ts` lista os 19 ficheiros na ordem correta.

### Nota honesta sobre qualidade a esta escala
Ao contrário dos primeiros bancos (vocabulary-bank e -2, da Fase 0, e -3, mais cuidadosamente tematizado), estes últimos lotes foram escritos num ritmo mais rápido para atingir o volume pedido — cada entrada continua a ter tradução PT-EU verificada, definição em inglês precisa e frase de exemplo real, mas o nível de escolha editorial por palavra (porquê esta palavra e não outra, como se encaixa no currículo) é necessariamente menor do que nos módulos de gramática, onde cada vocab item foi escolhido para reforçar o ponto gramatical da lição. **Nenhum destes 2.004+ itens está ligado a uma lição** — são todos vocabulário standalone (`VocabularyItem` sem `lessonId`), alimentando o Desafio Diário e a Revisão (SRS), não o currículo estruturado. Isto é consistente com a arquitetura já existente (`docs/decisions.md`, "Vagas sucessivas... vocabulário standalone... não associado a nenhuma lição"), mas vale a pena que o utilizador saiba: 2.000 palavras aqui significa cobertura lexical ampla para revisão e desafios diários, não 2.000 palavras ensinadas explicitamente dentro de lições com contexto gramatical, como as ~90 que estão nos 22 módulos de currículo.

## 2026-08-26 — FASE 3 da auditoria (continuação): introdução do nível B1

Terceira continuação da mesma sessão. **Correção a uma suposição anterior**: nas duas entradas de decisão abaixo eu tinha assumido que introduzir B1 era "uma alteração maior de schema/conteúdo, reservada para uma passagem dedicada". Isso estava errado — o enum `CefrLevel` do `prisma/schema.prisma` **já incluía B1/B2/C1/C2** desde a Fase 0 (só nunca tinham sido usados). Introduzir B1 é trabalho de conteúdo puro (editar `levels.json` + escrever módulos), não uma migração de schema. Corrigido o entendimento e feito nesta mesma sessão, com a mesma disciplina de validação.

**`content/curriculum/levels.json`**: novo nível B1 ("Threshold"), com 2 sublevels (B1.1, B1.2), a seguir a A2.2.

**5 módulos novos de gramática B1** — os 5 conceitos que restavam da lista original de 15 "em falta" na auditoria:
- **Past Perfect** (B1.1) — mod_b1_1_past_perfect
- **Second Conditional** (B1.1) — mod_b1_1_second_conditional
- **Passive Voice** (B1.1) — mod_b1_1_passive_voice
- **Reported Speech** (B1.2) — mod_b1_2_reported_speech
- **Future Continuous** (B1.2) — mod_b1_2_future_continuous

**Cobertura de gramática: 24/24** do checklist original da auditoria (secção 9 do `docs/AUDITORIA-2026-08-26.md`). Todos os 15 conceitos listados como "em falta" estão agora cobertos, mais os que já existiam desde antes desta sessão.

**Processo:** cada um dos 5 ficheiros validado individualmente com PowerShell `ConvertFrom-Json` antes de qualquer coisa. Desta vez, ao contrário do lote anterior, verifiquei explicitamente colisões de **id E headword** contra todo o `content/curriculum/` antes de ligar ao `seed.ts` — a lição da entrada anterior (onde só tinha verificado ids e reintroduzi 12 duplicados). Resultado: **767 ids e 497 headwords, ambos sem duplicados**.

### O que fica para depois
Vocabulário continua a precisar de expansão substancial (~480 → 2.000+ é o alvo da auditoria). Áudio real continua sem solução (não é algo que eu consiga produzir). B1 tem só 5 módulos — bem menos denso do que A1/A2 — mais conteúdo B1 (reading, exercícios extra, mais vocabulário B1) é o próximo passo natural se o utilizador quiser continuar a aprofundar em vez de alargar para B2.

## 2026-08-26 — FASE 3 da auditoria (continuação): mais 5 módulos, vocabulary-bank-3, e correção de 12 duplicados que eu próprio introduzi

Continuação direta do lote anterior (ver entrada abaixo), na mesma sessão, pedido do utilizador "pode continuar".

**Mais 5 módulos de gramática**, todos ainda dentro de A1/A2 (sem precisar de introduzir B1):
- **Future with "will"** (A1.3) — mod_a1_3_future_will, distinção com "going to" (já existente)
- **Past Continuous** (A2.1) — mod_a2_1_past_continuous
- **Gerunds vs. To-Infinitives** (A2.1) — mod_a2_1_gerunds_infinitives
- **Question Tags** (A2.1) — mod_a2_1_question_tags
- **Relative Clauses** (A2.2, who/which/that) — mod_a2_2_relative_clauses

Cobertura de gramática sobe de 14/24 para cerca de **18/24** (10 dos 15 itens listados como "em falta" na secção 9 da auditoria estão agora cobertos). Os 5 que restam — past perfect, future continuous, segundo condicional, voz passiva, discurso indireto — são todos genuinamente B1, e exigiriam introduzir um Level/Sublevels B1 novos no schema, o que fica reservado para uma passagem dedicada e não deve ser feito de forma apressada.

**`vocabulary-bank-3.json`: 122 palavras novas**, focadas em categorias que a auditoria confirmou estarem **inteiramente ausentes** — sobretudo partes do corpo e sintomas de saúde (não existia um único item para "cabeça", "tosse", "alérgico"...), além de emoções, trabalho, tecnologia, casa, viagens, tempo/frequência e verbos abstratos comuns.

**Erro cometido e corrigido nesta mesma sessão:** ao escolher vocabulário para os 11 módulos novos desta Fase 3, verifiquei colisões de **id** a cada lote, mas não de **headword** — e 12 dos meus próprios vocab items (furniture, battery, borrow, avoid, safe, reliable, crowded, colleague, landlord, luggage, reason, suggest) colidiam com palavras já existentes em `vocabulary-bank.json`/`vocabulary-bank-2.json`. Exatamente o mesmo tipo de bug que a auditoria original tinha encontrado e que eu tinha corrigido no início desta sessão — reintroduzido enquanto fazia o trabalho de o resolver. Detetado só depois de escrever `vocabulary-bank-3.json` e correr a verificação de headwords em todo o `content/curriculum/` (não só de ids), que devia ter feito desde o primeiro lote.

Corrigido substituindo as **12 entradas antigas e desacopladas** dos bancos standalone por palavras diferentes (ex. "colleague" → "supervisor", "furniture" → "wardrobe", "avoid" → "escape") — nunca o vocabulário dos módulos novos, que está integrado a `lesson.steps[].vocabulary_ids` e partir isso quebraria a lição. Confirmado no fim: **702 ids e 482 headwords em todo o `content/curriculum/`, ambos sem duplicados**.

**Lição para lotes futuros de conteúdo:** verificar sempre headwords, não só ids, e fazê-lo ANTES de escrever o lote seguinte, não só no fim.

## 2026-08-26 — FASE 3 da auditoria (início): 6 novos módulos de gramática

A auditoria (`docs/AUDITORIA-2026-08-26.md`, secção 8) identificou 13 conceitos gramaticais essenciais A1-B1 totalmente ausentes do currículo. Este é o primeiro lote — os 6 mais fundamentais, todos dentro do A1 já existente (Pre-A1→A2.2 continuam a ser as únicas sublevels seedadas; B1 fica para um lote posterior desta mesma fase):

1. **Present Continuous** (A1.1) — mod_a1_1_present_continuous
2. **Object Pronouns e Possessive Adjectives** (A1.1) — mod_a1_1_pronouns
3. **Wh- Questions com auxiliar** (A1.1) — mod_a1_1_wh_questions
4. **Articles a/an/the** (A1.2) — mod_a1_2_articles
5. **Quantifiers some/any/much/many** (A1.2) — mod_a1_2_quantifiers
6. **Superlatives** (A1.3, junto de "Comparing Things" que já existia) — mod_a1_3_superlatives

Cobertura de gramática passa de 8/24 para 14/24 conceitos do checklist da auditoria.

**Processo usado, dado o risco de um JSON inválido quebrar TODO o seeding** (um único ficheiro malformado faz `prisma/seed.ts` falhar por inteiro, não só o módulo em causa): cada ficheiro novo foi validado individualmente com `Get-Content ... | ConvertFrom-Json` no PowerShell antes de ser ligado ao `seed.ts` — não há Node.js nesta máquina para correr o seed a sério, por isso este foi o teste real disponível. Também confirmei por grep que os 519 ids em `content/curriculum/*.json` continuam todos únicos depois da adição (zero colisões) — um id duplicado faria um `upsert` sobrescrever silenciosamente outro registo.

Cada módulo segue exatamente a estrutura dos 11 já existentes (`docs/08-schema-json-conteudo.md`): grammar_concept com common_mistake_pt específico para falantes de português, 3 itens de vocabulário, 6 exercícios (2 grammar, 1 vocabulary, 1 listening, 1 reading, 1 translation — o mesmo padrão de 5 pilares graded que o resto do currículo já usa), e uma lição de 11 passos incluindo um apontamento de pronúncia genuíno (não genérico) por módulo. Escrito em inglês britânico consistente e português europeu (não brasileiro) em todo o lado, para não repetir os problemas de conteúdo que a própria auditoria encontrou no currículo existente (calques, PT-BR, regras absolutas sem exceção).

`MODULE_FILES` em `seed.ts` foi reordenado (não só apensado ao fim) para que os módulos novos apareçam na sequência certa dentro de cada sublevel — ex. "Superlatives" logo a seguir a "Comparing Things" — em vez de todos amontoados depois de A2.2, onde ficariam pedagogicamente fora de ordem.

### Não feito neste lote
Os 7 conceitos restantes (past continuous, past perfect, future com will, future continuous, second conditional, passive voice, reported speech, relative clauses) — os últimos 4 destes ultrapassam o que A1/A2 seedado consegue albergar sem introduzir B1 (Level + Sublevels novos), que é uma alteração de schema/conteúdo maior a fazer numa passagem dedicada. Expansão de vocabulário (331 → 2.000+) também fica para um lote seguinte desta mesma Fase 3.

## 2026-08-26 — FASE 2 da auditoria: fundações técnicas

Segue-se diretamente da auditoria master (ver entrada abaixo). O utilizador pediu para dividir o roadmap por fases e começar já pela Fase 2 (fundações), com "cuidado extra no código" porque os deploys da Netlify continuam pausados até 2026-09-01 — nada do que se segue foi executado, só revisto à mão com mais atenção que o habitual.

**Race conditions (o item de maior risco desta fase).** `recordActivity` (streak/XP) e `updateSkillScore` (octógono, EMA) faziam ler→computar→escrever sem proteção — sob concorrência real (ex. 8 respostas de uma sessão de tema, ou duas abas abertas), uma escrita podia apagar o efeito da outra, incluindo apagar um streak inteiro. Em vez de reescrever a lógica de datas/EMA em SQL puro (arriscado sem forma de testar), envolvi ambas em `prisma.$transaction` com `SELECT ... FOR UPDATE`, que bloqueia a linha até ao commit — a lógica de JS existente manteve-se exatamente igual, só passou a correr sob bloqueio. `recalculateAreas` (weakAreas/strongAreas) passou a correr dentro da mesma transação.

**Rate limiting no Gemini.** Não existia nenhum. Criado `src/lib/ai/rateLimit.ts` — 20 chamadas/10 min por utilizador, usando a tabela `AnalyticsEvent` já existente (sem alteração de schema). Falha aberta (allow) se a própria verificação der erro — nunca deve ser o rate limiter a quebrar uma funcionalidade que doutra forma funcionaria. Ligado aos 4 pontos que chamam o Gemini: `gradeFreeTextAnswer`, `getHolisticFeedback`, o tutor, e `scoreFreeResponse` (placement). Neste último também corrigi a mesma falha de injeção de prompt já encontrada noutros sítios (texto do aluno sem delimitação `<tags>`).

**Validação de fronteira nas duas rotas API que faltavam** (`/api/placement/submit`, `/api/ai/tutor`) — JSON malformado dava 500 cru; agora dá 400 normal.

**Responsive — fix mecânico e seguro.** Os 40 usos de `max-w-lg` na app inteira seguem todos o mesmo padrão (`<main className="mx-auto ... max-w-lg ... px-6 ...">`), confirmado por grep antes de tocar em nada. Troquei por `max-w-lg lg:max-w-2xl` em todos — aditivo, mobile 100% intocado, só alarga o ecrã a partir de 1024px. Não mexi nos grids internos `grid-cols-2` (risco maior, benefício menor).

**`loading.tsx` — um único ficheiro, não seis.** Criado em `src/app/(app)/loading.tsx`. Como o layout deste grupo persiste entre navegações client-side, este ficheiro cobre automaticamente todas as ~20 páginas do grupo (home, aprender, praticar, progresso, falar, definições) sem precisar de um ficheiro por página.

**Traduções para português que faltavam:**
- `SkillOctagon`: labels em inglês → português. Fontsize 9→10. Geometria do SVG não mudou (todas as traduções escolhidas são iguais ou mais curtas que o original inglês).
- `PILLAR_LABEL` (`pillarDisplay.ts`) estava incompleto — só cobria os 5 pilares do Diagnóstico Semanal. Faltavam SPEAKING/PRONUNCIATION/WRITING, por isso "Áreas a reforçar" na Home mostrava esses três em inglês minúsculo sempre que eram a área mais fraca.
- `classify()` em `certificate.ts` — "Not ready"/"Developing"/"Strong"/"Exceptional" em inglês no certificado público `/verify/[code]`, já identificado numa auditoria anterior e nunca corrigido. Certificados já emitidos mantêm o texto antigo (registo histórico, não é reescrito).
- "Day {currentDay}/{totalDays}" na Home Intensive → "Dia".

**`currentDay` do plano Intensive — resolvido sem migração.** Nunca era incrementado (ficava preso em "Day 1" para sempre) porque a app não tem nenhum job agendado que o pudesse fazer. Em vez de construir esse mecanismo, `currentDay` deixou de ser lido do schema para a Home — passa a calcular-se em runtime a partir de `IntensivePlan.startDate` (dias de calendário decorridos, coerente com "dia X de Y do plano"). O campo `currentDay` continua no schema (não removido — dead field aceitável por agora), só deixou de ser a fonte de verdade da UI. Também passei a mostrar `weeklyThemesJson.weeks` (o foco da semana atual), que era gerado e nunca lido.

**"Continuar lição" deixa de saltar lições abandonadas.** `getNextLessonForUser` considerava uma lição "feita" assim que houvesse UMA `ExerciseAttempt` nela — responder a um único exercício e fechar a app marcava a lição inteira como concluída. A fonte de verdade passou a ser o evento `lesson_completed` (`AnalyticsEvent`), que já era escrito por `completeLesson()` no fim real da lição mas nunca lido — sem alteração de schema. De caminho, corrigi também o badge de nível no ecrã de "Lição concluída", que mostrava sempre "A1.1" fixo em vez do subnível real da lição.

**Placement test volta a poder recomendar A2.** `averageToLevel()` limitava artificialmente todos os resultados a A1.3, com um comentário a dizer "MVP1 só tem conteúdo até A1" — mas há conteúdo A2 seedado (3 módulos). Um utilizador forte era sempre mal-colocado. Novos cortes cobrem os 5 subníveis que realmente têm conteúdo (A1.1→A2.2); se o currículo crescer para B1+, precisam de revisão.

**`Exercise.qaApproved` finalmente aplicado como filtro** em `buildQuestionSet` (Diagnóstico Semanal + Sheets de tema) — antes existia no schema mas não filtrava nada. Confirmei antes que os 66 exercícios seedados têm todos `qa_status: "approved"`, para não esvaziar acidentalmente o pool de perguntas. Aproveitei para colapsar o N+1 (uma query por pilar) numa única query com `pillar: { in: pillars } }`.

**Exportação RGPD completada** — faltavam `UserAchievement`, `AssessmentResult`, `ReviewScheduleItem` e `PlacementTest`. Adicionados ao `/api/profile/export`.

### Não feito nesta fase (fica para a Fase 3+)
`zod` formal nas fronteiras (a validação manual já cobre os pontos mais expostos) · limpeza dos 5 modelos mortos do schema (alteração de schema é mais arriscada sem forma de testar contra a BD real — fica para uma passagem dedicada) · grids internos `grid-cols-2` · `loading.tsx` para as rotas fora do grupo `(app)` (onboarding, placement).

## 2026-08-26 — AUDITORIA MASTER: 23 correções, incluindo 2 críticas

Auditoria completa pedida pelo utilizador (código, arquitetura, conteúdo, UX/UI, segurança, performance, comparação com concorrentes). Relatório integral em **`docs/AUDITORIA-2026-08-26.md`** — este registo cobre só as decisões técnicas.

**Nota global atribuída: 4,2/10.** Fundações de engenharia acima da média, conteúdo educativo muito abaixo do necessário (11 lições ≈ 5 semanas de material para uma promessa de 4 meses).

### Duas correções críticas

1. **`Answer.questionId` era FK obrigatória para `Question`, que nunca é criada.** O código passava um id de `Exercise`. Toda a chamada a `submitExerciseAnswer` devia falhar com violação de FK — ou seja, **responder a qualquer exercício dentro de uma lição estava quebrado**. Passou despercebido a sessão inteira porque o placement test usa outro caminho e nunca se executou uma lição até ao fim. Corrigido tornando `questionId` opcional (no MVP1 o `Exercise` É a pergunta). **[POR CONFIRMAR EM RUNTIME]**

2. **Correção do lado do cliente tornava notas e certificados forjáveis.** `submitWeeklyTest`/`submitTopicPractice` aceitavam `isCorrect` do browser. Um pedido forjado com tudo `true` produzia um certificado real, público e verificável. **Esta vulnerabilidade foi introduzida por mim mais cedo nesta mesma sessão**, ao trocar correção no servidor por correção no cliente para evitar dupla-correção — resolveu um problema e abriu um maior. Corrigido com `src/app/(app)/practice/gradeSubmission.ts`: o servidor volta a corrigir a partir do `Exercise` real. O cliente passa a enviar `given` (resposta em bruto), nunca o veredito. `gradeFreeTextAnswer` já faz igualdade exata primeiro, por isso respostas certas não custam chamadas de IA extra.

### Segurança (todas corrigidas)
- **2 IDOR**: conversas do tutor (`findFirst` com `userId`) e erros na fila SRS (verificação de dono **antes** de agendar, não depois).
- **3 injeções de prompt**: `SCORE:` em `getHolisticFeedback`, veredito em `gradeFreeTextAnswer`, `ERROR_LOGGED` forjado. Todas resolvidas com delimitação `<tags>` + instrução explícita de não seguir instruções internas + sanitização antes de persistir.
- **Open redirect** no login (`?next=` sem validação) e **reescrita não autenticada do nome** de outro utilizador no signup (o Supabase devolve sucesso para emails já registados, por anti-enumeração — o `upsert` reescrevia o nome do dono verdadeiro, que aparece no certificado público). O signup deixou de escrever na BD; `requireUser()` já cria a linha com sessão válida.

### Robustez
- `error.tsx` e `not-found.tsx` (não existia nenhum — 4 `notFound()` caíam no ecrã cru do Next.js, em inglês).
- try/catch em `PlacementTestRunner` (falha de rede prendia o utilizador no fim do teste, botão desativado, sem mensagem) e `TutorChat` (chat eterno em "a escrever...").
- Validação de fronteira em 3 server actions (limites de array, pilares válidos, `quality` 0-5).
- `resolvedAt` passa a ser escrito após 3 revisões bem-sucedidas — "erros já corrigidos" estava permanentemente a 0.
- N+1 em `submitTopicPractice`: 8 chamadas a `recordActivity` → 1 agregada.

### Conteúdo
- 4 palavras duplicadas entre módulos e bancos (o SRS servia a mesma palavra como se fossem duas) — substituídas por palavras novas.
- `A2.3` estava definido em `levels.json` **sem qualquer conteúdo** → aparecia como nível vazio. Removido até haver módulos.
- 3 erros de ensino: `"Posso ter o menu"` (calque que não existe em português), `"Sempre mude"` (PT-BR numa app PT-PT), e a regra de adjetivos afirmar "sempre, sem exceção" quando há exceções produtivas (*something interesting*).

### Não corrigido (exige decisão ou trabalho maior) — ver roadmap na auditoria
Race conditions no streak e no octógono (ler-modificar-escrever sem transação) · `currentDay` do plano Intensive nunca incrementa · `LearningPlan` escrito e nunca lido · 5 modelos mortos no schema · exportação RGPD incompleta · rate limiting ausente · zero breakpoints responsive · zero testes automáticos.

## 2026-08-26 — Continuação do redesenho: velocidade real + campos de texto em toda a app

Continuação do pedido "mais atualizações, cuidado extra a rever o código".

1. **Correção de tradução mais rápida a sério, não só na perceção**: `submitTranslation` (lições) chamava sempre o Gemini, mesmo quando a resposta batia certo com a referência. Adicionado atalho: `normalizeForCompare()` (ignora maiúsculas, espaços, pontuação final) verifica igualdade exata primeiro; só chama a IA se não bater certo. Poupa a latência real da chamada de rede no caso mais comum (resposta correta).
2. **`TextField.tsx`** (novo, input de uma linha) — mesmo tratamento visual do `TextAreaField`. Havia 13 inputs em 9 ficheiros (login, signup, recuperar/repor password, onboarding, chat do tutor) todos com o mesmo estilo fraco copiado — agora um componente só. `PlacementTestRunner`'s textarea de writing também migrado para `TextAreaField`.
3. **Bug encontrado e corrigido de caminho**: `TutorChat.tsx` mostrava sempre "The Coach is typing..." independentemente da personalidade escolhida (Interviewer, Native Friend, etc.) — hardcoded, nunca atualizado quando as 4 personalidades foram desbloqueadas. Agora usa `TUTOR_PERSONALITIES[personality].label` dinamicamente. Também ganhou `Spinner`.

## 2026-08-26 — Redesenho de interação: botões maiores, campos melhores, estilo "Busuu"

Pedido explícito do utilizador: "deve melhorar a interação, os campos para fazer traduções, a correção mais rápida. mais intuitivo. os botões maiores e com mais impacto visual. tem que estar um estilo profissional, mais semelhante ao busuu."

**Isto substitui deliberadamente uma decisão da Fase 0**: `docs/09-sistema-design.md` pedia cantos discretos (6px controlos / 2px cartões) como escolha de sofisticação minimalista, e nenhuma sombra em lado nenhum. O pedido do utilizador para se parecer mais com o Busuu é uma direção nova e explícita, que passa a ter prioridade — registado aqui para uma sessão futura não "corrigir" isto de volta ao original sem se aperceber da mudança de direção.

Alterações:
- `tailwind.config.ts`: `rounded-control` 6px→14px, `rounded-card` 2px→18px, `boxShadow.soft`/`boxShadow.lift` novos (o produto não tinha nenhuma sombra antes).
- `Button.tsx`: padding quase triplicado (px-7 py-3.5 em vez de px-5 py-2.5), `text-base font-semibold` em vez de `text-sm font-medium`, sombra + `active:scale-[0.97]` para feedback tátil ao carregar.
- `Card.tsx`: sombra suave, mais padding, fundo ligeiramente mais opaco.
- **Campos de tradução** (`TextAreaField.tsx`, novo componente partilhado): antes cada um dos 3 sítios (Translation step da lição, Diagnóstico Semanal, Sheets de tema) tinha um `<textarea>` inline com borda fina — agora um componente único, maior, com anel de foco em verdigris, sombra e placeholder mais visível.
- **Perceção de velocidade de correção** (`Spinner.tsx`, novo): estados de "A verificar.../A avaliar..." eram só texto estático, sem sinal visual de atividade — não dá para eliminar a latência real da chamada ao Gemini, mas um spinner ativo muda imenso a perceção de responsividade/profissionalismo.
- **`/practice` reorganizado em secções** ("Hoje", "Escolher o que praticar", "Falar e Ler", "Referência", "Os seus erros") em vez de uma lista plana de 11 cartões seguidos, que tinha crescido sem hierarquia à medida que cada feature nova era só acrescentada ao fundo. Pedido de "mais intuitivo".
- **Correção de risco**: com botões bem maiores, filas de 2-3 botões lado a lado (ex. "Não sabia" / "Custou" / "Sabia bem" na Revisão) podiam transbordar em ecrãs estreitos — adicionado `flex-wrap` a todas as filas de botões encontradas (`ReviewRunner`, `VerbRunner`, `TopicPracticeRunner`, `ReadingRunner`, `DeleteAccountButton`, landing page).

**Nota honesta**: não consegui verificar visualmente estas mudanças no site real — os deploys da Netlify continuam pausados (ver aviso no `PROJECT_STATE.md`). Revisto com cuidado extra por causa disso (nomeadamente a auditoria de filas de botões acima), mas uma revisão visual real só é possível depois do próximo deploy.

## 2026-08-26 — 2ª vaga de vocabulário + 3º módulo A2 (First Conditional)

Utilizador insistiu no mínimo de 20.000 palavras e confirmou ter "bastantes créditos" (orçamento de tokens) para investir. Mantive a mesma posição de honestidade da ronda anterior — 20.000 entradas verificadas à mão continua fora de alcance numa sessão, pelas mesmas razões (risco de erros de tradução sem verificação) — mas fiz uma segunda vaga bem maior: `content/curriculum/vocabulary-bank-2.json`, ~162 palavras novas em 18 temas (roupa, desporto, educação, transportes, animais, natureza, cidade, profissões, dinheiro, comunicação, substantivos abstratos, 15 phrasal verbs adicionais, 15 adjetivos, cozinha, relações sociais, documentos/burocracia, tamanho, quantidades). `seedVocabularyBank()` em `prisma/seed.ts` generalizado para `VOCABULARY_BANKS` (array de ficheiros) em vez de um único import — próximas vagas só precisam de acrescentar ao array, sem tocar na lógica.

Total de vocabulário depois desta ronda: ~24 (módulos) + ~135 (vaga 1) + ~162 (vaga 2) ≈ **320 palavras**. Ainda muito longe de 20.000, mas já dobrou desde a última atualização e é tudo verificado com o mesmo cuidado, não gerado em massa sem revisão.

Também: **3º módulo A2** (`a2-module-03-first-conditional.json`, sublevel A2.2) — First Conditional (if + Present Simple, will + verbo base). Erro PT→EN clássico: usar "will" também na parte do "if" ("If it will rain" em vez de "If it rains"), porque o português permite futuro nas duas orações.

## 2026-08-26 — Mega expansão de conteúdo: vocabulário, verbos, construção frásica

Pedido explícito do utilizador: "quero uma mega atualização... deve ter um vocabulário de +20000 palavras. deve investir em conteúdo de gramática, verbos, construção frásica, vocabulário."

**Decisão de honestidade, comunicada ao utilizador antes de começar**: 20.000 palavras curadas com traduções corretas não é possível escrever à mão numa sessão — seria preciso importar um dataset de frequência de palavras externo (sem acesso a `npm install`/internet fora do build da Netlify para o fazer com confiança) ou fabricar entradas sem verificação, o que arriscaria introduzir traduções erradas — precisamente o oposto do valor central da app ("ponte português-inglês"). Optei por uma expansão real e substancial em vez de volume fabricado:

1. **Banco de vocabulário standalone** (`content/curriculum/vocabulary-bank.json`, ~135 palavras) — a primeira vez que se adiciona vocabulário sem estar preso a uma lição/módulo completo (regra de gramática + 6 exercícios), o que tornou possível escalar mais depressa do que o padrão de módulo completo usado até agora. Cobre 13 temas (família, comida, casa, trabalho, tempo, viagens, emoções/personalidade, 20 verbos comuns, adjetivos, tecnologia, compras, tempo/meteorologia, saúde). `seedVocabularyBank()` em `prisma/seed.ts` — upsert direto em `VocabularyItem`, sem passar pelo mecanismo de Module/Unit/Lesson. Efeito imediato: mais que sextuplica o vocabulário total (~24 → ~159), o que alimenta diretamente o Desafio Diário e a Revisão (SRS), sem precisar de código novo.
2. **Verbos irregulares** (`src/content/irregularVerbs.ts`, `/practice/verbs`) — 51 verbos irregulares comuns (base/past simple/past participle/tradução), com "Verbo do Dia" (auto-avaliação, alimenta GRAMMAR) e tabela de referência completa sempre visível. Item explicitamente pedido ("verbos") que não existia de forma nenhuma até agora.
3. **Construção frásica** (`src/content/sentencePatterns.ts`, `/practice/patterns`) — 8 padrões de ordem de palavras que costumam persistir muito depois da gramática "estar aprendida" precisamente por nunca serem ensinados como tópico próprio: adjetivo antes do substantivo, perguntas com do/does, negação com don't/doesn't, posição de advérbios de frequência, there is/are, genitivo 's, preposições de tempo in/on/at, ordem fixa sujeito-verbo-objeto. Cada um com exemplo errado vs. certo lado a lado.

Todo este conteúdo foi escrito e revisto manualmente por mim (não gerado por chamada externa a outro modelo) — as traduções e exemplos foram verificados com o mesmo cuidado dos módulos de lição anteriores, apesar do volume maior.

## 2026-08-26 — 2ª lição A2: Must/Have To/Should

Continuação da fundação A2 (item #6). `content/curriculum/a2-module-02-obligation.json` — obrigação/permissão/conselho, distinção must (autoridade do falante) vs. have to (regra externa) vs. should (conselho, não obrigação). Erro PT→EN: "ter de" em português cobre must/have to sem distinção, levando a usar "must" mesmo para conselhos leves, o que soa muito mais autoritário em inglês do que pretendido.

## 2026-08-26 — Fecha a lista de 19 melhorias (pedido: "todas de uma só vez")

Pedido explícito do utilizador: terminar todos os itens da lista de melhorias ainda não feitos, de uma vez. Implementado nesta ronda:

- **#12 Modo Imersão** — `LearningProfile.immersionMode`, toggle em `/profile/settings`, esconde traduções PT nas lições atrás de "Mostrar tradução" (`RevealPt` em `LessonRunner.tsx`).
- **#18 Acessibilidade (parcial)** — `LearningProfile.accessibleReadingMode`, aplicado globalmente via classe `.accessible-reading` no `(app)/layout.tsx` (mais espaço entre linhas/letras, sem itálico — recomendações comuns para dislexia). Não é uma auditoria completa de acessibilidade (WCAG), é uma funcionalidade concreta.
- **#9 Cultura e pragmática** — `/practice/culture`, 5 dicas (small talk, registo, AmE/BrE, etiqueta).
- **#3 Phrasal verbs/idiomas dedicado** — `/practice/idioms`, "Idioma do Dia" determinístico por data, distinto dos `related_forms` já mostrados no Desafio Diário.
- **#8 Listening mais natural (continuação)** — `PlayTranscript` passa a preferir uma voz "Natural/Neural/Online" quando o browser expõe uma, em vez de aceitar sempre a primeira voz da lista.
- **#14 Inglês profissional por setor** — seletor de setor (tech/saúde/vendas/hotelaria) para o Interviewer em `/speak`, usa o `sessionFocus` que já existia em `buildTutorSystemPrompt` mas nunca era passado pela API.
- **#16 Analytics de progresso (instrumentação básica)** — `src/lib/analytics.ts`, o modelo `AnalyticsEvent` existia desde a Fase 0 mas nunca era escrito; regista `lesson_completed` e `weekly_test_completed`. **Não é um dashboard** — é a base de dados a começar a ser preenchida.
- **#17 Certificação interna** — `src/lib/certificate.ts`, emite um `Certificate` quando a média dos 8 pilares atinge "Competent" (≥65) pela primeira vez nesse nível, com página pública `/verify/[code]`. **Sem QR real**: não há biblioteca de geração de QR disponível nesta sessão (não há `npm install` no fluxo de trabalho — só o build da Netlify instala dependências); o "código" é o link de verificação em si, não uma imagem.
- **#13 PWA offline (parcial)** — `sw.js` passa a fazer cache-first do "shell" estático (ícones, manifest) em vez de cache vazio. Deliberadamente não cacheia páginas/dados — ver comentário no ficheiro.
- **#6 Currículo A2 (fundação, não "completo")** — `A2` adicionado a `levels.json` (A2.1/A2.2/A2.3), 1ª lição A2 seedada (`content/curriculum/a2-module-01-experiences.json`, Present Perfect para experiências de vida). **Honestidade**: um currículo A2 "completo" seria dezenas de módulos — isto é o início de A2, não a conclusão do item #6.

**Não feito, com justificação**:
- **#19 Comunidade/prática entre pares** — exigiria infraestrutura nova (multi-utilizador, moderação, provavelmente tempo real) incompatível com o modelo atual "1:1 com IA" da app. Construir um esboço vazio só para marcar como "feito" seria enganoso; fica fora desta ronda.
- **#7 Writing com correção holística "completa"** — já melhorado nesta sessão (score numérico, `WritingAttempt.score` preenchido); uma versão "completa" implicaria feedback estruturado por categoria (gramática/vocabulário/coerência separados) em vez de texto corrido — deixado como está por ser uma melhoria incremental, não um gap em falta.
- **#15 Testes periódicos** já estava feito (Diagnóstico Semanal).

**Aviso importante que se mantém**: nenhum destes commits foi validado por build real — os créditos de deploy da Netlify esgotaram-se a meio da sessão (ver aviso no topo do `PROJECT_STATE.md`), reinicia em 2026-09-01. Todo este trabalho foi revisto com cuidado extra por não haver essa rede de segurança, mas fica por confirmar com um build assim que possível.

## 2026-08-26 — Feedback de pronúncia mais específico no Speaking

Item #11 da lista de melhorias (baixo custo, impacto médio). Scoring fonético avançado continua fora do scope do MVP1 (não há áudio, só o transcript da Web Speech API — ver docs/10-scope-mvp1.md), mas o transcript já é, por si só, um sinal indireto de pronúncia: quando o reconhecimento de voz "ouve" uma palavra diferente da que fazia sentido no contexto, isso é frequentemente sintoma de um som mal pronunciado, não de um erro de vocabulário genuíno. `getHolisticFeedback("speaking", ...)` em `learn/actions.ts` ganhou uma instrução extra (só para speaking) a pedir ao Gemini para tratar esses casos como pistas de pronúncia e dar uma dica concreta, com atenção aos erros mais comuns de falantes de português (som TH, consoantes finais engolidas, acentuação tónica errada).

Mudança de baixo risco — só texto do system prompt, sem novos tipos/ficheiros/fluxos.

## 2026-08-26 — Correção tolerante por IA para respostas de texto livre

Gap de justiça encontrado ao continuar "atualizações": no Diagnóstico Semanal e nas Sheets de tema, uma pergunta de texto livre (sobretudo TRANSLATION, desde a correção do "não aparece hipótese de traduzir") era corrigida por igualdade exata contra uma única frase de referência — uma tradução válida mas com fraseado diferente era marcada como errada. Isto contradiz o próprio motivo de ter adicionado a resposta livre.

Corrigido com `src/lib/ai/gradeAnswer.ts` (`gradeFreeTextAnswer`): tenta igualdade exata primeiro (grátis, instantâneo), só chama o Gemini se não bater certo, pedindo uma classificação binária YES/NO tolerante a fraseado diferente/sinónimos/pontuação — cai para igualdade exata se a IA falhar. Exposto via `src/app/(app)/practice/checkAnswer.ts` (`checkFreeTextAnswer`).

Isto obrigou a mudar o fluxo de "Verificar" para perguntas de texto: antes a correção era instantânea no cliente (comparação simples); agora é assíncrona (chamada ao servidor) só para `kind: "text"` — escolha múltipla continua instantânea, sem custo de IA. `WeeklyTestAnswer`/`TopicPracticeAnswer` passaram a carregar `isCorrect` (já determinado pergunta a pergunta) em vez de `given`, e os `submitWeeklyTest`/`submitTopicPractice` deixaram de re-corrigir no fim — só agregam o que já foi decidido, evitando corrigir a mesma resposta duas vezes com critérios diferentes.

**Nota**: esta sessão ficou sem créditos de deploy da Netlify a meio deste trabalho (ver aviso no topo do `PROJECT_STATE.md`) — este código não foi validado por um build real. Revisto com cuidado extra por não haver essa rede de segurança; confirmar com um build assim que os deploys voltarem (2026-09-01).

## 2026-08-26 — 5 updates: erros do tutor no SRS, micro-desafios, mais conteúdo

Continuação de "atualizações com mais impacto" (pedido: "mais 5 atualizações"):

1. **AI Tutor regista erros recorrentes de verdade** — `TUTOR_SHARED_RULES` (`personalities.ts`) já dizia ao modelo "name it plainly so it can be logged for spaced review", mas nada lia a resposta para o fazer — a promessa nunca foi implementada. Corrigido com o mesmo padrão do `SCORE: NN` (learn/actions.ts): o modelo termina a resposta com `ERROR_LOGGED: <tipo> | <correção>` só quando está a corrigir um erro recorrente; `src/app/api/ai/tutor/route.ts` parseia essa linha, remove-a do texto mostrado, cria/incrementa um `UserError` (dedupe por `errorType`, pilar GRAMMAR por omissão) e agenda-o no SRS.
2. **Micro-Desafios alimentam o octógono** — mesma classe de gap do AI Tutor: `completeMicroChallenge()` dava XP mas nunca chamava `updateSkillScore`. Agora recebe `(pillar, score)` — "shadow" usa um score de engagement (65, sem correção formal), "listen" usa a correção real (100/20).
3. **2 micro-desafios novos** — "Fila de Espera" (shadow) e "Antes de Dormir" (listen), mais variedade de momentos do dia.
4. **1 texto de leitura novo** — "The Weekly Market", mais variedade em `/practice/reading`.
5. **8ª lição: "Making Plans"** (`going to` future, A1.3) — erro PT→EN: omitir o verbo "to be" ("I going to travel" em vez de "I am going to travel"), simétrico à lição de Past Simple já existente.

## 2026-08-26 — Conversar com o AI Tutor passa a contar para XP/streak/octógono

Outro gap real encontrado ao rever o código com o mesmo critério da correção do LISTENING: `src/app/api/ai/tutor/route.ts` nunca chamava `recordActivity`, `updateSkillScore` nem `awardAchievement` — falar com o Coach, o Interviewer, o Conversation Partner ou o Native Friend (a funcionalidade mais promovida da app) não dava XP, não contava para o streak, e não mexia no octógono de competência, ao contrário de todas as outras formas de praticar (lições, Desafio Diário, Diagnóstico, Revisão, Leitura). Isto era inconsistente com o resto do sistema construído nesta sessão.

Corrigido: cada resposta bem-sucedida do tutor (não a mensagem de erro de fallback) chama `recordActivity(user.id, "TUTOR_MESSAGE")` (XP baixo, 3 — evita farming por spam de mensagens curtas), `updateSkillScore(user.id, "SPEAKING", 65)` (sinal de engagement moderado, não há correção formal por mensagem) e `awardAchievement(user.id, "first_tutor_conversation")`.

## 2026-08-26 — Leitura Extensiva + correção de bug: LISTENING sem áudio no Diagnóstico/Sheets

Ao continuar com "atualizações de alto impacto", ao rever `PlayTranscript.tsx` (já tinha controlo de velocidade 0.75x/1x/1.25x, bem construído) percebi que `src/lib/practiceQuestions.ts` nunca extraía o campo `transcript` do `contentJson` — ou seja, uma pergunta LISTENING no Diagnóstico Semanal ou nas Sheets de tema dizia "Listen to the audio..." mas não havia nenhum botão de áudio. Corrigido: `PracticeQuestion` ganhou o campo `transcript`, `WeeklyTestRunner.tsx` e `TopicPracticeRunner.tsx` renderizam `<PlayTranscript>` quando presente.

Adicionado também **Leitura Extensiva** (`/practice/reading`) — item sinalizado como alto impacto/custo médio na crítica de produto ("exposição a texto conectado, não frases isoladas, é um dos maiores preditores de aquisição de língua"). 3 textos curtos A1 (`src/content/readingPassages.ts`), cada um com 3 perguntas de compreensão. Decisão de arquitetura: conteúdo estático em TypeScript, não no schema `Exercise`/`Lesson` — mais rápido de expandir (só acrescentar ao array) e não obriga a outro `prisma db push`. O texto também pode ser ouvido via `PlayTranscript`, o que dá um bónus de listening "de graça".

## 2026-08-26 — 7ª lição: Past Simple ("Yesterday")

Início do ataque ao item #5 da lista priorizada (expansão de conteúdo, o de custo mais alto na crítica de produto). Adicionado `content/curriculum/a1-module-06-past-simple.json` — A1.3, Past Simple regular/irregular, erro PT→EN destacado: manter o verbo na forma base com "yesterday" em vez de o mudar para o passado ("I go to the beach yesterday" em vez de "went"). Registado em `prisma/seed.ts` (`MODULE_FILES`), segue exatamente o mesmo formato dos módulos anteriores — nenhuma alteração à lógica de seed.

Efeito indireto importante: mais um módulo = mais exercícios na pool partilhada (`src/lib/practiceQuestions.ts`) que alimenta o Diagnóstico Semanal e as Sheets de tema — esses dois ganham variedade automaticamente, sem código novo.

## 2026-08-26 — Tema claro/escuro deixa de ser automático, passa a ser escolha do utilizador

Ao continuar a lista de updates, reexaminei a queixa "as cores são sempre muito pesadas, nunca muda" à luz do código: `tailwind.config.ts` tinha `darkMode: "media"`, ou seja, a app seguia sempre a preferência do sistema operativo (`prefers-color-scheme`), sem controlo nenhum do utilizador. Se o Windows do utilizador estiver em modo escuro, a app inteira — todas as páginas, sempre — renderiza em fundo `ink` (navy escuro), o que corresponde exatamente à queixa "sempre pesadas, nunca muda".

Corrigido: `darkMode: "class"` em vez de `"media"`. Todas as classes `dark:` já existentes no código continuam a funcionar sem alterações — só o mecanismo de ativação muda, de automático (media query) para explícito. Adicionado:
- `src/components/ui/ThemeToggle.tsx` — botão claro/escuro no cabeçalho da app (`(app)/layout.tsx`), guarda a escolha em `localStorage`.
- Script inline em `src/app/layout.tsx` (`<head>`) que aplica o tema guardado antes do primeiro paint, para não haver flash do tema errado.
- `globals.css`: `@media (prefers-color-scheme: dark)` trocado por seletores `.dark`.

Default passa a ser sempre claro, a não ser que o utilizador escolha escuro explicitamente — nunca mais preso ao tema do sistema operativo.

## 2026-08-26 — Badge "Powered by Netlify" desligado + letra maior

Pedido do utilizador: remover o popup "powered by netlify" que atrapalhava a visualização, e aumentar o tamanho da letra para leitura mais fácil.

- **Badge da Netlify**: não era código nosso — é uma funcionalidade opt-in da própria Netlify ("Powered by Netlify badge", em Project configuration → General) que injeta um badge fixo no canto do site. Desligada diretamente na consola Netlify (checkbox "Show the badge on this project" → desmarcada → Save). Nada a alterar no repositório.
- **Tamanho de letra**: escala `fontSize` em `tailwind.config.ts` aumentada ~10% em todos os níveis (xs→4xl), mantendo a mesma proporção modular entre eles — afeta toda a app de uma vez, sem tocar em cada componente individualmente.

## 2026-08-26 — Correção de UX nos quizzes: feedback imediato, tradução, sheets, cor por pilar

Feedback direto do utilizador depois de testar os updates anteriores: "não estou a gostar do formato da app deve dar correção no final se a resposta estiver errada. o tipo de perguntas é muito repetitivo... Nos testes, também não aparece hipótese de traduzir, quando faz a pergunta translate... as cores também são sempre muito pesadas, nunca muda". Comparação implícita com Duolingo/Busuu (feedback imediato por pergunta, variedade de formato, uso de cor para orientar).

Diagnóstico da causa: o Desafio Diário e o Diagnóstico Semanal (construídos nesta sessão) só davam pontuação silenciosa no fim, sem mostrar a resposta certa por pergunta — ao contrário do `ExerciseStep` das lições (`LessonRunner.tsx`), que já fazia isto bem desde o início. E o Diagnóstico Semanal excluía TRANSLATION por completo (exercícios desse pilar não têm `distractors`, logo não davam para escolha múltipla) — daí "não aparece hipótese de traduzir".

Corrigido:
- **`src/lib/practiceQuestions.ts`** (novo, substitui a lógica antiga de `weeklyTest.ts`): motor partilhado de seleção de exercícios. Regra nova: um exercício sem distratores vira pergunta de texto livre (`kind: "text"`) em vez de ficar de fora — cobre TRANSLATION automaticamente, sem hardcode por pilar.
- **Feedback imediato de dois passos** ("Verificar" → mostra correto/incorreto + revela a resposta certa → "Seguinte") aplicado ao Desafio Diário (`DailyChallengeRunner.tsx`) e ao Diagnóstico Semanal (`WeeklyTestRunner.tsx`) — mesmo padrão que já existia nas lições.
- **`src/lib/pillarDisplay.ts`** (novo): mapa pilar→cor (verdigris/brass/clay, as únicas cores de acento do sistema de design — ver `docs/09-sistema-design.md`, não inventadas de novo) com classes Tailwind completas e estáticas (o JIT não gera classes a partir de template strings interpoladas em runtime — risco real que foi evitado aqui). Cada pergunta do Diagnóstico Semanal muda de cor consoante o pilar, em vez de ser sempre verdigris.
- **Sheets de tema** (`/practice/topic`, `/practice/topic/[pillar]`) — pedido explícito: "deve ter várias sheets, que possa escolher o que quero trabalhar hoje". Ao contrário do Diagnóstico (1x/semana, todos os pilares), aqui o utilizador escolhe um pilar e pratica quantas vezes quiser, com perguntas novas de cada vez (seed variável, não fixado à semana). Não cria `AssessmentResult` — só atualiza o score desse pilar — para não poluir os checkpoints do Diagnóstico.

**Não feito nesta ronda, sinalizado para o utilizador**: o pedido "refaça toda a estrutura" e "as cores são sempre muito pesadas" também aponta para o fundo `ink` (navy) a toda a largura na landing/hero, que é uma escolha de design deliberada nos documentos de Fase 0 (`docs/09-sistema-design.md`, "produto premium, sofisticado"). Mudar isso é um trabalho de redesenho visual maior, que beneficia de iteração com screenshots reais no browser — não foi tentado às cegas nesta ronda para não arriscar uma mudança estética unilateral mal calibrada.

## 2026-08-26 — 5 updates de maior impacto (continuação da lista priorizada)

Pedido do utilizador: "pode continuar com mais updates. faça no mínimo 5 updates" — continuação direta da lista acordada na crítica de produto. Implementado:

1. **Diagnóstico Semanal** (`src/lib/weeklyTest.ts`, `/practice/weekly-test`) — prioridade #3 acordada ("testes que ajudem a corrigir no futuro"). Reutiliza os `Exercise` já seedados (só os pilares com distratores reais: GRAMMAR/VOCABULARY/LISTENING/READING — TRANSLATION/SPEAKING/WRITING dependem de correção livre por IA, fora de scope de um teste de escolha múltipla). Seleção determinística por semana ISO. 1x por semana, cria `AssessmentResult` tipo `WEEKLY`, atualiza o octógono por pilar, mostra explicitamente "o que corrigir esta semana".
2. **AI Tutor: mais personalidades** (`src/lib/ai/personalities.ts`, `/speak`) — prioridade #4 acordada ("inglês profissional cedo"). Desbloqueado `interviewer` (entrevista de emprego), `conversation_partner` (conversa livre) e `native_friend`; a infraestrutura (`buildTutorSystemPrompt`, enum `TutorPersonality`) já existia no schema/Fase 0 mas só "coach" estava exposto na UI — trabalho principalmente de wiring, não de construção de raiz. `professor`/`examiner` continuam fechados (ver comentário no ficheiro).
3. **Collocations deixam de estar escondidas** — o campo `VocabularyItem.collocations` já vinha populado pelo seed (`related_forms` no JSON de conteúdo) mas nunca era mostrado em lado nenhum da UI. Agora aparece em "Também pode dizer" no fim do Desafio Diário e na revelação da Revisão SM-2.
4. **Mais conquistas de gamificação** — só existia `first_lesson_complete`. Adicionado `first_daily_challenge`, `first_review`, `first_weekly_test`, `streak_3`, `streak_7`, `streak_30` (`src/lib/gamification/awardAchievement.ts`, chamado a partir de `recordActivity` para os marcos de streak).
5. **Descoberta e ligação de entry points** — Diagnóstico Semanal e Falar com o Tutor não tinham nenhum link a partir de Home/Practice; adicionados às grelhas existentes em ambas as páginas (Standard e Intensive).

## 2026-08-26 — Octógono de competência deixa de ficar congelado

Descoberto ao continuar a lista de melhorias por impacto (pedido do utilizador: "continue com os updates que têm mais impacto"): os 8 scores de `LearningProfile` (`grammarScore`, `vocabularyScore`, etc., usados no `SkillOctagon` e em "Áreas a reforçar") só eram escritos uma vez, no placement test (`src/app/api/placement/submit/route.ts`) — nenhuma lição, exercício, writing, speaking, tradução ou revisão os voltava a tocar. Isto contradiz diretamente a proposta de valor central ("sabe o que precisa de aprender, porque está a errar") logo a seguir ao onboarding.

Corrigido com `src/lib/skillProfile.ts`: `updateSkillScore(userId, pillar, rawScore)` aplica uma média móvel exponencial (EMA, α=0.25) ao score do pilar e recalcula `weakAreas`/`strongAreas` por comparação com a média dos pilares com sinal. Ligado a: exercícios de lição (`submitExerciseAnswer`), writing/speaking/translation (`submitWriting`/`submitSpeaking`/`submitTranslation`), Desafio Diário (`recordVocabExposure`) e revisões SM-2 (`submitReview`).

Efeito colateral positivo: `WritingAttempt.score` e `SpeakingAttempt.fluencyScore` existiam no schema mas nunca eram preenchidos — o feedback holístico da IA (Gemini) passou a terminar com uma linha `SCORE: NN` parseada por regex (sem depender de JSON mode da API), guardada nesses campos e removida do texto mostrado ao utilizador.

## 2026-08-26 — Crítica ao produto e SRS (repetição espaçada) real

Pedido do utilizador: crítica dura ao estado atual da app do ponto de vista de "alguém se tornar nativo em inglês", com lista de melhorias por custo (tokens)/impacto. Conclusão principal: o MVP1 tinha conteúdo insuficiente (6 lições, ~15 palavras) e nenhum motor de retenção — `UserError`/`ReviewScheduleItem` existiam no schema mas nunca eram lidos/escritos por nenhuma rota. Perguntado ao utilizador o que priorizar: escolheu **SRS primeiro**, fluência prática com testes/exames periódicos como reforço futuro, e inglês profissional genérico "cedo".

Implementado nesta sessão: motor SM-2 real (`src/lib/srs/sm2.ts`), agendamento (`src/lib/srs/schedule.ts`), nova rota `/practice/review` (fila de revisão estilo Anki: mostrar frente → revelar → auto-avaliação Não sabia/Custou/Sabia bem). Ligado a duas fontes de exposição: Desafio Diário (cada palavra respondida agenda revisão) e exercícios de lição (cada erro cria/incrementa `UserError` deduplicado por `errorType` e agenda revisão do erro). Contagem de pendentes visível em Home e Prática.

Schema: adicionado `repetitions` e `@@unique([userId, itemType, itemRefId])` a `ReviewScheduleItem`, para permitir upsert idempotente por item. Não há migração dedicada — `prisma db push --accept-data-loss` aplica no build da Netlify, como já é o fluxo estabelecido.

**Deliberadamente fora desta sessão** (ver crítica completa na conversa): expansão de vocabulário/currículo, phrasal verbs/idiomas, roleplay profissional, exames periódicos, listening mais natural. Ficam como próximos passos — ver `PROJECT_STATE.md` secção 6.

## 2026-08-26 — PWA: instalação no Android como app normal

Pedido do utilizador: poder instalar a webapp no telemóvel Android como uma app nativa. Adicionado suporte mínimo a Progressive Web App:
- `public/manifest.webmanifest` (nome, ícones, `display: standalone`, cores do sistema de design — Atlantic Ink `#1B2A4A`).
- `public/icon.svg` e `public/icon-maskable.svg` — ícone em SVG (carimbo circular a brass sobre fundo ink, coerente com o "Carimbo de Passaporte" do sistema de design). **Nota**: ícones SVG cobrem o pedido (instalação no Chrome/Android), mas PNG seria mais universalmente compatível (ex. Lighthouse PWA audit, alguns launchers Android mais antigos) — não gerado por não haver Node/Python/ferramenta de imagem nesta máquina; considerar gerar PNGs (192×192 e 512×512) a partir do SVG quando houver uma sessão com essas ferramentas.
- `public/sw.js` — service worker mínimo, sem caching agressivo (a app depende de dados em tempo real: sessão, progresso, IA); existe só para satisfazer o critério de instalabilidade do Chrome (manifest + service worker com `fetch` handler).
- `src/components/PwaRegister.tsx` — regista o service worker no cliente, montado em `src/app/layout.tsx`.
- `src/middleware.ts`: `manifest.webmanifest` e `sw.js` excluídos do matcher — o Chrome pede-os sem sessão, e o middleware anterior estava a redirecioná-los para `/login`, o que quebraria a instalabilidade.

## 2026-08-26 — Desafio Diário e checkpoints (pedido do utilizador)

- **Desafio Diário de vocabulário**: seleção determinística por dia (hash da data, sem `Math.random()`) a partir de todo o `VocabularyItem` seedado — 5 a 10 palavras, escolha múltipla de tradução (1 correta + 3 distratores de outras palavras), seguido de até 3 frases de exemplo para praticar. Ver `src/lib/dailyChallenge.ts`.
- **Checkpoints diário/semanal/mensal**: em vez de criar uma tabela nova, reutiliza-se `AssessmentResult` (já existia no schema com `type: DAILY|WEEKLY|MONTHLY|...`, secção 8 do master prompt) — completar o Desafio Diário cria um `AssessmentResult` tipo `DAILY`; o checkpoint semanal/mensal é uma contagem desses registos nos últimos 7/30 dias, mostrada em Progress. Ver `src/lib/checkpoints.ts`. Evita duplicar conceitos de "avaliação" já modelados.
- **Continuidade entre sessões**: criado `PROJECT_STATE.md` na raiz do repositório — deve ser lido em primeiro lugar por qualquer sessão nova do Claude Code, e atualizado a cada mudança relevante (pedido explícito do utilizador, para poupar tokens ao retomar trabalho).
- **Micro-Desafios** (`src/lib/microChallenges.ts`): 3 formatos propostos pelo utilizador — "5 Minutos Matinais" e "Casa de Banho" (shadowing: ouvir e repetir uma frase, via Web Speech API, sem custo) e "Sofá" (ouvir um diálogo curto + 1 pergunta de escolha múltipla). Conteúdo estático por agora (não vem da BD) — dão XP leve mas **não** contam para o checkpoint diário formal (esse continua a ser só o Desafio Diário de vocabulário), para não diluir o significado do checkpoint. Documento Word do projeto entregue como `.rtf` (não `.docx`): esta máquina não tem Node.js, Python nem pandoc instalados, logo não há forma de gerar o binário `.docx` nativo; `.rtf` abre diretamente no Word com formatação preservada.

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

## 2026-08-26 — Pivot: stack 100% gratuita (substitui as decisões de IA acima)

O utilizador pediu explicitamente custo zero — nem a Anthropic nem a OpenAI têm nível gratuito permanente de API (só a app de consumidor Claude.ai é gratuita; a API é sempre paga por uso). Isto **substitui** as linhas "IA de texto/tutoria" e "Speech-to-text" da tabela acima e a secção "Decisão discutida: Speech-to-text no MVP1".

| Camada | Decisão anterior | Nova decisão | Justificação |
|---|---|---|---|
| IA de texto/tutoria | Anthropic (Claude) | **Google Gemini** (`gemini-2.0-flash`, `@google/generative-ai`) | Nível gratuito permanente (com limite de pedidos/dia) — não é um trial que expira. Trade-off aceite: limites de rate no plano gratuito podem obrigar a upgrade pago se a app crescer para lá de uso pessoal/piloto. |
| Speech-to-text | Whisper API (paga) | **Web Speech API do browser** (`SpeechRecognition`, `src/components/ui/RecordButton.tsx`) | Grátis, corre inteiramente no browser do utilizador, sem upload de áudio a nenhum servidor. Volta a ser a opção que o master prompt sugeria originalmente para o MVP1 — nessa altura foi preterida por fiabilidade cross-browser, mas o requisito de custo zero agora tem prioridade. Trade-off aceite: suporte forte em Chrome/Edge, fraco ou ausente em Firefox/Safari. |
| Text-to-speech | Azure Neural TTS (planeado) | **Já resolvido antes com Web Speech API** (`speechSynthesis`, `PlayTranscript.tsx`) — sem alteração, continua gratuito | Nenhuma mudança necessária; já não dependia de nenhum fornecedor pago. |

Removida a dependência `@anthropic-ai/sdk` e a rota `/api/speaking/transcribe`; adicionada `@google/generative-ai`. Variáveis de ambiente `ANTHROPIC_API_KEY` e `OPENAI_API_KEY` substituídas por uma única `GEMINI_API_KEY` (criar em [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey), grátis).

## 2026-08-26 — TTS interino no MVP1: Web Speech API do browser

A tabela acima confirma Azure Neural TTS como fornecedor de produção, mas **implementar essa integração fica fora do MVP1** (custo/esforço de pipeline de áudio pré-gerado não se justifica antes de validar o resto do produto). Solução interina aplicada: exercícios de `listening` guardam um `transcript` (ver `docs/08-schema-json-conteudo.md`) que o browser lê em voz alta via Web Speech API (`speechSynthesis`), sem custo e sem backend. **Trade-off aceite**: qualidade de voz inferior a TTS neural, sem controlo de sotaque (British/American — a `EnglishVariant` do perfil ainda não é usada para escolher a voz), e alguns browsers/SOs mais antigos podem não suportar `speechSynthesis` (tratado com mensagem de fallback, não crash). Substituir por áudio pré-gerado com Azure TTS antes do MVP2, gerado a partir do mesmo `transcript`.

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

## 2026-08-26 — Expansão de conteúdo e heurística de "próxima lição"

- Conteúdo curricular expandido de 1 para 4 lições seedáveis: Pre-A1 "Greetings and Introductions" (verbo to be — inclui explicitamente o erro clássico "I have 38 years" citado na secção 4 do master prompt), A1.1 "Daily Routines" (Present Simple), A1.1 "Likes and Hobbies" (perguntas com Do/Does), A1.2 "At the Shop" (There is/There are). `prisma/seed.ts` generalizado para iterar sobre uma lista de ficheiros de módulo (`MODULE_FILES`) em vez de ter uma função por módulo — adicionar conteúdo novo passa a ser só criar o ficheiro JSON e adicioná-lo à lista.
- **Heurística de "próxima lição" na Home** (`src/lib/lessons.ts`): sem uma tabela dedicada de conclusão de lição, usa-se como proxy "tem pelo menos uma `ExerciseAttempt` num exercício dessa lição" para considerar a lição "tocada" e avançar para a seguinte. Aceitável para MVP1; **não filtra pelo nível atual do utilizador** (mostra sempre a próxima lição não tocada, independentemente de `LearningProfile.currentLevel`) — revisitar em MVP2 quando o currículo cobrir mais níveis e o level skipping (`docs/04-arquitetura-curricular-cefr.md`) precisar de gating real.

## 2026-08-27 — Fase 3 fechada: conteúdo de referência, limpeza de schema, PRONUNCIATION; início da Fase 4

Sessão contínua sem pausas (pedido explícito do utilizador: "não deve parar até os tokens da sessão estiverem perto de esgotar"). Trabalho realizado, por ordem:

### Conteúdo de referência (ficheiros estáticos `src/content/*.ts`, sem schema/seed)
- **`readingPassages.ts`**: 4 → 20 textos (~61 → ~2.400 palavras), cada um ligado deliberadamente a um conceito de gramática dos 27 módulos seedados (ex. `places-i-have-visited`↔Present Perfect, `if-i-won-the-lottery`↔Second Conditional, `how-coffee-is-made`↔Passive Voice), cobrindo Pre-A1 a B1.
- **`idioms.ts`**: 8 → 26 expressões idiomáticas/phrasal verbs (schema mantido: `phrase, literalPt, meaningEn, meaningPt, example, distractors[3]`).
- **`culturalTips.ts`**: 5 → 15 dicas culturais, agora cobrindo as 4 categorias (`small_talk`, `register`, `variants`, `etiquette`) de forma mais equilibrada.
- **`sentencePatterns.ts`**: 8 → 18 padrões de erro PT→EN (falsos amigos, `make` vs `do`, dupla negativa, etc.).
- **`irregularVerbs.ts`**: correção de um erro de categorização (`wake up` estava listado como verbo irregular — é um phrasal verb; substituído pelo verbo base `wake/woke/woken`) e expansão de 55 → 99 verbos. Confirmado sem duplicados via `grep -c "base:"` + `sort | uniq -d`.

Todos os ficheiros `.ts` foram relidos por inteiro após edição (sem `tsc` local) para confirmar sintaxe. Nenhum destes ficheiros usa `content/curriculum/*.json` nem passa pelo `seed.ts` — são servidos diretamente pela app, por isso não há risco de o build da Netlify (pausado até 2026-09-01) apanhar um erro que só apareça no seed.

### Limpeza de schema morto (`prisma/schema.prisma`)
Removidos, após grep exaustivo confirmando zero referências no código da aplicação (incluindo tipos `Prisma.X` gerados): modelos `Question`, `UserVocabularyMastery`, `UserConceptMastery`, `Bootcamp`, `BootcampEnrollment`; enum `MasteryState`; valor `BOOTCAMP` do enum `AttemptSource`; campos de relação órfãos em `User`/`GrammarConcept`/`VocabularyItem`/`Exercise`/`Answer`. Estes modelos tinham sido criados na Fase 0 para funcionalidades nunca implementadas (bootcamps, mastery tracking granular) — nunca chegaram a ser escritos por código nenhum. Segurança da remoção: (1) tabelas nunca tinham linhas escritas, (2) `prisma db push --accept-data-loss` já é a prática padrão deste projeto (sem migrações versionadas a preservar), (3) deploys pausados até 2026-09-01 dão tempo de sobra para apanhar qualquer problema antes do próximo build real. `Answer` fica reduzido a `{ id, attemptId, attempt, givenAnswer, isCorrect, createdAt }`.

### PRONUNCIATION deixa de estar sempre a zero (achado mais citado da auditoria original)
Sem áudio real nem scoring fonético (fora do MVP1, ver decisão de 2026-08-26 sobre Web Speech API), o octógono de competência tinha o eixo PRONUNCIATION permanentemente vazio. Solução aplicada em `src/app/(app)/learn/actions.ts`: para `kind === "speaking"`, o prompt à Gemini passa a pedir também uma linha `PRONUNCIATION: <n>` (inferida a partir de padrões no transcript de reconhecimento de fala — hesitações, palavras mal reconhecidas, etc.), reaproveitando a mesma metodologia já usada para `SCORE:`. `submitSpeaking()` grava `pronunciationScore` em `SpeakingAttempt` e chama `updateSkillScore(user.id, "PRONUNCIATION", pronunciationScore)`. **Trade-off aceite e documentado**: é um sinal indireto (padrões de transcrição), não scoring fonético fonema-a-fonema — melhor do que zero permanente, mas não deve ser apresentado ao utilizador como precisão clínica.
- **Vulnerabilidade auto-detetada e corrigida antes de finalizar**: a nova linha `PRONUNCIATION:` no prompt não estava coberta pela sanitização de input existente (só `SCORE:` era removido do texto do utilizador antes de ir para a Gemini) — adicionado `.replace(/PRONUNCIATION\s*:/gi, "pronunciation-")` à mesma cadeia de sanitização, espelhando a defesa já existente. Nenhuma exploração ocorreu; apanhado em revisão própria do código.
- `submitSpeaking()` ganhou também `responseTimeMs` opcional (tempo entre o prompt aparecer e o utilizador submeter), capturado em `LessonRunner.tsx` via `useRef(Date.now())`, validado (finito, ≥0, limitado a 10 min) e gravado em `SpeakingAttempt`.

### "Inglês de hoje" — plano diário adaptado ao tempo disponível (auditoria secção 47)
Nova função pura `generateDailyPlan()` (`src/lib/plan/dailyPlan.ts`), sem escrita na BD — deriva de `LearningProfile.dailyMinutesTarget` (já existia) e da existência de revisões pendentes. Gera uma checklist concreta (não só uma frase genérica) com escalões alinhados aos de `generateStandardPlan()`: ≤5min (micro-desafio), ≤15min (revisão + tema), ≤30min (revisão + tema + desafio diário), >30min (revisão + tema + speaking + leitura/diagnóstico). Renderizado como card clicável em `src/app/(app)/home/page.tsx`, tanto no branch Standard como no Intensive.

### Outras correções pequenas nesta sessão
- Texto de `note` em `generateStandardPlan()` (`src/lib/plan/generate.ts`) tinha uma mistura de inglês/português — corrigido para português europeu puro.
- Grelhas de atalhos de 4 cartões em `home/page.tsx` (Standard e Intensive): `grid-cols-2` → `grid-cols-2 lg:grid-cols-4`, aditivo, não altera mobile.
- `role="status" aria-live="polite"` adicionado ao parágrafo de feedback correto/incorreto em 6 componentes de exercício (`DailyChallengeRunner`, `IdiomRunner`, `MicroChallengeRunner`, `ReadingRunner`, `TopicPracticeRunner`, `LessonRunner`) — `WeeklyTestRunner` já tinha isto de uma fase anterior; agora todos os runners de exercício anunciam o resultado a leitores de ecrã.

### Vocabulário — nota de honestidade mantida
Meta de 2.000 palavras standalone atingida em trabalho anterior desta sessão (2.004 confirmadas, ver entrada de 2026-08-26). Nenhum trabalho de vocabulário novo nesta continuação — o foco foi fechar as lacunas de conteúdo de referência e as correções estruturais que a auditoria original tinha sinalizado mas que ficaram para "uma passagem dedicada".

## Pontos em aberto para decidir antes/durante MVP1

- Algoritmo exato de spaced repetition (`ReviewScheduleItem.easeFactor`/`intervalDays`): proposto tipo SM-2 como ponto de partida; afinar com dados reais de retenção a partir do MVP2.
- % de amostragem humana no Content QA por nível (secção "Content Engine" de `06-arquitetura-ia.md`) — a decidir com o especialista CEFR antes do seeding de A1.
- Limiar de mastery agregado exigido para elegibilidade de certificação de nível (`05-avaliacao-certificacao.md`) — a calibrar antes do MVP3.
