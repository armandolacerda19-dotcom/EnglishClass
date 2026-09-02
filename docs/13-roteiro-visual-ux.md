# Roteiro Visual/UX/UI — Fases 2-4

Origem: pedido do utilizador de 2026-09-02 ("MASTER PROMPT — AUDITORIA VISUAL, UX/UI, INTERATIVIDADE E EXPERIÊNCIA MULTIMÉDIA"). A Fase 1 (sistema de cor+ícone por pilar consistente em Home/Practice) foi implementada nessa mesma sessão — ver `docs/decisions.md` ("Fase 33"). Este ficheiro documenta o que ficou por fazer, de propósito, e porquê, para não se perder entre sessões.

**Restrição que atravessa tudo o que se segue**: sem orçamento para serviços pagos (confirmado com o utilizador nesta ronda) — nada de fotografia real, vídeo real, ou geração de imagem/vídeo por IA paga. Toda a riqueza visual tem de vir de SVG/CSS desenhado à mão e do TTS do browser (Web Speech API, já usado em `PlayTranscript.tsx`).

## Fase 2 — Unificar o layout dos exercícios

**Problema**: só os tipos de exercício novos (Quiz de Gramática, Escrita/Discurso Livre) usam `ExerciseShell.tsx`. Os ~20 Runners mais antigos em `src/components/challenge/` (Dictation, Ordering, Matching, FillBlank, Idiom, ListenChoose, Reading, ReadAloud, Speaking, Writing, WordBuilder, Verb, Translation, Synonym/Antonym, ContextWordChoice, ErrorCorrection, TopicPractice, DailyChallenge, MicroChallenge, Review, WeeklyTest) têm cada um o seu próprio JSX — inconsistência visual real entre eles (espaçamento, posição do botão, ecrã de conclusão).

**Porque não foi feito agora**: são ~20 ficheiros, cada um com lógica de estado própria já testada em produção; reescrever todos de uma vez sem build/testes locais (confirmado nesta sessão: sem Node/npm nesta máquina) é o mesmo risco de regressão que já impediu esta unificação em rondas anteriores.

**Abordagem recomendada para quando for feito**: migrar um Runner de cada vez, não todos juntos. Cada migração é um commit isolado + deploy + reteste real (mesmo processo desta sessão), para isolar qualquer regressão ao Runner certo.

**Concluído (2026-09-02)** — ronda completa de revisão dos ~20 Runners, um commit por ficheiro, ainda sem deploy/reteste real (pendente):
- **Migrados para `ExerciseShell`/`ExerciseComplete`** (9): `MatchingRunner`, `OrderingRunner`, `DictationRunner`, `IdiomRunner`, `DailyChallengeRunner`, `ReadingRunner` (só o ecrã de conclusão — o principal mantém 2 Cards próprios), `ReviewRunner`, `WeeklyTestRunner`, `TopicPracticeRunner`.
- **Avaliados e corrigidos só na cor** (3), por serem estruturalmente incompatíveis com o Card único de `ExerciseShell` (múltiplos Cards lado a lado após o resultado, ou sub-componentes com Card próprio): `WritingChallengeRunner`, `SpeakingChallengeRunner`, `MicroChallengeRunner`.
- **Avaliado e excluído** (1): `VerbRunner.tsx` — não é uma página de exercício autónoma, está embutido em `/practice/verbs` junto de uma tabela de referência.
- **Já usavam `ExerciseShell` desde a criação** (9): `FillBlankRunner`, `GrammarQuizRunner`, `ReadAloudRunner`, `WordBuilderRunner`, `TranslationEnPtRunner`, `ContextWordChoiceRunner`, `SynonymAntonymRunner`, `ErrorCorrectionRunner`, `ListenChooseRunner`.

Com isto, todos os ~21 Runners de `src/components/challenge/` foram revistos individualmente — não há mais nenhum a avaliar. O que falta agora é só **verificar** (deploy + reteste real de uma amostra, sobretudo os que usam gravação de voz/microfone, que não podem ser testados por leitura de código) e, se algum caso justificar, revisitar os 3 "corrigidos só na cor" para uma unificação mais profunda (exigiria desenhar um segundo padrão de shell para "múltiplos cards", não o `ExerciseShell` atual).

## Fase 3 — Riqueza visual: objetos interativos e ícones de vocabulário

**Objetos interativos** (secção 13 do pedido do utilizador — ex. divisão de casa clicável, "Where is the lamp?"): viável a custo zero com SVG desenhado à mão (mesmo padrão de `PillarIcon.tsx`/`SkillOctagon.tsx` desta sessão), mas cada cena (casa, restaurante, aeroporto) é um investimento de desenho considerável — não é uma tarefa de "algumas linhas", é um novo tipo de conteúdo com o seu próprio schema (`content/curriculum/*.json` ganharia um novo formato "scene" com hotspots clicáveis) e um novo Runner. Recomenda-se prototipar **uma única cena** (ex. cozinha, ~10 objetos) antes de decidir investir nas restantes.

**Ícones de vocabulário**: associar um ícone SVG simples a categorias de palavras com alta carga visual (objetos do dia a dia, profissões, comida, lugares) — não a todo o vocabulário (secção 22 do pedido: "não adicionar imagens onde não tragam valor"). Viável de forma incremental, categoria a categoria.

## Fase 4 — Cenários por profissão e role-play com áudio

**Cenários por profissão** (secção 23): a app já tem vocabulário/textos de leitura para vários registos, mas não cenários dedicados por profissão (medicina, IT, hotelaria, etc.). Isto é essencialmente mais conteúdo curricular (mesmo padrão dos `vocabulary-bank-*.json`/módulos já existentes), não uma mudança de arquitetura — pode ser feito em lotes, como o resto do currículo.

**Role-play com "vídeo"** (secção 21): já existe role-play por texto+voz em `/speak` (Restaurante/Hotel/Aeroporto/Reunião, `ROLEPLAY_SCENARIOS`) com personagem e avaliação por IA — o vídeo real está bloqueado por orçamento. Alternativa dentro do orçamento zero: ilustração SVG estática da personagem/cenário (ex. rececionista de hotel) ao lado do diálogo, para dar contexto visual sem vídeo. Impacto menor que vídeo real, mas genuinamente viável a custo zero.

## Sistema anti-monotonia (secção 18)

Não implementado nesta ronda — exigiria um mecanismo novo para detetar "o utilizador já fez N exercícios seguidos com o mesmo layout/tipo de interação" e variar a recomendação (`src/lib/exercise/recommendForUser.ts` já escolhe o próximo exercício por pilar mais fraco; teria de ganhar uma segunda dimensão — variedade de *formato*, não só de pilar). Fica dependente da Fase 2 (só faz sentido variar entre layouts se os layouts já estiverem consistentes o suficiente para comparar).
