"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampBadge } from "@/components/ui/StampBadge";
import { submitWeeklyTest, type WeeklyTestAnswer, type WeeklyTestResult } from "@/app/(app)/practice/weekly-test/actions";
import type { WeeklyTestQuestion } from "@/lib/weeklyTest";

const PILLAR_LABEL: Record<string, string> = {
  GRAMMAR: "gramática",
  VOCABULARY: "vocabulário",
  LISTENING: "compreensão oral",
  READING: "leitura",
};

interface WeeklyTestRunnerProps {
  questions: WeeklyTestQuestion[];
}

export function WeeklyTestRunner({ questions }: WeeklyTestRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<WeeklyTestAnswer[]>([]);
  const [result, setResult] = useState<WeeklyTestResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const question = questions[index]!;
  const isLast = index === questions.length - 1;

  async function confirm() {
    if (!selected) return;
    const nextAnswers = [...answers, { exerciseId: question.exerciseId, pillar: question.pillar, given: selected }];
    setAnswers(nextAnswers);

    if (isLast) {
      setSubmitting(true);
      const res = await submitWeeklyTest(nextAnswers);
      setResult(res);
      setSubmitting(false);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  if (result) {
    return (
      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <StampBadge code={`${result.overallScore}%`} tone="brass" />
          <h1 className="font-display text-2xl">Diagnóstico concluído!</h1>
        </div>

        <Card className="mb-4">
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-verdigris">Por pilar</p>
          <ul className="flex flex-col gap-2">
            {result.breakdown.map((b) => (
              <li key={b.pillar} className="flex items-center justify-between text-sm">
                <span>{PILLAR_LABEL[b.pillar] ?? b.pillar.toLowerCase()}</span>
                <span className="font-mono">
                  {b.correct}/{b.total}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {result.weakAreas.length > 0 && (
          <Card className="mb-4 border-clay">
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-clay">O que corrigir esta semana</p>
            <ul className="list-inside list-disc text-sm">
              {result.weakAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </Card>
        )}

        <Link href="/progress">
          <Button>Ver progresso</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-verdigris">
        Diagnóstico Semanal · {index + 1} de {questions.length}
      </p>
      <div className="mb-6 h-1 w-full rounded-full bg-ink/10 dark:bg-linen/10">
        <div
          className="h-1 rounded-full bg-verdigris transition-[width]"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <Card>
        <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">
          {PILLAR_LABEL[question.pillar] ?? question.pillar.toLowerCase()}
        </p>
        <p className="mb-4 text-lg">{question.prompt}</p>

        <fieldset className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 rounded-control border border-ink/10 p-3 text-sm">
              <input
                type="radio"
                name={question.exerciseId}
                checked={selected === opt}
                onChange={() => setSelected(opt)}
              />
              {opt}
            </label>
          ))}
        </fieldset>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button onClick={confirm} disabled={!selected || submitting}>
          {isLast ? "Terminar" : "Seguinte"}
        </Button>
      </div>
    </main>
  );
}
