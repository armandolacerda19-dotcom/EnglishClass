import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { SkillOctagon } from "@/components/ui/SkillOctagon";
import { CefrLevelTag } from "@/components/ui/CefrLevelTag";
import { formatLevelCode } from "@/lib/level";
import { StampBadge } from "@/components/ui/StampBadge";
import { getCheckpointSummary } from "@/lib/checkpoints";
import { getWeeklyActivity, getRetentionSnapshot } from "@/lib/metrics";
import { GOAL_LABEL } from "@/lib/goalLabels";

const WEEKDAY_LABEL_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// Código curto para caber no carimbo circular (docs/09-sistema-design.md) — o título
// completo da conquista aparece por baixo do carimbo.
const ACHIEVEMENT_SHORT_CODE: Record<string, string> = {
  first_lesson_complete: "1ª",
  first_daily_challenge: "DIA",
  first_review: "REV",
  streak_3: "3d",
  streak_7: "7d",
  streak_30: "30d",
  first_weekly_test: "DIAG",
  first_reading_passage: "LER",
  first_tutor_conversation: "TUTOR",
  first_idiom: "IDIOM",
  first_certificate: "CERT",
  first_verb: "VERB",
  first_dictation: "DICT",
  first_ordering: "ORD",
  first_matching: "MATCH",
  first_error_correction: "CORR",
  first_synonym_antonym: "SYN",
  first_context_choice: "CTX",
  first_conversation_evaluation: "EVAL",
  first_translation_en_pt: "EN-PT",
  first_word_builder: "BUILD",
  first_writing_challenge: "WRITE",
  first_speaking_challenge: "SPEAK",
  first_read_aloud: "READ",
  first_grammar_quiz: "GRAM",
  first_fill_blank: "BLANK",
  first_listen_choose: "LSTN",
};

