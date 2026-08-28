import { requireUserWithProfile } from "@/lib/session";
import { getDailyFillBlankSet } from "@/lib/fillBlank";
import { FillBlankRunner } from "@/components/challenge/FillBlankRunner";

// Preencher Espaços — tipo de exercício novo (Exercise Engine, 2026-08-28).
export default async function FillBlankPage() {
  await requireUserWithProfile();
  const items = getDailyFillBlankSet();

  return <FillBlankRunner items={items} />;
}
