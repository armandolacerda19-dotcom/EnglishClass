"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { StampBadge } from "@/components/ui/StampBadge";
import { Spinner } from "@/components/ui/Spinner";
import { ExerciseShell, ExerciseComplete } from "@/components/exercise/ExerciseShell";
import { submitErrorCorrection } from "@/app/(app)/practice/error-correction/actions";
import type { ErrorCorrectionItem } from "@/content/errorCorrection";
import type { GradingResult } from "@/lib/exercise/types";

// Correção de Erros — 1º tipo de exercício novo construído sobre o Exercise
// Engine (docs/12-exercise-engine.md). Mostra uma frase com um erro real e
// comum de falantes de português; o utilizador reescreve-a corrigida.
export function ErrorCorrectionRunner({ items }: { items: ErrorCorrectionItem[] }) {
  const [index, setIndex] = useState(0);
  const [given, setGiven] = useState("");
  const [result, setResult] = useState<GradingResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  if (items.length === 0) {
    return (
      <ExerciseShell label="Correção de Erros" current={0} total={0}>
        <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Não há frases disponíveis de momento.</p>
      </ExerciseShell>
    );
  }

  const item = items[index]!;
  const isLast = index === items.length - 1;

  async function check() {
    if (!given.trim()) return;
    setChecking(true);
    setSubmitError(null);
    try {
      const res = await submitErrorCorrection(item.id, given);
      setResult(res);
      if (res.isCorrect) setCorrectCount((c) => c + 1);
    } catch {
      setSubmitError("Não foi possível verificar a resposta — verifique a ligação e tente novamente.");
    } finally {
      setChecking(false);
    }
  }

  function advance() {
    if (!result) return;
    if (isLast) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setGiven("");
      setResult(null);
    }
  }

  if (done) {
    return (
      <ExerciseComplete
        badge={<StampBadge code={`${correctCount}/${items.length}`} tone="verdigris" />}
        title="Correção de Erros concluída!"
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
      label={`Correção de Erros · ${item.level}`}
      current={index + 1}
      total={items.length}
      submitError={submitError}
      footer={
        !result ? (
          <Button onClick={check} disabled={!given.trim() || checking}>
            {checking ? (
              <span className="flex items-center gap-2">
                <Spinner /> A verificar...
              </span>
            ) : (
              "Verificar"
            )}
          </Button>
        ) : (
          <Button onClick={advance}>{isLast ? "Terminar" : "Seguinte"}</Button>
        )
      }
    >
      <p className="mb-2 text-sm text-inkNeutral/70 dark:text-linen/70">Esta frase tem um erro. Reescreva-a corrigida.</p>
      <p className="mb-4 rounded-control bg-clay/10 px-3 py-2 text-sm italic text-clay">{item.wrong}</p>

      <TextField
        value={given}
        onChange={(e) => setGiven(e.target.value)}
        disabled={!!result}
        placeholder="Escreva a frase corrigida..."
      />

      {result && (
        <div role="status" aria-live="polite" className="mt-4 border-t border-ink/10 pt-4 dark:border-linen/10">
          <p className={`text-sm ${result.isCorrect ? "text-verdigris" : "text-clay"}`}>
            {result.isCorrect ? "Correto!" : "Quase — a forma correta era:"}
          </p>
          {!result.isCorrect && <p className="mt-1 text-sm font-semibold">{item.correct}</p>}
          <p className="mt-2 text-xs text-inkNeutral/60 dark:text-linen/60">{result.explanation}</p>
        </div>
      )}
    </ExerciseShell>
  );
}
