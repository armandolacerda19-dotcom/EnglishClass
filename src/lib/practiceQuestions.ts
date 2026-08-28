import { prisma } from "@/lib/prisma";
import type { Pillar } from "@prisma/client";

// Motor partilhado de seleção de exercícios já seedados (Exercise.contentJson) —
// usado pelo Diagnóstico Semanal (src/lib/weeklyTest.ts) e pelas Sheets de tema
// (/practice/topic). Substitui a versão anterior que só suportava escolha
// múltipla: exercícios sem distratores (ex. TRANSLATION, cuja resposta é uma
// frase livre) passam a aparecer como pergunta de texto em vez de ficarem de
// fora — ver docs/decisions.md 2026-08-26 (feedback do utilizador: "quando faz
// a pergunta translate, não aparece hipótese de traduzir").

export interface PracticeQuestion {
  exerciseId: string;
  pillar: Pillar;
  kind: "choice" | "text";
  prompt: string;
  options: string[]; // só relevante quando kind === "choice"; inclui a resposta certa, baralhada
  transcript: string | null; // exercícios LISTENING têm isto — lido em voz alta via PlayTranscript
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

function seededPick<T>(items: T[], seed: number, count: number): T[] {
  return seededShuffle(items, seed).slice(0, count);
}

// Fase 13 (auditoria 2026-08-27, achado real ao introduzir B2 nesta sessão):
// buildQuestionSet nunca filtrava por CEFR — misturava exercícios de
// QUALQUER nível seedado (Pre-A1 a B2) na mesma seleção aleatória. Com só
// Pre-A1→B1 isto já era discutível; com B2 a existir (estruturas como
// inversão, cleft sentences, participle clauses), um utilizador Pre-A1
// podia genuinamente receber uma pergunta B2 no Diagnóstico Semanal — o
// oposto de um teste de nivelamento coerente. `cefrLevelsUpTo` devolve o
// nível do utilizador e todos os anteriores, nunca os seguintes.
const CEFR_ORDER = ["PRE_A1", "A1", "A2", "B1", "B2", "C1", "C2"] as const;
// Exportada (mesmo padrão de `classify` em certificate.ts, Fase 8) só para ter
// um teste unitário direto sem precisar de mockar o Prisma.
export function cefrLevelsUpTo(level: string): Set<string> {
  const index = CEFR_ORDER.indexOf(level as (typeof CEFR_ORDER)[number]);
  return new Set(index >= 0 ? CEFR_ORDER.slice(0, index + 1) : CEFR_ORDER);
}

export async function buildQuestionSet(
  pillars: Pillar[],
  seed: number,
  perPillar: number,
  userId?: string,
  userLevel?: string
): Promise<PracticeQuestion[]> {
  const questions: PracticeQuestion[] = [];
  const allowedLevels = userLevel ? cefrLevelsUpTo(userLevel) : null;

  // Uma query para todos os pilares, não uma por pilar — antes disto, o
  // Diagnóstico Semanal (5 pilares) fazia 5 idas sequenciais à base de dados
  // só para montar a lista de perguntas. `qaApproved: true` também passou a
  // ser respeitado: antes o filtro existia no schema mas nunca era aplicado,
  // por isso conteúdo não aprovado por QA podia ser servido aos utilizadores.
  // Ver docs/decisions.md, auditoria 2026-08-26.
  const allExercises = await prisma.exercise.findMany({
    where: { pillar: { in: pillars }, qaApproved: true },
    orderBy: { id: "asc" },
  });
  const byPillar = new Map<Pillar, typeof allExercises>();
  const byPillarAtLevel = new Map<Pillar, typeof allExercises>();
  for (const ex of allExercises) {
    const bucket = byPillar.get(ex.pillar) ?? [];
    bucket.push(ex);
    byPillar.set(ex.pillar, bucket);

    if (allowedLevels?.has(ex.cefr)) {
      const levelBucket = byPillarAtLevel.get(ex.pillar) ?? [];
      levelBucket.push(ex);
      byPillarAtLevel.set(ex.pillar, levelBucket);
    }
  }

  // Fase 11 (auditoria 2026-08-27, secção 3): antes, este motor — que alimenta
  // tanto o Diagnóstico Semanal como as Sheets de tema, as duas superfícies de
  // "testa-me" da app — nunca olhava para `UserError`. Um utilizador com um
  // erro persistente e não resolvido tinha exatamente a mesma probabilidade de
  // ser testado nesse tópico do que em qualquer outro. Agora, quando há
  // `userId`, os erros ainda por resolver desse utilizador (por pilar) são
  // usados para dar prioridade a exercícios cujas tags tocam nesse tópico
  // concreto — o resto das vagas continua a ser escolhido ao acaso como antes.
  //
  // Fase 17 (auditoria 2026-08-28): o filtro só exigia `resolvedAt: null`,
  // sem olhar para `occurrences` — um erro cometido uma única vez tinha a
  // mesma prioridade que um repetido 10x, apesar do texto acima falar
  // explicitamente de "erro persistente". `getDueReviews` (srs/schedule.ts,
  // também Fase 11) já usa `occurrences >= 3` como o limiar real de
  // "persistente" nesta app — alinhado aqui para os dois sítios que
  // implementam a mesma ideia concordarem.
  const errorTagsByPillar = new Map<Pillar, Set<string>>();
  if (userId) {
    const errors = await prisma.userError.findMany({
      where: { userId, pillar: { in: pillars }, resolvedAt: null, occurrences: { gte: 3 } },
      select: { pillar: true, errorType: true },
    });
    for (const e of errors) {
      const set = errorTagsByPillar.get(e.pillar) ?? new Set<string>();
      set.add(e.errorType);
      errorTagsByPillar.set(e.pillar, set);
    }
  }

  for (const pillar of pillars) {
    // Prefere o conjunto filtrado por nível; só recua para todos os níveis
    // seedados se não houver NENHUM exercício deste pilar ao nível do
    // utilizador (ou nível abaixo) — melhor mostrar algo ligeiramente acima
    // do nível do que mostrar o ecrã "sem exercícios ainda".
    const atLevel = byPillarAtLevel.get(pillar) ?? [];
    const exercises = allowedLevels && atLevel.length > 0 ? atLevel : byPillar.get(pillar) ?? [];
    if (exercises.length === 0) continue;

    const take = Math.min(perPillar, exercises.length);
    const errorTags = errorTagsByPillar.get(pillar);
    let picked: typeof exercises;

    if (errorTags && errorTags.size > 0) {
      const matching = exercises.filter((ex) => {
        const tags = (ex.contentJson as any)?.tags as string[] | undefined;
        return tags?.some((t) => errorTags.has(t));
      });
      const priority = seededPick(matching, seed + pillar.length * 97, Math.min(take, matching.length));
      const rest = exercises.filter((ex) => !priority.includes(ex));
      const fill = seededPick(rest, seed + pillar.length * 197, take - priority.length);
      picked = [...priority, ...fill];
    } else {
      picked = seededPick(exercises, seed + pillar.length * 97, take);
    }

    for (const ex of picked) {
      const content = ex.contentJson as any;
      const correctAnswers = (content.correct_answer as string[]) ?? [];
      const primary = correctAnswers[0];
      if (!primary) continue;

      const distractors = (content.distractors as string[]) ?? [];
      const kind: "choice" | "text" = distractors.length > 0 ? "choice" : "text";
      const options =
        kind === "choice"
          ? seededPick([primary, ...distractors], seed + ex.id.length, Math.min(4, distractors.length + 1))
          : [];

      // Fase 16 (auditoria 2026-08-28, achado S4): `correctAnswers` NÃO vai
      // para o objeto devolvido — este chega diretamente a um componente
      // cliente (WeeklyTestRunner/TopicPracticeRunner) e ficava visível no
      // payload da página antes de o utilizador responder a nada. A correção
      // (choice e text) passou a ser um round-trip ao servidor —
      // checkChoiceAnswer/checkFreeTextAnswer em checkAnswer.ts — que lê o
      // Exercise de novo da BD em vez de confiar num valor já enviado ao
      // cliente.
      questions.push({
        exerciseId: ex.id,
        pillar,
        kind,
        prompt: content.prompt as string,
        options,
        transcript: (content.transcript as string) ?? null,
      });
    }
  }

  return questions;
}
