# Sistema de Design

Direção visual guiada pela skill `frontend-design`: escolhas deliberadas para este produto específico, não os três defaults genéricos de IA (cream+serif+terracotta / near-black+neon / broadsheet). O território deste produto é **a travessia entre duas línguas por um adulto profissional** — não uma escola, não um jogo. A metáfora central escolhida é o **"caderno de bordo / passaporte de progresso"**: cada avanço é um carimbo real, não confetti.

## Paleta

| Nome | Hex | Uso |
|---|---|---|
| Atlantic Ink | `#1B2A4A` | Fundo hero/marketing, texto primário sobre claro, navegação |
| Linen | `#F5F2EC` | Fundo de conteúdo em modo claro (não usado como fundo hero — evita o cliché cream+serif+terracota) |
| Verdigris | `#3E7C6B` | Cor de ação/CTA principal, progresso, estados "correto" |
| Brass | `#B8863B` | Conquistas, certificados, momentos de destaque — usado com moderação |
| Clay | `#B34B3C` | Exclusivamente para marcação de erro de interferência PT→EN (`common_mistake_pt`) — cor semântica fixa, nunca usada decorativamente |
| Ink Neutral | `#2B2E33` | Texto de corpo sobre Linen |

Regra: **Clay é reservado a erros de transferência PT→EN** em todo o produto — cria um código de cor consistente que o utilizador aprende a reconhecer ("vejo Clay = é um erro típico de falante de português"), reforçando o eixo de diferenciação "ponte português-inglês".

### Cor por pilar (5ª auditoria, 2026-09-01)

`src/lib/pillarDisplay.ts` (`PILLAR_ACCENT`/`PILLAR_ICON`) atribui uma cor e um ícone próprios a cada um dos 8 pilares — usado em qualquer sítio da app que liste tipos de exercício (Home, Practice, futuras superfícies), para o utilizador reconhecer visualmente "isto é Speaking" antes de ler a palavra. Antes desta ronda só existiam 3 cores utilizáveis (verdigris/brass/clay) para 8 pilares, com pares indistinguíveis (GRAMMAR=READING, VOCABULARY=TRANSLATION) e LISTENING a pedir Clay emprestado — violando a regra acima. Corrigido: Clay volta a ser exclusivo de erros; 6 cores novas (`moss`/`teal`/`slate`/`indigo`/`plum`/`berry`) preenchem os pilares em falta.

| Pilar | Cor | Hex |
|---|---|---|
| Grammar | Verdigris | `#3E7C6B` |
| Vocabulary | Brass | `#B8863B` |
| Listening | Teal | `#2E7A8C` |
| Speaking | Indigo | `#5A5FA0` |
| Pronunciation | Plum | `#96477A` |
| Reading | Moss | `#4F7A52` |
| Writing | Slate | `#46607A` |
| Translation | Berry | `#A83E5C` |

## Tipografia

| Papel | Tipo de letra | Nota |
|---|---|---|
| Display | **Fraunces** (serif contemporâneo, curvas suaves, alto contraste) | Usado com restrição: títulos de nível, certificados, headline do hero — nunca em corpo de texto ou UI de exercícios |
| UI / Corpo | **Inter** | Legibilidade máxima para exercícios, botões, navegação |
| Dados / Utilitário | **IBM Plex Mono** | Códigos de nível (`B1.2`), XP, temporizadores (Quick Speak), scores — dá uma sensação de "instrumento de precisão / carimbo" |

Escala tipográfica: 14 / 16 / **18** / 22 / 28 / 36 / 44 / 56px (base, 2ª subida — 2026-09-02, pedido do utilizador "letra maior, para mais fácil leitura"). Cada nível tem `line-height` próprio, não só o tamanho (corpo a 1.65, títulos mais apertados) — `tailwind.config.ts`.

## Layout

- **Grelha**: 4px como unidade base de espaçamento; 8/12/16/24/32/48/64 como passos práticos.
- **Home** não segue o template "número grande + gradiente": é uma página de "agenda do dia" — cartão de continuar lição à esquerda, fila horizontal de carimbos de conquista recente, lista curta e anotada de weak areas (texto, não gráfico).
- **Progress** usa um **octógono de competência** (8 eixos = os 8 pilares, exatamente) — a única visualização tipo radar do produto, justificada porque a estrutura de dados é literalmente óctupla, não decorativa.
- **Cantos e bordas**: raio de 6px em controlos, 2px em cartões grandes — suave mas não "app infantil" (evitar border-radius excessivo tipo 24px+).

## Assinatura: o Carimbo de Passaporte

Elemento único e recorrente: um **carimbo circular** (referência a vistos/carimbos de passaporte, sem imagética turística literal) em Brass ou Verdigris, com o código do subnível ou o código da conquista em Plex Mono, ligeiramente rodado, com textura subtil de tinta. Usado em:
- conclusão de subnível,
- achievements,
- certificados (o carimbo é o elemento central do PDF/página de certificado, ao lado do QR code),
- "Day X" do Intensive Path (um carimbo de progresso diário, mais discreto).

Este é o único elemento decorativo "assinatura" do produto — todo o resto do UI é disciplinado e funcional, conforme o princípio de restraint.

## Modo escuro

**Atualizado 2026-09-02** (pedido do utilizador: "cores pesadas"): o fundo deixou de ser Atlantic Ink sólido — passou a Ink Neutral (`#2B2E33`), a mesma cor já usada como texto de corpo em modo claro. Atlantic Ink mantém-se como cor de acento/texto/borda no escuro (nunca preto puro), Linen recua a texto secundário claro; Verdigris e Brass mantêm-se quase inalterados (ambos já têm contraste suficiente em fundo escuro); Clay sobe ligeiramente de luminosidade para manter contraste AA.

## Acessibilidade (obrigatório desde MVP1, secção 10 do master prompt)

- Contraste mínimo AA em todas as combinações de texto/fundo da paleta acima (validar Clay-sobre-Linen e Brass-sobre-Atlantic-Ink especificamente — são as combinações de menor contraste).
- Escala de fonte ajustável pelo utilizador, velocidade de áudio ajustável (0.75x–1.25x) em listening/shadowing.
- Legendas disponíveis em todo o áudio/vídeo.
- Navegação completa por teclado; foco visível (nunca `outline: none` sem substituto).
- Suporte a `prefers-reduced-motion` — a animação do carimbo ao completar nível é a única animação "de assinatura" e deve ter uma versão estática equivalente.

## Componentes base (a especificar em detalhe na Fase 1)

Button (primary/secondary/ghost), Card (lição/exercício/conquista), ProgressBar, SkillOctagon, StampBadge, AudioPlayer (com controlo de velocidade), RecordButton (speaking), ErrorCallout (sempre em Clay), CefrLevelTag (Plex Mono), BottomNav.
