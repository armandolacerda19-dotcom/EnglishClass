"use server";

import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { updateSkillScore } from "@/lib/skillProfile";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { getVerbOfTheDay } from "@/content/irregularVerbs";

export interface VerbCheckResult {
  pastSimpleCorrect: boolean;
  pastParticipleCorrect: boolean;
  pastSimple: string;
  pastParticiple: string;
  translationPt: string;
}

// Fase 16 (auditoria 2026-08-28, achado S2): antes, esta action aceitava
// `knewIt: boolean` diretamente do cliente — um pedido direto
// `completeVerbOfTheDay(true)`, sem sequer abrir a página, punha GRAMMAR a
// 100 sem nunca ter existido tentativa nenhuma. Ao contrário dos casos de
// fala (shadowing, speaking em geral), "Verbo do Dia" não depende de áudio:
// `getVerbOfTheDay` é puramente determinístico pela data, por isso o
// servidor consegue saber a sério qual é "o verbo de hoje" e comparar as
// respostas escritas do utilizador contra ele — nunca confiando num veredito
// já calculado no cliente. Isto deixou de ser só cosmético desde a Fase 15:
// o octógono GRAMMAR alimenta `maybeIssueCertificate`, que agora avança
// currentLevel/currentSublevel a sério.
function matches(given: string, accepted: string): boolean {
  const normalized = given.trim().toLowerCase();
  // Algumas formas têm alternativas separadas por "/" (ex. "was/were",
  // "got/gotten") — aceita-se qualquer uma delas.
  return accepted
    .split("/")
    .map((alt) => alt.trim().toLowerCase())
    .includes(normalized);
}

export async function completeVerbOfTheDay(pastSimpleGiven: string, pastParticipleGiven: string): Promise<VerbCheckResult> {
  const user = await requireUser();
  const verb = getVerbOfTheDay();

  const pastSimpleCorrect = matches(pastSimpleGiven, verb.pastSimple);
  const pastParticipleCorrect = matches(pastParticipleGiven, verb.pastParticiple);
  const bothCorrect = pastSimpleCorrect && pastParticipleCorrect;
  const oneCorrect = pastSimpleCorrect || pastParticipleCorrect;

  await recordActivity(user.id, bothCorrect ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  await updateSkillScore(user.id, "GRAMMAR", bothCorrect ? 100 : oneCorrect ? 60 : 20);
  await awardAchievement(user.id, "first_verb");

  return {
    pastSimpleCorrect,
    pastParticipleCorrect,
    pastSimple: verb.pastSimple,
    pastParticiple: verb.pastParticiple,
    translationPt: verb.translationPt,
  };
}
