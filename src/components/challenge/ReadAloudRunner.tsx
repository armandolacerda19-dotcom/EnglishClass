"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StampBadge } from "@/components/ui/StampBadge";
import { ExerciseShell, ExerciseComplete } from "@/components/exercise/ExerciseShell";
import { submitReadAloud } from "@/app/(app)/practice/read-aloud/actions";
import type { ReadAloudItem } from "@/content/readAloud";
import type { ReadAloudAnalysis } from "@/lib/readAloud";

// Leitura em Voz Alta — não reaproveita RecordButton.tsx (não expõe duração
// de gravação) porque "fluência" aqui tem de vir de um tempo real medido, não
// de um número inventado — captura o próprio SpeechRecognition, cronometrado
// do clique de início ao fim do reconhecimento.
export function ReadAloudRunner({ items }: { items: ReadAloudItem[] }) {
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<ReadAloudAnalysis | null>(null);
  const [done, setDone] = useState(false);
  const [avgAccuracy, setAvgAccuracy] = useState<number[]>([]);
  const recognitionRef = useRef<any>(null);
  const startRef = useRef<number | null>(null);

  if (items.length === 0) {
    return (
      <ExerciseShell label="Leitura em Voz Alta" current={0} total={0}>
        <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Não há textos disponíveis de momento.</p>
      </ExerciseShell>
    );
  }

  const item = items[index]!;
  const isLast = index === items.length - 1;

  async function submit(transcript: string, durationMs: number | null) {
    setChecking(true);
    setSubmitError(null);
    try {
      const res = await submitReadAloud(item.id, transcript, durationMs);
      setResult(res);
      setAvgAccuracy((a) => [...a, res.accuracy]);
    } catch {
      setSubmitError("Não foi possível avaliar a leitura — verifique a ligação e tente novamente.");
    } finally {
      setChecking(false);
    }
  }

  function startRecording() {
    setRecordError(null);
    const SpeechRecognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecordError("O seu browser não suporta reconhecimento de voz. Experimente Chrome ou Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      const durationMs = startRef.current ? Date.now() - startRef.current : null;
      submit(transcript, durationMs);
    };
    recognition.onerror = () => {
      setRecordError("Não foi possível reconhecer a fala. Verifique as permissões do microfone e tente novamente.");
      setRecording(false);
    };
    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
    startRef.current = Date.now();
    recognition.start();
    setRecording(true);
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setRecording(false);
  }

  function advance() {
    if (!result) return;
    if (isLast) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setResult(null);
    }
  }

  if (done) {
    const overall = avgAccuracy.length > 0 ? Math.round(avgAccuracy.reduce((a, b) => a + b, 0) / avgAccuracy.length) : 0;
    return (
      <ExerciseComplete badge={<StampBadge code={`${overall}%`} tone="verdigris" />} title="Leitura em Voz Alta concluída!">
        <div className="flex flex-wrap gap-2">
          <Link href="/home">
            <Button>Voltar à Home</Button>
          </Link>
        </div>
      </ExerciseComplete>
    );
  }

  return (
    <ExerciseShell
      label={`Leitura em Voz Alta · ${item.level}`}
      current={index + 1}
      total={items.length}
      submitError={submitError}
      footer={result && <Button onClick={advance}>{isLast ? "Terminar" : "Seguinte"}</Button>}
    >
      <p className="mb-4 text-sm text-inkNeutral/70 dark:text-linen/70">Leia esta frase em voz alta.</p>
      <p className="mb-4 text-lg leading-relaxed">{item.text}</p>

      {!result && (
        <div className="flex flex-col items-start gap-2">
          <Button type="button" variant={recording ? "secondary" : "primary"} onClick={recording ? stopRecording : startRecording} disabled={checking}>
            {checking ? "A avaliar..." : recording ? "A ouvir... (clique para parar)" : "Gravar leitura"}
          </Button>
          {recordError && <p className="text-sm text-clay">{recordError}</p>}
        </div>
      )}

      {result && (
        <div role="status" aria-live="polite" className="mt-4 border-t border-ink/10 pt-4 dark:border-linen/10">
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Precisão</p>
              <p className="font-mono text-xl">{result.accuracy}%</p>
            </div>
            <div>
              <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Fluência (ritmo)</p>
              <p className="font-mono text-xl">{result.fluencyScore === null ? "—" : `${result.fluencyScore}%`}</p>
            </div>
          </div>

          <p className="mb-1 text-sm leading-relaxed">
            {result.diff.map((w, i) => (
              <span key={i} className={w.correct ? "text-verdigris" : "font-semibold text-clay underline"}>
                {w.word}{" "}
              </span>
            ))}
          </p>
          <p className="mt-2 text-xs italic text-inkNeutral/60 dark:text-linen/60">{item.translationPt}</p>
          <p className="mt-2 text-xs text-inkNeutral/50 dark:text-linen/50">
            Pronúncia: sem dados fonéticos reais — o reconhecimento de voz do browser não mede confiança por palavra,
            só transcreve o que ouviu.
          </p>
        </div>
      )}
    </ExerciseShell>
  );
}
