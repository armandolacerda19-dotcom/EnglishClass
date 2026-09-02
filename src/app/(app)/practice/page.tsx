import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ErrorCallout } from "@/components/ui/ErrorCallout";
import { getDueReviewCount } from "@/lib/srs/schedule";
import { PILLAR_ACCENT, PILLAR_ICON } from "@/lib/pillarDisplay";
import { PillarIcon } from "@/components/ui/PillarIcon";

// Reorganizado em secções com título (2026-08-26) — pedido do utilizador:
// "mais intuitivo". Antes disto, a página tinha crescido para uma lista plana
// de 11 cartões seguidos, sem hierarquia — cada feature nova só era
// acrescentada ao fundo. Agora agrupa por intenção: o que fazer hoje, como
// escolher o que praticar, conversar, e material de referência.
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 mt-8 font-mono text-xs uppercase tracking-widest text-inkNeutral/50 first:mt-0 dark:text-linen/50">
      {children}
    </p>
  );
}

// Badge de tipo de exercício (5ª auditoria, 2026-09-01) — antes cada card desta
// página tinha a cor do rótulo escolhida à mão, alternando brass/verdigris/clay
// sem critério (ver docs/decisions.md), sem nenhum ícone. Agora deriva sempre
// do pilar real (PILLAR_ACCENT/PILLAR_ICON, pillarDisplay.ts) — o mesmo pilar
// tem sempre a mesma cor+forma em toda a app, e a página deixa de parecer uma
// grelha uniforme de cards idênticos.
function PillarLabel({ pillar, children }: { pillar: keyof typeof PILLAR_ACCENT; children: React.ReactNode }) {
  const accent = PILLAR_ACCENT[pillar]!;
  const iconName = PILLAR_ICON[pillar]!;
  return (
    <div className="mb-1 flex items-center gap-1.5">
      <PillarIcon name={iconName} className={`h-3.5 w-3.5 shrink-0 ${accent.text}`} />
      <p className={`font-mono text-xs uppercase tracking-wide ${accent.text}`}>{children}</p>
    </div>
  );
}

function pillarHover(pillar: keyof typeof PILLAR_ACCENT) {
  return PILLAR_ACCENT[pillar]!.hoverBorder;
}

