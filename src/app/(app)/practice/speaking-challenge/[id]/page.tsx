import { notFound } from "next/navigation";
import { requireUserWithProfile } from "@/lib/session";
import { getSpeakingChallengeItem } from "@/content/speakingChallenges";
import { SpeakingChallengeRunner } from "@/components/challenge/SpeakingChallengeRunner";

export default async function SpeakingChallengeItemPage({ params }: { params: { id: string } }) {
  await requireUserWithProfile();
  const item = getSpeakingChallengeItem(params.id);
  if (!item) notFound();

  return <SpeakingChallengeRunner item={item} />;
}
