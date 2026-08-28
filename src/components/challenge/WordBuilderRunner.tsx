"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { StampBadge } from "@/components/ui/StampBadge";
import { Spinner } from "@/components/ui/Spinner";
import { ExerciseShell, ExerciseComplete } from "@/components/exercise/ExerciseShell";
import { submitWordBuilder } from "@/app/(app)/practice/word-builder/actions";
import type { WordBuilderItem } from "@/content/wordBuilder";
import type { GradingResult } from "@/lib/exercise/types";

export function WordBuilderRunner({ items }: { items: WordBuilderItem[] }) {
  const [index, setIndex] = useState(0);
  const [given, setGiven] = useState("");
  const [result, setResult] = useState<GradingResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  if (items.length === 0) {
    return (
      <ExerciseShell label="Word Builder" current={0} total={0}>
        <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Não há palavras disponíveis de momento.</p>
      </ExerciseShell>
    );
  }

  const item = items[index]!;
  const isLast = index === items.length - 1;
  const [before, after] = item.sentence.split("___");

  async function check() {
    if (!given.trim()) return;
    setChecking(true);
    setSubmitError(null);
    try {
      const res = await submitWordBuilder(item.id, given);
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
        title="Word Builder concluído!"
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
      label={`Word Builder · ${item.level}`}
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
      <p className="mb-1 text-xs font-mono uppercase tracking-wide text-inkNeutral/50 dark:text-linen/50">
        {item.base} ({item.basePos}) → {item.targetPos}
      </p>
      <p className="mb-4 text-lg">
        {before}
        <span className={`font-semibold ${result ? (result.isCorrect ? "text-verdigris" : "text-clay") : ""}`}>
          {given || "____"}
        </span>
        {after}
      </p>

      <TextField
        value={given}
        onChange={(e) => setGiven(e.target.value)}
        disabled={!!result}
        placeholder="Escreva a forma derivada..."
      />

      {result && (
        <div role="status" aria-live="polite" className="mt-4 border-t border-ink/10 pt-4 dark:border-linen/10">
          <p className={`text-sm ${result.isCorrect ? "text-verdigris" : "text-clay"}`}>
            {result.isCorrect ? "Correto!" : "Quase — a forma certa era:"}
          </p>
          {!result.isCorrect && <p className="mt-1 text-sm font-semibold">{item.correct}</p>}
          <p className="mt-2 text-xs text-inkNeutral/60 dark:text-linen/60">{item.rule}</p>
        </div>
      )}
    </ExerciseShell>
  );
}
