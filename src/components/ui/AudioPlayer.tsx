"use client";

import { useRef, useState } from "react";

const SPEEDS = [0.75, 1, 1.25];

// Reprodução de áudio de listening/shadowing com controlo de velocidade —
// requisito de acessibilidade (docs/09-sistema-design.md).
export function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [speed, setSpeed] = useState(1);

  function changeSpeed(next: number) {
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }

  return (
    <div className="flex items-center gap-3">
      <audio ref={audioRef} controls src={src} className="w-full" />
      <div className="flex gap-1">
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => changeSpeed(s)}
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
