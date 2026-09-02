"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampBadge } from "@/components/ui/StampBadge";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { ExerciseComplete } from "@/components/exercise/ExerciseShell";
import { submitReadingPractice } from "@/app/(app)/practice/reading/actions";
import { PILLAR_ACCENT } from "@/lib/pillarDisplay";
import type { ReadingPassage } from "@/content/readingPassages";

const accent = PILLAR_ACCENT.READING!;

// 5ª auditoria (Fase 2 do roteiro visual, 2026-09-02) — o ecrã principal tem
// dois Cards lado a lado (texto + pergunta), incompatível com o Card único de
// ExerciseShell, por isso mantém o layout próprio (só a cor de identidade
// passa a vir de PILLAR_ACCENT.READING em vez de verdigris fixo). O ecrã de
// conclusão migra para ExerciseComplete, que ganha o CTA "Continuar: {pilar}"
// que este exercício não tinha (Fase 25).
export function ReadingRunner({ passage }: { passage: ReadingPassage }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; selected: string }[]>([]);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Fonte de verdade do resultado final é sempre o servidor — ver actions.ts, Fase 8.
  const [finalScore, setFinalScore] = useState<{ correct: number; total: number } | null>(null);

  const question = passage.questions[index]!;
  const isLast = index === passage.questions.length - 1;
  const isCorrect = selected === question.correctAnswer;

  function check() {
    if (!selected) return;
    setChecked(true);
  }

  async function advance() {
    const nextAnswers = [...answers, { questionId: question.id, selected: selected! }];
    setAnswers(nextAnswers);

    if (isLast) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const score = await submitReadingPractice(passage.id, nextAnswers);
        setFinalScore(score);
        setDone(true);
      } catch {
        setSubmitError("Não foi possível guardar o resultado — verifique a ligação e tente novamente.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    }
  }

  if (done) {
    return (
      <ExerciseComplete
        badge={<StampBadge code={`${finalScore?.correct ?? 0}/${finalScore?.total ?? passage.questions.length}`} tone="verdigris" />}
        title="Leitura concluída!"
      >
        <div className="flex flex-wrap gap-2">
          <Link href="/practice/reading">
            <Button variant="secondary">Outro texto</Button>
          </Link>
          <Link href="/home">
            <Button>Voltar à Home</Button>
          </Link>
        </div>
      </ExerciseComplete>
    );
  }

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <p className={`mb-1 font-mono text-xs uppercase tracking-widest ${accent.text}`}>{passage.title}</p>
      <div className="mb-6 h-1 w-full rounded-full bg-ink/10 dark:bg-linen/10">
        <div
          className={`h-1 rounded-full ${accent.bg} transition-[width]`}
          style={{ width: `${((index + 1) / passage.questions.length) * 100}%` }}
        />
      </div>

      <Card className="mb-4">
        <div className="mb-3">
          <PlayTranscript text={passage.text} />
        </div>
        {/* Fase 14 — whitespace-pre-line preserva quebras de linha (`\n`) sem
            quebrar os 60 textos existentes, que são um único parágrafo
            contínuo sem `\n` nenhum: essencial para os novos géneros
            "dialogue"/"email", onde a formatação em linhas faz parte de como
            o texto se lê (falas separadas, "Subject:" numa linha própria). */}
        <p className="whitespace-pre-line text-sm leading-relaxed">{passage.text}</p>
      </Card>

      <Card>
        <p className={`mb-1 font-mono text-xs uppercase tracking-wide ${accent.text}`}>
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
          <p role="status" aria-live="polite" className={`mt-3 text-sm ${isCorrect ? accent.text : "text-clay"}`}>
            {isCorrect ? "Correto." : `Incorreto. Resposta certa: ${question.correctAnswer}`}
          </p>
        )}
      </Card>

      {submitError && (
        <p role="alert" className="mt-3 text-sm text-clay">
          {submitError}
        </p>
      )}

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
