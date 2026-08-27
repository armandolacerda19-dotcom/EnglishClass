"use client";

import { useState } from "react";
import { useEnglishVariant } from "./EnglishVariantContext";

const SPEEDS = [0.75, 1, 1.25];

// Fase 9 (auditoria 2026-08-27) — sotaque preferido por locale BCP-47: cada
// browser/SO expõe as vozes instaladas com um `lang` diferente consoante a
// variante. Só mapeamos BRITISH/AMERICAN para os locales mais comuns
// (en-GB/en-US) — a app não oferece nenhuma outra opção no onboarding
// (`EnglishVariant` só tem BRITISH/AMERICAN/INTERNATIONAL), por isso não há
// "AUSTRALIAN"/"IRISH" a mapear. Nunca gera áudio novo, só escolhe entre as
// vozes que o próprio browser já tem instaladas.
const VARIANT_LANG_PREFERENCE: Record<string, string[]> = {
  BRITISH: ["en-gb"],
  AMERICAN: ["en-us"],
  INTERNATIONAL: [], // sem preferência de sotaque — só natural/neural, ver pickVoice
};

// Substituto de listening sem ficheiros de áudio gravados (que ainda não existem —
// ver docs/decisions.md): sintetiza o transcript no browser via Web Speech API.
// Não mostra o texto ao utilizador — só o lê em voz alta, como um ficheiro de áudio.
export function PlayTranscript({ text }: { text: string }) {
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const variant = useEnglishVariant();

  // Item #8 da lista de melhorias (listening mais natural): a voz por defeito do
  // browser costuma ser a mais robótica das disponíveis. Preferimos explicitamente
  // uma voz "Natural"/"Neural"/online quando o browser expõe uma (Edge e Chrome em
  // muitos SO já trazem vozes deste tipo) — sem isso, cai na voz por defeito do
  // browser como sempre fez.
  //
  // Desde a Fase 9, também respeita `englishVariant` (LearningProfile, escolhido
  // no onboarding) — antes esse campo existia, era usado no prompt do tutor de
  // IA, mas nunca chegava a influenciar qual voz de TTS era escolhida: todos os
  // utilizadores ouviam sempre a mesma voz americana, mesmo tendo pedido
  // explicitamente inglês britânico.
  function pickVoice(): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
    if (voices.length === 0) return null;

    const langPrefixes = VARIANT_LANG_PREFERENCE[variant] ?? [];
    const matchesVariant = (v: SpeechSynthesisVoice) =>
      langPrefixes.some((prefix) => v.lang.toLowerCase().startsWith(prefix));

    // 1ª escolha: voz natural/neural QUE também corresponda ao sotaque pedido.
    const naturalMatch = voices.find((v) => matchesVariant(v) && /natural|neural|online/i.test(v.name));
    if (naturalMatch) return naturalMatch;

    // 2ª escolha: qualquer voz do sotaque pedido, mesmo que não seja "natural".
    const anyMatch = voices.find(matchesVariant);
    if (anyMatch) return anyMatch;

    // Sem correspondência (sotaque não instalado neste browser, ou INTERNATIONAL
    // sem preferência): cai no comportamento anterior — qualquer voz natural, ou
    // en-US, ou a primeira disponível.
    const anyNatural = voices.find((v) => /natural|neural|online/i.test(v.name));
    return anyNatural ?? voices.find((v) => v.lang.toLowerCase() === "en-us") ?? voices[0]!;
  }

  function play() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setUnsupported(true);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    // O `lang` da utterance segue a voz escolhida quando há uma — só cai para
    // en-US fixo se não houver nenhuma voz inglesa disponível de todo.
    utterance.lang = voice?.lang ?? "en-US";
    utterance.rate = speed;
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
