import { requireUserWithProfile } from "@/lib/session";
import { TutorChat } from "@/components/tutor/TutorChat";
import { TUTOR_PERSONALITIES, type TutorPersonalityKey } from "@/lib/ai/personalities";

const SECTOR_LABEL: Record<string, string> = {
  tech: "the tech industry",
  healthcare: "the healthcare industry",
  sales: "sales / business",
  hospitality: "hospitality / tourism",
};

export default async function TutorPage({
  searchParams,
}: {
  searchParams: { personality?: string; sector?: string };
}) {
  await requireUserWithProfile();
  const requested = searchParams.personality;
  const personality: TutorPersonalityKey =
    requested && TUTOR_PERSONALITIES[requested as TutorPersonalityKey]?.availableInMvp1
      ? (requested as TutorPersonalityKey)
      : "coach";

  // Setor só faz sentido para o interviewer — item #14 da lista de melhorias.
  const sector = personality === "interviewer" && searchParams.sector ? searchParams.sector : undefined;
  const sessionFocus = sector && SECTOR_LABEL[sector] ? `The candidate is interviewing for a role in ${SECTOR_LABEL[sector]}.` : undefined;

  return <TutorChat personality={personality} sessionFocus={sessionFocus} />;
}
