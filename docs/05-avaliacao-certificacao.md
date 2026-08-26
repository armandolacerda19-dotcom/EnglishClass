# Framework de Avaliação e Certificação

## Placement Test

- **Standard**: cobre os 8 pilares, dificuldade adaptativa (item response — cada resposta ajusta a dificuldade da próxima), duração alvo ~15–20 min.
- **Intensive**: mais profundo e mais rápido — mais itens por pilar em menos tempo, prioriza identificar rapidamente o teto de competência (para permitir level skipping agressivo).
- **Output**: nível CEFR estimado + subnível, skill profile por pilar (0–100 por pilar), weak areas nomeadas, intensidade recomendada (ex. "Standard 15min" ou "Intensive 60min").

## Diagnóstico "Why are you stuck?"

Motor de diagnóstico que cruza o skill profile com padrões de erro para atribuir uma causa-raiz dominante:

| Causa-raiz | Sinal característico | Intervenção |
|---|---|---|
| Grammar gap | Erros sistemáticos numa estrutura específica | Reforço direcionado da unidade de gramática |
| Vocabulary gap | Baixo reconhecimento de vocabulário do nível | Sessões de vocabulário em chunks |
| Listening gap | Erros só em exercícios de áudio | Listening graduado + shadowing |
| Speaking anxiety | Baixa taxa de tentativas de speaking vs. alta taxa em texto | Sessões de baixo risco (Quick Speak curto, sem avaliação pública) |
| Pronunciation | Compreensão escrita boa, feedback de pronúncia mau | Foco em sons/stress específicos |
| Falta de exposição | Poucas sessões/semana | Ajuste do plano, não do conteúdo |
| Dependência de tradução | Latência alta antes de responder, uso frequente de translation helper | Exercícios "Think in English" |
| Falta de automatismo | Correto mas lento | Automaticity Training / Quick Speak (Intensive) |

Este diagnóstico corre após o placement test e é recalculado periodicamente (ex. Weekly Check no Intensive, avaliações mensais no Standard).

## Cadência de avaliação

- **Daily**: micro-check dentro da sessão do dia (não um exame separado).
- **Weekly**: revisão comparativa semana a semana (mais relevante no Intensive — "Weekly Check").
- **Monthly**: relatório de progresso, Retention Score por pilar.
- **Por Unit/Module/Level**: exame de fim de nível cobrindo os 8 pilares.

## Exame de fim de nível

Cobre Grammar, Vocabulary, Reading, Listening, Writing, Speaking, Translation. Nota mínima por pilar exigida para aprovação — não é possível compensar um pilar fraco com outro forte (evita "passar" sem conseguir realmente falar).

## Certificação interna

- Cobre Pre-A1 a C2.
- **Aviso obrigatório, sempre visível no certificado e na página de verificação**: *"This is an internal English proficiency assessment and is not an official Cambridge English, IELTS, TOEFL or Wall Street English qualification."*
- **Conteúdo do certificado**: nome do candidato, nível CEFR, score global, breakdown por pilar, data de emissão, ID único, QR code → `/verify/[certificateId]`.
- **Escala de score**:

| Score | Classificação |
|---|---|
| 0–59 | Not ready |
| 60–69 | Developing |
| 70–79 | Competent |
| 80–89 | Strong |
| 90–100 | Exceptional |

- **Regra de emissão**: exige desempenho mínimo em **todos** os pilares (não apenas exercícios completados) — coerente com a regra de não-compensação do exame de nível.
- **Página `/verify/[id]`**: pública, sem autenticação, mostra apenas nome, nível, score, data e validade — nunca dados sensíveis adicionais (RGPD).

## Estados de mastery (referência cruzada)

Ver `04-arquitetura-curricular-cefr.md` — `Introduced → Practising → Developing → Strong → Mastered`. A certificação de nível só é elegível quando a distribuição de mastery dos conceitos do nível atinge um limiar mínimo definido por pilar (a calibrar com o professor CEFR/linguista antes do MVP3).
