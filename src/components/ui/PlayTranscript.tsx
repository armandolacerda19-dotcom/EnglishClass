"use client";

import { useState } from "react";

const SPEEDS = [0.75, 1, 1.25];

// Substituto de listening sem ficheiros de áudio gravados (que ainda não existem —
// ver docs/decisions.md): sintetiza o transcript no browser via Web Speech API.
// Não mostra o texto ao utilizador — só o lê em voz alta, como um ficheiro de áudio.
export function PlayTranscript({ text }: { text: string }) {
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  // Item #8 da lista de melhorias (listening mais natural): a voz por defeito do
  // browser costuma ser a mais robótica das disponíveis. Preferimos explicitamente
  // uma voz "Natural"/"Neural"/online quando o browser expõe uma (Edge e Chrome em
  // muitos SO já trazem vozes deste tipo) — sem isso, cai na voz por defeito do
  // browser como sempre fez.
  function pickVoice(): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
    if (voices.length === 0) return null;
    const preferred = voices.find((v) => /natural|neural|online/i.test(v.name));
    return preferred ?? voices.find((v) => v.lang === "en-US") ?? voices[0]!;
  }

  function play() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setUnsupported(true);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = speed;
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
  }

  if (unsupported) {
    return <p className="text-sm text-clay">O seu browser não suporta leitura de áudio por síntese de voz.</p>;
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={play}
        className="rounded-control bg-ink px-4 py-2 text-sm text-linen dark:bg-linen dark:text-ink"
      >
        {playing ? "A tocar..." : "▶ Ouvir"}
      </button>
      <div className="flex gap-1">
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSpeed(s)}
            aria-pressed={speed === s}
            className={`rounded-control px-2 py-1 font-mono text-xs ${
              speed === s ? "bg-ink text-linen dark:bg-linen dark:text-ink" : "bg-ink/5 dark:bg-linen/10"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
