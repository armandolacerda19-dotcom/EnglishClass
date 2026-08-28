import { requireUserWithProfile } from "@/lib/session";
import { getDailyContextWordChoiceSet } from "@/lib/contextWordChoice";
import { ContextWordChoiceRunner } from "@/components/challenge/ContextWordChoiceRunner";

// Escolher pela Palavra Certa (contexto) — tipo de exercício novo (Exercise
// Engine, 2026-08-28).
export default async function ContextChoicePage() {
  await requireUserWithProfile();
  const items = getDailyContextWordChoiceSet();

  return <ContextWordChoiceRunner items={items} />;
}
