"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { StampBadge } from "@/components/ui/StampBadge";
import { Spinner } from "@/components/ui/Spinner";
import { ExerciseShell, ExerciseComplete } from "@/components/exercise/ExerciseShell";
import { submitFillBlank } from "@/app/(app)/practice/fill-blank/actions";
import type { FillBlankItem } from "@/content/fillBlank";
import type { GradingResult } from "@/lib/exercise/types";

// Preencher Espaços — pedido explicitamente com dica e revelação parcial
// (relatório de 2026-08-28), diferente do "text kind" já usado noutros
// exercícios: aqui o utilizador pode pedir ajuda progressiva antes de
// responder, sem penalização (é uma ferramenta de aprendizagem, não um
// truque para "ganhar" — a nota reflete sempre a resposta final dada).
export function FillBlankRunner({ items }: { items: FillBlankItem[] }) {
  const [index, setIndex] = useState(0);
  const [given, setGiven] = useState("");
  const [result, setResult] = useState<GradingResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [revealCount, setRevealCount] = useState(0);

  if (items.length === 0) {
    return (
      <ExerciseShell label="Preencher Espaços" current={0} total={0}>
        <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Não há frases disponíveis de momento.</p>
      </ExerciseShell>
    );
  }

  const item = items[index]!;
  const isLast = index === items.length - 1;
  const [before, after] = item.sentence.split("___");
  const primaryAnswer = item.correct[0] ?? "";
  const revealed = primaryAnswer.slice(0, revealCount);
  const masked = revealed + "_".repeat(Math.max(0, primaryAnswer.length - revealCount));

  async function check() {
    if (!given.trim()) return;
    setChecking(true);
    setSubmitError(null);
    try {
      const res = await submitFillBlank(item.id, given);
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
      setShowHint(false);
      setRevealCount(0);
    }
  }

  if (done) {
    return (
      <ExerciseComplete
        badge={<StampBadge code={`${correctCount}/${items.length}`} tone="verdigris" />}
        title="Preencher Espaços concluído!"
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
      label={`Preencher Espaços · ${item.level}`}
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
      <p className="mb-4 text-lg">
        {before}
        <span className="font-semibold text-inkNeutral/40 dark:text-linen/40">____</span>
        {after}
      </p>

      <TextField
        value={given}
        onChange={(e) => setGiven(e.target.value)}
        disabled={!!result}
        placeholder="Escreva a resposta..."
      />

      {!result && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowHint(true)}
            className="font-mono text-xs text-inkNeutral/50 underline hover:text-verdigris dark:text-linen/50"
          >
            Dica
          </button>
          <button
            type="button"
            onClick={() => setRevealCount((c) => Math.min(primaryAnswer.length, c + 1))}
            className="font-mono text-xs text-inkNeutral/50 underline hover:text-verdigris dark:text-linen/50"
          >
            Revelar mais uma letra
          </button>
          {revealCount > 0 && <span className="font-mono text-sm tracking-widest">{masked}</span>}
        </div>
      )}
      {showHint && !result && <p className="mt-2 text-xs italic text-inkNeutral/60 dark:text-linen/60">{item.hint}</p>}

      {result && (
        <div role="status" aria-live="polite" className="mt-4 border-t border-ink/10 pt-4 dark:border-linen/10">
          <p className={`text-sm ${result.isCorrect ? "text-verdigris" : "text-clay"}`}>
            {result.isCorrect ? "Correto!" : "Quase — a resposta certa era:"}
          </p>
          {!result.isCorrect && <p className="mt-1 text-sm font-semibold">{primaryAnswer}</p>}
          <p className="mt-2 text-xs text-inkNeutral/60 dark:text-linen/60">{result.explanation}</p>
        </div>
      )}
    </ExerciseShell>
  );
}