export default async function ProgressPage() {
  const { user, learningProfile } = await requireUserWithProfile();

  const [exerciseAttempts, resolvedErrors, achievements, checkpoints, certificates, recentConfidence, weeklyActivity, retention] =
    await Promise.all([
      prisma.exerciseAttempt.count({ where: { userId: user.id } }),
      prisma.userError.count({ where: { userId: user.id, resolvedAt: { not: null } } }),
      prisma.userAchievement.findMany({ where: { userId: user.id }, include: { achievement: true }, orderBy: { earnedAt: "desc" } }),
      getCheckpointSummary(user.id),
      prisma.certificate.findMany({ where: { userId: user.id }, orderBy: { issuedAt: "desc" } }),
      // Métrica de confiança (auditoria secção 294) — média das últimas 20
      // autoavaliações de speaking, não de sempre: reflete como o utilizador se
      // sente ULTIMAMENTE, não um histórico diluído de meses atrás.
      prisma.speakingAttempt.findMany({
        where: { userId: user.id, confidenceSelfRating: { not: null } },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { confidenceSelfRating: true },
      }),
      // Fase 5 da auditoria ("Personalização"), item "métricas" — src/lib/metrics.ts.
      getWeeklyActivity(user.id),
      getRetentionSnapshot(user.id),
    ]);

  const avgConfidence =
    recentConfidence.length > 0
      ? recentConfidence.reduce((sum, a) => sum + (a.confidenceSelfRating ?? 0), 0) / recentConfidence.length
      : null;

  const weeklyActivityMax = Math.max(1, ...weeklyActivity.map((d) => d.count));

  // Fase 12 (auditoria 2026-08-27, secção "Fase 5 — Personalização"): `goal`
  // e `targetDate` eram capturados no onboarding e só lidos no prompt oculto
  // do tutor de IA — nunca devolvidos ao utilizador em nenhum momento de
  // progresso. `/progress` é exatamente esse momento.
  const daysToTarget = learningProfile.targetDate
    ? Math.ceil((learningProfile.targetDate.getTime() - Date.now()) / 86_400_000)
    : null;

  const skillProfile = {
    grammar: learningProfile.grammarScore,
    vocabulary: learningProfile.vocabularyScore,
    listening: learningProfile.listeningScore,
    speaking: learningProfile.speakingScore,
    pronunciation: learningProfile.pronunciationScore,
    reading: learningProfile.readingScore,
    writing: learningProfile.writingScore,
    translation: learningProfile.translationScore,
  };

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="font-display text-2xl">O seu progresso</h1>
        <CefrLevelTag code={formatLevelCode(learningProfile)} />
      </div>

      {learningProfile.goal !== "GENERAL" && (
        <Card className="mb-4 border-brass/30">
          <p className="text-sm">
            Está a aprender inglês para <strong>{GOAL_LABEL[learningProfile.goal]}</strong>
            {daysToTarget !== null && daysToTarget >= 0 && (
              <> — faltam <strong>{daysToTarget}</strong> {daysToTarget === 1 ? "dia" : "dias"} para o seu objetivo.</>
            )}
            {daysToTarget !== null && daysToTarget < 0 && <> — a data-alvo já passou, mas o progresso continua a contar.</>}
          </p>
        </Card>
      )}

      <Card className="mb-4 flex justify-center">
        <SkillOctagon scores={skillProfile} />
      </Card>

      <Card className="mb-4">
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-verdigris">Checkpoints</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-mono text-xl">{checkpoints.doneToday ? "✓" : "—"}</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">hoje</p>
          </div>
          <div>
            <p className="font-mono text-xl">{checkpoints.daysThisWeek}/7</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">esta semana</p>
          </div>
          <div>
            <p className="font-mono text-xl">{checkpoints.daysThisMonth}/30</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">este mês</p>
          </div>
        </div>
      </Card>

      <Card className="mb-4">
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-verdigris">Atividade — últimos 7 dias</p>
        <div className="flex items-end justify-between gap-2" style={{ height: "64px" }}>
          {weeklyActivity.map((day) => {
            const heightPct = Math.max(6, Math.round((day.count / weeklyActivityMax) * 100));
            const label = WEEKDAY_LABEL_PT[new Date(day.date + "T00:00:00Z").getUTCDay()];
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t-control ${day.count > 0 ? "bg-verdigris" : "bg-ink/10 dark:bg-linen/10"}`}
                    style={{ height: `${heightPct}%` }}
                    title={`${day.count} ${day.count === 1 ? "ação" : "ações"}`}
                  />
                </div>
                <span className="font-mono text-[10px] text-inkNeutral/50 dark:text-linen/50">{label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {retention.totalItems > 0 && (
        <Card className="mb-4">
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-verdigris">Retenção (revisão espaçada)</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="font-mono text-xl">{retention.totalItems}</p>
              <p className="text-xs text-inkNeutral/60 dark:text-linen/60">em rotação</p>
            </div>
            <div>
              <p className="font-mono text-xl">{retention.mastered}</p>
              <p className="text-xs text-inkNeutral/60 dark:text-linen/60">já domina bem</p>
            </div>
            <div>
              <p className="font-mono text-xl">{retention.averageEase?.toFixed(1) ?? "—"}</p>
              <p className="text-xs text-inkNeutral/60 dark:text-linen/60">facilidade média</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="font-mono text-2xl">{exerciseAttempts}</p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">exercícios tentados</p>
        </Card>
        <Card>
          <p className="font-mono text-2xl">{resolvedErrors}</p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">erros já corrigidos</p>
        </Card>
      </div>

      {avgConfidence !== null && (
        <Card className="mt-4">
          <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Confiança a falar</p>
          <div className="flex items-center gap-3">
            <p className="font-mono text-2xl">{avgConfidence.toFixed(1)}/5</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
              Média das últimas {recentConfidence.length} autoavaliações em exercícios de speaking
            </p>
          </div>
        </Card>
      )}

      {certificates.length > 0 && (
        <Card className="mt-4">
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-brass">Certificados</p>
          <div className="flex flex-col gap-2">
            {certificates.map((c) => (
              <Link
                key={c.id}
                href={`/verify/${c.verificationCode}`}
                target="_blank"
                className="flex items-center justify-between rounded-control border border-ink/10 p-3 text-sm hover:border-brass dark:border-linen/10"
              >
                <span>
                  {c.cefr.replace("_", "-")} · {c.classification}
                </span>
                <span className="font-mono text-xs text-brass">ver →</span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {achievements.length > 0 && (
        <Card className="mt-4">
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-brass">Conquistas</p>
          <div className="flex flex-wrap gap-4">
            {achievements.map((a) => (
              <div key={a.id} className="flex flex-col items-center gap-1">
                <StampBadge code={ACHIEVEMENT_SHORT_CODE[a.achievement.code] ?? "★"} tone="brass" />
                <p className="max-w-16 text-center text-xs text-inkNeutral/60 dark:text-linen/60">{a.achievement.title}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </main>
  );
}
