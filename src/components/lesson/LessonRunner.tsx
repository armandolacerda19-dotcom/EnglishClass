"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorCallout } from "@/components/ui/ErrorCallout";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { RecordButton } from "@/components/ui/RecordButton";
import { StampBadge } from "@/components/ui/StampBadge";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { Spinner } from "@/components/ui/Spinner";
import {
  submitExerciseAnswer,
  submitWriting,
  submitSpeaking,
  submitTranslation,
  completeLesson,
} from "@/app/(app)/learn/actions";

interface LessonStep {
  type: string;
  content_ref?: string;
  content?: string;
  prompt?: string;
  exercise_ids?: string[];
  vocabulary_ids?: string[];
}

interface ExerciseContent {
  id: string;
  prompt: string;
  correct_answer: string[];
  distractors: string[];
  explanation: string;
  common_mistake_pt: string | null;
  audio_url: string | null;
  transcript?: string;
}

interface VocabularyItem {
  id: string;
  headword: string;
  translationPt: string;
  definitionEn: string;
  exampleSentences: string[];
  audioUrl: string | null;
}

interface GrammarConcept {
  id: string;
  title: string;
  rule: string;
  simpleExplanation: string;
  example: string;
  exampleTranslation: string;
  commonMistakePt: string;
  correction: string;
  realWorldExample: string;
}

interface LessonRunnerProps {
  userId: string;
  lesson: { id: string; title: string; steps: LessonStep[]; sublevelCode: string };
  exercises: ExerciseContent[];
  vocabulary: VocabularyItem[];
  grammarConcept: GrammarConcept | null;
  immersionMode: boolean;
}

// Modo Imersão (#12 da lista de melhorias) — esconde a tradução PT atrás de um
// botão de revelar, em vez de a mostrar sempre. Ligado/desligado em
// /profile/settings, persistido em LearningProfile.immersionMode.
function RevealPt({ text, immersionMode, className = "" }: { text: string; immersionMode: boolean; className?: string }) {
  const [revealed, setRevealed] = useState(false);
  if (!immersionMode) return <p className={className}>{text}</p>;
  if (revealed) return <p className={className}>{text}</p>;
  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className="text-xs font-mono uppercase tracking-wide text-verdigris underline"
    >
      Mostrar tradução
    </button>
  );
}

