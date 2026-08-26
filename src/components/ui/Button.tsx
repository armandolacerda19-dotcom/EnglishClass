import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-verdigris text-white hover:bg-verdigris/90",
  secondary: "bg-transparent border border-ink text-ink hover:bg-ink/5 dark:border-linen dark:text-linen dark:hover:bg-linen/10",
  ghost: "bg-transparent text-ink hover:bg-ink/5 dark:text-linen dark:hover:bg-linen/10",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-control px-5 py-2.5 font-sans font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
