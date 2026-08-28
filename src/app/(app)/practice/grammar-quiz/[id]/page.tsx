import { notFound } from "next/navigation";
import { requireUserWithProfile } from "@/lib/session";
import { getGrammarTopic } from "@/lib/grammarQuiz";
import { GrammarQuizRunner } from "@/components/challenge/GrammarQuizRunner";

export default async function GrammarQuizTopicPage({ params }: { params: { id: string } }) {
  await requireUserWithProfile();
  const topic = await getGrammarTopic(params.id);
  if (!topic) notFound();

  return <GrammarQuizRunner topic={topic} />;
}
