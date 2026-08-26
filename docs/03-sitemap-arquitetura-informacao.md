# Sitemap e Arquitetura de Informação

## Navegação principal (mobile — cidadão de primeira classe)

Bottom nav: **Home · Learn · Practice · Speak · Progress** (+ Profile/Settings/Certificates acessíveis a partir do avatar, não na bottom nav).

## Mapa de ecrãs

```
/ (marketing público, não autenticado)
├── /login, /signup, /forgot-password
│
/onboarding
├── /onboarding/goal            (objetivo: travel/work/interview/promotion/relocation/meetings/exam/geral)
├── /onboarding/level           (nível percebido, opcional — não substitui placement)
├── /onboarding/time             (tempo disponível por dia)
├── /onboarding/profile          (profissão, interesses, variante de inglês)
├── /onboarding/track             (Standard vs Intensive)
├── /onboarding/placement-intro
├── /placement-test/[step]        (adaptativo: grammar, vocab, reading, listening, writing, speaking, pronunciation)
└── /onboarding/results           (nível estimado + skill profile + plano gerado)

/home                              (Standard: saudação, objetivo do dia, continuar, weak areas, progresso, speaking)
/home/intensive                    (Intensive: Day X/Y, minutos feitos/restantes, prioridade do dia, recovery banner se aplicável)

/learn                             (currículo estruturado por nível/módulo/unidade)
├── /learn/[level]                 (ex. /learn/a1 — módulos e unidades)
├── /learn/[level]/[module]/[unit]
└── /learn/[level]/[module]/[unit]/[lesson]     (fluxo de lição: regra→exemplo→erro comum→exercício→speaking→writing→translation)

/practice                          (prática livre / spaced repetition / weak areas)
├── /practice/review               (fila de revisão SRS do dia)
├── /practice/errors                (base de erros pessoais, por pilar)
├── /practice/grammar, /practice/vocabulary, /practice/listening,
│   /practice/reading, /practice/writing, /practice/translation
└── /practice/automaticity          (Intensive: Quick Speak, Automaticity Training)

/speak
├── /speak/tutor                   (AI Tutor — escolha de personalidade: Coach/Professor/Conversation Partner/Examiner/Interviewer/Native Friend)
├── /speak/scenarios                (cenários reais: restaurant, airport, hotel, work, meeting, interview, presentation, negotiation, customer service, small talk, shopping, phone call)
├── /speak/shadowing                (Intensive)
└── /speak/pronunciation

/progress
├── /progress/overview              (Learning Velocity, Retention Score por pilar)
├── /progress/skills                 (skill profile detalhado por pilar/subnível)
├── /progress/reports                (relatórios semanais/mensais comparativos)
└── /progress/weekly-check           (Intensive)

/assessments
├── /assessments/daily, /weekly, /monthly
├── /assessments/level-exam/[level]  (exame de fim de nível)
└── /assessments/history

/certificates
├── /certificates                    (lista de certificados obtidos)
└── /certificates/[id]                (detalhe + link de verificação pública /verify/[id])

/intensive                           (hub do percurso intensivo, só visível se track=Intensive)
├── /intensive/plan                  (plano semanal/diário)
├── /intensive/bootcamps              (catálogo + bootcamp ativo)
└── /intensive/recovery               (recalculo após faltas)

/professional-english                 (MVP2+, especializações por setor)

/profile
├── /profile/settings                 (idioma da interface, variante de inglês, notificações, acessibilidade)
├── /profile/privacy                  (exportação e eliminação de dados — RGPD, disponível desde MVP1)
└── /profile/subscription              (plano, faturação)

/verify/[certificateId]                (página pública de verificação de certificado, sem autenticação)
```

## Princípios de IA (arquitetura de informação)

- **Home é o hub de decisão diária** — nunca uma lista de módulos. Deve responder "o que faço agora?" em <5 segundos de leitura.
- **Practice é onde a repetição espaçada e os erros pessoais vivem** — distinto de Learn (currículo linear) para não confundir "aprender coisa nova" com "reforçar o que já vi".
- **Speak é uma secção de topo, não um botão dentro de uma lição** — reflete que speaking é o maior ponto de fricção do público-alvo (secção 2 do master prompt) e precisa de visibilidade própria.
- **Certificates e Progress são separados**: Progress é diagnóstico (dados), Certificates é prova formal (documento).
