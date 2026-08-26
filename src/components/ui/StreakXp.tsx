export function StreakXp({ xp, streak }: { xp: number; streak: number }) {
  return (
    <div className="mb-4 flex gap-4 font-mono text-xs">
      <span className="text-brass">{xp} XP</span>
      <span className="text-verdigris">{streak} {streak === 1 ? "dia" : "dias"} seguidos</span>
    </div>
  );
}
