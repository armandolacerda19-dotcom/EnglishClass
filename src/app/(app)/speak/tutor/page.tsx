import { requireUserWithProfile } from "@/lib/session";
import { TutorChat } from "@/components/tutor/TutorChat";
import { TUTOR_PERSONALITIES, type TutorPersonalityKey } from "@/lib/ai/personalities";

export default async function TutorPage({
  searchParams,
}: {
  searchParams: { personality?: string };
}) {
  await requireUserWithProfile();
  const requested = searchParams.personality;
  const personality: TutorPersonalityKey =
    requested && TUTOR_PERSONALITIES[requested as TutorPersonalityKey]?.availableInMvp1
      ? (requested as TutorPersonalityKey)
      : "coach";

  return <TutorChat personality={personality} />;
}
