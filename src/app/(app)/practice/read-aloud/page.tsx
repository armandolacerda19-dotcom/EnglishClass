import { requireUserWithProfile } from "@/lib/session";
import { getDailyReadAloudSet } from "@/lib/readAloud";
import { ReadAloudRunner } from "@/components/challenge/ReadAloudRunner";

// Leitura em Voz Alta — tipo de exercício novo (Exercise Engine, 2026-08-28).
export default async function ReadAloudPage() {
  await requireUserWithProfile();
  const items = getDailyReadAloudSet();

  return <ReadAloudRunner items={items} />;
}
