import { notFound } from "next/navigation";
import { requireUserWithProfile } from "@/lib/session";
import { READING_PASSAGES } from "@/content/readingPassages";
import { ReadingRunner } from "@/components/challenge/ReadingRunner";

export default async function ReadingPassagePage({ params }: { params: { id: string } }) {
  const { learningProfile } = await requireUserWithProfile();

  const passage = READING_PASSAGES.find((p) => p.id === params.id);
  if (!passage) notFound();

  return <ReadingRunner passage={passage} cefrLevel={learningProfile.currentLevel} />;
}
