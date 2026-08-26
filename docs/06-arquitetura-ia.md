# Arquitetura de IA

## Princípios gerais

- Todo o output de IA voltado ao utilizador (tutor, correção, conteúdo gerado) passa por um **prompt base com contexto do `LearningProfile`** — nunca uma chamada "fria" sem memória.
- IA **nunca inventa regras gramaticais**. Deve admitir incerteza ("não tenho a certeza sobre isto") em vez de gerar uma explicação plausível mas errada.
- Distinção explícita, sempre que relevante, entre **"correto"** e **"mais natural"** — um erro de registo não é tratado como erro gramatical.
- Todo o conteúdo gerado por IA para consumo permanente (exercícios, vocabulário, diálogos) passa pelo **Content QA** antes de entrar em produção — nunca é servido diretamente do gerador para o utilizador final sem validação (ver secção Content Engine abaixo).

## AI Tutor — personalidades

| Personalidade | Papel | Tom |
|---|---|---|
| The Coach | Motivação, disciplina, foco no plano/objetivo | Direto, encorajador |
| The Professor | Explicação gramatical profunda, precisão | Formal, didático |
| The Conversation Partner | Prática de conversação livre | Casual, paciente |
| The Examiner | Simulação de avaliação/exame | Neutro, rigoroso |
| The Interviewer | Simulação de entrevista de emprego | Profissional, realista |
| The Native Friend | Small talk, expressões idiomáticas, cultura | Descontraído, colorido |

Cada personalidade partilha o mesmo motor de memória (erros, nível, objetivos, histórico) — a diferença está no **prompt de sistema** (tom, foco, nível de correção) e nunca nos dados a que acede.

### Estrutura do prompt base do AI Tutor (a refinar em `/lib/ai/prompts/`)

```
[Identidade da personalidade] +
[Perfil do utilizador: nível CEFR, subnível, objetivo, profissão, variante de inglês]
+ [Erros recorrentes recentes (top 3-5, com common_mistake_pt)]
+ [Contexto da sessão atual: pilar em foco, unidade/lição]
+ [Regras de comportamento: não inventar regras; distinguir correct vs natural;
   feedback holístico no fim, não interromper constantemente;
   registar novos erros detectados na tabela Error]
+ [Input do utilizador]
```

## AI Conversation — cenários

Cenários iniciais (MVP1/2): *restaurant, airport, hotel, work, meeting, interview, presentation, negotiation, customer service, small talk, shopping, phone call.*

- A situação **evolui dinamicamente** com as respostas do utilizador (não é um script fixo de perguntas).
- **Feedback no final da simulação**, não interrupções constantes — preserva o fluxo de conversação e a confiança do utilizador (alinhado com a persona "Speaking anxiety" do diagnóstico).
- Feedback estruturado: o que correu bem / o que melhorar / até 3 erros a corrigir / alternativas mais naturais.

## Correção de Writing/Speaking

Dimensões avaliadas: gramática, vocabulário, ortografia, pontuação, coerência, coesão, registo, naturalidade.
Regras:
- Nunca inventar regras.
- Distinguir sempre "incorreto" de "pouco natural/não idiomático".
- Ligar erros detectados à base de `Error` do utilizador (para alimentar `ReviewSchedule`).

## Content Engine + Content QA

Todo conteúdo gerado por IA (exercícios, diálogos, perguntas de gramática, vocabulário, traduções, listening scripts, cenários de speaking) segue este pipeline antes de ficar disponível a utilizadores:

```
1. Geração (Claude, com prompt de pilar + nível + tema)
2. Validação automática:
   - Gramaticalidade
   - Nível CEFR (vocabulário e estrutura compatíveis com o subnível alvo)
   - Ambiguidade (pergunta tem resposta única e clara, distractors não são "quase certos")
   - Naturalidade (soa a inglês real, não traduzido)
   - Adequação cultural
   - Tradução correta (PT↔EN, quando aplicável)
3. Aprovação humana amostral (revisão por especialista CEFR em % da produção,
   maior no lançamento de cada nível, decrescente com confiança acumulada)
4. Publicação no formato JSON versionado (ver `08-schema-json-conteudo.md`)
```

Nenhum conteúdo gerado entra em produção sem passar pelo passo 2. O passo 3 é obrigatório no lançamento de cada nível novo (arranque de qualidade) e amostral depois.

## Think in English

Exercícios desenhados para reduzir a dependência de tradução direta — ex. mostrar uma situação/imagem/áudio e perguntar "What is happening?" em vez de "Como se diz X em inglês?". Aumenta em proporção com o nível (ver Immersion Mode em `04-arquitetura-curricular-cefr.md` e secção 5 do master prompt).

## Speech-to-text e pronunciation scoring

- **MVP1**: avaliar Web Speech API (custo zero, latência baixa, qualidade variável) vs. Whisper API (melhor qualidade, custo por uso) para transcrição de speaking. Decisão registada em `decisions.md`.
- **Pronunciation scoring fonético avançado** (fonema a fonema) fica fora do MVP1 — feedback de speaking no MVP1 é holístico (via transcrição + análise de texto), não scoring acústico. Scoring fonético avançado entra em MVP3 (shadowing com scoring).

## Text-to-speech

Necessário desde o MVP1 para áudio de vocabulário/listening. Avaliar ElevenLabs vs. Azure/Google TTS por qualidade de voz nativa (British/American) e custo por caractere. Decisão registada em `decisions.md`.
