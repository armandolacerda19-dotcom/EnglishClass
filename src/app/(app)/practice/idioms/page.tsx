import { requireUserWithProfile } from "@/lib/session";
import { getIdiomOfTheDay } from "@/content/idioms";
import { IdiomRunner } from "@/components/challenge/IdiomRunner";

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

export default async function IdiomsPage() {
  await requireUserWithProfile();

  const idiom = getIdiomOfTheDay();
  const seed = idiom.id.length * 97;
  const options = seededShuffle([idiom.meaningEn, ...idiom.distractors], seed);

  return <IdiomRunner idiom={idiom} options={options} />;
}