export function LessonRunner({ lesson, exercises, vocabulary, grammarConcept, immersionMode }: LessonRunnerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const isLast = stepIndex === lesson.steps.length - 1;
  const done = stepIndex >= lesson.steps.length;
  // Seguro: só acedido quando !done, ou seja, stepIndex < lesson.steps.length.
  const step = lesson.steps[stepIndex]!;

  function next() {
    setStepIndex((i) => i + 1);
  }

  const exerciseById = Object.fromEntries(exercises.map((e) => [e.id, e]));

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-verdigris">{lesson.title}</p>
      <div className="mb-6 h-1 w-full rounded-full bg-ink/10 dark:bg-linen/10">
        <div
          className="h-1 rounded-full bg-verdigris transition-[width]"
          style={{ width: `${(Math.min(stepIndex, lesson.steps.length) / lesson.steps.length) * 100}%` }}
        />
      </div>

      {done ? (
        <LessonComplete lessonId={lesson.id} sublevelCode={lesson.sublevelCode} />
      ) : (
        <div className="flex flex-col gap-4">
          {step.type === "rule" && grammarConcept && (
            <Card>
              <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Regra</p>
              <p className="mb-2 font-display text-lg">{grammarConcept.title}</p>
              <p className="text-sm">{grammarConcept.rule}</p>
              <p className="mt-2 text-sm text-inkNeutral/70 dark:text-linen/70">{grammarConcept.simpleExplanation}</p>
            </Card>
          )}

          {step.type === "example" && grammarConcept && (
            <Card>
              <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Exemplo</p>
              <p className="text-sm">{grammarConcept.example}</p>
              <div className="mt-1">
                <RevealPt
                  text={grammarConcept.exampleTranslation}
                  immersionMode={immersionMode}
                  className="text-sm italic text-inkNeutral/70 dark:text-linen/70"
                />
              </div>
            </Card>
          )}

          {step.type === "common_mistake" && grammarConcept && (
            <ErrorCallout>{grammarConcept.commonMistakePt}</ErrorCallout>
          )}

          {step.type === "vocabulary" && (
            <Card>
              <p className="mb-3 font-mono text-xs uppercase tracking-wide text-verdigris">Vocabulário</p>
              <ul className="flex flex-col gap-3">
                {vocabulary.map((v) => (
                  <li key={v.id}>
                    <p className="font-display text-base">{v.headword}</p>
                    {immersionMode ? (
                      <RevealPt
                        text={`${v.translationPt} — ${v.definitionEn}`}
                        immersionMode
                        className="text-sm text-inkNeutral/70 dark:text-linen/70"
                      />
                    ) : (
                      <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
                        {v.translationPt} — {v.definitionEn}
                      </p>
                    )}
                    {v.exampleSentences[0] && <p className="text-sm italic">"{v.exampleSentences[0]}"</p>}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {(step.type === "exercise" || step.type === "listening" || step.type === "reading") &&
            step.exercise_ids?.map((id) => {
              const exercise = exerciseById[id];
              return exercise ? <ExerciseStep key={id} exercise={exercise} /> : null;
            })}

          {step.type === "pronunciation" && (
            <Card>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-verdigris">Pronúncia</p>
              <p className="text-sm">{step.content}</p>
            </Card>
          )}

          {step.type === "speaking" && step.prompt && <SpeakingStep prompt={step.prompt} />}
          {step.type === "writing" && step.prompt && <WritingStep prompt={step.prompt} />}

          {step.type === "translation" &&
            step.exercise_ids?.map((id) => {
              const exercise = exerciseById[id];
              return exercise ? <TranslationStep key={id} exercise={exercise} /> : null;
            })}

          <div className="mt-4 flex justify-end">
            <Button onClick={next}>{isLast ? "Concluir lição" : "Seguinte"}</Button>
          </div>
        </div>
      )}
    </main>
  );
}

function ExerciseStep({ exercise }: { exercise: ExerciseContent }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const options = [...exercise.correct_answer, ...exercise.distractors].sort(() => 0.5 - Math.random());

  async function check() {
    if (!selected) return;
    const res = await submitExerciseAnswer(exercise.id, selected);
    setResult(res);
  }

  return (
    <Card>
      {exercise.transcript && <PlayTranscript text={exercise.transcript} />}
      <p className="mb-3 mt-2 text-sm">{exercise.prompt}</p>
      <fieldset className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 rounded-control border border-ink/10 p-2 text-sm">
            <input type="radio" name={exercise.id} checked={selected === opt} onChange={() => setSelected(opt)} disabled={!!result} />
            {opt}
          </label>
        ))}
      </fieldset>
      {!result ? (
        <Button className="mt-3" variant="secondary" onClick={check} disabled={!selected}>
          Verificar
        </Button>
      ) : (
        <p role="status" aria-live="polite" className={`mt-3 text-sm ${result.isCorrect ? "text-verdigris" : "text-clay"}`}>
          {result.isCorrect ? "Correto." : "Incorreto."} {result.explanation}
        </p>
      )}
    </Card>
  );
}

function SpeakingStep({ prompt }: { prompt: string }) {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Momento em que o prompt de speaking apareceu no ecrã — base para
  // SpeakingAttempt.responseTimeMs, campo que existia no schema desde a Fase 0
  // ("Automaticity Training / Quick Speak") mas nunca era escrito em lado
  // nenhum. Não implementa a feature completa de treino de automaticidade,
  // só começa a registar o dado bruto para essa feature poder ser construída
  // depois. Ver docs/decisions.md 2026-08-26 (auditoria).
  const promptShownAtRef = useRef(Date.now());

  async function handleTranscript(text: string) {
    setTranscript(text);
    setLoading(true);
    const responseTimeMs = Date.now() - promptShownAtRef.current;
    const feedbackText = await submitSpeaking(prompt, text, responseTimeMs);
    setFeedback(feedbackText);
    setLoading(false);
  }

  return (
    <Card>
      <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Speaking</p>
      <p className="mb-3 text-sm">{prompt}</p>
      <RecordButton onTranscript={handleTranscript} />
      {loading && (
        <p className="mt-2 flex items-center gap-2 text-sm text-inkNeutral/70 dark:text-linen/70">
          <Spinner /> A avaliar...
        </p>
      )}
      {transcript && <p className="mt-3 text-sm italic">"{transcript}"</p>}
      {feedback && <p className="mt-2 rounded-card bg-verdigris/5 p-3 text-sm">{feedback}</p>}
    </Card>
  );
}

function WritingStep({ prompt }: { prompt: string }) {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const feedbackText = await submitWriting(prompt, text);
    setFeedback(feedbackText);
    setLoading(false);
  }

  return (
    <Card>
      <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Writing</p>
      <p className="mb-3 text-sm">{prompt}</p>
      <TextAreaField rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva a sua resposta em inglês..." />
      <Button className="mt-3" variant="secondary" onClick={handleSubmit} disabled={loading || !text.trim()}>
        {loading ? (
          <span className="flex items-center gap-2">
            <Spinner /> A avaliar...
          </span>
        ) : (
          "Submeter"
        )}
      </Button>
      {feedback && <p className="mt-2 rounded-card bg-verdigris/5 p-3 text-sm">{feedback}</p>}
    </Card>
  );
}

function TranslationStep({ exercise }: { exercise: ExerciseContent }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ feedback: string; referenceAnswer: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const res = await submitTranslation(exercise.id, text);
    setResult(res);
    setLoading(false);
  }

  return (
    <Card>
      <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Translation</p>
      <p className="mb-3 text-sm">{exercise.prompt}</p>
      <TextAreaField rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva a tradução em inglês..." />
      <Button className="mt-3" variant="secondary" onClick={handleSubmit} disabled={loading || !text.trim()}>
        {loading ? (
          <span className="flex items-center gap-2">
            <Spinner /> A avaliar...
          </span>
        ) : (
          "Submeter"
        )}
      </Button>
      {result && (
        <div className="mt-2 flex flex-col gap-1">
          <p className="rounded-card bg-verdigris/5 p-3 text-sm">{result.feedback}</p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Sugestão: {result.referenceAnswer}</p>
        </div>
      )}
    </Card>
  );
}

function LessonComplete({ lessonId, sublevelCode }: { lessonId: string; sublevelCode: string }) {
  useEffect(() => {
    completeLesson(lessonId);
  }, [lessonId]);

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      {/* Antes mostrava sempre "A1.1", seja qual fosse a lição real. */}
      <StampBadge code={sublevelCode} tone="brass" />
      <h2 className="font-display text-xl">Lição concluída.</h2>
      <Link href="/home">
        <Button>Voltar à Home</Button>
      </Link>
    </div>
  );
}
