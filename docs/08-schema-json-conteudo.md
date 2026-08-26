# Schema JSON de Conteúdo (Lição / Exercício / Vocabulário)

Formato versionável usado em `Lesson.contentJson` e `Exercise.contentJson` (ver `07-schema-dados.md`). Permite seeding manual (ficheiros em `/content/`) e geração por IA validada pelo Content QA (`06-arquitetura-ia.md`) com o mesmo formato.

## `schema_version`

Todo documento de conteúdo inclui `"schema_version"` — permite migrar o formato sem quebrar conteúdo já publicado.

## Exercício (unidade mínima de prática)

```json
{
  "schema_version": 1,
  "id": "ex_a1_present_simple_001",
  "cefr_level": "A1",
  "pillar": "grammar",
  "concept_ref": "gc_a1_present_simple_routines",
  "prompt": "Complete the sentence: She ___ (work) at a bank.",
  "correct_answer": ["works"],
  "distractors": ["work", "working", "worked"],
  "explanation": "Usamos a 3ª pessoa do singular (he/she/it) com -s no Present Simple para rotinas e factos.",
  "common_mistake_pt": "Falantes de português tendem a esquecer o -s na 3ª pessoa, por não existir marcação equivalente obrigatória em PT nesta posição.",
  "audio_url": null,
  "tags": ["present-simple", "3rd-person-s", "routines"],
  "generated_by_ai": false,
  "qa_status": "approved"
}
```

Campos mínimos obrigatórios (conforme secção 6 do master prompt): `id, cefr_level, pillar, prompt, correct_answer, distractors, explanation, common_mistake_pt, audio_url, tags`. Campos adicionais (`concept_ref`, `generated_by_ai`, `qa_status`, `schema_version`) suportam rastreabilidade e o pipeline de QA.

**`transcript`** (opcional, usado em exercícios de pillar `listening`): enquanto não há um fornecedor de TTS gravado em produção (ver `docs/decisions.md`), `audio_url` fica `null` e o frontend lê `transcript` em voz alta via Web Speech API do browser (`src/components/ui/PlayTranscript.tsx`). Quando um fornecedor de TTS real for integrado, gerar `audio_url` a partir do mesmo `transcript` e este campo deixa de ser necessário no frontend, mas deve manter-se no conteúdo como fonte da síntese.

## Lição (fluxo completo dos 8 pilares)

```json
{
  "schema_version": 1,
  "id": "lesson_a1_m2_u3_present_simple_routines",
  "title": "Talking About Daily Routines",
  "cefr_level": "A1",
  "pillars": ["grammar", "vocabulary", "speaking", "writing", "translation"],
  "grammar_concept_ref": "gc_a1_present_simple_routines",
  "steps": [
    { "type": "rule",        "content_ref": "gc_a1_present_simple_routines#rule" },
    { "type": "example",     "content_ref": "gc_a1_present_simple_routines#example" },
    { "type": "common_mistake", "content_ref": "gc_a1_present_simple_routines#common_mistake_pt" },
    { "type": "exercise",    "exercise_ids": ["ex_a1_present_simple_001", "ex_a1_present_simple_002"] },
    { "type": "speaking",    "prompt": "Describe your typical weekday morning in 3-4 sentences." },
    { "type": "writing",     "prompt": "Write 5 sentences about your daily routine using the Present Simple." },
    { "type": "translation", "exercise_ids": ["ex_a1_present_simple_translation_001"] }
  ]
}
```

## Item de vocabulário (chunk/collocation, não palavra isolada)

```json
{
  "schema_version": 1,
  "id": "vocab_b1_make_a_decision",
  "headword": "make a decision",
  "type": "collocation",
  "translation_pt": "tomar uma decisão",
  "definition_en": "to choose something after thinking about it",
  "cefr_level": "B1",
  "audio_url": "https://cdn.../make_a_decision.mp3",
  "ipa": "/meɪk ə dɪˈsɪʒ.ən/",
  "related_forms": ["reach a decision", "decision-making process"],
  "example_sentences": [
    "We need to make a decision by Friday.",
    "It wasn't easy to make a decision so quickly."
  ],
  "difficulty": 2,
  "tags": ["business", "collocation"]
}
```

## Cenário de speaking (AI Conversation)

```json
{
  "schema_version": 1,
  "id": "scenario_work_meeting_status_update",
  "category": "work",
  "title": "Giving a Status Update in a Meeting",
  "cefr_level_range": ["B1", "B2"],
  "setup": "You are in a weekly team meeting. Your manager asks you for an update on your current project.",
  "ai_role": "Manager",
  "user_role": "Team member",
  "evolves_dynamically": true,
  "feedback_dimensions": ["grammar", "vocabulary", "coherence", "register", "naturalness"]
}
```

## Regras de validação (aplicadas pelo Content QA)

1. `correct_answer` não pode estar vazio; `distractors` não pode conter respostas ambíguas ou "quase corretas" sem justificação linguística.
2. `cefr_level` do vocabulário/estrutura usada no `prompt` e em `explanation` tem de ser compatível com `cefr_level` declarado (não pode exigir vocabulário de nível superior para responder).
3. `common_mistake_pt` é obrigatório em todo `GrammarConcept`-linked exercise (não obrigatório em exercícios de vocabulário/listening puro).
4. Todo conteúdo com `generated_by_ai: true` entra com `qa_status: "pending"` e só passa a `"approved"` após o pipeline descrito em `06-arquitetura-ia.md`.
