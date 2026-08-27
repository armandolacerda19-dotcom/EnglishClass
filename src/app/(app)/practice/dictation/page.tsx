import { requireUserWithProfile } from "@/lib/session";
import { getDailyDictationSet } from "@/lib/dictation";
import { DictationRunner } from "@/components/challenge/DictationRunner";

// Ditado — Fase 4, auditoria secções 291/310. Mesmo padrão de entrada direta
// (sem hub de escolha) do Desafio Diário: um conjunto de 5 frases já
// selecionado por dia, sem o utilizador ter de escolher nada primeiro.
export default async function DictationPage() {
  await requireUserWithProfile();
  const items = getDailyDictationSet();

  return <DictationRunner items={items} />;
}
