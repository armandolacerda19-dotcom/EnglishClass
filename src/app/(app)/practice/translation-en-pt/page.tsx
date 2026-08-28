import { requireUserWithProfile } from "@/lib/session";
import { getDailyTranslationEnPtSet } from "@/lib/translationEnPt";
import { TranslationEnPtRunner } from "@/components/challenge/TranslationEnPtRunner";

// Tradução EN→PT — tipo de exercício novo (Exercise Engine, 2026-08-28).
export default async function TranslationEnPtPage() {
  await requireUserWithProfile();
  const items = getDailyTranslationEnPtSet();

  return <TranslationEnPtRunner items={items} />;
}
