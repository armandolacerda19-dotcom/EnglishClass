# Schema de Base de Dados

Schema completo em [`prisma/schema.prisma`](../prisma/schema.prisma), cobrindo todas as entidades da secção 6 do master prompt. Pronto a migrar (`prisma migrate dev`) assim que a Fase 1 arrancar.

## Decisões de modelação

- **Separação Grammar vs Vocabulary mastery**: `UserConceptMastery` (gramática) e `UserVocabularyMastery` (vocabulário) são tabelas distintas porque vocabulário tem duas dimensões independentes (`recognitionState` passivo / `productionState` ativo — secção 4 do master prompt) enquanto gramática tem uma única progressão de mastery.
- **`ReviewScheduleItem` é polimórfico por `itemType`/`itemRefId`** em vez de FKs separadas para cada tipo de item revisável — evita explosão de tabelas de junção à medida que mais tipos de conteúdo revisável forem adicionados (ex. cenários de speaking no futuro). Trade-off aceite: perde-se integridade referencial a nível de BD nesse campo; a validação de `itemType`/`itemRefId` fica a cargo da camada de aplicação.
- **`Exercise.contentJson` e `Lesson.contentJson`** guardam o corpo real do exercício/lição em JSON versionável (ver `08-schema-json-conteudo.md`) em vez de normalizar todos os campos em colunas — permite iterar o formato de conteúdo sem migrações constantes, e permite reaproveitar o mesmo schema JSON para seeding manual e geração por IA.
- **`generatedByAi` + `qaApproved` em `Exercise`**: rastreia proveniência e estado do pipeline de Content QA (`06-arquitetura-ia.md`). Nenhum exercício com `generatedByAi=true` e `qaApproved=false` deve ser servido a utilizadores — esta regra fica documentada aqui e é aplicada na query layer (Fase 1).
- **`Unit.skippable`**: flag que habilita o fast-check de level skipping (secção 4/5 do master prompt).
- **Certificação (`Certificate`) não depende de `AssessmentResult`** diretamente por FK — a regra de elegibilidade (desempenho mínimo por pilar) é calculada a partir de `UserConceptMastery`/`UserVocabularyMastery`/`AssessmentResult` no momento da emissão, e o certificado guarda um snapshot (`skillBreakdownJson`) imutável — um certificado não deve mudar de conteúdo se dados históricos forem recalculados depois.
- **`LearningPlan` (Standard) vs `IntensivePlan`**: entidades distintas porque têm formas de dados e ciclo de vida diferentes (plano contínuo vs. plano com `startDate`/`targetDate`/`recoveryLog`), evitando um schema com metade dos campos sempre nulos.
- **`AnalyticsEvent.userId` é opcional com `onDelete: SetNull`**: permite reter eventos agregados após eliminação de conta (RGPD — minimização, sem perder analytics agregados não pessoais); nenhum campo de `propsJson` deve conter PII bruta (aplicar na camada de emissão de eventos).

## Índices

Índices definidos priorizam os padrões de leitura mais frequentes: fila diária de revisão (`ReviewScheduleItem [userId, dueAt]`), histórico de tentativas por utilizador (`[userId, createdAt]` em `ExerciseAttempt`/`SpeakingAttempt`/`WritingAttempt`/`Translation`), e catálogo de conteúdo por pilar/nível (`Exercise [pillar, cefr]`). Revisitar após MVP1 com dados reais de uso.

## Migrações e seeding

- MVP1 precisa de um seed inicial cobrindo Pre-A1 → A1 completo nos 8 pilares (ver `10-scope-mvp1.md`), estruturado no formato de `08-schema-json-conteudo.md` para permitir tanto seeding manual (ficheiros JSON versionados em `/content/`) como geração assistida por IA validada pelo pipeline de `06-arquitetura-ia.md`.
- Recomenda-se manter o conteúdo curricular (Levels/Sublevels/Modules/Units/Lessons/GrammarConcepts/VocabularyItems/Exercises) como **dados versionados em ficheiros**, aplicados à BD por um script de seed idempotente — não editado diretamente em produção — para permitir revisão pedagógica via PR antes de publicar.
