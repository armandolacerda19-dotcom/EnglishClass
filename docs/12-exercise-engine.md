# Exercise Engine — arquitetura

Pedido do utilizador (2026-08-28): construir "uma verdadeira arquitetura de aprendizagem" com 20 tipos de exercício, motor de distribuição inteligente, adaptive learning e mastery tracking — não páginas isoladas. Este documento é o registo permanente da Fase 1 (auditoria) e Fase 2 (arquitetura) desse pedido; as fases seguintes (3-6) ficam registadas em `docs/decisions.md` à medida que avançam.

## Fase 1 — o que já existe (auditoria)

Feita por 3 investigações independentes e profundas (modelo de dados/conteúdo, progresso/mastery/gamificação, interface/IA/áudio), não um resumo por memória.

### O achado mais importante: duas pipelines de conteúdo em paralelo

1. **`Exercise.contentJson` (BD, seedado)** — usado por exercícios de lição (`LessonRunner`), Diagnóstico Semanal e Sheets de tema (`buildQuestionSet`). Forma plana e uniforme: `{ prompt, correct_answer: string[], distractors: string[], explanation, tags, transcript? }`. Sem campo nenhum para ordenação, emparelhamento, blanks múltiplos ou qualquer coisa fora de "escolha múltipla ou texto livre".
2. **Módulos de conteúdo estático (`src/content/*.ts`)** — ditado, ordenar frases, emparelhar, verbos, idiomas, leitura, cultura, padrões frásicos, micro-desafios, desafio diário. Cada um com o seu próprio `page.tsx`/`actions.ts`/Runner, sem passar pelo `Exercise` nenhum.

Isto significa que **não existe hoje um "motor" único** — existem 11+ implementações paralelas, cada uma reinventando o mesmo ciclo: buscar conteúdo → mostrar → "Verificar" → corrigir no servidor contra o conteúdo real → `updateSkillScore` + `recordActivity` + `awardAchievement`.

### O que já está genuinamente bem resolvido (não mexer)

- **Mastery**: `updateSkillScore()` (`src/lib/skillProfile.ts`) — EMA simples (α=0,25) sobre os 8 pilares, com `SELECT...FOR UPDATE` transacional contra race conditions, e recalcula `weakAreas`/`strongAreas` a cada chamada. É a ÚNICA fonte de verdade de progresso por competência, já chamada por praticamente todas as superfícies existentes. **O motor novo tem de chamar esta função, nunca reimplementá-la.**
- **SRS**: `scheduleReview()`/`getDueReviews()` (`src/lib/srs/`) — SM-2 real, com repescagem forçada de erros com `occurrences >= 3`. Funciona.
- **Gamificação**: `recordActivity()`/`awardAchievement()` (`src/lib/gamification/`) — tabela de XP por `ActivityKind`, streak com congelamentos, achievements seedados. Funciona.
- **Correção semântica de texto livre**: `gradeFreeTextAnswer()` (`src/lib/ai/gradeAnswer.ts`) — igualdade exata primeiro, IA (Gemini) só se necessário, com defesas contra prompt injection já implementadas. Reutilizável tal como está.
- **Primitivas visuais**: `Card`, `Button`, `TextField`, `TextAreaField`, `Spinner`, `StampBadge`, `ProgressBar`, `PlayTranscript`, `RecordButton`, `pillarDisplay.ts` (cor/rótulo por pilar). Convenção de layout consistente em todos os runners (`mx-auto max-w-lg lg:max-w-2xl px-6 py-10`, barra de progresso, `Card`, botão "Verificar"/"Seguinte").

### Limitações reais confirmadas (não fingir que não existem)

- **Voz**: só Web Speech API (TTS) + `SpeechRecognition` do browser (STT). Sem áudio gravado real, sem análise fonética/prosódica — a app já infere "pronúncia" a partir do texto transcrito, nunca do som em si. Qualquer "Pronúncia: 82%" tem de ser honesto sobre isto ser um proxy (precisão do reconhecimento de fala), não uma medição fonética real.
- **Sem vídeo nenhum na app** — zero conteúdo de vídeo, zero infraestrutura de streaming. Produzir vídeo não é viável a custo zero (direitos, alojamento, largura de banda).
- **Conversa com IA não tem avaliação estruturada no fim** — é um chat corrido; o único sinal estruturado extraído hoje é `ERROR_LOGGED` por mensagem. `AIConversation.feedbackJson` já existe no schema mas nunca é escrito.
- **Sem "as suas lições" separado da fila de SRS** — `/practice/review` é a única superfície de erro-histórico.

