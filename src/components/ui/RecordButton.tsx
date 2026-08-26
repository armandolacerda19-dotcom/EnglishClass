"use client";

import { useRef, useState } from "react";
import { Button } from "./Button";

interface RecordButtonProps {
  onRecorded: (blob: Blob) => void;
}

// Gravação básica via MediaRecorder — o blob resultante é enviado para
// /api/speaking/transcribe (Whisper API, ver docs/decisions.md).
export function RecordButton({ onRecorded }: RecordButtonProps) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecorded(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError("Não foi possível aceder ao microfone. Verifique as permissões do browser.");
    }
  }

  function stop() {
    mediaRecorderRef.current?.stop();
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
        {recording ? "Parar gravação" : "Gravar resposta"}
      </Button>
      {error && <p className="text-sm text-clay">{error}</p>}
    </div>
  );
}
