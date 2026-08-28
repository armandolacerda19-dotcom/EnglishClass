"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

// Exercise Engine — shell visual partilhado (docs/12-exercise-engine.md).
// Reduz a duplicação de layout que hoje se repete em cada Runner
// (DictationRunner/OrderingRunner/MatchingRunner/...): container com largura
// máxima, cabeçalho com rótulo + progresso, barra de progresso, Card, e uma
// zona de erro de submissão. Só o layout é partilhado — cada tipo de
// exercício continua dono do seu próprio estado e lógica de correção; isto
// não tenta forçar 20 interações diferentes a caber num único componente
// genérico de perguntas/respostas, o que produziria uma abstração pior do
// que manter cada Runner explícito.
//
// Usado pelos tipos de exercício NOVOS a partir desta ronda; os Runners já
// existentes continuam com o seu próprio JSX — migrá-los não traz ganho
// suficiente para justificar o risco de regressão sem build/testes locais.
export function ExerciseShell({
  label,
  current,
  total,
  accentClass = "bg-verdigris",
  labelAccentClass = "text-verdigris",
  submitError,
  children,
  footer,
}: {
  label: string;
  current: number;
  total: number;
  accentClass?: string;
  labelAccentClass?: string;
  submitError?: string | null;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <p className={`mb-1 font-mono text-xs uppercase tracking-widest ${labelAccentClass}`}>
        {label} · {current} de {total}
      </p>
      <div className="mb-6 h-1 w-full rounded-full bg-ink/10 dark:bg-linen/10">
        <div
          className={`h-1 rounded-full ${accentClass} transition-[width]`}
          style={{ width: `${total > 0 ? (current / total) * 100 : 0}%` }}
        />
      </div>

      <Card>{children}</Card>

      {submitError && (
        <p role="alert" className="mt-3 text-sm text-clay">
          {submitError}
        </p>
      )}

      {footer && <div className="mt-4 flex justify-end">{footer}</div>}
    </main>
  );
}

// Ecrã de conclusão partilhado (carimbo + título + CTA "Voltar à Home") — o
// mesmo padrão repetido em todos os Runners existentes.
export function ExerciseComplete({
  badge,
  title,
  children,
}: {
  badge: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        {badge}
        <h1 className="font-display text-2xl">{title}</h1>
      </div>
      {children}
    </main>
  );
}
