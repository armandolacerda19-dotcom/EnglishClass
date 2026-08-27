"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampBadge } from "@/components/ui/StampBadge";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { submitReadingPractice } from "@/app/(app)/practice/reading/actions";
import type { ReadingPassage } from "@/content/readingPassages";

export function ReadingRunner({ passage }: { passage: ReadingPassage }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const question = passage.questions[index]!;
  const isLast = index === passage.questions.length - 1;
  const isCorrect = selected === question.correctAnswer;

  function check() {
    if (!selected) return;
    setChecked(true);
    if (isCorrect) setCorrectCount((c) => c + 1);
  }

  async function advance() {
    if (isLast) {
      setSubmitting(true);
      await submitReadingPractice(correctCount, passage.questions.length);
      setSubmitting(false);
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    }
  }

  if (done) {
    return (
      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <StampBadge code={`${correctCount}/${passage.questions.length}`} tone="verdigris" />
          <h1 className="font-display text-2xl">Leitura concluída!</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/practice/reading">
            <Button variant="secondary">Outro texto</Button>
          </Link>
          <Link href="/home">
            <Button>Voltar à Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-verdigris">{passage.title}</p>
      <div className="mb-6 h-1 w-full rounded-full bg-ink/10 dark:bg-linen/10">
        <div
          className="h-1 rounded-full bg-verdigris transition-[width]"
          style={{ width: `${((index + 1) / passage.questions.length) * 100}%` }}
        />
      </div>

      <Card className="mb-4">
        <div className="mb-3">
          <PlayTranscript text={passage.text} />
        </div>
        <p className="text-sm leading-relaxed">{passage.text}</p>
      </Card>

      <Card>
        <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">
          Pergunta {index + 1} de {passage.questions.length}
        </p>
        <p className="mb-4 text-lg">{question.prompt}</p>

        <fieldset className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 rounded-control border border-ink/10 p-3 text-sm">
              <input
                type="radio"
                name={question.id}
                checked={selected === opt}
                onChange={() => setSelected(opt)}
                disabled={checked}
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {checked && (
          <p className={`mt-3 text-sm ${isCorrect ? "text-verdigris" : "text-clay"}`}>
            {isCorrect ? "Correto." : `Incorreto. Resposta certa: ${question.correctAnswer}`}
          </p>
        )}
      </Card>

      <div className="mt-4 flex justify-end">
        {!checked ? (
          <Button onClick={check} disabled={!selected}>
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
