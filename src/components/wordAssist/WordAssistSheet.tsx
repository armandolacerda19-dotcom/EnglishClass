"use client";

import { useEffect, useState } from "react";
import type { CefrLevel } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { GuessAttempt } from "./GuessAttempt";
import { lookupWordAction, recordGuessAction } from "@/app/(app)/word-assist/actions";
import type { WordLookupResult } from "@/lib/wordAssist/lookupWord";

type Step = "loading" | "ask" | "guessing" | "revealed";

// Progressão pedagógica por nível (pedido original: iniciante vê PT primeiro,
// avançado vê EN primeiro) — só decide ORDEM de apresentação, os dados já
// vêm todos na mesma resposta de lookupWordAction.
function helpTier(cefrLevel?: CefrLevel): "beginner" | "intermediate" | "advanced" {
  if (!cefrLevel || cefrLevel === "PRE_A1" || cefrLevel === "A1") return "beginner";
  if (cefrLevel === "A2" || cefrLevel === "B1") return "intermediate";
  return "advanced";
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}

// Painel do Smart Word Assist — em mobile ocupa a largura toda, ancorado ao
// fundo (bottom sheet); em desktop fica centrado como um pequeno modal. Não
// é um popover ancorado à palavra (o pedido original menciona hover em
// desktop) — simplificação deliberada da Fase 1: um único componente para os
// dois tamanhos de ecrã, sem lógica de posicionamento/deteção de borda de
// viewport, documentada em docs/decisions.md.
export function WordAssistSheet({
  word,
  sentence,
  cefrLevel,
  onClose,
}: {
  word: string;
  sentence: string;
  cefrLevel?: CefrLevel;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("loading");
  const [result, setResult] = useState<WordLookupResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    lookupWordAction(word, sentence).then((r) => {
      if (cancelled) return;
      setResult(r);
      setStep("ask");
    });
    return () => {
      cancelled = true;
    };
  }, [word, sentence]);

  function handleGuessDone(correct: boolean) {
    if (result) void recordGuessAction(result.headword, result.vocabularyItemId, correct);
    setStep("revealed");
  }

  const tier = helpTier(cefrLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-[1px] dark:bg-black/60"
      />
      <div className="relative z-10 w-full max-w-sm rounded-t-card border border-ink/10 bg-white p-6 shadow-lift dark:border-linen/10 dark:bg-inkNeutral sm:rounded-card">
        <div className="mb-4 flex items-start justify-between gap-2">
          <p className="font-display text-xl">{word}</p>
          <button onClick={onClose} aria-label="Fechar" className="text-inkNeutral/50 hover:text-inkNeutral dark:text-linen/50 dark:hover:text-linen">
            ✕
          </button>
        </div>

        {step === "loading" && (
          <div className="flex items-center gap-2 py-6 text-sm text-inkNeutral/60 dark:text-linen/60">
            <Spinner /> A procurar...
          </div>
        )}

        {step === "ask" && result && (
          <div className="flex flex-col gap-3">
            <p className="text-base">Consegue descobrir o significado?</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setStep("guessing")}>Tentar adivinhar</Button>
              <Button variant="secondary" onClick={() => setStep("revealed")}>
                Ver significado
              </Button>
              <Button variant="ghost" onClick={() => speak(result.headword)}>
                🔊 Ouvir
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Ignorar
              </Button>
            </div>
          </div>
        )}

        {step === "guessing" && result && <GuessAttempt meaningPt={result.meaningPt} onDone={handleGuessDone} />}

        {step === "revealed" && result && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => speak(result.headword)}
                aria-label="Ouvir pronúncia"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verdigris/10 text-verdigris"
              >
                🔊
              </button>
              {result.ipa && <span className="font-mono text-sm text-inkNeutral/60 dark:text-linen/60">/{result.ipa}/</span>}
            </div>

            {tier === "beginner" ? (
              <>
                <p className="text-lg font-semibold text-verdigris">🇵🇹 {result.meaningPt}</p>
                {result.definitionEn && <p className="text-sm text-inkNeutral/70 dark:text-linen/70">{result.definitionEn}</p>}
              </>
            ) : (
              <>
                {result.definitionEn && <p className="text-base">🇬🇧 {result.definitionEn}</p>}
                <p className={tier === "advanced" ? "text-sm text-inkNeutral/60 dark:text-linen/60" : "text-base font-semibold text-verdigris"}>
                  🇵🇹 {result.meaningPt}
                </p>
              </>
            )}

            {result.exampleSentence && <p className="text-sm italic text-inkNeutral/70 dark:text-linen/70">"{result.exampleSentence}"</p>}

            <Button variant="secondary" onClick={onClose}>
              Continuar a ler
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
