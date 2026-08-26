# Scope do MVP1 (Fase 1)

## Dentro do scope

- **Autenticação** (Supabase Auth): registo, login, recuperação de password.
- **Onboarding**: objetivo, nível percebido (opcional), tempo disponível, profissão, interesses, variante de inglês, escolha Standard vs Intensive.
- **Placement test**: adaptativo, 8 pilares, output = nível/subnível estimado + skill profile + weak areas.
- **Currículo Pre-A1 + A1 completo** nos 8 pilares (profundidade suficiente para ser usável — não exaustiva; A2+ fica para MVP2).
- **Tradução PT↔EN**: exercícios de tradução integrados nas lições.
- **AI Tutor v1**: uma personalidade (**The Coach**, por ser a mais versátil para onboarding de novos utilizadores), com correção básica (grammar/vocab/naturalness) e memória de erros recorrentes.
- **Speaking básico**: gravação + transcrição (Whisper API, ver `decisions.md`) + feedback holístico de IA. Sem scoring fonético avançado.
- **Standard Path e Intensive Path**: seleção no onboarding + `LearningPlan`/`IntensivePlan` gerados automaticamente (versão simples — sem recovery automático avançado, que entra em MVP2).
- **Daily mission**: ecrã Home com objetivo do dia.
- **Dashboard de progresso básico**: skill profile por pilar, streak, XP.
- **Privacidade RGPD**: exportação e eliminação de dados do utilizador — disponível desde o dia 1, não adiado.
- **Sistema de design v1**: paleta, tipografia, componentes base (`09-sistema-design.md`) aplicados de forma consistente.

## Fora do scope do MVP1 (explicitamente adiado)

| Item | Fase prevista | Razão |
|---|---|---|
| A2, B1, B2, C1, C2 | MVP2/MVP3 | Validar o motor pedagógico e de IA em A1 antes de escalar conteúdo |
| Writing com correção de IA completa | MVP2 | MVP1 tem writing dentro da lição mas sem o motor de correção holística completo (fica ligado ao AI Tutor v1 de forma simplificada) |
| Base de erros recorrentes como sistema (SRS completo) | MVP2 | `UserError`/`ReviewScheduleItem` existem no schema, mas o algoritmo de repetição espaçada completo só entra em MVP2 |
| Especializações de inglês profissional por setor | MVP2 | Requer currículo A2/B1 como base |
| Bootcamps | MVP2 (primeiro bootcamp end-to-end) | Requer planeamento intensivo maduro |
| Certificação interna completa (exame, certificado, QR) | MVP3 | Requer níveis completos até pelo menos B1/B2 para ter valor percebido |
| Pronunciation scoring fonético avançado / Shadowing | MVP3 | Fora do scope técnico do MVP1 (ver `decisions.md`) |
| Immersion Mode completo | MVP3 | Requer conteúdo suficiente em inglês para todos os níveis |
| Múltiplas personalidades de AI Tutor | MVP2 | MVP1 lança só com "The Coach" para validar o motor antes de multiplicar personas |
| Analytics avançado / Learning Velocity | MVP3 | Requer volume de dados de uso real |

## Definition of Done do MVP1

Um utilizador novo consegue:
1. Registar-se e completar o onboarding.
2. Fazer o placement test e receber um nível/subnível + plano.
3. Completar uma lição completa dos 8 pilares em A1 (regra → exemplo → erro comum → exercício → speaking → writing → translation).
4. Falar com o AI Tutor (The Coach) e receber correção com memória de erros.
5. Ver o seu progresso no dashboard.
6. Fazer tudo isto tanto em Standard como em Intensive Path.
7. Exportar ou eliminar os seus dados a partir de `/profile/privacy`.

**Não avançar para MVP2 sem apresentar este fluxo completo, funcional, ao utilizador e sem confirmação explícita de que o DoD foi cumprido.**
