import { requireUserWithProfile } from "@/lib/session";
import { getMatchingSet } from "@/lib/vocabularyMatching";
import { MatchingRunner } from "@/components/challenge/MatchingRunner";

// Emparelhar — 2º tipo de exercício novo desta ronda (pedido do utilizador,
// 2026-08-28). Reaproveita VocabularyItem (1.923 headwords já seedados),
// filtrado ao nível do utilizador — sem conteúdo estático novo a escrever.
export default async function MatchingPage() {
  const { learningProfile } = await requireUserWithProfile();
  const pairs = await getMatchingSet(learningProfile.currentLevel);

  return <MatchingRunner pairs={pairs} />;
}
