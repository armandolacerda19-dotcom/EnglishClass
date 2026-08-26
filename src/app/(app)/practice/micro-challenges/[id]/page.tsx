import { notFound } from "next/navigation";
import { requireUserWithProfile } from "@/lib/session";
import { getMicroChallenge } from "@/lib/microChallenges";
import { MicroChallengeRunner } from "@/components/challenge/MicroChallengeRunner";

export default async function MicroChallengeDetailPage({ params }: { params: { id: string } }) {
  await requireUserWithProfile();
  const challenge = getMicroChallenge(params.id);
  if (!challenge) notFound();

  return <MicroChallengeRunner challenge={challenge} />;
}
