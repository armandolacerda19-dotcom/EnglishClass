export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label && <p className="mb-1 text-xs text-inkNeutral/70 dark:text-linen/70">{label}</p>}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-linen/10"
      >
        <div className="h-full rounded-full bg-verdigris transition-[width]" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
