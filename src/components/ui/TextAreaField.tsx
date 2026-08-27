import { TextareaHTMLAttributes } from "react";

// Campo de texto para respostas livres (tradução, etc.) — antes era um
// textarea genérico repetido em 3 sítios com estilo fraco (borda fina, pouco
// padding). Pedido explícito do utilizador (2026-08-26): "os campos para fazer
// traduções" precisam de ser melhores — maior, mais claro qual está em foco,
// mais fácil de usar. Ver docs/decisions.md.
export function TextAreaField({ className = "", rows = 3, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={`w-full rounded-control border-2 border-ink/15 bg-white/80 px-4 py-3.5 text-base leading-relaxed shadow-soft outline-none transition-colors placeholder:text-inkNeutral/40 focus:border-verdigris disabled:cursor-not-allowed disabled:opacity-60 dark:border-linen/15 dark:bg-white/5 dark:placeholder:text-linen/30 dark:focus:border-verdigris ${className}`}
      {...props}
    />
  );
}
