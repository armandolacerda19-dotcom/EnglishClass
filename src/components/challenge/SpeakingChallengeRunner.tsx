"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { submitSpeakingChallenge } from "@/app/(app)/practice/speaking-challenge/actions";
import { PILLAR_ACCENT } from "@/lib/pillarDisplay";
import type { SpeakingChallengeItem } from "@/content/speakingChallenges";
import type { SpeakingChallengeResult } from "@/lib/ai/gradeSpeakingChallenge";

const accent = PILLAR_ACCENT.SPEAKING!;

// Desafio de Discurso Livre — diferente de RecordButton.tsx e
// ReadAloudRunner.tsx: aqueles usam `continuous = false` (para uma frase
// única, o SpeechRecognition para sozinho após uma pausa). Aqui o utilizador
// tem de falar 45-90s sem guião, por isso `continuous = true` +
// `interimResults = true`, acumulando os segmentos "final" em vez de
// substituir o transcrito a cada pausa — sem isto, uma pausa natural para
// respirar a meio da fala cortaria a gravação como se tivesse terminado.
export function SpeakingChallengeRunner({ item }: { item: SpeakingChallengeItem }) {
  const [recording, setRecording] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [recordError, setRecordError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<SpeakingChallengeResult | null>(null);

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef("");
  const startRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Ref em vez de ler `recording` (state) dentro de `onend` — o handler é
  // atribuído uma vez dentro de startRecording(), fechando sobre o valor de
  // `recording` NESSE momento (sempre `false`, porque setRecording(true) só
  // corre depois); sem o ref, o auto-restart abaixo nunca dispararia.
  const recordingRef = useRef(false);

  useEffect(() => {
    return () => {
      recordingRef.current = false;
      recognitionRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startRecording() {
    setRecordError(null);
    setLiveTranscript("");
    finalTranscriptRef.current = "";
    const SpeechRecognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecordError("O seu browser não suporta reconhecimento de voz. Experimente Chrome ou Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i];
        if (chunk.isFinal) {
          finalTranscriptRef.current += (finalTranscriptRef.current ? " " : "") + chunk[0].transcript.trim();
        } else {
          interim += chunk[0].transcript;
        }
      }
      setLiveTranscript((finalTranscriptRef.current + " " + interim).trim());
    };
    recognition.onerror = (event: any) => {
      // "no-speech" dispara sozinho em silêncios longos com continuous=true —
      // não é um erro real, o reconhecimento reinicia-se automaticamente no
      // Chrome; só mostramos erro para falhas genuínas (ex. microfone negado).
      if (event.error === "no-speech") return;
      setRecordError("Não foi possível reconhecer a fala. Verifique as permissões do microfone e tente novamente.");
      stopRecording();
    };
    recognition.onend = () => {
      // Chrome termina `continuous` sozinho após ~60s de silêncio total em
      // alguns casos — se o utilizador ainda não carregou em "Parar", volta a
      // arrancar para não cortar a gravação a meio de um discurso longo.
      if (recordingRef.current) {
        try {
          recognition.start();
        } catch {
          recordingRef.current = false;
          setRecording(false);
        }
      }
    };

    recognitionRef.current = recognition;
    startRef.current = Date.now();
    recognition.start();
    recordingRef.current = true;
    setRecording(true);
    setElapsedMs(0);
    timerRef.current = setInterval(() => {
      if (startRef.current) setElapsedMs(Date.now() - startRef.current);
    }, 500);
  }

  function stopRecording() {
    recordingRef.current = false;
    setRecording(false);
    recognitionRef.current?.stop();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function submit() {
    const transcript = finalTranscriptRef.current.trim();
    if (!transcript) return;
    const durationMs = startRef.current ? Date.now() - startRef.current : null;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitSpeakingChallenge(item.id, transcript, durationMs);
      setResult(res);
    } catch {
      setSubmitError("Não foi possível avaliar a gravação — verifique a ligação e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  const seconds = Math.floor(elapsedMs / 1000);
  const targetReached = seconds >= item.suggestedSeconds;

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <p className={`mb-1 font-mono text-xs uppercase tracking-widest ${accent.text}`}>Desafio de Discurso Livre · {item.level}</p>
      <p className="mb-1 font-display text-xl">{item.prompt}</p>
      <p className="mb-6 text-xs italic text-inkNeutral/60 dark:text-linen/60">{item.promptPt}</p>

      <Card className="mb-4">
        <p className="mb-3 text-sm text-inkNeutral/70 dark:text-linen/70">
          Fale sem guião durante cerca de {item.suggestedSeconds} segundos. Não leia nem repita — explique as suas próprias ideias.
        </p>

        {!result && (
          <>
            <div className="mb-3 flex items-center gap-3">
              <Button type="button" variant={recording ? "secondary" : "primary"} onClick={recording ? stopRecording : startRecording} disabled={submitting}>
                {recording ? "Parar gravação" : "Começar a falar"}
              </Button>
              {(recording || elapsedMs > 0) && (
                <span className={`font-mono text-sm ${targetReached ? "text-verdigris" : "text-inkNeutral/60 dark:text-linen/60"}`}>
                  {seconds}s {targetReached && "✓"}
                </span>
              )}
            </div>

            {recordError && <p className="mb-2 text-sm text-clay">{recordError}</p>}

            {liveTranscript && (
              <p className="rounded-lg bg-ink/5 p-3 text-sm italic text-inkNeutral/70 dark:bg-linen/5 dark:text-linen/70">
                {liveTranscript}
              </p>
            )}

            {!recording && finalTranscriptRef.current && (
              <div className="mt-3 flex justify-end">
                <Button onClick={submit} disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Spinner /> A avaliar...
                    </span>
                  ) : (
                    "Enviar"
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {submitError && (
          <p role="alert" className="mt-3 text-sm text-clay">
            {submitError}
          </p>
        )}
      </Card>

      {result && (
        <>
          <Card className="mb-4">
            <div className="flex flex-col gap-3">
              {[
                { label: "Gramática", value: result.grammarScore },
                { label: "Vocabulário", value: result.vocabularyScore },
                { label: "Coerência", value: result.coherenceScore },
                { label: "Fluência", value: result.fluencyScore },
              ].map((a) => (
                <div key={a.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{a.label}</span>
                    <span className="font-mono">{a.value}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-ink/10 dark:bg-linen/10">
                    <div className="h-1.5 rounded-full bg-verdigris" style={{ width: `${a.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {result.wordsPerMinute !== null && (
              <p className="mt-3 text-xs text-inkNeutral/60 dark:text-linen/60">
                Ritmo medido: {result.wordsPerMinute} palavras/minuto.
              </p>
            )}
          </Card>

          <Card className="mb-4">
            <p className="text-sm">{result.summary}</p>
          </Card>

          {result.corrections.length > 0 && (
            <Card className="mb-4 border-clay">
              <p className="mb-3 font-mono text-xs uppercase tracking-wide text-clay">Correções</p>
              <ul className="flex flex-col gap-4 text-sm">
                {result.corrections.map((c, i) => (
                  <li key={i}>
                    <p>❌ {c.original}</p>
                    <p className="text-inkNeutral/70 dark:text-linen/70">⚠️ {c.issue}</p>
                    <p className="text-verdigris">✅ {c.corrected}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Link href="/practice/speaking-challenge">
            <Button>Outro desafio</Button>
          </Link>
        </>
      )}
    </main>
  );
}
