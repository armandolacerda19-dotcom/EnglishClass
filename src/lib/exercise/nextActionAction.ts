"use server";

import { requireUserWithProfile } from "@/lib/session";
import { getDueReviewCount } from "@/lib/srs/schedule";
import { getRecommendationForUser } from "./recommendForUser";

// Achado #6 da 4ª auditoria (2026-08-28): os ecrãs de conclusão dos Runners só
// tinham "Voltar à Home" — o utilizador terminava um exercício sem nenhuma
// indicação do que fazer a seguir, quebrando o ciclo de revisão/progressão.
// Reaproveita exatamente o mesmo motor de recomendação já usado na Home
// (`getRecommendationForUser`) — nenhuma lógica nova, só um novo ponto de
// entrada para o componente partilhado `ExerciseComplete` (ExerciseShell.tsx)
// poder chamá-lo a partir de QUALQUER ecrã de conclusão, sem cada Runner
// precisar de replicar a busca de dados.
export async function getNextExerciseAction() {
  const { user, learningProfile } = await requireUserWithProfile();
  const dueReviews = await getDueReviewCount(user.id);

  const recommendation = await getRecommendationForUser(
    user.id,
    learningProfile.weakAreas,
    {
      grammarScore: learningProfile.grammarScore,
      vocabularyScore: learningProfile.vocabularyScore,
      listeningScore: learningProfile.listeningScore,
      speakingScore: learningProfile.speakingScore,
      pronunciationScore: learningProfile.pronunciationScore,
      readingScore: learningProfile.readingScore,
      writingScore: learningProfile.writingScore,
      translationScore: learningProfile.translationScore,
    },
    dueReviews
  );

  if (dueReviews > 0) {
    return { href: "/practice/review", label: `Rever ${dueReviews} ${dueReviews === 1 ? "item" : "itens"} pendentes` };
  }
  if (!recommendation) return null;
  return { href: recommendation.href, label: `Continuar: ${recommendation.pillarLabel}` };
}
