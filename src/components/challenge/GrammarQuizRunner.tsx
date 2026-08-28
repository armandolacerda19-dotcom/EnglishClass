"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { StampBadge } from "@/components/ui/StampBadge";
import { Spinner } from "@/components/ui/Spinner";
import { ExerciseShell, ExerciseComplete } from "@/components/exercise/ExerciseShell";
import { submitGrammarChallenge, submitGrammarApply } from "@/app/(app)/practice/grammar-quiz/actions";
import type { GrammarTopicDetail } from "@/lib/grammarQuiz";
import type { GradingResult } from "@/lib/exercise/types";
import type { GrammarApplyResult } from "@/lib/ai/gradeGrammarApply";

type Phase = "challenge" | "apply" | "done";

// Quiz de Gramática por Tema — Challenge (mesmos exercícios reais do tópico,
// sem a regra mostrada, sem 4 opções — só 2, força decisão real) seguido de
// Apply (escrever uma frase a usar a estrutura, avaliado pela IA).
export function GrammarQuizRunner({ topic }: { topic: GrammarTopicDetail }) {
  const [phase, setPhase] = useState<Phase>(topic.questions.length > 0 ? "challenge" : "apply");
  const [index, setIndex] = useState(0);
  const [given, setGiven] = useState("");
  const [result, setResult] = useState<GradingResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [applyText, setApplyText] = useState("");
  const [applyResult, setApplyResult] = useState<GrammarApplyResult | null>(null);

  const question = topic.questions[index];
  const isLastQuestion = index === topic.questions.length - 1;

  async function checkChallenge(value: string) {
    if (!question || result) return;
    setChecking(true);
    setSubmitError(null);
    try {
      const res = await submitGrammarChallenge(question.exerciseId, value);
      setResult(res);
      if (res.isCorrect) setCorrectCount((c) => c + 1);
    } catch {
      setSubmitError("Não foi possível verificar a resposta — verifique a ligação e tente novamente.");
    } finally {
      setChecking(false);
    }
  }

  function advanceChallenge() {
    if (isLastQuestion) {
      setPhase("apply");
    } else {
      setIndex((i) => i + 1);
      setGiven("");
      setResult(null);
    }
  }

  async function checkApply() {
    if (!applyText.trim()) return;
    setChecking(true);
    setSubmitError(null);
    try {
      const res = await submitGrammarApply(topic.id, applyText);
      setApplyResult(res);
    } catch {
      setSubmitError("Não foi possível verificar a frase — verifique a ligação e tente novamente.");
    } finally {
      setChecking(false);
    }
  }

  if (phase === "done") {
    return (
      <ExerciseComplete
        badge={<StampBadge code={topic.questions.length > 0 ? `${correctCount}/${topic.questions.length}` : "✓"} tone="verdigris" />}
        title={`${topic.title} concluído!`}
      >
        <div className="flex flex-wrap gap-2">
          <Link href="/practice/grammar-quiz">
            <Button variant="secondary">Outro tema</Button>
          </Link>
          <Link href="/home">
            <Button>Voltar à Home</Button>
          </Link>
        </div>
      </ExerciseComplete>
    );
  }

  if (phase === "apply") {
    return (
      <ExerciseShell
        label={`${topic.title} · Apply`}
        current={topic.questions.length + 1}
        total={topic.questions.length + 1}
        submitError={submitError}
        footer={
          !applyResult ? (
            <Button onClick={checkApply} disabled={!applyText.trim() || checking}>
              {checking ? (
                <span className="flex items-center gap-2">
                  <Spinner /> A verificar...
                </span>
              ) : (
                "Verificar"
              )}
            </Button>
          ) : (
            <Button onClick={() => setPhase("done")}>Terminar</Button>
          )
        }
      >
        <p className="mb-2 text-sm text-inkNeutral/70 dark:text-linen/70">
          Escreva uma frase sua que use "{topic.title}".
        </p>
        <p className="mb-4 text-xs text-inkNeutral/50 dark:text-linen/50">{topic.realWorldExample}</p>
        <TextField value={applyText} onChange={(e) => setApplyText(e.target.value)} disabled={!!applyResult} placeholder="Write your own sentence..." />
        {applyResult && (
          <div role="status" aria-live="polite" className="mt-4 border-t border-ink/10 pt-4 dark:border-linen/10">
            <p className={`text-sm ${applyResult.usesStructure ? "text-verdigris" : "text-clay"}`}>
              {applyResult.usesStructure ? "Usou a estrutura corretamente!" : "Ainda não usou a estrutura pedida."}
            </p>
            <p className="mt-1 text-xs text-inkNeutral/60 dark:text-linen/60">{applyResult.tip}</p>
          </div>
        )}
      </ExerciseShell>
    );
  }

  if (!question) return null;

  return (
    <ExerciseShell
      label={`${topic.title} · Challenge`}
      current={index + 1}
      total={topic.questions.length + 1}
      submitError={submitError}
      footer={
        result && (
          <Button onClick={advanceChallenge}>{isLastQuestion ? "Ir para Apply" : "Seguinte"}</Button>
        )
      }
    >
      <p className="mb-4 text-lg">{question.prompt}</p>

      {question.kind === "choice" ? (
        <fieldset className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setGiven(opt);
                checkChallenge(opt);
              }}
              disabled={!!result || checking}
              className={`rounded-control border p-3 text-left text-sm ${
                result && given === opt
                  ? result.isCorrect
                    ? "border-verdigris bg-verdigris/10 text-verdigris"
                    : "border-clay bg-clay/10 text-clay"
                  : "border-ink/10 hover:border-verdigris dark:border-linen/10"
              }`}
            >
              {opt}
            </button>
          ))}
        </fieldset>
      ) : (
        <div className="flex flex-col gap-3">
          <TextField value={given} onChange={(e) => setGiven(e.target.value)} disabled={!!result} placeholder="Type your answer..." />
          {!result && (
            <div className="flex justify-end">
              <Button onClick={() => checkChallenge(given)} disabled={!given.trim() || checking}>
                Verificar
              </Button>
            </div>
          )}
        </div>
      )}

      {result && !result.isCorrect && result.correctAnswer && (
        <p className="mt-3 text-sm">
          Resposta certa: <span className="font-semibold">{result.correctAnswer}</span>
        </p>
      )}
    </ExerciseShell>
  );
}
