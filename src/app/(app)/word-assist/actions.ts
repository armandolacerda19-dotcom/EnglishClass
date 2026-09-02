"use server";

import { requireUser } from "@/lib/session";
import { lookupWord, recordGuessResult, type WordLookupResult } from "@/lib/wordAssist/lookupWord";

export async function lookupWordAction(word: string, contextSentence: string): Promise<WordLookupResult> {
  const user = await requireUser();
  return lookupWord(word, contextSentence, user.id);
}

export async function recordGuessAction(headword: string, vocabularyItemId: string | null, correct: boolean): Promise<void> {
  const user = await requireUser();
  await recordGuessResult(user.id, headword, vocabularyItemId, correct);
}
