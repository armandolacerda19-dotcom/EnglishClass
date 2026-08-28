"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StampBadge } from "@/components/ui/StampBadge";
import { ExerciseShell, ExerciseComplete } from "@/components/exercise/ExerciseShell";
import { submitContextWordChoice } from "@/app/(app)/practice/context-choice/actions";
import type { ContextWordChoiceItem } from "@/content/contextWordChoice";
import type { GradingResult } from "@/lib/exercise/types";

export function ContextWordChoiceRunner({ items }: { items: ContextWordChoiceItem[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <ExerciseShell label="Escolher pelo Contexto" current={0} total={0}>
        <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Não há frases disponíveis de momento.</p>
      </ExerciseShell>
    );
  }

  const item = items[index]!;
  const isLast = index === items.length - 1;
  const [before, after] = item.sentence.split("___");

  async function check(option: string) {
    if (result) return;
    setSelected(option);
    setSubmitError(null);
    try {
      const res = await submitContextWordChoice(item.id, option);
      setResult(res);
      if (res.isCorrect) setCorrectCount((c) => c + 1);
    } catch {
      setSubmitError("Não foi possível verificar a resposta — verifique a ligação e tente novamente.");
      setSelected(null);
    }
  }

  function advance() {
    if (!result) return;
    if (isLast) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setResult(null);
    }
  }

  if (done) {
    return (
      <ExerciseComplete
        badge={<StampBadge code={`${correctCount}/${items.length}`} tone="verdigris" />}
        title="Escolher pelo Contexto concluído!"
      >
        <div className="flex flex-wrap gap-2">
          <Link href="/home">
            <Button>Voltar à Home</Button>
          </Link>
        </div>
      </ExerciseComplete>
    );
  }

  return (
    <ExerciseShell
      label={`Escolher pelo Contexto · ${item.level}`}
      current={index + 1}
      total={items.length}
      submitError={submitError}
      footer={result && <Button onClick={advance}>{isLast ? "Terminar" : "Seguinte"}</Button>}
    >
      <p className="mb-4 text-lg">
        {before}
        <span className={`font-semibold ${selected ? (result?.isCorrect ? "text-verdigris" : "text-clay") : "text-inkNeutral/40 dark:text-linen/40"}`}>
          {selected ?? "____"}
        </span>
        {after}
      </p>

      <fieldset className="flex flex-col gap-2">
        {item.options.map((opt) => {
          const isSelected = selected === opt;
          const isRight = opt === item.correct;
          const showState = !!result;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => check(opt)}
              disabled={!!result}
              className={`rounded-control border p-3 text-left text-sm transition-colors ${
                showState && isRight
                  ? "border-verdigris bg-verdigris/10 text-verdigris"
                  : showState && isSelected && !isRight
                  ? "border-clay bg-clay/10 text-clay"
                  : "border-ink/10 hover:border-verdigris dark:border-linen/10"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </fieldset>

      {result && <p className="mt-3 text-xs text-inkNeutral/60 dark:text-linen/60">{item.explanation}</p>}
    </ExerciseShell>
  );
}
