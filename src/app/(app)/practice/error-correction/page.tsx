import { requireUserWithProfile } from "@/lib/session";
import { getDailyErrorCorrectionSet } from "@/lib/errorCorrection";
import { ErrorCorrectionRunner } from "@/components/challenge/ErrorCorrectionRunner";

// Correção de Erros — tipo de exercício novo (Exercise Engine, 2026-08-28).
export default async function ErrorCorrectionPage() {
  await requireUserWithProfile();
  const items = getDailyErrorCorrectionSet();

  return <ErrorCorrectionRunner items={items} />;
}
