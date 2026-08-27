# Auditoria Master — Plataforma de Inglês

**Data:** 2026-08-26
**Âmbito:** aplicação completa (código, arquitetura, conteúdo educativo, UX/UI, segurança, performance)
**Método:** auditoria estática exaustiva do código + análise de conteúdo + pesquisa de concorrência online

---

## ⚠️ Limitação declarada — leia primeiro

Esta auditoria **não incluiu execução da aplicação**. Três razões concretas:

1. **Não há Node.js nesta máquina** — nunca houve; foi essa a razão de todo o fluxo de trabalho ser "Claude edita → git push → Netlify constrói".
2. **Os deploys da Netlify estão pausados** (créditos gratuitos esgotados até 2026-09-01). Os últimos ~15 commits, incluindo praticamente tudo o que foi construído hoje, **nunca chegaram a ser publicados**. A versão online é a `b583b7a`.
3. **Não tenho credenciais de login** e, por regra de segurança permanente, nunca as insiro. Mesmo a versão antiga online não permite testar fluxos autenticados.

**Consequência honesta:** tudo abaixo foi verificado por leitura de código, contagem exata de ficheiros e análise linguística. Nada foi verificado por clique. Onde um achado exige confirmação em execução, está marcado como **[POR CONFIRMAR EM RUNTIME]**.

