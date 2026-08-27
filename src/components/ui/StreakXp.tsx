// `streakFreezes` opcional: Fase 12 (auditoria 2026-08-27, "reparação de
// streak") — ganha-se 1 a cada semana seguida (até 2 guardados), gasto
// automaticamente se falhar exatamente 1 dia (ver recordActivity.ts). Mostrado
// só quando > 0, para não poluir o ecrã de quem ainda não ganhou nenhum.
export function StreakXp({ xp, streak, streakFreezes = 0 }: { xp: number; streak: number; streakFreezes?: number }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 font-mono text-xs">
      <span className="text-brass">{xp} XP</span>
      <span className="text-verdigris">{streak} {streak === 1 ? "dia" : "dias"} seguidos</span>
      {streakFreezes > 0 && (
        <span
          className="text-inkNeutral/60 dark:text-linen/60"
          title="Congelamentos de streak: se falhar 1 dia, o seu streak não é perdido."
        >
          ❄️ {streakFreezes}
        </span>
      )}
    </div>
  );
}
