import { requireUserWithProfile } from "@/lib/session";
import { TutorChat } from "@/components/tutor/TutorChat";
import { TUTOR_PERSONALITIES, type TutorPersonalityKey } from "@/lib/ai/personalities";

const SECTOR_LABEL: Record<string, string> = {
  tech: "the tech industry",
  healthcare: "the healthcare industry",
  sales: "sales / business",
  hospitality: "hospitality / tourism",
};

// Cenários de roleplay — auditoria secção 294. Cada descrição dá ao Gemini o
// suficiente para encarnar uma personagem concreta e manter a cena focada em
// vocabulário prático dessa situação, não conversa livre. `restaurant` é o
// default se o utilizador clicar no cartão principal sem escolher cenário.
const SCENARIO_FOCUS: Record<string, string> = {
  restaurant: "You are a waiter at a restaurant. The learner is a customer. Start by greeting them and handing over the menu.",
  hotel: "You are a hotel receptionist. The learner is a guest checking in (or with a request). Start by greeting them at the front desk.",
  airport: "You are airport/airline staff at a check-in or boarding gate. The learner is a passenger. Start by greeting them and asking for their documents or ticket.",
  meeting: "You are a colleague in a work meeting with the learner. Start the meeting by briefly introducing the agenda and asking for their update.",
};

export default async function TutorPage({
  searchParams,
}: {
  searchParams: { personality?: string; sector?: string; scenario?: string };
}) {
  await requireUserWithProfile();
  const requested = searchParams.personality;
  const personality: TutorPersonalityKey =
    requested && TUTOR_PERSONALITIES[requested as TutorPersonalityKey]?.availableInMvp1
      ? (requested as TutorPersonalityKey)
      : "coach";

  // Setor só faz sentido para o interviewer — item #14 da lista de melhorias.
  const sector = personality === "interviewer" && searchParams.sector ? searchParams.sector : undefined;
  const scenario = personality === "roleplay" ? searchParams.scenario ?? "restaurant" : undefined;
  const sessionFocus = sector && SECTOR_LABEL[sector]
    ? `The candidate is interviewing for a role in ${SECTOR_LABEL[sector]}.`
    : scenario && SCENARIO_FOCUS[scenario]
    ? SCENARIO_FOCUS[scenario]
    : undefined;

  return <TutorChat personality={personality} sessionFocus={sessionFocus} />;
}