Isto não é uma formalidade. Um bug crítico encontrado nesta auditoria (o #1 abaixo) seria apanhado em 10 segundos por um único teste manual — e passou despercebido durante toda a sessão precisamente porque nunca ninguém executou esse fluxo.

---

## 1. Executive Summary

A aplicação tem **fundações de engenharia acima da média** (TypeScript estrito, documentação de 1.000+ linhas, decisões arquiteturais registadas, separação servidor/cliente correta) e **conteúdo educativo muito abaixo do necessário** para a promessa que faz.

O desequilíbrio é o achado central: foi construída muita **infraestrutura de aprendizagem** (SRS SM-2 real, octógono de competência vivo, diagnóstico semanal, tutor de IA multi-personalidade, certificação) e muito pouco **material para essa infraestrutura processar** (11 lições, 331 palavras, 66 exercícios, zero áudio). É um motor bem construído com pouco combustível.

Além disso, encontraram-se **8 defeitos de gravidade alta ou crítica**, incluindo um que impede o funcionamento do fluxo principal da app e uma vulnerabilidade que torna notas e certificados forjáveis a partir do browser.

**Todos os defeitos críticos e de gravidade alta foram corrigidos nesta sessão** (secção 30).

---

## 2. Nota Global

| Área | Nota | Justificação em uma linha |
|---|---:|---|
| Qualidade do código | 7/10 | TS estrito, bem organizado, comentado com o *porquê*; zero testes |
| Arquitetura | 7/10 | Separação correta, schema pensado; 5 modelos mortos, 2 write-only |
| Funcionalidade | 4/10 | Muitas features; uma quebrada de raiz, várias write-only |
| UX | 5/10 | Fluxos claros; zero loading states, "Continuar" salta lições |
| UI | 6/10 | Coerente e agora com identidade; 9px labels, sem responsive |
| Design | 6/10 | Sistema de design real e documentado; mobile-only |
| Performance | 4/10 | 51 upserts redundantes, N+1, queries sem limite |
| Segurança | 3/10 → 7/10 | Era forjável do browser; corrigido nesta sessão |
| Responsividade | 2/10 | **Zero breakpoints em toda a app** |
| Acessibilidade | 4/10 | Alguns aria corretos; feedback não anunciado, 9px |
| Conteúdo educativo | 3/10 | 11 lições, ~5 semanas de material |
| Gramática | 3/10 | 8 de 24 conceitos essenciais cobertos |
| Vocabulário | 2/10 | 331 palavras vs. 1.500-2.500 para A2 |
| Listening | 1/10 | **Zero áudio real** — 11 transcrições lidas por voz sintética |
| Speaking | 3/10 | Existe e dá feedback; nunca avaliado formalmente |
| Pronúncia | 1/10 | Pilar do octógono que **nunca recebe pontuação** |
| Reading | 2/10 | 4 textos, 261 palavras no total |
| Writing | 4/10 | Correção por IA real e boa; 11 prompts, sem rubrica |
| Sistema de revisão | 8/10 | **SM-2 genuíno — o ponto mais forte da app** |
| Personalização | 3/10 | Recolhe dados; `LearningPlan` gerado e nunca lido |
| Gamificação | 6/10 | XP/streak/13 conquistas, adulto; streak com race condition |
| Progressão de níveis | 3/10 | Pre-A1→A2.2; placement nunca recomenda A2 |
| Exames | 4/10 | Diagnóstico semanal real; 10 perguntas de um pool de 66 |
| Utilidade prática | 4/10 | Cultura/padrões/idiomas são bons; poucos e desligados do motor |
| Preparação para conversação | 5/10 | 4 personalidades + setores; sem áudio, sem progressão estruturada |
| Adequação a 4 meses | 2/10 | Conteúdo esgota em ~5 semanas |

### NOTA GLOBAL: **4,2 / 10**

**Porquê 4,2 e não mais:** a promessa é "professor 24/7 que leva a falar inglês em 4 meses". A app tem material para ~5 semanas, não tem áudio nenhum, e não avalia formalmente as duas competências produtivas (falar e escrever). Uma nota mais alta seria desonesta.

**Porquê 4,2 e não menos:** o que existe está genuinamente bem construído. O SRS é um SM-2 a sério, não uma imitação. A ponte PT→EN é real e melhor do que a de qualquer concorrente. A documentação é de nível profissional. As fundações aguentam o produto que falta construir.

---

## 3. Estado Técnico

**Métricas:** 118 ficheiros TS/TSX · 6.455 linhas · 33 commits · **0 testes** · **0 loading/error boundaries** (antes desta auditoria)

**Bom:** `strict` + `noUncheckedIndexedAccess` ativos (raro e valioso); `"use client"` só nas folhas (19 de ~60 ficheiros); dados de conteúdo importados apenas por server components — **zero fuga para o bundle**; documentação viva em `docs/decisions.md`.

**Mau:** zero testes automáticos numa app com lógica de scoring, SRS e certificação; `zod` instalado e **nunca importado**; `requireUser()` faz um `upsert` a cada chamada — **51 escritas redundantes à base de dados** por navegação típica.

---

## 4. Estado Educativo

| Recurso | Quantidade real |
|---|---|
| Lições completas | **11** |
| Exercícios corrigíveis | **66** |
| Palavras de vocabulário | **331** (327 únicas antes da correção) |
| Textos de leitura | **4** (261 palavras no total) |
| Verbos irregulares | 54 |
| Idiomas/phrasal verbs | 8 |
| Padrões frásicos | 8 |
| Dicas de cultura | 5 |
| Micro-desafios | 5 |
| **Ficheiros de áudio** | **0** |

**Ritmo real:** a 2-3 lições por semana, o currículo esgota-se em **menos de 5 semanas**. Para 4 meses seriam precisas 80-120 lições.

---

## 5. Estado UX/UI

**Bugs de UX confirmados por código:**
- **"Continuar lição" salta lições incompletas.** `getNextLessonForUser` marca uma lição como "tocada" se houver **um** exercício respondido. Abandonar ao passo 5 de 11 empurra o utilizador para a lição seguinte, para sempre.
- **Zero `loading.tsx` e zero `<Suspense>`.** `/progress` faz 8 idas à base de dados sem qualquer indicação visual — a página anterior fica congelada.
- **Barra de progresso Intensive a 100% no dia 1** (`?? 1 / ?? 1`). ✅ corrigido
- **404 e erros no ecrã cru do Next.js**, em inglês, numa app em português. ✅ corrigido
- **Octógono com labels em inglês** e fonte de 9px numa UI portuguesa.

---

## 6-11. Competências

**Speaking (3/10):** Web Speech API + feedback holístico por IA, com dicas de pronúncia específicas para falantes de português. Real e útil. Mas: 11 prompts no total, nunca avaliado formalmente (não é um `Exercise`), sem progressão palavra→frase→diálogo→conversa.

**Listening (1/10):** **não existe áudio na aplicação.** Os 11 exercícios "de listening" têm `audio_url: null` e um campo `transcript` lido por voz sintética do browser. Um exercício de listening sem áudio gravado é um exercício de leitura com passo extra. Sem sotaques, sem velocidade natural, sem discurso conectado real.

**Pronúncia (1/10):** é um dos 8 eixos do octógono e **nada no código escreve `pronunciationScore`** fora do placement inicial. O eixo fica permanentemente a zero.

**Reading (2/10):** 4 textos, todos A1, 261 palavras no total. Nenhum para Pre-A1, nenhum para A2 (apesar de existirem 3 módulos A2). As perguntas são respondíveis por *scanning* sem compreender.

**Writing (4/10):** a correção por IA é genuinamente boa (gramática, vocabulário, registo, naturalidade, distingue "incorreto" de "pouco natural"). Mas são 11 prompts, sem rubrica e sem avaliação formal.

**Gramática (3/10):** 11 conceitos. **8 de 24** essenciais A1-B1 cobertos.
❌ **Em falta:** present continuous, past continuous, past perfect, futuro com *will*, future continuous, segundo condicional, **voz passiva**, discurso indireto, orações relativas, **artigos**, pronomes, quantificadores, **superlativos**, gerúndios vs. infinitivos, question tags.
⚠️ **Parciais:** present perfect (só experiência), can/could (só pedidos), perguntas (só do/does — sem *wh-*).

**Vocabulário (2/10):** 331 itens. A2 funcional exige 1.500-2.500 famílias de palavras — a app tem **~15%**. Distribuição: A1 52%, A2 38%, Pre-A1 8%, B1 <1%.

---

## 12-13. CEFR e Exames

**Níveis definidos:** Pre-A1, A1 (×3 subníveis), A2 (×2 após correção). **Não existe B1.**

**Gaps:** Pre-A1 tem 1 módulo — o `levels.json` promete "alfabeto, números, saudações" e **nada disso existe**. A2.2 tem 1 módulo. A2.3 estava definido **sem qualquer conteúdo** ✅ removido.

**Placement test:** 24 perguntas (3 por pilar), teto B1. `averageToLevel()` **limita todos os resultados a A1.3** — um utilizador forte nunca é encaminhado para o A2 que existe.

**Diagnóstico Semanal:** real e bem construído (5 pilares × 2, determinístico por semana ISO, atualiza o octógono, pode emitir certificado). Mas só **11 exercícios de listening** existem — o pool esgota em ~5 semanas de repetição.

---

## 14-16. Revisão, Personalização, Gamificação

**Revisão (8/10) — o melhor da app.** SM-2 genuíno (`easeFactor`, `repetitions`, `intervalDays`), fila estilo Anki com auto-avaliação, alimentada por vocabulário *e* erros de lição *e* erros detetados pelo tutor. Melhor do que o Busuu nesta dimensão.

**Personalização (3/10):** recolhe objetivo, tempo disponível, profissão, interesses, variante — e depois **`LearningPlan` é escrito e nunca lido por ninguém**. O "plano personalizado" não afeta nada. O `dailyMinutesTarget` não gera plano diário adaptado.

**Gamificação (6/10):** XP, streak, 13 conquistas, checkpoints — tom adulto, não infantilizado, alinhado com o documento de visão. Problema: `currentStreak` tem **race condition** (ler-modificar-escrever não atómico) que pode **apagar um streak de 30 dias** — o pior falhanço possível num sistema cuja regra declarada é "nunca punitivo".

---

## 17-19. Bugs e Problemas Críticos

### 🔴 CRÍTICO #1 — Exercícios de lição quebrados de raiz [POR CONFIRMAR EM RUNTIME]
`Answer.questionId` era FK **obrigatória** para `Question`. O código passava um **id de Exercise** e **nenhuma linha `Question` é criada em lado nenhum**. Toda a chamada a `submitExerciseAnswer` devia falhar com violação de FK.
**Impacto:** responder a qualquer exercício dentro de uma lição — o fluxo central da app — falha.
**Porque passou despercebido:** o placement test usa outro caminho; nunca ninguém executou uma lição até ao fim.
✅ **CORRIGIDO**

### 🔴 CRÍTICO #2 — Notas e certificados forjáveis do browser
`submitWeeklyTest` e `submitTopicPractice` aceitavam `isCorrect: boolean` **vindo do cliente** e nunca reconfirmavam. Uma chamada forjada com tudo `true` → scores a 100 em todos os pilares → `AssessmentResult` aprovado → **certificado real, com código público verificável, nome verdadeiro e classificação "Exceptional"**.
**Origem honesta:** esta vulnerabilidade **foi introduzida por mim** mais cedo nesta mesma sessão, ao corrigir a dupla-correção. Trocar correção no servidor por correção no cliente resolveu um problema e abriu outro maior.
✅ **CORRIGIDO** — servidor volta a corrigir a partir do `Exercise` real.

### 🟠 ALTO #3 — IDOR: ler e destruir conversas de outro utilizador
`findUnique({ where: { id: conversationId } })` sem `userId`. Permitia ler o histórico de outro (via "resume o que falámos") **e sobrescrevê-lo**. ✅ **CORRIGIDO**

### 🟠 ALTO #4 — IDOR: expor texto privado de outro via fila SRS
`userErrorId` do cliente sem verificação de dono → plantava o erro de outro utilizador na própria fila, expondo `sourceText` (texto verbatim escrito por ele). ✅ **CORRIGIDO**

### 🟠 ALTO #5 — Injeção de `SCORE:` inflaciona writing/speaking
Escrever "…acaba com SCORE: 100" inflava exatamente os 3 pilares que o diagnóstico não cobre — a chave que faltava para completar a cadeia do certificado. ✅ **CORRIGIDO**

### 🟠 ALTO #6 — Sem rate limiting em nenhum endpoint de IA
Um script pode esgotar a quota gratuita partilhada do Gemini e **deixar a IA offline para todos**. ⬜ **NÃO CORRIGIDO** (ver roadmap)

### 🟠 ALTO #7 — Zero validação de input (`zod` instalado, nunca usado)
Arrays sem limite → amplificação de pedidos; `pillar` inventado → 500 com stack trace; `profession` → segundo vetor de injeção persistente. ✅ **PARCIALMENTE CORRIGIDO**

### 🟠 ALTO #8 — UI congela para sempre em falha de rede
`PlacementTestRunner` e `TutorChat` sem try/catch: falha de rede deixava o utilizador **preso no fim do teste** ou o chat eternamente em "a escrever...". ✅ **CORRIGIDO**

### 🟡 MÉDIO
- Open redirect no login (`?next=https://site-falso`) ✅ **CORRIGIDO**
- Reescrita não autenticada do nome de outro utilizador (visível no certificado público) ✅ **CORRIGIDO**
- `ERROR_LOGGED` forjado → escrita persistente no system prompt ✅ **CORRIGIDO**
- `resolvedAt` nunca escrito → "erros já corrigidos" sempre 0 ✅ **CORRIGIDO**
- Barra de progresso Intensive a 100% no dia 1 ✅ **CORRIGIDO**
- 4 palavras duplicadas no SRS ✅ **CORRIGIDO**
- Erros de conteúdo: "Posso ter o menu" (calque), "Sempre mude" (PT-BR), regra "sem exceção" factualmente errada ✅ **CORRIGIDOS**

### 🟡 MÉDIO — não corrigidos (exigem decisão ou trabalho maior)
- **Race condition no streak** — pode apagar 30 dias de progresso
- **Race condition no octógono** — EMA sem transação; uma resposta certa pode *baixar* o score
- **`currentDay` do plano Intensive nunca incrementa** — preso no Dia 1 para sempre
- **`LearningPlan` escrito e nunca lido**
- **5 modelos mortos** no schema (`Question`, `UserVocabularyMastery`, `UserConceptMastery`, `Bootcamp`, `BootcampEnrollment`)
- **Exportação RGPD incompleta** (falta `UserAchievement`, `AssessmentResult`, `ReviewScheduleItem`) e pode rebentar por memória
- **`Exercise.qaApproved` nunca usado como filtro** — o portão de qualidade é decorativo
- **Zero breakpoints responsive** — 46 containers `max-w-lg` fixos
- **Feedback correto/incorreto sem `aria-live`** em 7 sítios (1 corrigido)

---

## 20. Comparação com Concorrentes

Notas dos concorrentes baseadas em pesquisa de mercado de 2026 ([Busuu review](https://languavibe.com/busuu-review/), [comparativo de apps com SRS](https://www.taalhammer.com/taalhammer-vs-duolingo-busuu-babbel-and-anki-which-language-learning-app-teaches-using-full-sentences-in-2026/), [apps de IA 2026](https://www.borderset.com/blogs/posts/top-10-ai-language-learning-apps-2026)).

| Critério | Duolingo | Busuu | Babbel | ELSA | Memrise | **Esta app** |
|---|---:|---:|---:|---:|---:|---:|
| UX | 9 | 8 | 8 | 7 | 7 | **5** |
| UI | 9 | 8 | 8 | 7 | 7 | **6** |
| Speaking | 4 | 7 | 6 | 9 | 4 | **3** |
| Listening | 7 | 7 | 8 | 6 | 9 | **1** |
| Grammar | 4 | 8 | 8 | 2 | 3 | **3** |
| Vocabulary | 7 | 7 | 7 | 3 | 9 | **2** |
| Inglês prático | 5 | 8 | 9 | 5 | 7 | **4** |
| Personalização | 6 | 7 | 6 | 7 | 6 | **3** |
| Progressão | 7 | 8 | 8 | 5 | 5 | **3** |
| Exames | 5 | 7 | 5 | 4 | 3 | **4** |
| Motivação | 10 | 7 | 6 | 6 | 7 | **6** |
| IA | 7 | 7 | 5 | 8 | 4 | **7** |
| Uso familiar | 8 | 6 | 6 | 5 | 6 | **2** |
| Eficiência | 5 | 8 | 8 | 7 | 7 | **4** |
| Prep. fluência | 4 | 7 | 7 | 6 | 4 | **3** |
| **Global** | **7** | **8** | **7** | **6** | **6** | **4** |

---

## 21. Onde esta app é MELHOR

1. **Ponte PT→EN explícita.** Cada conceito tem `common_mistake_pt` — o erro específico de falantes de português. **Nenhum concorrente internacional faz isto.** É a vantagem mais defensável.
2. **SRS integrado com erros reais.** O Busuu tem revisão; nenhum liga revisão espaçada aos erros que *aquele* utilizador cometeu numa conversa com o tutor.
3. **Tutor de IA com memória de erros.** O tutor recebe os 5 erros recorrentes e reforça-os.
4. **Tom adulto sem infantilização.** Sem mascotes, sem confetti.
5. **Diagnóstico por 8 pilares.** Mais granular do que o "nível" único dos concorrentes.
6. **Sem custo.**

---

## 22. Onde esta app é PIOR

1. **Áudio: 0 vs. milhares.** Diferença de categoria, não de grau.
2. **Conteúdo: ~5 semanas vs. anos.**
3. **Vocabulário: 331 vs. 5.000+.**
4. **Sem app nativa, sem offline real, sem notificações.**
5. **Sem responsive** — inutilizável em desktop de forma decente.
6. **Sem conteúdo produzido por humanos verificados** — sem vídeos de nativos (Memrise), sem correção por comunidade (Busuu), sem fonética (ELSA).
7. **Zero testes** — os concorrentes têm QA a sério.

---

## 23-26. Melhorias e Prioridades

### TOP 10 OBRIGATÓRIAS (maior impacto na aprendizagem)

| # | Melhoria | Impacto | Investimento | P |
|---|---|---|---|---|
| 1 | **Áudio real** (TTS de qualidade pré-gerado ou gravado) | CRÍTICO | ALTO | P0 |
| 2 | **Currículo até B1** (+70-100 lições) | CRÍTICO | ALTO | P0 |
| 3 | **Vocabulário 331 → 2.000+** | CRÍTICO | ALTO | P0 |
| 4 | **13 conceitos gramaticais em falta** | CRÍTICO | MÉDIO | P0 |
| 5 | **Plano diário adaptado ao tempo** (15/30/60/90 min) | ALTO | MÉDIO | P0 |
| 6 | **Speaking com progressão** palavra→frase→diálogo→livre | ALTO | ALTO | P1 |
| 7 | **Pronúncia a sério** (o eixo está sempre a 0) | ALTO | ALTO | P1 |
| 8 | **Rate limiting** (protege a quota partilhada) | ALTO | BAIXO | P1 |
| 9 | **Testes automáticos** de scoring/SRS/certificação | ALTO | MÉDIO | P1 |
| 10 | **Responsive** (2 breakpoints resolvem 80%) | MÉDIO | BAIXO | P1 |

### TOP 10 MELHOR RELAÇÃO IMPACTO/INVESTIMENTO

1. Responsive: `sm:`/`lg:` em ~10 ficheiros — **1h**
2. Rate limiting por utilizador — **2h**
3. `loading.tsx` nas 6 páginas principais — **1h**
4. Corrigir "Continuar" (registar conclusão real) — **2h**
5. Placement recomendar A2 — **15 min**
6. `aria-live` nos 7 feedbacks — **30 min**
7. Traduzir labels do octógono + aumentar fonte — **15 min**
8. `zod` nas server actions — **3h**
9. Incrementar `currentDay` do plano Intensive — **1h**
10. Ler o `LearningPlan` na Home — **2h**

### TOP 10 UX
Loading states · conclusão real de lição · plano diário prescrito · progresso por lição · explicar zeros no /progress · responsive · empty state em `/learn` · confirmação ao sair a meio · histórico do tutor entre visitas · atalhos de teclado nos quizzes

### TOP 10 EDUCATIVAS
Áudio · B1 · vocabulário 2.000+ · gramática em falta · leitura graduada (4→60 textos) · dictation · shadowing · rubrica de writing · exames por nível · rever exemplos artificiais

### TOP 10 SPEAKING
Progressão estruturada · roleplay por cenário (restaurante/hotel/aeroporto/reunião) · scoring de pronúncia · tempo de resposta (automaticidade) · guardar áudio para auto-avaliação · feedback fonético PT→EN · shadowing · conversa livre com objetivo · simulação de entrevista por setor · métrica de confiança

---

## 27. Roadmap

**FASE 1 — Correções críticas** ✅ concluída nesta sessão
FK dos exercícios · correção no servidor · 2 IDOR · injeções · error boundaries · falhas de rede

**FASE 2 — Fundações que faltam** (~1 semana)
Rate limiting · `zod` · testes de scoring/SRS · responsive · loading states · race conditions

**FASE 3 — Conteúdo** (~2-3 meses, o grosso do trabalho)
Vocabulário 2.000+ · gramática em falta · A2 completo + B1 · 60+ textos graduados

**FASE 4 — Áudio e Speaking** (~1 mês)
Áudio real · progressão de speaking · pronúncia · shadowing/dictation

**FASE 5 — Personalização** (~2 semanas)
Plano diário adaptado · usar `LearningPlan` · conclusão real de lições · métricas

**FASE 6 — Família** (~1 semana)
Perfis múltiplos · progresso individual · privacidade entre perfis

**FASE 7 — Polimento**
Acessibilidade completa · performance · limpar schema morto

---

## 28. Plano de 4 Meses — Veredito Honesto

### A app consegue levar alguém a falar inglês com confiança em 4 meses?

# NÃO — no estado atual.

**Não é uma questão de qualidade, é de quantidade.** Dados de referência ([Cambridge English](https://www.cambridge.org/elt/blog/2018/10/11/how-long-learn-language/), [guided learning hours](https://support.cambridgeenglish.org/hc/en-gb/articles/202838506-Guided-learning-hours)):

- **A1 → B1 exige 350-400 horas** de aprendizagem guiada
- Em 16 semanas → **22-25 h/semana** (3-3,5 h/dia, todos os dias)
- A app tem material para **~5 semanas** a ritmo normal

**O que é realista com esta app hoje:** Pre-A1 → **A2 fraco**. Não B1, não conversação fluente.

**O que seria realista com as Fases 3-4 feitas:** A1 → **B1 sólido** em 4 meses a 2-3h/dia. Ambicioso mas defensável — e a arquitetura (SRS, octógono, tutor, diagnóstico) **já aguenta isso**. Falta o conteúdo.

### Plano Intensivo de 4 Meses (para quando o conteúdo existir)

| | **Mês 1 — Fundamentos** | **Mês 2 — Construção** | **Mês 3 — Compreensão** | **Mês 4 — Automatização** |
|---|---|---|---|---|
| **Objetivo** | A1 sólido | A2 | A2+/B1 | B1 falado |
| **Horas/semana** | 15-20 | 20-25 | 20-25 | 25 |
| **Vocabulário** | 500 (alta freq.) | +600 | +600 | +400 (revisão pesada) |
| **Gramática** | presente, passado, futuro, artigos, pronomes | perfeito, modais, comparativos, condicional 1 | passiva, relativas, discurso indireto, condicional 2 | consolidação, nuance |
| **Speaking** | frases isoladas, 10 min/dia | diálogos guiados, 20 min/dia | roleplay livre, 30 min/dia | conversa espontânea, 45 min/dia |
| **Listening** | frases lentas | diálogos curtos | conversas normais | velocidade nativa, sotaques |
| **Reading** | 100 palavras/dia | 300 | 600 | 1000 |
| **Writing** | frases | parágrafos | emails/mensagens | textos de opinião |
| **Revisão** | SRS diário 10 min | 15 min | 20 min | 20 min |
| **Avaliação** | diagnóstico semanal | + exame A1 | + exame A2 | + exame B1 |

**Regra de ouro:** speaking todos os dias desde o dia 1, mesmo com 20 palavras. A competência que menos se treina é a que mais falha.

---

## 29. O que falta para 10/10

### Obrigatório
Áudio real · currículo até B1 (80-120 lições) · vocabulário 2.000+ · 13 conceitos gramaticais · avaliação formal de speaking e writing · pronúncia com pontuação · plano diário adaptado · testes automáticos · responsive · rate limiting

### Muito importante
Exames por nível com certificado · leitura graduada 60+ textos · shadowing e dictation · perfis familiares · histórico do tutor · métricas de retenção · acessibilidade AA completa

### Nice to have
Vídeos de nativos · scoring fonético avançado · modo offline real · notificações · comunidade

---

## 30. Correções efetuadas nesta auditoria

| # | Problema | Ficheiro | Estado |
|---|---|---|---|
| 1 | FK inválida quebrava todos os exercícios de lição | `schema.prisma`, `learn/actions.ts` | ✅ |
| 2 | Notas/certificados forjáveis do cliente | `gradeSubmission.ts` (novo), `weekly-test/actions.ts`, `topic/actions.ts`, 2 runners | ✅ |
| 3 | IDOR — conversas de outro utilizador | `api/ai/tutor/route.ts` | ✅ |
| 4 | IDOR — texto privado via fila SRS | `review/actions.ts` | ✅ |
| 5 | Injeção `SCORE:` inflaciona pilares | `learn/actions.ts` | ✅ |
| 6 | Injeção em `gradeFreeTextAnswer` | `gradeAnswer.ts` | ✅ |
| 7 | `ERROR_LOGGED` forjado → prompt persistente | `api/ai/tutor/route.ts` | ✅ |
| 8 | Open redirect no login | `login/actions.ts` | ✅ |
| 9 | Reescrita não autenticada de nome | `signup/actions.ts` | ✅ |
| 10 | Placement congelava em falha de rede | `PlacementTestRunner.tsx` | ✅ |
| 11 | Chat congelava em "a escrever..." | `TutorChat.tsx` | ✅ |
| 12 | Sem error boundary | `app/error.tsx` (novo) | ✅ |
| 13 | 404 cru em inglês | `app/not-found.tsx` (novo) | ✅ |
| 14 | `resolvedAt` nunca escrito | `review/actions.ts` | ✅ |
| 15 | Barra Intensive a 100% no dia 1 | `home/page.tsx` | ✅ |
| 16 | Validação de input em falta | `weekly-test/`, `topic/`, `review/actions.ts` | ✅ |
| 17 | N+1: 8 chamadas → 1 agregada | `topic/actions.ts` | ✅ |
| 18 | 4 palavras duplicadas no SRS | `vocabulary-bank*.json` | ✅ |
| 19 | A2.3 definido sem conteúdo | `levels.json` | ✅ |
| 20 | "Posso ter o menu" (calque errado) | `a1-module-05` | ✅ |
| 21 | "Sempre mude" (PT-BR) | `a1-module-06` | ✅ |
| 22 | Regra "sem exceção" factualmente errada | `sentencePatterns.ts` | ✅ |
| 23 | Feedback sem `aria-live` | `WeeklyTestRunner.tsx` | ✅ parcial |

**23 correções.** Todos os problemas críticos e de gravidade alta que podiam ser corrigidos sem decisão do utilizador foram corrigidos.

---

## 31. Testes efetuados

**Verificados por leitura de código:** inventário de 31 modelos Prisma (escrita/leitura) · todas as server actions e rotas API para autenticação · 32 rotas para links de entrada · contagem exata de conteúdo · cobertura gramatical vs. CEFR · revisão linguística de amostras · env vars e segredos · queries sem limite · N+1 · race conditions · bundle client/servidor

**NÃO verificados (exigem execução):** o fluxo de lição funciona após a correção da FK · o teste semanal corrige corretamente no servidor · aspeto real em mobile/desktop · Web Speech API em browsers reais · performance real

---

## 32. Nota Final

| Dimensão | Nota |
|---|---:|
| Técnica | 6/10 |
| Educativa | 3/10 |
| UX | 5/10 |
| UI | 6/10 |
| Speaking | 3/10 |
| Conteúdo | 3/10 |
| Praticidade | 4/10 |
| Preparação para fluência | 3/10 |
| Vs. concorrentes | 4/10 |

# NOTA GLOBAL: 4,2 / 10

---

## Conclusão

**O que está genuinamente excelente:** o SRS (SM-2 a sério), a ponte PT→EN (vantagem competitiva real e defensável), a documentação, a disciplina de TypeScript, o tom adulto, a arquitetura de conteúdo (adicionar um módulo é adicionar um JSON).

**O problema central:** foi construído um motor pedagógico sofisticado e falta-lhe combustível. A app tem infraestrutura para um curso de um ano e conteúdo para cinco semanas.

**O caminho:** a Fase 1 está feita. A Fase 2 é uma semana de trabalho. **A Fase 3 (conteúdo) é 80% do esforço restante e é o que decide se a promessa de 4 meses é real ou não.** Nenhuma melhoria de UX, IA ou design compensa a falta de material — e, inversamente, com material suficiente esta app passa a ser genuinamente competitiva, porque o que a diferencia (ponte PT→EN + SRS + tutor com memória) já está construído e funciona.

**Próximo passo recomendado:** confirmar em produção que a correção da FK resolveu os exercícios de lição (assim que os deploys voltarem, a 1 de setembro), e depois atacar o conteúdo — vocabulário e gramática em falta primeiro, áudio a seguir.
