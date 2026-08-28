import { requireUserWithProfile } from "@/lib/session";
import { getDailySynonymAntonymSet } from "@/lib/synonymsAntonyms";
import { SynonymAntonymRunner } from "@/components/challenge/SynonymAntonymRunner";

// Sinónimos e Antónimos — tipo de exercício novo (Exercise Engine, 2026-08-28).
export default async function SynonymsPage() {
  await requireUserWithProfile();
  const items = getDailySynonymAntonymSet();

  return <SynonymAntonymRunner items={items} />;
}
