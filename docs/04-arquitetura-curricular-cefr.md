# Arquitetura Curricular CEFR

## Estrutura de níveis

7 níveis × 3 subníveis = 21 subníveis: `Pre-A1, A1.1, A1.2, A1.3, A2.1, A2.2, A2.3, B1.1, B1.2, B1.3, B2.1, B2.2, B2.3, C1.1, C1.2, C1.3, C2.1, C2.2, C2.3` (Pre-A1 não se subdivide — é a rampa de entrada absoluta).

Cada subnível é composto por **Módulos** (temáticos, ex. "Daily Routines", "Work Meetings") → **Unidades** (ex. "Present Simple for Routines") → **Lições** (a unidade mínima de progresso).

## Os 8 pilares em cada subnível

Todo o subnível tem conteúdo mapeado nos 8 pilares — não é obrigatório que cada unidade cubra os 8, mas o subnível como um todo tem de os cobrir para poder ser "mastered":

| Pilar | O que é avaliado/ensinado |
|---|---|
| Grammar | Estruturas do subnível, com ponte PT→EN explícita |
| Vocabulary | Chunks/collocations/phrasal verbs do domínio semântico do módulo |
| Listening | Compreensão de áudio nativo/graduado ao nível |
| Speaking | Produção oral controlada → livre |
| Pronunciation | Sons, stress, ritmo, entoação relevantes ao nível |
| Reading | Textos graduados, estratégias de leitura |
| Writing | Produção escrita, do nível de frase (Pre-A1) a ensaio (C2) |
| Translation | PT↔EN, usado como ponte pedagógica, não como muleta permanente |

## Anatomia de um conceito de gramática (unidade mínima pedagógica)

Conforme secção 4 do master prompt, todo `GrammarConcept` segue esta cadeia obrigatória:

```
regra → explicação simples → exemplo → tradução → erro comum (PT→EN) → correção → exercício → speaking → writing → translation → exemplo de uso real
```

Nenhum conceito de gramática é publicado sem os 11 elementos. Esta cadeia é o que distingue a plataforma de um banco de exercícios genérico.

## Base de interferência PT→EN

Mantida como entidade viva (`Error` + tags de `common_mistake_pt`), alimentada por:
1. Lista inicial curada por linguista/professor CEFR (ex.: `"I have 38 years"` → `"I am 38 years old"`; falso uso de gerúndio; confusão *make/do*; ordem de advérbios; *false friends* como "actually/atualmente", "pretend/pretender", "library/livraria").
2. Erros reais capturados por utilizador (tabela `Error`), agregados anonimamente para identificar padrões novos e alimentar o Content Engine (ver `06-arquitetura-ia.md`).

## Vocabulário: passivo vs. ativo

Cada `VocabularyItem` tem, por utilizador, um estado de domínio em duas dimensões independentes:
- **Reconhecimento** (passivo): consegue identificar/traduzir quando exposto.
- **Produção** (ativo): usa espontaneamente em speaking/writing sem prompt direto.

O Intensive Path prioriza exercícios que forçam a conversão passivo→ativo (Quick Speak, Automaticity Training — ver `06-arquitetura-ia.md` e roteiro MVP2/3).

## Estados de mastery (aplica-se a `GrammarConcept`, `VocabularyItem`, e indiretamente a `Unit`/`Module`)

```
Introduced → Practising → Developing → Strong → Mastered
```

Progressão não é linear por tempo — depende de desempenho consistente em exercícios espaçados (ver `ReviewSchedule` em `07-schema-dados.md`). "Mastered" exige demonstração em pelo menos duas ocasiões espaçadas no tempo, não uma resposta certa isolada.

## Level skipping

Se o placement test (ou uma avaliação de nível) mostrar domínio já existente num pilar/subnível, a unidade correspondente é marcada `Skippable` com opção de "fast-check" (3–5 perguntas) para confirmar — evitando repetir conteúdo já dominado, mantendo o foco nas lacunas reais (secção 5 do master prompt).
