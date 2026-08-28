import { notFound } from "next/navigation";
import { requireUserWithProfile } from "@/lib/session";
import { getWritingChallengeItem } from "@/content/writingChallenges";
import { WritingChallengeRunner } from "@/components/challenge/WritingChallengeRunner";

export default async function WritingChallengeItemPage({ params }: { params: { id: string } }) {
  await requireUserWithProfile();
  const item = getWritingChallengeItem(params.id);
  if (!item) notFound();

  return <WritingChallengeRunner item={item} />;
}
