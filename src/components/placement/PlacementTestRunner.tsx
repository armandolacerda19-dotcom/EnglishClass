"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PLACEMENT_QUESTIONS } from "@/lib/placement/questions";
import { Button } from "@/components/ui/Button";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { RecordButton } from "@/components/ui/RecordButton";
import { TextAreaField } from "@/components/ui/TextAreaField";

interface AnswerState {
  [questionId: string]: string;
}

export function PlacementTestRunner() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Seguro: index nunca ultrapassa PLACEMENT_QUESTIONS.length - 1 (ver isLast/handleSubmitTest).
  const question = PLACEMENT_QUESTIONS[index]!;
  const isLast = index === PLACEMENT_QUESTIONS.length - 1;

  function setAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  // try/catch obrigatório: sem ele, uma falha de rede deixava `submitting` a true
  // para sempre — o utilizador ficava preso no fim do teste de nivelamento, com o
  // botão desativado, sem mensagem e sem forma de tentar outra vez.
  async function handleSubmitTest() {
    setSubmitting(true);
    setSubmitError(null);
    const payload = PLACEMENT_QUESTIONS.map((q) => ({ questionId: q.id, answer: answers[q.id] ?? "" }));
    try {
      const res = await fetch("/api/placement/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      if (res.ok) {
        router.push("/onboarding/results");
        return;
      }
      setSubmitError("Não foi possível calcular o resultado. Tente novamente.");
    } catch {
      setSubmitError("Sem ligação à internet. Verifique a ligação e tente novamente.");
    }
    setSubmitting(false);
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-verdigris">
        Pergunta {index + 1} de {PLACEMENT_QUESTIONS.length} · {question.pillar}
      </p>

      <h2 className="font-display text-xl">{question.prompt}</h2>

      {question.transcript && <PlayTranscript text={question.transcript} />}

      {question.freeResponse ? (
        question.pillar === "writing" ? (
          <TextAreaField rows={4} value={answers[question.id] ?? ""} onChange={(e) => setAnswer(e.target.value)} />
        ) : (
          <div className="flex flex-col gap-3">
            <RecordButton onTranscript={setAnswer} />
            {answers[question.id] && (
              <p className="rounded-card border border-ink/10 p-3 text-sm italic">"{answers[question.id]}"</p>
            )}
          </div>
        )
      ) : (
        <fieldset className="flex flex-col gap-2">
          {question.options?.map((opt) => (
            <label key={opt} className="flex items-center gap-2 rounded-control border border-ink/10 p-3 text-sm">
              <input type="radio" name={question.id} checked={answers[question.id] === opt} onChange={() => setAnswer(opt)} />
              {opt}
            </label>
          ))}
        </fieldset>
      )}

      {submitError && (
        <p role="alert" className="rounded-card border-l-4 border-clay bg-clay/5 p-3 text-sm text-clay">
          {submitError}
        </p>
      )}

      <div className="flex flex-wrap justify-between gap-2">
        <Button type="button" variant="ghost" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
          Voltar
        </Button>
        {!isLast ? (
          <Button type="button" onClick={() => setIndex((i) => i + 1)}>
            Seguinte
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmitTest} disabled={submitting}>
            {submitting ? "A calcular resultado..." : "Terminar teste"}
          </Button>
        )}
      </div>
    </div>
  );
}
