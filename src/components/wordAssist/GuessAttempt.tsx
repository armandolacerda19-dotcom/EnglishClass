"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

// Normalização solta de propósito: o objetivo é avaliar se o utilizador
// percebeu o sentido, não testar ortografia exata do português.
function looselyMatches(guess: string, meaningPt: string): boolean {
  const clean = (s: string) => s.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const g = clean(guess);
  const m = clean(meaningPt);
  if (!g) return false;
  return g === m || m.includes(g) || g.includes(m);
}

export function GuessAttempt({
  meaningPt,
  onDone,
}: {
  meaningPt: string;
  onDone: (correct: boolean) => void;
}) {
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  function submit() {
    if (!guess.trim() || result) return;
    const correct = looselyMatches(guess, meaningPt);
    setResult(correct ? "correct" : "incorrect");
    setTimeout(() => onDone(correct), correct ? 700 : 1100);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Escreva o que acha que a palavra significa em português.</p>
      <input
        autoFocus
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={!!result}
        placeholder="A sua tentativa..."
        className="rounded-control border border-ink/15 bg-white/80 px-4 py-3 text-base dark:border-linen/15 dark:bg-white/5"
      />
      {result && (
        <p className={`text-sm font-semibold ${result === "correct" ? "text-verdigris" : "text-clay"}`}>
          {result === "correct" ? "Muito bem! Era mesmo isso." : `Quase — o significado é "${meaningPt}".`}
        </p>
      )}
      {!result && (
        <Button onClick={submit} disabled={!guess.trim()}>
          Verificar
        </Button>
      )}
    </div>
  );
}
