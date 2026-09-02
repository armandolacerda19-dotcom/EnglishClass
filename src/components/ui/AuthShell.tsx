import type { ReactNode } from "react";

// Redesenho 2026-09-02 (pedido do utilizador: login/signup "formulário nu",
// sem marca, sem hierarquia visual — quase indistinguíveis um do outro além
// do texto). Componente partilhado por login/signup/forgot-password/
// reset-password/check-email, para as 5 páginas ganharem a mesma identidade
// de uma vez: eyebrow com o nome do produto, título grande, card com
// sombra + uma barra de gradiente decorativa (as mesmas cores do sistema de
// pilares, nunca Clay — reservado a erros) em vez do formulário a nu sobre o
// fundo da página.
//
// Não usa o componente `Card` partilhado (`ui/Card.tsx`) de propósito: o seu
// `p-6` vem embutido na própria classe base, e sobrepor com `p-0` no
// `className` passado não é fiável (ambas as classes de padding do Tailwind
// podem ser geradas em qualquer ordem no CSS final — não há garantia de qual
// "ganha"). Replica aqui a mesma linguagem visual (raio/borda/sombra) sem
// esse conflito.
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-verdigris">Plataforma de Inglês</p>
          <h1 className="font-display text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-base text-inkNeutral/70 dark:text-linen/70">{subtitle}</p>}
        </div>

        <div className="overflow-hidden rounded-card border border-ink/10 bg-white/70 shadow-lift dark:border-linen/10 dark:bg-white/5">
          <div className="h-1.5 w-full bg-gradient-to-r from-verdigris via-indigo to-plum" />
          <div className="p-8">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-base">{footer}</div>}
      </div>
    </main>
  );
}
