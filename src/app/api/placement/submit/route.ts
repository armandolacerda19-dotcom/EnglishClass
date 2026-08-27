import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PLACEMENT_QUESTIONS } from "@/lib/placement/questions";
import { scorePlacementTest, type PlacementAnswer } from "@/lib/placement/scoring";
import { scoreFreeResponse } from "@/lib/ai/scoreFreeResponse";
import { generateStandardPlan, generateIntensivePlan } from "@/lib/plan/generate";
import type { Pillar } from "@prisma/client";

export async function POST(req: NextRequest) {
  const user = await requireUser();

  // JSON malformado ou `answers` no formato errado devolvia um 500 cru com
  // stack trace. Um corpo inválido devolve agora um 400 normal.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo do pedido inválido." }, { status: 400 });
  }
  const rawAnswers = (body as { answers?: unknown })?.answers;
  if (!Array.isArray(rawAnswers)) {
    return NextResponse.json({ error: "Formato de respostas inválido." }, { status: 400 });
  }
  const answers = rawAnswers
    .slice(0, PLACEMENT_QUESTIONS.length)
    .filter(
      (a): a is { questionId: string; answer: string } =>
        !!a && typeof a.questionId === "string" && typeof a.answer === "string"
    );

  const byId = new Map(answers.map((a) => [a.questionId, a.answer]));

  const scored: PlacementAnswer[] = await Promise.all(
    PLACEMENT_QUESTIONS.map(async (q) => {
      const answer = byId.get(q.id) ?? "";
      if (!q.freeResponse) return { questionId: q.id, answer };

      const aiScore = await scoreFreeResponse({
        prompt: q.prompt,
        learnerResponse: answer,
        cefrDifficulty: q.difficultyLevel,
        userId: user.id,
      });
      return { questionId: q.id, answer, aiScore };
    })
  );

  const result = scorePlacementTest(scored);

  const learningProfile = await prisma.learningProfile.findUniqueOrThrow({ where: { userId: user.id } });

  await prisma.placementTest.create({
    data: {
      userId: user.id,
      track: learningProfile.track,
      resultLevel: result.resultLevel as any,
      resultSublevel: result.resultSublevel,
      skillProfileJson: result.skillProfile,
      weakAreas: result.weakAreas.map((p) => p.toUpperCase()) as Pillar[],
      completedAt: new Date(),
    },
  });

  await prisma.learningProfile.update({
    where: { userId: user.id },
    data: {
      currentLevel: result.resultLevel as any,
      currentSublevel: result.resultSublevel,
      grammarScore: result.skillProfile.grammar ?? 0,
      vocabularyScore: result.skillProfile.vocabulary ?? 0,
      listeningScore: result.skillProfile.listening ?? 0,
      speakingScore: result.skillProfile.speaking ?? 0,
      pronunciationScore: result.skillProfile.pronunciation ?? 0,
      readingScore: result.skillProfile.reading ?? 0,
      writingScore: result.skillProfile.writing ?? 0,
      translationScore: result.skillProfile.translation ?? 0,
      weakAreas: result.weakAreas.map((p) => p.toUpperCase()) as Pillar[],
    },
  });

  // MVP1 só tem conteúdo seedado em A1.1 (docs/10-scope-mvp1.md) — a fila do plano
  // aponta sempre para as lições disponíveis, por ordem.
  const nextLessons = await prisma.lesson.findMany({ orderBy: { order: "asc" }, select: { id: true } });
  const nextLessonIds = nextLessons.map((l) => l.id);

  if (learningProfile.track === "INTENSIVE") {
    const totalDays = learningProfile.targetDate
      ? Math.max(7, Math.round((learningProfile.targetDate.getTime() - Date.now()) / 86_400_000))
      : 30;

    const plan = generateIntensivePlan({ goal: learningProfile.goal, totalDays, startDate: new Date() });

    await prisma.intensivePlan.upsert({
      where: { userId: user.id },
      update: plan as any,
      create: { userId: user.id, ...plan } as any,
    });
  } else {
    const plan = generateStandardPlan({
      dailyMinutes: learningProfile.dailyMinutesTarget,
      weakAreas: result.weakAreas.map((p) => p.toUpperCase()) as Pillar[],
      nextLessonIds,
    });

    await prisma.learningPlan.upsert({
      where: { userId: user.id },
      update: plan,
      create: { userId: user.id, ...plan },
    });
  }

  return NextResponse.json({ result });
}
