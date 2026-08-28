import { requireUserWithProfile } from "@/lib/session";
import { getDailyWordBuilderSet } from "@/lib/wordBuilder";
import { WordBuilderRunner } from "@/components/challenge/WordBuilderRunner";

// Word Builder — tipo de exercício novo (Exercise Engine, 2026-08-28).
export default async function WordBuilderPage() {
  await requireUserWithProfile();
  const items = getDailyWordBuilderSet();

  return <WordBuilderRunner items={items} />;
}