export default async function PracticePage() {
  const { user } = await requireUserWithProfile();

  const [errors, dueReviews] = await Promise.all([
    prisma.userError.findMany({
      where: { userId: user.id, resolvedAt: null },
      orderBy: { lastOccurredAt: "desc" },
      take: 20,
    }),
    getDueReviewCount(user.id),
  ]);

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="font-display text-2xl">Prática</h1>

      <SectionLabel>Hoje</SectionLabel>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/practice/daily-challenge">
          <Card className={pillarHover("VOCABULARY")}>
            <PillarLabel pillar="VOCABULARY">Desafio Diário</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Vocabulário, 2 min</p>
          </Card>
        </Link>
        <Link href="/practice/micro-challenges">
          <Card className="hover:border-ink/40 dark:hover:border-linen/40">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-inkNeutral/70 dark:text-linen/70">
              Micro-Desafios
            </p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Momentos do dia</p>
          </Card>
        </Link>
      </div>
      <Link href="/practice/review" className="mt-3 block">
        <Card className={dueReviews > 0 ? "border-clay hover:border-clay" : "hover:border-clay"}>
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 font-mono text-xs uppercase tracking-wide text-clay">Revisão</p>
              <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
                {dueReviews > 0 ? "Palavras e erros prontos a rever" : "Sem revisões pendentes agora"}
              </p>
            </div>
            {dueReviews > 0 && (
              <span className="rounded-full bg-clay px-3 py-1 font-mono text-sm font-semibold text-white">
                {dueReviews}
              </span>
            )}
          </div>
        </Card>
      </Link>

      <SectionLabel>Escolher o que praticar</SectionLabel>
      <Link href="/practice/topic" className="block">
        <Card className="border-2 border-ink/10 hover:border-verdigris dark:border-linen/10">
          <p className="mb-1 font-display text-lg">O que quer trabalhar hoje?</p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
            Vocabulário, gramática, listening, leitura ou tradução — à sua escolha
          </p>
        </Card>
      </Link>
      <Link href="/practice/weekly-test" className="mt-3 block">
        <Card className="hover:border-ink/40 dark:hover:border-linen/40">
          <p className="mb-1 font-mono text-xs uppercase tracking-wide text-inkNeutral/70 dark:text-linen/70">
            Diagnóstico Semanal
          </p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
            Teste rápido por pilar — mostra o que corrigir esta semana
          </p>
        </Card>
      </Link>

      <SectionLabel>Falar e Ler</SectionLabel>
      <Link href="/speak" className="block">
        <Card className={pillarHover("SPEAKING")}>
          <PillarLabel pillar="SPEAKING">Falar com o Tutor</PillarLabel>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
            Conversa livre, entrevista de emprego, ou o Coach de sempre
          </p>
        </Card>
      </Link>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Link href="/practice/reading">
          <Card className={pillarHover("READING")}>
            <PillarLabel pillar="READING">Leitura</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Textos com perguntas</p>
          </Card>
        </Link>
        <Link href="/practice/idioms">
          <Card className={pillarHover("VOCABULARY")}>
            <PillarLabel pillar="VOCABULARY">Idioma do Dia</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Phrasal verbs, expressões</p>
          </Card>
        </Link>
        <Link href="/practice/read-aloud">
          <Card className={pillarHover("PRONUNCIATION")}>
            <PillarLabel pillar="PRONUNCIATION">Leitura em Voz Alta</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Leia e grave — precisão e ritmo</p>
          </Card>
        </Link>
        <Link href="/practice/dictation">
          <Card className={pillarHover("LISTENING")}>
            <PillarLabel pillar="LISTENING">Ditado</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Ouça e escreva a frase</p>
          </Card>
        </Link>
        <Link href="/practice/ordering">
          <Card className={pillarHover("GRAMMAR")}>
            <PillarLabel pillar="GRAMMAR">Ordenar Frases</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Monte a frase pela ordem certa</p>
          </Card>
        </Link>
        <Link href="/practice/matching">
          <Card className={pillarHover("VOCABULARY")}>
            <PillarLabel pillar="VOCABULARY">Emparelhar</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Palavra inglesa ↔ tradução</p>
          </Card>
        </Link>
        <Link href="/practice/listen-choose">
          <Card className={pillarHover("LISTENING")}>
            <PillarLabel pillar="LISTENING">Ouvir e Escolher</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">3 níveis de velocidade/complexidade</p>
          </Card>
        </Link>
      </div>

      <SectionLabel>Gramática e Vocabulário</SectionLabel>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/practice/error-correction">
          <Card className={pillarHover("GRAMMAR")}>
            <PillarLabel pillar="GRAMMAR">Correção de Erros</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Encontre e corrija o erro</p>
          </Card>
        </Link>
        <Link href="/practice/synonyms">
          <Card className={pillarHover("VOCABULARY")}>
            <PillarLabel pillar="VOCABULARY">Sinónimos e Antónimos</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Amplie o vocabulário por relação</p>
          </Card>
        </Link>
        <Link href="/practice/context-choice">
          <Card className={pillarHover("VOCABULARY")}>
            <PillarLabel pillar="VOCABULARY">Escolher pelo Contexto</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Palavras fáceis de confundir</p>
          </Card>
        </Link>
        <Link href="/practice/word-builder">
          <Card className={pillarHover("VOCABULARY")}>
            <PillarLabel pillar="VOCABULARY">Word Builder</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Prefixos, sufixos, formação de palavras</p>
          </Card>
        </Link>
        <Link href="/practice/translation-en-pt">
          <Card className={pillarHover("TRANSLATION")}>
            <PillarLabel pillar="TRANSLATION">Tradução EN→PT</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">A direção inversa da tradução</p>
          </Card>
        </Link>
        <Link href="/practice/grammar-quiz">
          <Card className={pillarHover("GRAMMAR")}>
            <PillarLabel pillar="GRAMMAR">Quiz por Tema</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Challenge sem ajudas + Apply em contexto</p>
          </Card>
        </Link>
        <Link href="/practice/fill-blank">
          <Card className={pillarHover("GRAMMAR")}>
            <PillarLabel pillar="GRAMMAR">Preencher Espaços</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Com dica e revelação progressiva</p>
          </Card>
        </Link>
      </div>

      <SectionLabel>Escrita e Discurso Livre</SectionLabel>
      <div className="mb-6 flex flex-col gap-3">
        <Link href="/practice/writing-challenge" className="block">
          <Card className="border-2 border-ink/10 hover:border-slate dark:border-linen/10">
            <p className="mb-1 font-display text-lg">Desafio de Escrita Livre</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
              Escreva livremente — correções ❌⚠️✅ e como um nativo escreveria
            </p>
          </Card>
        </Link>
        <Link href="/practice/speaking-challenge" className="block">
          <Card className="border-2 border-ink/10 hover:border-indigo dark:border-linen/10">
            <p className="mb-1 font-display text-lg">Desafio de Discurso Livre</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
              Fale 45-90s sem guião sobre um tema — não é repetir nem shadowing
            </p>
          </Card>
        </Link>
      </div>

      <SectionLabel>Referência</SectionLabel>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/practice/verbs">
          <Card className={pillarHover("GRAMMAR")}>
            <PillarLabel pillar="GRAMMAR">Verbos Irregulares</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Verbo do dia + tabela</p>
          </Card>
        </Link>
        <Link href="/practice/patterns">
          <Card className={pillarHover("GRAMMAR")}>
            <PillarLabel pillar="GRAMMAR">Construção Frásica</PillarLabel>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Ordem de palavras</p>
          </Card>
        </Link>
      </div>
      <Link href="/practice/culture" className="mt-3 block">
        <Card className="hover:border-ink/40 dark:hover:border-linen/40">
          <p className="mb-1 font-mono text-xs uppercase tracking-wide text-inkNeutral/70 dark:text-linen/70">
            Cultura
          </p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Small talk, registo, diferenças AmE/BrE</p>
        </Card>
      </Link>
      <Link href="/practice/pronunciation" className="mt-3 block">
        <Card className={pillarHover("PRONUNCIATION")}>
          <PillarLabel pillar="PRONUNCIATION">Sons e Pronúncia</PillarLabel>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Padrões PT→EN mais comuns, com áudio</p>
        </Card>
      </Link>

      <SectionLabel>Os seus erros</SectionLabel>
      {errors.length === 0 ? (
        <Card>
          <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
            Ainda não há erros registados. Complete lições em Learn para começarmos a construir a sua base de
            revisão.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Achado #7 da 4ª auditoria (2026-08-28): a lista era só de leitura,
              sem forma de ir praticar diretamente o erro mostrado. Aponta para
              /practice/review — a fila de repetição espaçada é o mecanismo que
              já resurge exatamente este erro (não uma prática genérica do
              pilar), por isso funciona para os 8 pilares sem precisar de um
              mapa pilar→rota (nem todos os pilares têm uma rota de tema
              dedicada, ex. SPEAKING/WRITING/PRONUNCIATION). */}
          {errors.map((error) => (
            <Link key={error.id} href="/practice/review" className="block">
              <ErrorCallout label={`${error.pillar.toLowerCase()} · ${error.occurrences}x · toque para praticar`}>
                {error.commonMistakePt ?? error.correction}
              </ErrorCallout>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
