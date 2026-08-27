# Registo de Decisões de Arquitetura

Log vivo — atualizar sempre que uma decisão de stack, schema ou convenção for tomada, para que fases futuras (ou outra sessão) não repitam a análise.

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

## Pontos em aberto para decidir antes/durante MVP1

- Algoritmo exato de spaced repetition (`ReviewScheduleItem.easeFactor`/`intervalDays`): proposto tipo SM-2 como ponto de partida; afinar com dados reais de retenção a partir do MVP2.
- % de amostragem humana no Content QA por nível (secção "Content Engine" de `06-arquitetura-ia.md`) — a decidir com o especialista CEFR antes do seeding de A1.
- Limiar de mastery agregado exigido para elegibilidade de certificação de nível (`05-avaliacao-certificacao.md`) — a calibrar antes do MVP3.
