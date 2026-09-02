"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampBadge } from "@/components/ui/StampBadge";
import { ExerciseShell, ExerciseComplete } from "@/components/exercise/ExerciseShell";
import { completeDailyChallenge, recordVocabExposure } from "@/app/(app)/practice/daily-challenge/actions";
import { PILLAR_ACCENT } from "@/lib/pillarDisplay";
import type { DailyChallengeWord } from "@/lib/dailyChallenge";

const accent = PILLAR_ACCENT.VOCABULARY!;

interface DailyChallengeRunnerProps {
  words: DailyChallengeWord[];
  practiceSentences: { sentence: string; headword: string }[];
}

// Migrado para ExerciseShell/ExerciseComplete (5ª auditoria, Fase 2 do roteiro
// visual/UX, 2026-09-02) — quinto dos ~20 Runners antigos (ver
// MatchingRunner.tsx para o primeiro). Zero mudança de lógica/estado; a cor
// visível não muda (Desafio Diário já era brass, a cor real de Vocabulary),
// passa a vir do sistema central.
export function DailyChallengeRunner({ words, practiceSentences }: DailyChallengeRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [alreadyDoneToday, setAlreadyDoneToday] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const word = words[index]!;
  const isLast = index === words.length - 1;
  const isCorrect = selected === word.translationPt;

  function check() {
    if (!selected) return;
    setChecked(true);
    setScore((s) => (isCorrect ? s + 1 : s));
    // Fire-and-forget: uma falha aqui só significa que esta palavra não entra
    // na fila de revisão espaçada desta vez — não deve travar a sessão.
    void recordVocabExposure(word.id, selected);
  }

  async function advance() {
    const nextScore = score;
    if (isLast) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const result = await completeDailyChallenge(nextScore, words.length);
        setAlreadyDoneToday(result.alreadyDoneToday);
        setDone(true);
      } catch {
        setSubmitError("Não foi possível guardar o resultado — verifique a ligação e tente novamente.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    }
  }

  if (done) {
    return (
      <ExerciseComplete badge={<StampBadge code={`${score}/${words.length}`} tone="brass" />} title="Desafio de hoje concluído!">
        <p className="mb-4 text-center text-sm text-inkNeutral/70 dark:text-linen/70">
          {alreadyDoneToday
            ? "Já tinha feito o desafio de hoje — este resultado não conta XP extra, mas continue a praticar."
            : "Acertou " + score + " de " + words.length + " palavras."}
        </p>

        {practiceSentences.length > 0 && (
          <Card className="mb-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-verdigris">Frases para praticar</p>
            <ul className="flex flex-col gap-3">
              {practiceSentences.map((p, i) => (
                <li key={i}>
                  <p className="text-sm italic">"{p.sentence}"</p>
                  <p className="text-xs text-inkNeutral/60 dark:text-linen/60">usa: {p.headword}</p>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {words.some((w) => w.collocations.length > 0) && (
          <Card className="mb-4">
            <p className={`mb-3 font-mono text-xs uppercase tracking-wide ${accent.text}`}>Também pode dizer</p>
            <ul className="flex flex-col gap-2">
              {words
                .filter((w) => w.collocations.length > 0)
                .map((w) => (
                  <li key={w.id} className="text-sm">
                    <span className="font-semibold">{w.headword}</span>
                    <span className="text-inkNeutral/60 dark:text-linen/60"> → {w.collocations.join(", ")}</span>
                  </li>
                ))}
            </ul>
          </Card>
        )}

        <Link href="/home">
          <Button>Voltar à Home</Button>
        </Link>
      </ExerciseComplete>
    );
  }

  return (
    <ExerciseShell
      label="Desafio Diário"
      current={index + 1}
      total={words.length}
      accentClass={accent.bg}
      labelAccentClass={accent.text}
      submitError={submitError}
      footer={
        !checked ? (
          <Button onClick={check} disabled={!selected}>
            Verificar
          </Button>
        ) : (
          <Button onClick={advance} disabled={submitting}>
            {isLast ? "Terminar" : "Seguinte"}
          </Button>
        )
      }
    >
      <p className={`mb-1 font-mono text-xs uppercase tracking-wide ${accent.text}`}>O que significa...</p>
      <p className="mb-4 font-display text-2xl">{word.headword}</p>

      <fieldset className="flex flex-col gap-2">
        {word.options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 rounded-control border border-ink/10 p-3 text-sm">
            <input
              type="radio"
              name={word.id}
              checked={selected === opt}
              onChange={() => setSelected(opt)}
              disabled={checked}
            />
            {opt}
          </label>
        ))}
      </fieldset>

      {checked && (
        <p role="status" aria-live="polite" className={`mt-3 text-sm ${isCorrect ? accent.text : "text-clay"}`}>
          {isCorrect ? "Correto." : `Incorreto. Era: ${word.translationPt}`}
        </p>
      )}
    </ExerciseShell>
  );
}
