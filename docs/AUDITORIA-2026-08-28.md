# Auditoria de Evolução — 2026-08-28

> **Terceira auditoria.** Mede a evolução face à auditoria de 2026-08-27 (nota global 5,6/10),
> depois de implementadas as Fases 8-15 do roadmap (blindagem, rubrica de speaking, accountability
> de erros, retenção, currículo até C1, fonologia de fala ligada, correção de 3 bugs reais no
> sistema de nivelamento). Não reavalia do zero.

---

## ⚠️ Limitação metodológica declarada

**Esta auditoria é 100% estática — a aplicação NÃO foi executada.** Continua sem Node.js nesta
máquina (não é possível `next build`, `tsc`, correr o seed ou os testes) e os deploys da Netlify
continuam pausados até 2026-09-01. Tudo o que se segue foi verificado por **leitura de código
atual, com ficheiro e linha**, através de 4 agentes de investigação independentes (segurança,
estatísticas de conteúdo, funcionalidades/pedagogia, correção gramatical dos módulos novos),
cada um instruído a ser cético e a tentar ativamente encontrar o que está partido — não a
confirmar o que a sessão de trabalho alegou. Onde a validação exigiria execução real, o achado
está marcado **[POR CONFIRMAR EM RUNTIME]**.

A comparação com concorrentes (secção 4) foi atualizada com uma pesquisa web leve (não uma
reavaliação exaustiva de cada app) — ver fontes citadas nessa secção.

---

## 🔴 ACHADO CRÍTICO — A forja de certificados está reaberta, por uma porta diferente

**A Fase 8 fechou as 6 rotas identificadas na 2ª auditoria. Mas nunca olhou para
`practice/review/actions.ts`, que tem exatamente a mesma classe de vulnerabilidade — e hoje é
mais grave do que a original, porque agora alimenta o avanço REAL de nível/currículo, não só um
certificado cosmético.**

```ts
// src/app/(app)/practice/review/actions.ts:58-61
if (itemType === "vocabulary_item") {
  await updateSkillScore(user.id, "VOCABULARY", qualityToScore(safeQuality));
  return;
}
```

Ao contrário do ramo `"error"` (que valida dono via `prisma.userError.findUnique` +
`userError.userId !== user.id`), o ramo `"vocabulary_item"` **nunca verifica que `itemRefId`
corresponde a uma `VocabularyItem` real**. `src/lib/srs/schedule.ts:16-50` (`scheduleReview`)
confirma: faz upsert de `ReviewScheduleItem` com qualquer `itemRefId` string, sem `findUnique`
contra `VocabularyItem`. `quality` (0-5) é um número livre do cliente, só sujeito a clamp
(`review/actions.ts:31`), nunca confrontado com nenhuma resposta real — `qualityToScore(5) = 100`.

**Exploit trivial**: chamar `submitReview("vocabulary_item", "qualquer-string", 5)` — nem precisa
de um id real — sobe VOCABULARY para perto de 100 via EMA em poucas chamadas. Esta rota nunca
chama o Gemini, por isso `checkAiRateLimit` não se aplica; não há travão nenhum.

**Porque é mais grave do que em 2026-08-27**: a Fase 15 desta sessão fez `maybeIssueCertificate`
(`src/lib/certificate.ts`) avançar `currentLevel`/`currentSublevel` de verdade quando a média dos
8 pilares justifica um certificado — usando `Sublevel.order` para encontrar o subnível seguinte.
Isto é uma correção genuína e bem implementada (verificada nesta auditoria, ver secção 1). Mas
significa que um `VOCABULARY` forjado já não produz só um certificado decorativo — **produz
progressão real de currículo**, incluindo o filtro de exercícios por CEFR (`buildQuestionSet`,
também Fase 15) passar a mostrar conteúdo B2/C1 a alguém que nunca demonstrou saber nada disso.

**Não é um caso isolado — dois achados relacionados, ambos já existentes mas com peso maior
agora pela mesma razão:**
- `practice/verbs/actions.ts:8` — `completeVerbOfTheDay(knewIt: boolean)` continua sem
  re-derivação nenhuma, GRAMMAR forjável por desenho, documentado como decisão deliberada em
  `PROJECT_STATE.md` mas nunca revisitado à luz do avanço real de nível.
