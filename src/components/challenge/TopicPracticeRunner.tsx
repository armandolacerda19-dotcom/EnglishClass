"use client";

import { useState } from "react";
import Link from "next/link";
import type { Pillar } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { StampBadge } from "@/components/ui/StampBadge";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { Spinner } from "@/components/ui/Spinner";
import { ExerciseShell, ExerciseComplete } from "@/components/exercise/ExerciseShell";
import { submitTopicPractice, type TopicPracticeAnswer, type TopicPracticeResult } from "@/app/(app)/practice/topic/actions";
import { checkFreeTextAnswer, checkChoiceAnswer } from "@/app/(app)/practice/checkAnswer";
import type { PracticeQuestion } from "@/lib/practiceQuestions";
import { PILLAR_LABEL, PILLAR_ACCENT, DEFAULT_ACCENT } from "@/lib/pillarDisplay";

interface TopicPracticeRunnerProps {
  pillar: Pillar;
  questions: PracticeQuestion[];
}

interface CheckResult {
  isCorrect: boolean;
  referenceAnswer: string;
}

// Migrado para ExerciseShell/ExerciseComplete (5ª auditoria, Fase 2 do
// roteiro visual, 2026-09-02) — décimo primeiro dos ~20 Runners antigos. Já
// tinha um sistema de cor por pilar bem feito; zero mudança de
// lógica/estado, só de apresentação.
export function TopicPracticeRunner({ pillar, questions }: TopicPracticeRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [answers, setAnswers] = useState<TopicPracticeAnswer[]>([]);
  const [result, setResult] = useState<TopicPracticeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const question = questions[index]!;
  const isLast = index === questions.length - 1;
  const given = question.kind === "text" ? textAnswer : selected;
  const accent = PILLAR_ACCENT[pillar] ?? DEFAULT_ACCENT;

  // Escolha múltipla e texto livre (tradução) corrigem os dois no servidor —
  // ver checkAnswer.ts/gradeAnswer.ts.
  //
  // Fase 16 (auditoria 2026-08-28, achado S4): a correção de escolha múltipla
  // era feita localmente contra `question.correctAnswers`, campo que ia
  // embutido no payload de TODAS as perguntas da sheet — dava para ler as
  // respostas certas antes de responder a qualquer uma. Passou a round-trip
  // ao servidor, tal como o texto livre já era.
  async function check() {
    if (!given) return;
    setChecking(true);
    setSubmitError(null);
    try {
      const res = question.kind === "choice" ? await checkChoiceAnswer(question.exerciseId, given) : await checkFreeTextAnswer(question.exerciseId, given);
      setCheckResult(res);
    } catch {
      setSubmitError("Não foi possível verificar a resposta — verifique a ligação e tente novamente.");
    } finally {
      setChecking(false);
    }
  }

  async function advance() {
    if (!checkResult) return;
    // Envia a resposta em bruto, não o veredito — a correção que conta é a do
    // servidor (ver gradeSubmission.ts).
    const nextAnswers: TopicPracticeAnswer[] = [
      ...answers,
      { exerciseId: question.exerciseId, given: given ?? "" },
    ];
    setAnswers(nextAnswers);

    if (isLast) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await submitTopicPractice(pillar, nextAnswers);
        setResult(res);
      } catch {
        setSubmitError("Não foi possível terminar a sessão — verifique a ligação e tente novamente.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setTextAnswer("");
      setCheckResult(null);
    }
  }

  if (result) {
    return (
      <ExerciseComplete badge={<StampBadge code={`${result.correct}/${result.total}`} tone="brass" />} title="Sessão concluída!">
        <p className="mb-4 text-center text-sm text-inkNeutral/70 dark:text-linen/70">
          {PILLAR_LABEL[pillar] ?? pillar.toLowerCase()} — pode repetir quando quiser, com perguntas novas.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/practice/topic">
            <Button variant="secondary">Outro tema</Button>
          </Link>
          <Link href="/home">
            <Button>Voltar à Home</Button>
          </Link>
        </div>
      </ExerciseComplete>
    );
  }

  return (
    <ExerciseShell
      label={`${PILLAR_LABEL[pillar] ?? pillar.toLowerCase()}`}
      current={index + 1}
      total={questions.length}
      accentClass={accent.bg}
      labelAccentClass={accent.text}
      submitError={submitError}
      footer={
        !checkResult ? (
          <Button onClick={check} disabled={!given || checking}>
            {checking ? (
              <span className="flex items-center gap-2">
                <Spinner /> A verificar...
              </span>
            ) : (
              "Verificar"
            )}
          </Button>
        ) : (
          <Button onClick={advance} disabled={submitting}>
            {isLast ? "Terminar" : "Seguinte"}
          </Button>
        )
      }
    >
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
                disabled={!!checkResult}
              />
              {opt}
            </label>
          ))}
        </fieldset>
      ) : (
        <TextAreaField
          rows={2}
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          disabled={!!checkResult}
          placeholder="Escreva a sua resposta..."
        />
      )}

      {checkResult && (
        <p role="status" aria-live="polite" className={`mt-3 text-sm ${checkResult.isCorrect ? accent.text : "text-clay"}`}>
          {checkResult.isCorrect ? "Correto." : `Incorreto. Resposta certa: ${checkResult.referenceAnswer}`}
        </p>
      )}
    </ExerciseShell>
  );
}
