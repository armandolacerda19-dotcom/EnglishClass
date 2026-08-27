"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampBadge } from "@/components/ui/StampBadge";
import { submitReview } from "@/app/(app)/practice/review/actions";
import type { DueReview } from "@/lib/srs/schedule";

interface ReviewRunnerProps {
  reviews: DueReview[];
}

// Fluxo estilo Anki: mostra a frente, o utilizador pensa, revela a resposta e
// auto-avalia-se (1 = não sabia, 3 = custou, 5 = sabia bem). Essa auto-avaliação
// alimenta o SM-2 (src/lib/srs/sm2.ts) para decidir o próximo intervalo.
export function ReviewRunner({ reviews }: ReviewRunnerProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const item = reviews[index]!;
  const isLast = index === reviews.length - 1;

  async function grade(quality: number) {
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
  }

  if (done) {
    return (
      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <StampBadge code={`${reviewedCount}`} tone="verdigris" />
          <h1 className="font-display text-2xl">Revisão concluída!</h1>
          <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
            Reviu {reviewedCount} {reviewedCount === 1 ? "item" : "itens"}. Cada um volta a aparecer no momento certo
            para consolidar a memória.
          </p>
        </div>
        <Link href="/home">
          <Button>Voltar à Home</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-verdigris">
        Revisão · {index + 1} de {reviews.length}
      </p>
      <div className="mb-6 h-1 w-full rounded-full bg-ink/10 dark:bg-linen/10">
        <div
          className="h-1 rounded-full bg-verdigris transition-[width]"
          style={{ width: `${((index + 1) / reviews.length) * 100}%` }}
        />
      </div>

      <Card>
        {item.kind === "vocabulary_item" ? (
          <>
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Lembra-se desta palavra?</p>
            <p className="mb-4 font-display text-2xl">{item.headword}</p>
            {revealed && (
              <div className="border-t border-ink/10 pt-4 dark:border-linen/10">
                <p className="mb-1 text-sm font-semibold">{item.translationPt}</p>
                <p className="mb-2 text-xs text-inkNeutral/60 dark:text-linen/60">{item.definitionEn}</p>
                {item.exampleSentences[0] && (
                  <p className="mb-2 text-sm italic">"{item.exampleSentences[0]}"</p>
                )}
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
      </Card>

      <div className="mt-4 flex justify-end gap-2">
        {!revealed ? (
          <Button onClick={() => setRevealed(true)}>Mostrar resposta</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={() => grade(1)}>
              Não sabia
            </Button>
            <Button variant="secondary" onClick={() => grade(3)}>
              Custou
            </Button>
            <Button onClick={() => grade(5)}>Sabia bem</Button>
          </>
        )}
      </div>
    </main>
  );
}
