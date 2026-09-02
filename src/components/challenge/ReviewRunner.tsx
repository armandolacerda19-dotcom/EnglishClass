"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StampBadge } from "@/components/ui/StampBadge";
import { ExerciseShell, ExerciseComplete } from "@/components/exercise/ExerciseShell";
import { submitReview } from "@/app/(app)/practice/review/actions";
import { PILLAR_ACCENT } from "@/lib/pillarDisplay";
import type { DueReview } from "@/lib/srs/schedule";

const vocabAccent = PILLAR_ACCENT.VOCABULARY!;

interface ReviewRunnerProps {
  reviews: DueReview[];
}

// Fluxo estilo Anki: mostra a frente, o utilizador pensa, revela a resposta e
// auto-avalia-se (1 = não sabia, 3 = custou, 5 = sabia bem). Essa auto-avaliação
// alimenta o SM-2 (src/lib/srs/sm2.ts) para decidir o próximo intervalo.
//
// Migrado para ExerciseShell/ExerciseComplete (5ª auditoria, Fase 2 do roteiro
// visual, 2026-09-02). Diferente dos outros Runners migrados: mistura itens de
// vocabulário e correções de erro de QUALQUER pilar na mesma sessão, por isso
// o rótulo/barra de progresso mantêm Verdigris (aqui usado no seu sentido
// original de "progresso genérico", não de identidade de um pilar — ver
// docs/09-sistema-design.md). Só o item "vocabulary_item" ganha a cor real de
// Vocabulary (antes também verdigris, sem ligação a nenhum pilar); o item
// "error" mantém Clay, corretamente — é literalmente um erro.
export function ReviewRunner({ reviews }: ReviewRunnerProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const item = reviews[index]!;
  const isLast = index === reviews.length - 1;

  // Fase 8 (auditoria 2026-08-27, item 9) — sem try/catch, uma falha de rede
  // a meio de uma sessão de revisão deixava o utilizador preso, sem
  // mensagem, sem forma de tentar de novo.
  async function grade(quality: number) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (item.kind === "vocabulary_item") {
        await submitReview("vocabulary_item", item.itemRefId, quality);
      } else {
        await submitReview("error", item.itemRefId, quality, item.userErrorId);
      }
      setReviewedCount((c) => c + 1);

      if (isLast) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
        setRevealed(false);
      }
    } catch {
      setSubmitError("Não foi possível guardar a sua resposta — verifique a ligação e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <ExerciseComplete badge={<StampBadge code={`${reviewedCount}`} tone="verdigris" />} title="Revisão concluída!">
        <p className="mb-4 text-center text-sm text-inkNeutral/70 dark:text-linen/70">
          Reviu {reviewedCount} {reviewedCount === 1 ? "item" : "itens"}. Cada um volta a aparecer no momento certo
          para consolidar a memória.
        </p>
        <Link href="/home">
          <Button>Voltar à Home</Button>
        </Link>
      </ExerciseComplete>
    );
  }

  return (
    <ExerciseShell
      label="Revisão"
      current={index + 1}
      total={reviews.length}
      submitError={submitError}
      footer={
        !revealed ? (
          <Button onClick={() => setRevealed(true)}>Mostrar resposta</Button>
        ) : (
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" disabled={submitting} onClick={() => grade(1)}>
              Não sabia
            </Button>
            <Button variant="secondary" disabled={submitting} onClick={() => grade(3)}>
              Custou
            </Button>
            <Button disabled={submitting} onClick={() => grade(5)}>
              Sabia bem
            </Button>
          </div>
        )
      }
    >
      {item.kind === "vocabulary_item" ? (
        <>
          <p className={`mb-1 font-mono text-xs uppercase tracking-wide ${vocabAccent.text}`}>Lembra-se desta palavra?</p>
          <p className="mb-4 font-display text-2xl">{item.headword}</p>
          {revealed && (
            <div className="border-t border-ink/10 pt-4 dark:border-linen/10">
              <p className="mb-1 text-sm font-semibold">{item.translationPt}</p>
              <p className="mb-2 text-xs text-inkNeutral/60 dark:text-linen/60">{item.definitionEn}</p>
              {item.exampleSentences[0] && <p className="mb-2 text-sm italic">"{item.exampleSentences[0]}"</p>}
              {item.collocations.length > 0 && (
                <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
                  Também pode dizer: {item.collocations.join(", ")}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="mb-1 font-mono text-xs uppercase tracking-wide text-clay">
            Lembra-se da correção · {item.pillar.toLowerCase()}
          </p>
          <p className="mb-4 text-lg">{item.commonMistakePt ?? item.sourceText}</p>
          {revealed && (
            <div className="border-t border-ink/10 pt-4 dark:border-linen/10">
              <p className="mb-1 text-xs text-inkNeutral/60 dark:text-linen/60">Escreveu:</p>
              <p className="mb-2 text-sm line-through opacity-70">{item.sourceText}</p>
              <p className="mb-1 text-xs text-inkNeutral/60 dark:text-linen/60">Correção:</p>
              <p className="text-sm font-semibold">{item.correction}</p>
            </div>
          )}
        </>
      )}
    </ExerciseShell>
  );
}
