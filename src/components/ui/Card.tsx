import { HTMLAttributes } from "react";

// Sombra suave + mais padding (2026-08-26) — mesmo pedido de "impacto visual
// profissional, mais Busuu" que motivou o Button maior. Ver docs/decisions.md.
export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-ink/10 bg-white/70 p-6 shadow-soft transition-shadow dark:border-linen/10 dark:bg-white/5 ${className}`}
      {...props}
    />
  );
}
