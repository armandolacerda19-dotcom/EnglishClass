"use client";

import { useState } from "react";
import Link from "next/link";
import type { Pillar } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampBadge } from "@/components/ui/StampBadge";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { submitTopicPractice, type TopicPracticeAnswer, type TopicPracticeResult } from "@/app/(app)/practice/topic/actions";
import type { PracticeQuestion } from "@/lib/practiceQuestions";
import { PILLAR_LABEL, PILLAR_ACCENT, DEFAULT_ACCENT } from "@/lib/pillarDisplay";

interface TopicPracticeRunnerProps {
  pillar: Pillar;
  questions: PracticeQuestion[];
}

export function TopicPracticeRunner({ pillar, questions }: TopicPracticeRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<TopicPracticeAnswer[]>([]);
  const [result, setResult] = useState<TopicPracticeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const question = questions[index]!;
  const isLast = index === questions.length - 1;
  const given = question.kind === "text" ? textAnswer : selected;
  const isCorrect =
    !!given && question.correctAnswers.some((c) => c.trim().toLowerCase() === given.trim().toLowerCase());
  const accent = PILLAR_ACCENT[pillar] ?? DEFAULT_ACCENT;

  function check() {
    if (!given) return;
    setChecked(true);
  }

  async function advance() {
    const nextAnswers = [...answers, { exerciseId: question.exerciseId, given: given ?? "" }];
    setAnswers(nextAnswers);

    if (isLast) {
      setSubmitting(true);
      const res = await submitTopicPractice(pillar, nextAnswers);
      setResult(res);
      setSubmitting(false);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setTextAnswer("");
      setChecked(false);
    }
  }

  if (result) {
    return (
      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <StampBadge code={`${result.correct}/${result.total}`} tone="brass" />
          <h1 className="font-display text-2xl">Sessão concluída!</h1>
          <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
            {PILLAR_LABEL[pillar] ?? pillar.toLowerCase()} — pode repetir quando quiser, com perguntas novas.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/practice/topic">
            <Button variant="secondary">Outro tema</Button>
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
      <p className={`mb-1 font-mono text-xs uppercase tracking-widest ${accent.text}`}>
        {PILLAR_LABEL[pillar] ?? pillar.toLowerCase()} · {index + 1} de {questions.length}
      </p>
      <div className="mb-6 h-1 w-full rounded-full bg-ink/10 dark:bg-linen/10">
        <div
          className={`h-1 rounded-full ${accent.bg} transition-[width]`}
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <Card className={accent.border}>
        <p className="mb-4 text-lg">{question.prompt}</p>
        {question.transcript && (
          <div className="mb-4">
            <PlayTranscript text={question.transcript} />
          </div>
        )}

        {question.kind === "choice" ? (
          <fieldset className="flex flex-col gap-2">
            {question.options.map((opt) => (
              <label key={opt} className="flex items-center gap-2 rounded-control border border-ink/10 p-3 text-sm">
                <input
                  type="radio"
                  name={question.exerciseId}
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                  disabled={checked}
                />
                {opt}
              </label>
            ))}
          </fieldset>
        ) : (
          <textarea
            rows={2}
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            disabled={checked}
            placeholder="Escreva a sua resposta..."
            className="w-full rounded-control border border-ink/20 px-3 py-2 text-sm"
          />
        )}

        {checked && (
          <p className={`mt-3 text-sm ${isCorrect ? "text-verdigris" : "text-clay"}`}>
            {isCorrect ? "Correto." : `Incorreto. Resposta certa: ${question.correctAnswers[0]}`}
          </p>
        )}
      </Card>

      <div className="mt-4 flex justify-end">
        {!checked ? (
          <Button onClick={check} disabled={!given}>
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
