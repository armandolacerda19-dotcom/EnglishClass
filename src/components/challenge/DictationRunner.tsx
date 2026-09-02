"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StampBadge } from "@/components/ui/StampBadge";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { TextField } from "@/components/ui/TextField";
import { ExerciseShell, ExerciseComplete } from "@/components/exercise/ExerciseShell";
import { submitDictation } from "@/app/(app)/practice/dictation/actions";
import { checkDictation } from "@/lib/dictation";
import { PILLAR_ACCENT } from "@/lib/pillarDisplay";
import type { DictationItem } from "@/content/dictation";

const accent = PILLAR_ACCENT.LISTENING!;

// Migrado para ExerciseShell/ExerciseComplete (5ª auditoria, Fase 2 do roteiro
// visual/UX, 2026-09-02) — terceiro dos ~20 Runners antigos (ver
// MatchingRunner.tsx/OrderingRunner.tsx para os dois primeiros). Zero mudança
// de lógica/estado, cor passa de verdigris fixo para a cor real do pilar
// Listening.
export function DictationRunner({ items }: { items: DictationItem[] }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<{ itemId: string; given: string }[]>([]);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Resultado final vem SEMPRE do servidor (submitDictation recalcula tudo a
  // partir do texto real) — nunca da contagem local, que é só feedback
  // imediato de UX, não a fonte de verdade. Ver docs/decisions.md, Fase 8.
  const [finalScore, setFinalScore] = useState<{ correct: number; total: number } | null>(null);

  if (items.length === 0) {
    return (
      <ExerciseShell label="Ditado" current={0} total={0}>
        <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Não há frases de ditado disponíveis de momento.</p>
      </ExerciseShell>
    );
  }

  const item = items[index]!;
  const isLast = index === items.length - 1;
  const result = checked ? checkDictation(answer, item.text) : null;

  function check() {
    if (!answer.trim()) return;
    setChecked(true);
  }

  async function advance() {
    const nextAnswers = [...answers, { itemId: item.id, given: answer }];
    setAnswers(nextAnswers);

    if (isLast) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const score = await submitDictation(nextAnswers);
        setFinalScore(score);
        setDone(true);
      } catch {
        setSubmitError("Não foi possível guardar o resultado — verifique a ligação e tente novamente.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setIndex((i) => i + 1);
      setAnswer("");
      setChecked(false);
    }
  }

  if (done) {
    return (
      <ExerciseComplete
        badge={<StampBadge code={`${finalScore?.correct ?? 0}/${finalScore?.total ?? items.length}`} tone="verdigris" />}
        title="Ditado concluído!"
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
      label={`Ditado · ${item.level}`}
      current={index + 1}
      total={items.length}
      accentClass={accent.bg}
      labelAccentClass={accent.text}
      submitError={submitError}
      footer={
        !checked ? (
          <Button onClick={check} disabled={!answer.trim()}>
            Verificar
          </Button>
        ) : (
          <Button onClick={advance} disabled={submitting}>
            {isLast ? "Terminar" : "Seguinte"}
          </Button>
        )
      }
    >
      <p className="mb-3 text-sm text-inkNeutral/70 dark:text-linen/70">Ouça a frase e escreva exatamente o que ouviu.</p>
      <PlayTranscript text={item.text} />

      <div className="mt-4">
        <TextField
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={checked}
          placeholder="Escreva aqui o que ouviu..."
        />
      </div>

      {result && (
        <div role="status" aria-live="polite" className="mt-3">
          <p className={`text-sm ${result.isCorrect ? accent.text : "text-clay"}`}>
            {result.isCorrect ? "Correto!" : "Quase — compare com a frase certa:"}
          </p>
          {!result.isCorrect && (
            <p className="mt-2 text-sm leading-relaxed">
              {result.diff.map((w, i) => (
                <span key={i} className={w.correct ? accent.text : "font-semibold text-clay underline"}>
                  {w.word}{" "}
                </span>
              ))}
            </p>
          )}
          <p className="mt-2 text-xs italic text-inkNeutral/60 dark:text-linen/60">{item.translationPt}</p>
        </div>
      )}
    </ExerciseShell>
  );
}
