"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { completeVerbOfTheDay } from "@/app/(app)/practice/verbs/actions";
import type { IrregularVerb } from "@/content/irregularVerbs";

export function VerbRunner({ verb }: { verb: IrregularVerb }) {
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function grade(knewIt: boolean) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await completeVerbOfTheDay(knewIt);
      setDone(true);
    } catch {
      setSubmitError("Não foi possível guardar — verifique a ligação e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-brass/30">
      <p className="mb-1 font-mono text-xs uppercase tracking-wide text-brass">Verbo do Dia</p>
      <p className="mb-4 font-display text-2xl">{verb.base}</p>
      <PlayTranscript text={verb.base} />

      {!revealed ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setRevealed(true)}>Mostrar Past Simple / Participle</Button>
        </div>
      ) : (
        <div className="mt-4 border-t border-ink/10 pt-4 dark:border-linen/10">
          <p className="mb-1 text-sm">
            Past Simple: <span className="font-semibold">{verb.pastSimple}</span>
          </p>
          <p className="mb-1 text-sm">
            Past Participle: <span className="font-semibold">{verb.pastParticiple}</span>
          </p>
          <p className="mb-3 text-xs text-inkNeutral/60 dark:text-linen/60">{verb.translationPt}</p>

          {submitError && (
            <p role="alert" className="mb-2 text-sm text-clay">
              {submitError}
            </p>
          )}

          {!done ? (
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="secondary" disabled={submitting} onClick={() => grade(false)}>
                Não sabia
              </Button>
              <Button disabled={submitting} onClick={() => grade(true)}>
                Sabia bem
              </Button>
            </div>
          ) : (
            <p className="text-right text-sm text-verdigris">Registado — volte amanhã para outro verbo.</p>
          )}
        </div>
      )}
    </Card>
  );
}
