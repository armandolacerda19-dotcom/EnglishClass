"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { Goal, LearningTrack, EnglishVariant } from "@prisma/client";

export interface OnboardingBasics {
  goal: Goal;
  dailyMinutes: number;
  profession: string;
  interests: string[];
  englishVariant: EnglishVariant;
  track: LearningTrack;
  targetDate: string | null; // ISO, só para Intensive
}

// Fase 8 (auditoria 2026-08-27, achado N2) — esta action não validava nada:
// enums convertidos do cliente sem confirmar que eram valores reais,
// `profession` sem limite de tamanho (e injetado VERBATIM no system prompt
// do tutor em todas as sessões futuras — buildTutorPrompt.ts — logo uma
// injeção persistente), `interests` sem limite de itens, `dailyMinutes` sem
// limite, `targetDate` passado direto a `new Date()` (uma string inválida
// vira "Invalid Date", que o Prisma rejeita com um 500 cru).
const VALID_GOALS = new Set<Goal>(["TRAVEL", "WORK", "INTERVIEW", "PROMOTION", "RELOCATION", "MEETINGS", "EXAM", "GENERAL"]);
const VALID_VARIANTS = new Set<EnglishVariant>(["BRITISH", "AMERICAN", "INTERNATIONAL"]);
const VALID_TRACKS = new Set<LearningTrack>(["STANDARD", "INTENSIVE"]);

// Guarda a primeira metade do onboarding (objetivo, tempo, perfil, percurso).
// O nível CEFR só é definido depois do placement test (ver /onboarding/placement).
export async function saveOnboardingBasics(basics: OnboardingBasics) {
  const user = await requireUser();

  const goal = VALID_GOALS.has(basics.goal) ? basics.goal : "GENERAL";
  const englishVariant = VALID_VARIANTS.has(basics.englishVariant) ? basics.englishVariant : "INTERNATIONAL";
  const track = VALID_TRACKS.has(basics.track) ? basics.track : "STANDARD";

  const dailyMinutes =
    typeof basics.dailyMinutes === "number" && Number.isFinite(basics.dailyMinutes)
      ? Math.max(1, Math.min(240, Math.round(basics.dailyMinutes)))
      : 15;

  const profession = typeof basics.profession === "string" ? basics.profession.trim().slice(0, 100) : "";

  const interests = Array.isArray(basics.interests)
    ? basics.interests.filter((i): i is string => typeof i === "string").map((i) => i.trim().slice(0, 40)).slice(0, 10)
    : [];

  // Data válida e dentro de um horizonte razoável (até 2 anos) — sem isto,
  // "Invalid Date" ou uma data absurda (ex. ano 9999) chegava direto ao Prisma.
  let targetDate: Date | null = null;
  if (typeof basics.targetDate === "string" && basics.targetDate) {
    const parsed = new Date(basics.targetDate);
    const twoYearsFromNow = new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000);
    if (!Number.isNaN(parsed.getTime()) && parsed > new Date() && parsed <= twoYearsFromNow) {
      targetDate = parsed;
    }
  }

  const data = {
    goal,
    dailyMinutesTarget: dailyMinutes,
    profession,
    interests,
    englishVariant,
    track,
    targetDate,
  };

  await prisma.learningProfile.upsert({
    where: { userId: user.id },
    update: data,
    create: { userId: user.id, ...data },
  });

  redirect("/onboarding/placement");
}
