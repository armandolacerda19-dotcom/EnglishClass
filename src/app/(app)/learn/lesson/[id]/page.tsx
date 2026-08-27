import { notFound } from "next/navigation";
import { requireUserWithProfile } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { LessonRunner } from "@/components/lesson/LessonRunner";

export default async function LessonPage({ params }: { params: { id: string } }) {
  const { user, learningProfile } = await requireUserWithProfile();

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
    include: { exercises: true },
  });

  if (!lesson) notFound();

  const content = lesson.contentJson as any;
  const vocabularyIds: string[] =
    content.steps.find((s: any) => s.type === "vocabulary")?.vocabulary_ids ?? [];

  const vocabulary = vocabularyIds.length
    ? await prisma.vocabularyItem.findMany({ where: { id: { in: vocabularyIds } } })
    : [];

  const grammarConcept = content.grammar_concept_ref
    ? await prisma.grammarConcept.findUnique({ where: { id: content.grammar_concept_ref } })
    : null;

  return (
    <LessonRunner
      userId={user.id}
      lesson={{ id: lesson.id, title: lesson.title, steps: content.steps }}
      exercises={lesson.exercises.map((e) => e.contentJson as any)}
      vocabulary={vocabulary}
      grammarConcept={grammarConcept}
      immersionMode={learningProfile.immersionMode}
    />
  );
}