- `practice/micro-challenges/actions.ts:36,54-58` — o shadowing aceita `transcript` livre do
  cliente; como a frase-alvo já está visível no ecrã (`MicroChallengeRunner.tsx:77`), enviar
  `transcript = challenge.sentence` sem gravar nada dá pontuação máxima em SPEAKING.

**Nota de honestidade**: `PROJECT_STATE.md:7` afirma "pilar e nota passam a ser sempre derivados
no servidor... nunca aceites do cliente". Essa frase está **factualmente incorreta** hoje — foi
verdade para as 6 rotas explicitamente listadas na 2ª auditoria, mas a auditoria (e a sessão de
correção que se seguiu) nunca cobriu `review/actions.ts`, que tem o mesmo problema.

---

## 1. Verificação das Fases 8-15 (o que foi mesmo feito)

### Fase 8 — Blindagem: **⚠️ maioritariamente mantida, com o achado crítico acima**

| Item | Estado | Prova |
|---|---|---|
| 6 rotas de forja (micro-challenges/dictation/reading/idioms/daily-challenge/verbs) | ⚠️ 5/6 | `verbs/actions.ts:8` continua sem re-derivação, por desenho documentado |
| **`review/actions.ts` (nunca esteve na lista das "6 rotas")** | 🔴 **NOVO** | ver achado crítico acima |
| N1 (prompt/text sanitizados igualmente) | ✅ | `learn/actions.ts:347-358` — `stripMarkers` aplicado a ambos |
| N2 (validação de onboarding) | ✅ | `onboarding/actions.ts:25-58` — enums, limites, `targetDate` |
| N3 (validação de `sessionFocus`/`message`) | ✅ | `api/ai/tutor/route.ts:26-45` |
| N4 (rate limit atómico) | ✅ | `rateLimit.ts:50-78` — `$transaction` + `pg_advisory_xact_lock` |
| N5 (pilar real, não do cliente) | ✅ | `weekly-test/actions.ts:67-79`, `gradeSubmission.ts:55,63,68` |
| N6 (seed paralelo) | ✅ | `seed.ts:90-93,426,460` — `mapWithConcurrency` |
| IDOR na fila SRS (ramo `"error"`) | ✅ | `review/actions.ts:47-52` — dono verificado antes de usar `userErrorId` |
| Open redirect (`/\`) | ✅ | `login/actions.ts:18` — regex `^\/[^/\\]` bloqueia ambos os casos |
| Error boundaries | ✅ | `(app)/error.tsx` e `error.tsx` na raiz, ambos existem |
| Rate limit por perfil (não é do roadmap da Fase 8, mas continua aberto) | 🔴 | `profiles/actions.ts:35-58` — sem limite de criação |

**Residual não corrigido, sinalizado mas não crítico**: `practiceQuestions.ts:12-20,149-157`
continua a devolver `correctAnswers` ao componente cliente do Diagnóstico Semanal
(`weekly-test/page.tsx:39,54`) — não permite forjar a nota (o servidor recorrige sempre), mas
expõe as respostas certas antes de o utilizador responder. Problema de integridade do teste, não
de segurança do certificado.

### Fase 9 — Áudio real: **inalterada nesta ronda**

Continua bloqueada por decisão financeira do utilizador, não revisitada nesta sessão. Sem
novidade a reportar.

### Fase 10 — Rubrica e oral a sério: **✅ maioritariamente, com uma fragilidade real**

| Item | Estado | Prova |
|---|---|---|
| Rubrica de 5 eixos (incl. naturalness) pedida e processada para speaking | ✅ | `learn/actions.ts:265-412`, ordem exata pedida `:322-328` |
| `SpeakingStep` mostra as 5 barras | ✅ | `LessonRunner.tsx:352-366`, `RUBRIC_LABEL:397-406` |
| Canal de voz no AI Tutor (gravar + ouvir) | ✅ | `TutorChat.tsx:159-161` (RecordButton), `:114-128` (botão ouvir) |
| **Robustez do parsing se o modelo desviar da ordem exata** | ⚠️ **NOVO** | `SCORE`/`PRONUNCIATION` removidos com `$` sem `/m` (`:368,374`) — se o modelo não terminar exatamente nessa ordem, o valor fica `null` **e a linha "SCORE: X"/"PRONUNCIATION: X" fica visível no texto de feedback mostrado ao utilizador**, porque o `replace` usa a mesma âncora falhada do `match`. Os 5 campos da rubrica são mais tolerantes (usam `/m`, batem em qualquer linha) |

### Fase 11 — Accountability de erros: **✅ confirmada**

| Item | Estado | Prova |
|---|---|---|
| Repescagem forçada de erros com `occurrences >= 3` | ✅ | `schedule.ts:95-99` — sem filtro de `dueAt` |
| Fila ordenada por `occurrences` primeiro, `dueAt` como desempate | ✅ | `schedule.ts:127-130` |
| `buildQuestionSet` prioriza exercícios ligados a erros do utilizador | ✅ | `practiceQuestions.ts:98-108,123-134` |
| Nuance: a prioridade não exige `occurrences >= 3`, só `resolvedAt: null` | ⚠️ | qualquer erro não resolvido (mesmo cometido 1 vez) recebe a mesma prioridade que um "persistente" — a palavra usada na documentação é mais forte do que o código exige |

### Fase 12 — Retenção: **✅ confirmada integralmente**

Reparação de streak sem bugs de lógica encontrados (`recordActivity.ts:68-91`, condições
verificadas uma a uma incl. o caso de 2+ dias falhados mesmo com congelamentos disponíveis).
`/profiles` e renomear perfil não foram re-verificados nesta ronda (sem alterações desde a Fase
12, sem razão para suspeitar de regressão).

### Fase 13 — Currículo até B2 (+ extensões): **✅ conteúdo correto, com 1 bug de ordenação**

- 26 módulos novos (A1 +1, A2 +5, B1 +5, B2 +9) revistos linha a linha por um agente: **zero
  erros gramaticais, zero chaves de resposta erradas, zero redundância pedagógica** entre os
  pares suspeitos verificados (wish vs. condicionais, so/neither vs. inversão, indirect questions
  vs. wh-questions, present perfect continuous vs. present perfect/past simple).
- 🆕 **Bug de ordenação encontrado**: em 4 sublevels (A1.1, A2.1, A2.2, B1.1), a posição dos
  módulos no array `MODULE_FILES` de `seed.ts` **não corresponde** ao campo `module.order` de
  cada ficheiro. Como `/learn` ordena por `module.order` (`learn/page.tsx:13-15`) mas a sequência
  real de lições segue `Lesson.order` (posição no array, `lessons.ts:18`), **o utilizador vê os
  módulos numa ordem na página de currículo diferente da ordem em que os vai completar de facto**
  nestes 4 sublevels. Exemplo: em A1.1, `reflexive-pronouns` (order=6) está listado antes de
  `wh-questions` (order=5) no array.
- Fonologia de fala ligada: ✅ confirmada — `pronunciationTips.ts:88-127` (5 itens
  `connected-speech`), `pronunciation/page.tsx` com 2 secções separadas.

### Fase 14 — Inglês autêntico: **✅ fechada nos termos declarados**

82 textos de leitura confirmados (não 79 nem 76 — número exato, contado diretamente). Só 22 têm
`genre` explícito (introduzido a partir da Fase 14/15); os restantes 60 são narrativa implícita,
tal como documentado — não é uma alegação falsa, é exatamente o que foi declarado ("os 60 textos
existentes continuam válidos sem o campo"). Distribuição por nível: Pre-A1 10, A1 19, A2 26, B1
23, B2 4, C1 0 — **zero textos C1**, apesar de o nível já existir no currículo de módulos.

### Fase 15 — Currículo C1 + placement estendido: **✅ confirmada**

- 6 módulos C1 revistos, sem erros linguísticos nem chaves de resposta erradas.
- `averageToLevel` (`scoring.ts:71-84`): 12 bandas verificadas uma a uma, estritamente
  monótonas, cobrem `[0,100]` sem lacunas nem sobreposições, terminam em C1.2.
- `maybeIssueCertificate` avança nível corretamente via `Sublevel.order`, com tratamento correto
  do teto do currículo (sem próximo subnível → sem crash, sem update). **Mas herda diretamente a
  gravidade do achado crítico** — a lógica em si está bem construída, o problema é o que a
  alimenta.
- `cefrLevelsUpTo`/`buildQuestionSet`: nunca mostra conteúdo acima do nível do utilizador. Nuance
  encontrada: o recuo para "todos os níveis" só acontece com **zero** exercícios disponíveis ao
  nível do utilizador para um pilar, não com "poucos" — pode devolver silenciosamente menos
  perguntas do que `perPillar` pedia.

---

## 2. Achados de segurança (consolidado desta ronda)

| # | Achado | Gravidade | Estado |
|---|---|---|---|
| S1 | `review/actions.ts` — VOCABULARY forjável sem validar `itemRefId` | 🔴 Crítico | Novo, não coberto por nenhuma auditoria anterior |
| S2 | `verbs/actions.ts` — GRAMMAR forjável por desenho | 🟠 Alto | Já conhecido, peso agravado pelo avanço real de nível |
| S3 | Shadowing do micro-desafio — SPEAKING semi-forjável (frase-alvo já visível) | 🟡 Médio | Já existia, não tinha sido nomeado como forja |
| S4 | `correctAnswers` do Diagnóstico Semanal expostas ao componente cliente antes de responder | 🟡 Médio | Residual da 2ª auditoria, não corrigido |
| S5 | Sem limite de criação de perfis por conta | 🟡 Médio | Residual da 2ª auditoria (Fase 6), não corrigido |
| S6 | Rubrica de speaking: parsing pode deixar marcador visível no feedback se o modelo desviar da ordem pedida | 🟡 Médio | Novo (Fase 10), fragilidade de robustez, não de segurança direta |

---

## 3. Comparação com concorrentes (atualizada)

Pesquisa web leve para confirmar que o panorama competitivo não mudou de forma material desde a
2ª auditoria (ver fontes no final). Conclusão: nenhuma das apps lançou nada que exija reavaliar
drasticamente as suas colunas — ELSA continua a liderar claramente em feedback fonético,
Duolingo/Busuu/Memrise continuam a expandir IA conversacional de forma incremental. Só a coluna
"Esta app" foi recalculada, com base nas verificações desta auditoria.

| Critério | **Esta app** | Duolingo | Busuu | Babbel | ELSA | Memrise |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Volume de currículo | **6** (era 4) | 9 | 8 | 8 | 5 | 7 |
| Áudio real / listening | **2** (igual) | 9 | 8 | 9 | 8 | 10 |
| Speaking / pronúncia | **5** (era 4) | 5 | 6 | 6 | **10** | 6 |
| SRS / retenção | **9** (era 8) | 6 | 7 | 7 | 5 | 9 |
| Feedback de IA (escrita) | **8** (igual) | 3 | 6 | 4 | 7 | 3 |
| Foco PT→EN (erro específico) | **9** (igual) | 2 | 4 | 5 | 3 | 3 |
| Personalização | **7** (era 5) | 6 | 7 | 6 | 8 | 6 |
| Gamificação | **7** (era 6) | **10** | 6 | 5 | 6 | 7 |
| Perfis de família | **7** (igual) | 6 | 5 | 5 | 4 | 5 |
| **Progressão/certificação de nível** (novo) | **5** | 7 | 6 | 6 | 6 | 5 |
| Custo | **10** (igual) | 7 | 5 | 4 | 4 | 5 |

**Onde a distância encolheu de verdade**: currículo (volume e profundidade, agora até C1),
retenção/SRS (occurrences finalmente age), personalização (plano diário genuinamente adaptado).
**Onde não encolheu**: áudio/listening continua no mesmo patamar, 2/10 contra 8-10 dos
concorrentes — o fosso que define o produto continua exatamente onde estava. **Nova linha,
"progressão/certificação de nível"**: mecanismo bem desenhado (12 bandas, avanço automático),
mas pontuado abaixo dos concorrentes porque, ao contrário deles, o *gate* de confiança que o
alimenta está comprovadamente furável hoje.

---

## 4. Saída — nota, evolução, ações e roadmap

### 4.1 Nota global

# 5,6/10 → **6,3/10**

Subida real em conteúdo, pedagogia e correção de bugs genuínos — a maior ronda de trabalho
verificado desta série de auditorias, com evidência consistente em 4 investigações
independentes. **Mas travada, outra vez, por uma regressão de segurança da mesma classe da
anterior — desta vez mais grave em consequência, porque alimenta progressão real de currículo,
não um certificado decorativo.**

Sem o achado crítico (S1) e os relacionados (S2, S3): a nota seria **~7,6/10** — a maior
distância entre "potencial" e "nota real" desde a primeira auditoria, e pelo mesmo motivo
recorrente: um ponto de confiança no cliente nunca coberto pela ronda de correções anterior.

### 4.2 Evolução por dimensão

| Dimensão | Antes (5,6) | Agora | O que mudou |
|---|:---:|:---:|---|
| Técnica | 6,5 | **7** | Mais testes unitários (placement, practiceQuestions), mas ainda não executados (sem Node); bug de ordenação de módulos encontrado |
| **Segurança** | 4 | **4,5** | 5/6 rotas + N1-N6 genuinamente corrigidos e verificados; mas achado crítico novo em `review/actions.ts` reabre a forja, agora com mais consequência |
| Conteúdo educativo | 6 | **7,5** | 30→57 lições (52%-71% da meta de 80-120, contra 25-37% antes) |
| Gramática | 8 | **9** | ~22/24 → cobertura completa + 21 conceitos B2/C1 genuínos verificados sem erros |
| Vocabulário | 7 | **7** | Cresceu para ~2.096, mas descoberta uma discrepância de documentação de 81 palavras nos bancos (não desta sessão) |
| Listening | 2 | **2,5** | CEFR-filtering evita expor conteúdo acima do nível; continua zero áudio real |
| Pronúncia | 4 | **5** | Fonologia de fala ligada adicionada (linking, weak forms, elisão, contrações faladas, sons intrusivos) |
| Speaking | 5 | **6** | Rubrica de 5 eixos + canal de voz no tutor; travado pela fragilidade de parsing e pelo shadowing semi-forjável |
| Reading | 8 | **8,5** | 60→82 textos, 5 géneros (22 já explicitamente marcados) |
| Writing | 7 | **7,5** | Eixo "naturalidade" adicionado à rubrica |
| SRS | 8 | **9** | `occurrences` finalmente prioriza a fila e força repescagem — deixou de ser decorativo |
| Personalização | 5 | **7** | Plano diário liga a sério ao pilar mais fraco; "porquê" do onboarding volta a aparecer em `/progress` |
| Gamificação | 6 | **7** | Streak com reparação (congelamentos), verificado sem bugs de lógica |
| Família | 7 | **7,5** | Beco sem saída corrigido, renomear perfil |
| **Progressão de nível** (novo) | — | **5** | B2/C1 introduzidos, placement/certificação tecnicamente sólidos, mas o *gate* que os alimenta é forjável (achado crítico) |
| Adequação a 4 meses | 4 | **5,5** | 57 lições + profundidade C1 aproxima-se mais de um percurso de 4 meses |

### 4.3 Top 5 ações imediatas (impacto ÷ esforço)

| # | Ação | Onde | Esforço |
|---|---|---|---|
| **1** | **Fechar `review/actions.ts` (VOCABULARY forjável).** Validar `itemRefId` contra `VocabularyItem` real antes de aceitar `quality`, mesmo padrão já usado no ramo `"error"` do mesmo ficheiro | `practice/review/actions.ts:58-61`, `lib/srs/schedule.ts:16-50` | ~1 h |
| **2** | **Revisitar `verbs/actions.ts` e o shadowing à luz do avanço real de nível.** Já não é um risco cosmético aceitável — decidir conscientemente (re-derivar como os outros pilares, ou aceitar e documentar o novo risco explicitamente) | `practice/verbs/actions.ts:8`; `practice/micro-challenges/actions.ts:36,54-58` | ~1-2 h |
| **3** | **Corrigir a ordem dos módulos em 4 sublevels** (A1.1, A2.1, A2.2, B1.1) para o array `MODULE_FILES` bater certo com `module.order` — hoje `/learn` mostra uma ordem, a progressão real segue outra | `prisma/seed.ts` | ~30 min |
| **4** | **Tornar a rubrica de speaking robusta a desvios do modelo.** Aplicar a mesma tolerância `/m` já usada nos 5 campos da rubrica ao SCORE/PRONUNCIATION, para nunca deixar um marcador de controlo visível no feedback | `learn/actions.ts:368,374` | ~30 min |
| **5** | **Corrigir a discrepância de 81 palavras** nos bancos de vocabulário — recontar e corrigir `docs/decisions.md`/`PROJECT_STATE.md`, ou investigar se algum lote se perdeu | `content/curriculum/vocabulary-bank*.json` | ~30 min |

### 4.4 Roadmap do que falta

**FASE 16 — Blindagem 2.0** · ~1 dia · **P0**
Fechar `review/actions.ts`, decidir conscientemente sobre `verbs/actions.ts` e o shadowing,
deixar de expor `correctAnswers` ao cliente no Diagnóstico Semanal antes de responder, limite de
criação de perfis por conta.

**FASE 17 — Correções de precisão** · ~1 dia · **P1**
Ordem dos módulos nos 4 sublevels, robustez do parsing da rubrica de speaking, corrigir a
contagem de vocabulário na documentação, decidir sobre o limiar de `occurrences` usado em
`buildQuestionSet` (hoje qualquer erro não resolvido, não só os persistentes).

**FASE 18 — Currículo C2 + fechar Fase 14 real** · contínuo · **P2**
Introduzir C2 (schema já suporta), continuar a rebalancear sublevels mais finos, e revisitar
Fase 14 (notícias/podcasts reais, letras de música, legendas) assim que a Fase 9 (áudio real)
for desbloqueada por decisão do utilizador.

---

### 4.5 Veredito honesto

**O objetivo declarado (perceber letras de música, ver filmes sem legendas) continua tão
distante quanto na 2ª auditoria — a Fase 9 (áudio real) nunca foi revisitada nesta sessão, por
decisão explícita e correta de não gastar dinheiro sem autorização.** O que mudou é a
credibilidade do que rodeia esse objetivo: o currículo agora vai genuinamente até C1, com
fonologia de fala ligada ensinada como referência (ainda que sem áudio real para a praticar), e
os mecanismos de progressão/retenção/personalização estão, pela primeira vez, todos verificados
como funcionais de ponta a ponta. **Mas a app continua a poder mentir a si própria sobre o nível
de quem a usa** — um utilizador (ou um script) pode inflar VOCABULARY para 100 numa chamada, e o
sistema, hoje mais do que nunca, vai acreditar e agir sobre essa mentira: sobe-lhe o nível,
muda-lhe o conteúdo mostrado, emite-lhe um certificado C1 verificável publicamente. É o mesmo
padrão de risco da 2ª auditoria, na mesma classe de gravidade, só que desta vez a régua que a
app usa para medir progresso é mais rica — o que torna medi-la com dados forjados mais grave, não
menos.

---

## Fontes (comparação com concorrentes, secção 3)

- [Top 10 AI Language Learning Apps in 2026: Beyond Duolingo](https://www.remio.ai/post/top-10-ai-language-learning-apps-in-2026-beyond-duolingo)
- [Language Learning Apps Comparison: What Actually Works](https://migaku.com/blog/language-fun/language-learning-apps-comparison)
- [6 Best AI Language Learning Apps in 2026: Ranked and Tested](https://www.upskillist.com/blog/best-ai-language-learning-apps/)
- [Top 5 AI Language Apps for Speaking Practice (2026)](https://benjamingordonscholarship.com/top-5-ai-powered-language-learning-apps/)