## Fase 2 — arquitetura

### Princípio orientador

Não substituir o que funciona. Construir um **motor partilhado para exercícios NOVOS**, e ligar-lhe os tipos que ainda não existem — sem reescrever os 11 runners já verificados e em produção (risco real de regressão sem build/testes locais, sem ganho proporcional).

```
ExerciseEngine (lib/exercise/)
  ├─ types.ts        — contratos partilhados (ExerciseKind, GradingResult, DifficultyTier)
  ├─ grading.ts       — primitivas de correção reutilizáveis (exact/choice/semantic/diff/order)
  ├─ progress.ts       — 1 função (recordExerciseResult) que chama updateSkillScore +
  │                      recordActivity + awardAchievement + scheduleReview, sempre da
  │                      mesma forma — nunca reimplementa a lógica dessas 4 funções
  └─ recommend.ts      — adaptive learning: que tipo/pilar/dificuldade mostrar a seguir

ExercisePlayer (components/exercise/ExercisePlayer.tsx)
  — shell visual partilhado (barra de progresso + Card + Verificar/Seguinte + erro de
    submissão), usado pelos exercícios NOVOS; os runners existentes continuam como estão
```

### Modelo de dificuldade

Em vez de um novo enum de dificuldade separado do CEFR (que já existe e já funciona em toda a app), a "dificuldade" de um exercício é a combinação de duas coisas que já existem:
- **Nível CEFR** do conteúdo (`Exercise.cefr`/`cefr_level` nos ficheiros estáticos).
- **Camada dentro do tópico** — `Learn → Practice → Challenge → Apply`, mapeada aos passos de lição já existentes (`rule`=Learn, `exercise`=Practice) mais dois níveis novos formalizados no motor: `challenge` (mesma competência, sem andaimes — sem opções óbvias, distratores mais próximos) e `apply` (uso em contexto — ex. escrever/falar sobre o tema, não só reconhecer).

### Adaptive learning — desenho real, não fantasia de ML

Dado o volume de dados por utilizador (uma app pessoal/familiar, não milhões de eventos), um sistema de recomendação baseado em regras claras é o desenho honesto e certo — não um modelo de ML a fingir sofisticação sem dados para o treinar. `recommend.ts` decide:

1. **Que pilar** — reutiliza `LearningProfile.weakAreas` (já mantido por `recalculateAreas`, dentro de `updateSkillScore`).
2. **Que camada** — se o pilar tem `score < 50`: `practice` (reforço com andaimes); `50-80`: `challenge`; `>80`: `apply`.
3. **Que tipo de exercício** — roda por uma lista dos tipos disponíveis para aquele pilar, evitando repetir o último tipo usado (sinal simples: os últimos N tipos guardados em `localStorage` no cliente, sem precisar de nova tabela na BD).
4. **Quando rever** — a fila de SRS já resolve isto (`getDueReviews`); o motor só verifica se há revisões pendentes antes de recomendar conteúdo novo.

Este desenho cobre o pedido do utilizador ("se falhar, simplificar; se acertar fácil, aumentar dificuldade") sem inventar infraestrutura de ML desproporcionada ao produto.

## Fase 3 — core implementado (2026-08-28)

