"use server";

import { requireUser } from "@/lib/session";
import { getErrorCorrectionItem } from "@/content/errorCorrection";
import { semanticGrade } from "@/lib/exercise/grading";
import { recordExerciseResult } from "@/lib/exercise/progress";
import type { GradingResult } from "@/lib/exercise/types";

// Correção de Erros — 1º tipo de exercício novo desta ronda construído sobre
// o Exercise Engine (docs/12-exercise-engine.md). Mesmo padrão de segurança
// já estabelecido: o servidor lê a frase real por id, nunca confia numa
// resposta "correta" vinda do cliente. Correção semântica (não igualdade
// exata) — pode haver mais do que uma forma válida de corrigir a mesma frase.
export async function submitErrorCorrection(itemId: string, given: string): Promise<GradingResult> {
  const user = await requireUser();
  const item = getErrorCorrectionItem(itemId);
  if (!item) return { isCorrect: false, score: 0 };

  const result = await semanticGrade(item.wrong, [item.correct], given, user.id);

  await recordExerciseResult({
    userId: user.id,
    pillar: "GRAMMAR",
    kind: "error_correction",
    score: result.score,
    correct: result.isCorrect === true,
    achievementCode: "first_error_correction",
    errorSignal:
      result.isCorrect === true
        ? undefined
        : {
            sourceText: given,
            correction: item.correct,
            errorType: item.errorType,
            commonMistakePt: item.explanation,
          },
  });

  return { ...result, explanation: item.explanation };
}
