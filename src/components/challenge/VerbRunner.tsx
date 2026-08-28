"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { completeVerbOfTheDay, type VerbCheckResult } from "@/app/(app)/practice/verbs/actions";
import type { IrregularVerb } from "@/content/irregularVerbs";

// Fase 16 (auditoria 2026-08-28, achado S2): antes disto era "revelar as
// respostas, depois autoavaliar-se num botão Sabia bem/Não sabia" — o
// servidor confiava cegamente nesse booleano. Agora é um recall a sério:
// escreve-se Past Simple/Participle de memória, o servidor corrige contra
// `getVerbOfTheDay()` (puramente determinístico pela data) e só depois se
// revelam as respostas certas.
export function VerbRunner({ verb }: { verb: IrregularVerb }) {
  const [pastSimple, setPastSimple] = useState("");
  const [pastParticiple, setPastParticiple] = useState("");
  const [result, setResult] = useState<VerbCheckResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function check() {
    if (!pastSimple.trim() || !pastParticiple.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await completeVerbOfTheDay(pastSimple, pastParticiple);
      setResult(res);
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

      {!result ? (
        <div className="mt-4 flex flex-col gap-3 border-t border-ink/10 pt-4 dark:border-linen/10">
          <label className="flex flex-col gap-1.5 text-sm">
            Past Simple
            <TextField
              value={pastSimple}
              onChange={(e) => setPastSimple(e.target.value)}
              disabled={submitting}
              placeholder="ex.: went"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Past Participle
            <TextField
              value={pastParticiple}
              onChange={(e) => setPastParticiple(e.target.value)}
              disabled={submitting}
              placeholder="ex.: gone"
            />
          </label>

          {submitError && (
            <p role="alert" className="text-sm text-clay">
              {submitError}
            </p>
          )}

          <div className="flex justify-end">
            <Button disabled={submitting || !pastSimple.trim() || !pastParticiple.trim()} onClick={check}>
              Verificar
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 border-t border-ink/10 pt-4 dark:border-linen/10">
          <p role="status" aria-live="polite" className={`mb-1 text-sm ${result.pastSimpleCorrect ? "text-verdigris" : "text-clay"}`}>
            Past Simple: <span className="font-semibold">{result.pastSimple}</span>
            {!result.pastSimpleCorrect && " — a sua resposta não bateu certo"}
          </p>
          <p className={`mb-1 text-sm ${result.pastParticipleCorrect ? "text-verdigris" : "text-clay"}`}>
            Past Participle: <span className="font-semibold">{result.pastParticiple}</span>
            {!result.pastParticipleCorrect && " — a sua resposta não bateu certo"}
          </p>
          <p className="mb-3 text-xs text-inkNeutral/60 dark:text-linen/60">{result.translationPt}</p>
          <p className="text-right text-sm text-inkNeutral/60 dark:text-linen/60">Registado — volte amanhã para outro verbo.</p>
        </div>
      )}
    </Card>
  );
}
