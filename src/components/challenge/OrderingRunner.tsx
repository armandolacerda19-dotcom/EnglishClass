"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampBadge } from "@/components/ui/StampBadge";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { submitOrdering } from "@/app/(app)/practice/ordering/actions";
import { shuffleWords } from "@/lib/sentenceOrdering";
import type { OrderingItem } from "@/content/sentenceOrdering";

// Ordenar Frases — pedido do utilizador (2026-08-28): "tipos de exercícios
// diferentes". Palavras baralhadas em fichas tocáveis; o utilizador reconstrói
// a frase tocando-as pela ordem certa. Único exercício da app que testa
// ativamente ordem sintática — os outros testam reconhecimento (escolha
// múltipla) ou produção livre (tradução/ditado), nenhum força a construir a
// sequência com as próprias mãos.
export function OrderingRunner({ items }: { items: OrderingItem[] }) {
  const [index, setIndex] = useState(0);
  const [built, setBuilt] = useState<{ word: string; poolIndex: number }[]>([]);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<{ itemId: string; given: string[] }[]>([]);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Resultado final vem SEMPRE do servidor (submitOrdering recalcula tudo a
  // partir das frases reais) — nunca da contagem local, que é só feedback
  // imediato de UX. Mesmo princípio de DictationRunner.tsx, Fase 8.
  const [finalScore, setFinalScore] = useState<{ correct: number; total: number } | null>(null);

  const item = items[index];
  const pool = useMemo(() => (item ? shuffleWords(item) : []), [item]);
  const usedPoolIndexes = new Set(built.map((b) => b.poolIndex));

  if (!item) {
    return (
      <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
        <h1 className="mb-4 font-display text-2xl">Ordenar Frases</h1>
        <Card>
          <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Não há frases disponíveis de momento.</p>
        </Card>
      </main>
    );
  }

  const isLast = index === items.length - 1;
  const isFull = built.length === item.words.length;
  const given = built.map((b) => b.word);
  const isCorrect = checked && given.every((w, i) => w === item.words[i]);

  function tapWord(word: string, poolIndex: number) {
    if (checked || usedPoolIndexes.has(poolIndex)) return;
    setBuilt((b) => [...b, { word, poolIndex }]);
  }

  function removeWord(builtIndex: number) {
    if (checked) return;
    setBuilt((b) => b.filter((_, i) => i !== builtIndex));
  }

  function reset() {
    if (checked) return;
    setBuilt([]);
  }

  function check() {
    if (!isFull) return;
    setChecked(true);
  }

  async function advance() {
    // TS não propaga o "if (!item) return" do topo do componente para dentro
    // desta closure — reafirmar aqui é só para o compilador, `item` já está
    // garantidamente definido neste ponto (o early return já correu antes de
    // este botão sequer existir na árvore).
    if (!item) return;
    const nextAnswers = [...answers, { itemId: item.id, given }];
    setAnswers(nextAnswers);

    if (isLast) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const score = await submitOrdering(nextAnswers);
        setFinalScore(score);
        setDone(true);
      } catch {
        setSubmitError("Não foi possível guardar o resultado — verifique a ligação e tente novamente.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setIndex((i) => i + 1);
      setBuilt([]);
      setChecked(false);
    }
  }

  if (done) {
    return (
      <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <StampBadge code={`${finalScore?.correct ?? 0}/${finalScore?.total ?? items.length}`} tone="verdigris" />
          <h1 className="font-display text-2xl">Ordenar Frases concluído!</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/home">
            <Button>Voltar à Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-verdigris">
        Ordenar Frases · {item.level} · {index + 1} de {items.length}
      </p>
      <div className="mb-6 h-1 w-full rounded-full bg-ink/10 dark:bg-linen/10">
        <div
          className="h-1 rounded-full bg-verdigris transition-[width]"
          style={{ width: `${((index + 1) / items.length) * 100}%` }}
        />
      </div>

      <Card className="mb-4">
        <p className="mb-3 text-sm text-inkNeutral/70 dark:text-linen/70">Toque nas palavras pela ordem certa para formar a frase.</p>

        <div className="mb-4 min-h-[3.5rem] rounded-control border-2 border-dashed border-ink/15 p-3 dark:border-linen/15">
          {built.length === 0 ? (
            <p className="text-sm text-inkNeutral/40 dark:text-linen/40">A sua frase aparece aqui...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {built.map((b, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => removeWord(i)}
                  disabled={checked}
                  className={`rounded-control px-3 py-1.5 text-sm ${
                    checked
                      ? item.words[i] === b.word
                        ? "bg-verdigris/15 text-verdigris"
                        : "bg-clay/15 text-clay line-through"
                      : "bg-ink text-linen hover:opacity-80 dark:bg-linen dark:text-ink"
                  }`}
                >
                  {b.word}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {pool.map((word, i) => (
            <button
              key={i}
              type="button"
              onClick={() => tapWord(word, i)}
              disabled={checked || usedPoolIndexes.has(i)}
              className={`rounded-control border border-ink/10 px-3 py-1.5 text-sm dark:border-linen/10 ${
                usedPoolIndexes.has(i) ? "opacity-25" : "hover:border-verdigris"
              }`}
            >
              {word}
            </button>
          ))}
        </div>

        {built.length > 0 && !checked && (
          <button type="button" onClick={reset} className="mt-3 font-mono text-xs text-inkNeutral/50 underline dark:text-linen/50">
            limpar
          </button>
        )}

        {checked && (
          <div role="status" aria-live="polite" className="mt-4 border-t border-ink/10 pt-4 dark:border-linen/10">
            <p className={`text-sm ${isCorrect ? "text-verdigris" : "text-clay"}`}>
              {isCorrect ? "Correto!" : "Quase — a ordem certa era:"}
            </p>
            {!isCorrect && <p className="mt-1 text-sm font-semibold">{item.words.join(" ")}</p>}
            <p className="mt-2 text-xs italic text-inkNeutral/60 dark:text-linen/60">{item.translationPt}</p>
            <p className="mt-1 text-xs text-inkNeutral/50 dark:text-linen/50">{item.focus}</p>
            <div className="mt-2">
              <PlayTranscript text={item.words.join(" ")} />
            </div>
          </div>
        )}
      </Card>

      {submitError && (
        <p role="alert" className="mb-3 text-sm text-clay">
          {submitError}
        </p>
      )}

      <div className="flex justify-end">
        {!checked ? (
          <Button onClick={check} disabled={!isFull}>
            Verificar
          </Button>
        ) : (
          <Button onClick={advance} disabled={submitting}>
            {isLast ? "Terminar" : "Seguinte"}
          </Button>
        )}
      </div>
    </main>
  );
}
