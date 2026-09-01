import { HTMLAttributes, ReactNode } from "react";

// Sombra suave + mais padding (2026-08-26) — mesmo pedido de "impacto visual
// profissional, mais Busuu" que motivou o Button maior. Ver docs/decisions.md.
//
// `icon`/`iconClassName` (5ª auditoria, 2026-09-01) — opcionais e aditivos: sem
// eles o Card renderiza exatamente como antes. Mostram um pequeno badge de
// ícone acima do conteúdo, para os cards de tipo de exercício (Home/Practice)
// deixarem de se distinguir só pela cor do texto do rótulo — cor+forma juntas,
// não só cor (par de PillarIcon/PILLAR_ACCENT em pillarDisplay.ts).
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  iconClassName?: string;
}

export function Card({ className = "", icon, iconClassName = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-card border border-ink/10 bg-white/70 p-6 shadow-soft transition-shadow dark:border-linen/10 dark:bg-white/5 ${className}`}
      {...props}
    >
      {icon && (
        <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${iconClassName}`}>{icon}</div>
      )}
      {children}
    </div>
  );
}
