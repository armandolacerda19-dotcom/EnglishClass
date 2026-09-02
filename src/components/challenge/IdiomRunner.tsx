"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { ExerciseShell } from "@/components/exercise/ExerciseShell";
import { completeIdiom } from "@/app/(app)/practice/idioms/actions";
import { PILLAR_ACCENT } from "@/lib/pillarDisplay";
import type { Idiom } from "@/content/idioms";

const accent = PILLAR_ACCENT.VOCABULARY!;

// Migrado para ExerciseShell (5ª auditoria, Fase 2 do roteiro visual/UX,
// 2026-09-02) — quarto dos ~20 Runners antigos (ver MatchingRunner.tsx para o
// primeiro). Item único do dia, não uma lista — sem ecrã de conclusão à parte
// (ExerciseComplete), o botão "Voltar à Home" aparece no mesmo ecrã depois de
// verificar, como já acontecia antes.
export function IdiomRunner({ idiom, options }: { idiom: Idiom; options: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isCorrect = selected === idiom.meaningEn;

  async function check() {
    if (!selected) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await completeIdiom(selected);
      setChecked(true);
    } catch {
      setSubmitError("Não foi possível guardar — verifique a ligação e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ExerciseShell
      label="Idioma do Dia"
      current={1}
      total={1}
      accentClass={accent.bg}
      labelAccentClass={accent.text}
      submitError={submitError}
      footer={
        !checked ? (
          <Button onClick={check} disabled={!selected || submitting}>
            Verificar
          </Button>
        ) : (
          <Link href="/home">
            <Button>Voltar à Home</Button>
          </Link>
        )
      }
    >
      <p className="mb-4 text-sm text-inkNeutral/70 dark:text-linen/70">Um phrasal verb ou expressão idiomática nova a cada dia.</p>

      <p className="mb-1 font-display text-2xl">{idiom.phrase}</p>
      <p className="mb-4 text-xs italic text-inkNeutral/50 dark:text-linen/50">
        tradução literal: "{idiom.literalPt}" (não é o que significa!)
      </p>
      <PlayTranscript text={idiom.phrase} />

      <p className="mb-3 mt-4 text-sm font-semibold">O que significa realmente?</p>
      <fieldset className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 rounded-control border border-ink/10 p-3 text-sm">
            <input
              type="radio"
              name="idiom"
              checked={selected === opt}
              onChange={() => setSelected(opt)}
              disabled={checked}
            />
            {opt}
          </label>
        ))}
      </fieldset>

      {checked && (
        <div className="mt-4 border-t border-ink/10 pt-4 dark:border-linen/10">
          <p role="status" aria-live="polite" className={`mb-2 text-sm ${isCorrect ? accent.text : "text-clay"}`}>
            {isCorrect ? "Correto!" : `Não. Significa: ${idiom.meaningEn}`}
          </p>
          <p className="mb-1 text-xs text-inkNeutral/60 dark:text-linen/60">Em português: {idiom.meaningPt}</p>
          <p className="text-sm italic">"{idiom.example}"</p>
        </div>
      )}
    </ExerciseShell>
  );
}
