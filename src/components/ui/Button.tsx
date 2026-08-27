import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

// Maior, mais arredondado, com sombra e feedback tátil ao carregar (scale) —
// pedido explícito do utilizador (2026-08-26): "botões maiores e com mais
// impacto visual... estilo profissional, mais semelhante ao Busuu". Ver
// docs/decisions.md para o porquê de isto substituir a escolha original mais
// discreta do sistema de design (docs/09-sistema-design.md).
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-verdigris text-white shadow-soft hover:bg-verdigris/90 hover:shadow-lift",
  secondary:
    "bg-transparent border-2 border-ink text-ink hover:bg-ink/5 dark:border-linen dark:text-linen dark:hover:bg-linen/10",
  ghost: "bg-transparent text-ink hover:bg-ink/5 dark:text-linen dark:hover:bg-linen/10",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-control px-7 py-3.5 font-sans text-base font-semibold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
