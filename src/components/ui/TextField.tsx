import { InputHTMLAttributes } from "react";

// Campo de uma linha (email, password, etc.) — mesmo tratamento visual do
// TextAreaField, para consistência em toda a app (login, signup, onboarding,
// placement test, chat do tutor). Antes cada formulário tinha o seu próprio
// input inline com o mesmo estilo fraco copiado 13 vezes em 9 ficheiros.
export function TextField({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-control border-2 border-ink/15 bg-white/80 px-4 py-3 text-base shadow-soft outline-none transition-colors placeholder:text-inkNeutral/40 focus:border-verdigris disabled:cursor-not-allowed disabled:opacity-60 dark:border-linen/15 dark:bg-white/5 dark:placeholder:text-linen/30 dark:focus:border-verdigris ${className}`}
      {...props}
    />
  );
}