- `src/lib/exercise/types.ts` — `ExerciseKind` (20 valores), `DifficultyTier`, `GradingResult`, `ExerciseResultInput`.
- `src/lib/exercise/grading.ts` — `exactMatchGrade`, `semanticGrade` (envolve `gradeFreeTextAnswer`), `sequenceGrade`, `wordAccuracyGrade`.
- `src/lib/exercise/progress.ts` — `recordExerciseResult()`, chama sempre `updateSkillScore` + `recordActivity` + `awardAchievement` + (quando há erro) `scheduleReview`/`UserError`, na mesma ordem/lógica que `submitExerciseAnswer` já usava.
- `src/lib/exercise/recommend.ts` — adaptive learning baseado em regras (`recommendNextActivity`), usa `weakAreas`/scores já existentes.
- `src/components/exercise/ExerciseShell.tsx` — shell visual partilhado (`ExerciseShell`, `ExerciseComplete`) para os tipos NOVOS.
- `getGeminiModel(systemInstruction, jsonMode)` (`src/lib/ai/gemini.ts`) ganhou um 2º parâmetro opcional para respostas JSON estruturadas (Gemini 2.0 Flash suporta `responseMimeType`) — aditivo, não muda nenhuma chamada existente.

## Fase 4 — tipos de exercício, estado real (atualizado a cada lote)

Ver `docs/decisions.md` ("Exercise Engine — Fase 3/4") para o registo de cada lote à medida que é construído. Estado por tipo (dos 20 pedidos):

| # | Tipo | Estado |
|---|---|---|
| 1 | Escolha múltipla | ✅ já existia (lição/Diagnóstico/Sheets) |
| 2 | Preencher espaços | ⚠️ coberto parcialmente pelo "text kind" existente; UI dedicada com dica/revelação ainda por construir |
| 3 | Ordenar palavras | ✅ já existia (`/practice/ordering`) |
| 4 | Associar palavras | ✅ já existia, EN↔PT (`/practice/matching`) |
| 5 | Ouvir e escolher | ⚠️ coberto parcialmente (listening steps/leitura usam PlayTranscript+MCQ); progressão de velocidade/sotaque por nível ainda não formalizada |
| 6 | Ditado | ✅ já existia (`/practice/dictation`) |
| 7 | Repetição oral | ✅ já existia (shadowing em micro-desafios), com o limite honesto já documentado (Web Speech API, sem áudio real) |
| 8 | Leitura em voz alta | 🔴 não implementado — precisa de gravação+transcript scoring, nenhuma superfície existe hoje |
| 9 | Conversação com IA | ✅ **novo nesta ronda** — avaliação estruturada de fim de conversa (`api/ai/tutor/evaluate`), 4-5 eixos, erros, palavras novas |
| 10 | Correção de erros | ✅ **novo nesta ronda** (`/practice/error-correction`) |
| 11 | Tradução PT→EN | ✅ já existia (`TranslationStep`) |
| 12 | Tradução EN→PT | ✅ **novo** (`/practice/translation-en-pt`), correção semântica via `semanticGrade` |
| 13 | Contexto | ✅ **novo nesta ronda** (`/practice/context-choice`) |
| 14 | Sinónimos/antónimos | ✅ **novo nesta ronda** (`/practice/synonyms`) |
| 15 | Word Builder | ✅ **novo** (`/practice/word-builder`), 20 itens de morfologia |
| 16 | Quiz de gramática por tema (Learn/Practice/Challenge/Apply) | ⚠️ Learn+Practice já existem (Lesson steps); Challenge/Apply como camadas formais ainda não |
| 17 | Compreensão de texto | ✅ já existia (`/practice/reading`) |
| 18 | Compreensão de vídeo | 🔴 bloqueado — zero conteúdo de vídeo na app, não viável a custo zero |
| 19 | Role-play | ✅ já existia (personalidade "roleplay"), agora com avaliação de fim de conversa partilhada com o tipo 9 |
| 20 | Desafio de escrita livre | ✅ **novo** (`/practice/writing-challenge`), formato ❌⚠️✅ + "como um nativo escreveria" |

**15/20 confirmados funcionais** (8 já existiam antes desta ronda + 7 genuinamente novos: Correção de Erros, Sinónimos/Antónimos, Contexto, avaliação de Conversação com IA, Tradução EN→PT, Word Builder, Desafio de Escrita com formato ❌⚠️✅), **1 vídeo genuinamente bloqueado** por falta de infraestrutura a custo zero, os 4 restantes (Preencher espaços dedicado, Ouvir e escolher com progressão de velocidade/sotaque, Leitura em voz alta, Challenge/Apply formal no quiz de gramática) têm arquitetura pronta (o motor suporta-os) mas conteúdo/UI dedicados ainda por construir.
