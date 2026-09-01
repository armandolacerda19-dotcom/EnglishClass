"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StampBadge } from "@/components/ui/StampBadge";
import { ExerciseShell, ExerciseComplete } from "@/components/exercise/ExerciseShell";
import { submitMatching } from "@/app/(app)/practice/matching/actions";
import { PILLAR_ACCENT } from "@/lib/pillarDisplay";
import type { MatchingPair } from "@/lib/vocabularyMatching";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

const accent = PILLAR_ACCENT.VOCABULARY!;

// Emparelhar — pedido do utilizador (2026-08-28): "tipos de exercícios
// diferentes". Sem distratores: cada palavra inglesa tem uma tradução real
// entre as visíveis, o utilizador tem de emparelhar as duas colunas. A UI só
// deixa um par avançar quando está correto — tentativas erradas voltam a
// separar-se — por isso a nota reflete quantas tentativas foram precisas,
// não só se terminou.
//
// Migrado para ExerciseShell/ExerciseComplete (5ª auditoria, Fase 2 do roteiro
// visual/UX, 2026-09-02) — primeiro dos ~20 Runners antigos com JSX próprio a
// passar para o layout partilhado, como prova de conceito antes de migrar os
// restantes um de cada vez. Zero mudança de lógica/estado, só de apresentação
// — usa a cor do pilar Vocabulary (docs/09-sistema-design.md) em vez do
// verdigris fixo que tinha antes.
export function MatchingRunner({ pairs }: { pairs: MatchingPair[] }) {
  const left = useMemo(() => shuffle(pairs), [pairs]);
  const right = useMemo(() => shuffle(pairs), [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ completed: number; mistakes: number } | null>(null);

  if (pairs.length === 0) {
    return (
      <ExerciseShell label="Emparelhar" current={0} total={0}>
        <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Não há vocabulário disponível de momento.</p>
      </ExerciseShell>
    );
  }

  async function finish(finalMistakes: number) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitMatching(
        pairs.map((p) => p.itemId),
        finalMistakes
      );
      setResult(res);
    } catch {
      setSubmitError("Não foi possível guardar o resultado — verifique a ligação e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  function tapLeft(itemId: string) {
    if (matched.has(itemId) || wrongPair) return;
    const nextLeft = selectedLeft === itemId ? null : itemId;
    setSelectedLeft(nextLeft);
    if (nextLeft && selectedRight) resolveAttempt(nextLeft, selectedRight);
  }

  function tapRight(itemId: string) {
    if (matched.has(itemId) || wrongPair) return;
    const nextRight = selectedRight === itemId ? null : itemId;
    setSelectedRight(nextRight);
    if (selectedLeft && nextRight) resolveAttempt(selectedLeft, nextRight);
  }

  function resolveAttempt(leftId: string, rightId: string) {
    if (leftId === rightId) {
      const nextMatched = new Set(matched);
      nextMatched.add(leftId);
      setMatched(nextMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (nextMatched.size === pairs.length) {
        finish(mistakes);
      }
    } else {
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      setWrongPair({ left: leftId, right: rightId });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  }

  if (result) {
    return (
      <ExerciseComplete
        badge={<StampBadge code={`${result.mistakes} erro${result.mistakes === 1 ? "" : "s"}`} tone="verdigris" />}
        title="Emparelhar concluído!"
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
      label={`Emparelhar · ${mistakes} erro${mistakes === 1 ? "" : "s"}`}
      current={matched.size}
      total={pairs.length}
      accentClass={accent.bg}
      labelAccentClass={accent.text}
      submitError={submitError}
    >
      <p className="mb-4 text-sm text-inkNeutral/70 dark:text-linen/70">Toque numa palavra inglesa e depois na tradução certa.</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {left.map((p) => (
            <button
              key={p.itemId}
              type="button"
              onClick={() => tapLeft(p.itemId)}
              disabled={matched.has(p.itemId)}
              className={`rounded-control px-3 py-2.5 text-left text-sm transition-colors ${
                matched.has(p.itemId)
                  ? `${accent.bgSoft} ${accent.textSoft} line-through`
                  : wrongPair?.left === p.itemId
                  ? "bg-clay/20 text-clay"
                  : selectedLeft === p.itemId
                  ? "bg-ink text-linen dark:bg-linen dark:text-ink"
                  : `border border-ink/10 ${accent.hoverBorder} dark:border-linen/10`
              }`}
            >
              {p.headword}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {right.map((p) => (
            <button
              key={p.itemId}
              type="button"
              onClick={() => tapRight(p.itemId)}
              disabled={matched.has(p.itemId)}
              className={`rounded-control px-3 py-2.5 text-left text-sm transition-colors ${
                matched.has(p.itemId)
                  ? `${accent.bgSoft} ${accent.textSoft} line-through`
                  : wrongPair?.right === p.itemId
                  ? "bg-clay/20 text-clay"
                  : selectedRight === p.itemId
                  ? "bg-ink text-linen dark:bg-linen dark:text-ink"
                  : `border border-ink/10 ${accent.hoverBorder} dark:border-linen/10`
              }`}
            >
              {p.translationPt}
            </button>
          ))}
        </div>
      </div>

      {submitting && <p className="mt-3 text-sm text-inkNeutral/60 dark:text-linen/60">A guardar...</p>}
    </ExerciseShell>
  );
}
