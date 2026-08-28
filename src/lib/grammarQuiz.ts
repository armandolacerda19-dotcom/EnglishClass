import { prisma } from "@/lib/prisma";

// Quiz de Gramática por Tema (Learn/Practice/Challenge/Apply) — tipo de
// exercício novo (Exercise Engine, prioridade 🟠 do relatório de
// 2026-08-28). Learn/Practice já existiam (rule/exercise steps dentro da
// lição); isto formaliza Challenge (os mesmos exercícios reais do
// GrammarConcept, mas sem a regra mostrada antes — sem andaimes) e Apply
// (escrever uma frase a usar a estrutura, avaliado pela IA). Reaproveita
// diretamente os `GrammarConcept`/`Exercise` já seedados — zero conteúdo
// novo a escrever.

export interface GrammarTopicSummary {
  id: string;
  title: string;
  exerciseCount: number;
}

export async function listGrammarTopics(): Promise<GrammarTopicSummary[]> {
  const concepts = await prisma.grammarConcept.findMany({
    select: { id: true, title: true, _count: { select: { exercises: true } } },
    orderBy: { title: "asc" },
  });
  return concepts.filter((c) => c._count.exercises > 0).map((c) => ({ id: c.id, title: c.title, exerciseCount: c._count.exercises }));
}

export interface GrammarChallengeQuestion {
  exerciseId: string;
  kind: "choice" | "text";
  prompt: string;
  options: string[];
}

export interface GrammarTopicDetail {
  id: string;
  title: string;
  rule: string;
  realWorldExample: string;
  questions: GrammarChallengeQuestion[];
}

export async function getGrammarTopic(id: string): Promise<GrammarTopicDetail | null> {
  const concept = await prisma.grammarConcept.findUnique({
    where: { id },
    include: { exercises: { where: { qaApproved: true } } },
  });
  if (!concept) return null;

  const questions: GrammarChallengeQuestion[] = concept.exercises
    .map((ex) => {
      const content = ex.contentJson as any;
      const correctAnswers = (content.correct_answer as string[]) ?? [];
      const primary = correctAnswers[0];
      if (!primary) return null;
      const distractors = (content.distractors as string[]) ?? [];
      const kind: "choice" | "text" = distractors.length > 0 ? "choice" : "text";
      // Challenge = sem andaimes: mostra sempre as 2 melhores opções em vez
      // das 4 do modo Practice normal, para forçar decisão real em vez de
      // eliminação por exclusão.
      const options = kind === "choice" ? [primary, distractors[0]].filter((o): o is string => !!o).sort(() => Math.random() - 0.5) : [];
      return { exerciseId: ex.id, kind, prompt: content.prompt as string, options };
    })
    .filter((q): q is GrammarChallengeQuestion => q !== null);

  return { id: concept.id, title: concept.title, rule: concept.rule, realWorldExample: concept.realWorldExample, questions };
}
