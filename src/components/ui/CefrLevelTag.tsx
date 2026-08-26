export function CefrLevelTag({ code }: { code: string }) {
  return (
    <span className="inline-flex items-center rounded-control bg-ink px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-linen dark:bg-linen dark:text-ink">
      {code}
    </span>
  );
}
