import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-ink/10 bg-white/60 p-5 dark:border-linen/10 dark:bg-white/5 ${className}`}
      {...props}
    />
  );
}
