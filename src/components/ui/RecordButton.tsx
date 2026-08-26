"use client";

import { useRef, useState } from "react";
import { Button } from "./Button";

interface RecordButtonProps {
  onTranscript: (text: string) => void;
}

// Reconhecimento de voz via Web Speech API do browser — grátis, sem upload de
// áudio a nenhum servidor (troca da Whisper API paga, ver docs/decisions.md).
// Suporte sólido em Chrome/Edge; pode estar ausente noutros browsers.
export function RecordButton({ onTranscript }: RecordButtonProps) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  function start() {
    setError(null);
    const SpeechRecognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("O seu browser não suporta reconhecimento de voz. Experimente Chrome ou Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      onTranscript(transcript);
    };
    recognition.onerror = () => {
      setError("Não foi possível reconhecer a fala. Verifique as permissões do microfone e tente novamente.");
      setRecording(false);
    };
    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  }

  function stop() {
    recognitionRef.current?.stop();
    setRecording(false);
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        variant={recording ? "secondary" : "primary"}
        onClick={recording ? stop : start}
        aria-pressed={recording}
      >
        {recording ? "A ouvir... (clique para parar)" : "Gravar resposta"}
      </Button>
      {error && <p className="text-sm text-clay">{error}</p>}
    </div>
  );
}
