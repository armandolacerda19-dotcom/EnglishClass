"use client";

import { useEffect, useState } from "react";
import { useEnglishVariant } from "./EnglishVariantContext";
import { loadVoices, englishVoices, getPreferredVoiceName } from "@/lib/voicePreference";

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

// Nomes de voz conhecidos por soarem melhor do que a voz robótica por
// omissão de cada SO. "natural|neural|online" cobre as vozes "Online
// (Natural)" do Windows/Edge; "google" cobre as vozes do Chrome/ChromeOS/
// Android ("Google US English", "Google UK English Female"), que não têm
// nenhuma dessas palavras no nome mas são visivelmente melhores do que o
// motor `espeak` por omissão do Linux/Android — antes ficavam de fora do
// critério de qualidade e nunca eram preferidas.
const QUALITY_VOICE_RE = /natural|neural|online|google/i;

// Substituto de listening sem ficheiros de áudio gravados (que ainda não existem —
// ver docs/decisions.md): sintetiza o transcript no browser via Web Speech API.
// Não mostra o texto ao utilizador — só o lê em voz alta, como um ficheiro de áudio.
// `defaultSpeed`: opcional, aditivo — usado pela progressão de dificuldade de
// Ouvir e Escolher (Exercise Engine, 2026-08-28): Iniciante começa a 0.75x
// (lento e claro), Intermédio a 1x (velocidade natural), Avançado a 1x sem
// desaceleração disponível como "ajuda por omissão" (o utilizador ainda pode
// mudar manualmente). Nenhuma chamada existente passa isto, por isso o
// comportamento delas não muda.
export function PlayTranscript({ text, defaultSpeed = 1 }: { text: string; defaultSpeed?: number }) {
  const [speed, setSpeed] = useState(defaultSpeed);
  const [playing, setPlaying] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const variant = useEnglishVariant();

  // Pré-carrega a lista de vozes assim que o componente monta, em vez de só
  // no clique — `getVoices()` costuma devolver [] antes de `voiceschanged`
  // disparar (ver lib/voicePreference.ts), o que fazia o primeiro "Ouvir" de
  // cada sessão cair sempre na voz por omissão do browser, ignorando o
  // sotaque escolhido no onboarding e qualquer preferência de voz guardada.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    let cancelled = false;
    loadVoices().then((v) => {
      if (!cancelled) setVoices(englishVoices(v));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Item #8 da lista de melhorias (listening mais natural): a voz por defeito do
  // browser costuma ser a mais robótica das disponíveis. Preferimos explicitamente
  // uma voz "Natural"/"Neural"/online/Google quando o browser expõe uma — sem
  // isso, cai na voz por defeito do browser como sempre fez.
  //
  // Desde a Fase 9, também respeita `englishVariant` (LearningProfile, escolhido
  // no onboarding). Desde esta ronda, respeita primeiro uma preferência de voz
  // explícita guardada pelo utilizador em Definições (ver
  // VoicePreferenceSettings.tsx) — nenhuma heurística automática acerta sempre
  // qual voz soa melhor num dado browser/SO, por isso a escolha final fica
  // disponível para o próprio utilizador decidir.
  function pickVoice(): SpeechSynthesisVoice | null {
    if (voices.length === 0) return null;

    const preferredName = getPreferredVoiceName();
    if (preferredName) {
      const exact = voices.find((v) => v.name === preferredName);
      if (exact) return exact;
    }

    const langPrefixes = VARIANT_LANG_PREFERENCE[variant] ?? [];
    const matchesVariant = (v: SpeechSynthesisVoice) =>
      langPrefixes.some((prefix) => v.lang.toLowerCase().startsWith(prefix));

    // 1ª escolha: voz de qualidade QUE também corresponda ao sotaque pedido.
    const qualityMatch = voices.find((v) => matchesVariant(v) && QUALITY_VOICE_RE.test(v.name));
    if (qualityMatch) return qualityMatch;

    // 2ª escolha: qualquer voz do sotaque pedido, mesmo que não seja de qualidade superior.
    const anyMatch = voices.find(matchesVariant);
    if (anyMatch) return anyMatch;

    // Sem correspondência (sotaque não instalado neste browser, ou INTERNATIONAL
    // sem preferência): cai no comportamento anterior — qualquer voz de
    // qualidade, ou en-US, ou a primeira disponível.
    const anyQuality = voices.find((v) => QUALITY_VOICE_RE.test(v.name));
    return anyQuality ?? voices.find((v) => v.lang.toLowerCase() === "en-us") ?? voices[0]!;
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
