import type { Pillar } from "@prisma/client";

// Geração de plano MVP1 — versão simples: sequência linear das unidades do currículo
// disponível (Pre-A1 → A1), priorizando os pilares mais fracos do skill profile.
// Recovery automático avançado e recalculo por faltas ficam para MVP2 (docs/10-scope-mvp1.md).

export interface StandardPlanInput {
  dailyMinutes: number;
  weakAreas: Pillar[];
  nextLessonIds: string[];
}

export function generateStandardPlan({ dailyMinutes, weakAreas, nextLessonIds }: StandardPlanInput) {
  return {
    dailyMinutes,
    focusPillars: weakAreas,
    planJson: {
      queue: nextLessonIds,
      // Texto corrigido para português europeu 2026-08-26 (auditoria) — antes
      // misturava inglês e português, e nunca era mostrado na UI (só passou a
      // ser exibido em src/app/(app)/home/page.tsx nesta mesma correção).
      note:
        dailyMinutes <= 5
          ? "Hábito mínimo — foco numa única micro-lição por dia."
          : dailyMinutes <= 15
          ? "Plano normal — uma lição completa por dia."
          : dailyMinutes <= 30
          ? "Plano acelerado — lição completa + prática extra no pilar mais fraco."
          : "Compromisso elevado — lição + prática + sessão de speaking dedicada.",
    },
  };
}

export interface IntensivePlanInput {
  goal: string;
  totalDays: number;
  startDate: Date;
}

export function generateIntensivePlan({ goal, totalDays, startDate }: IntensivePlanInput) {
  const targetDate = new Date(startDate);
  targetDate.setDate(targetDate.getDate() + totalDays);

  const weeks = Math.max(1, Math.ceil(totalDays / 7));
  const weeklyThemes = Array.from({ length: weeks }, (_, i) => ({
    week: i + 1,
    focus: i === 0 ? "diagnóstico e fundações" : i === weeks - 1 ? `revisão final orientada a: ${goal}` : "consolidação e speaking intensivo",
  }));

  return {
    goal,
    startDate,
    targetDate,
    totalDays,
    weeklyThemesJson: { weeks: weeklyThemes },
  };
}
