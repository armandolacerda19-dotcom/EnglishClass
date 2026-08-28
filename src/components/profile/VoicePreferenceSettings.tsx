"use client";

import { useEffect, useState } from "react";
import { loadVoices, englishVoices, getPreferredVoiceName, setPreferredVoiceName } from "@/lib/voicePreference";

// Reforço de "áudio real" a custo zero (pedido do utilizador, 2026-08-28):
// não há orçamento para vozes gravadas pagas (Azure/ElevenLabs), mas a
// qualidade das vozes já instaladas no browser/SO varia muito e nenhuma
// heurística automática (PlayTranscript.tsx) acerta sempre qual soa melhor
// num dado aparelho — por isso o próprio utilizador escolhe aqui. Fica em
// localStorage, não no perfil da BD: uma voz escolhida no telemóvel pode
// simplesmente não existir no portátil.
export function VoicePreferenceSettings() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selected, setSelected] = useState("");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    setSelected(getPreferredVoiceName() ?? "");
    let cancelled = false;
    loadVoices().then((v) => {
      if (!cancelled) setVoices(englishVoices(v));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(name: string) {
    setSelected(name);
    setPreferredVoiceName(name || null);
  }

  function preview(name: string) {
    if (!name) return;
    const voice = voices.find((v) => v.name === name);
    if (!voice) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("This is what this voice sounds like.");
    utterance.voice = voice;
    utterance.lang = voice.lang;
    window.speechSynthesis.speak(utterance);
  }

  if (!supported) return null;

  return (
    <div>
      <p className="font-display text-base">Voz do áudio</p>
      <p className="mb-2 text-xs text-inkNeutral/60 dark:text-linen/60">
        As vozes disponíveis dependem do seu aparelho — escolha a que soar melhor. "Automático" deixa a app escolher a mais natural para o sotaque das Definições de onboarding.
      </p>
      {voices.length === 0 ? (
        <p className="text-xs text-inkNeutral/50 dark:text-linen/50">A carregar vozes disponíveis...</p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selected}
            onChange={(e) => handleChange(e.target.value)}
            className="rounded-control border-2 border-ink/15 bg-white/80 px-3 py-2 text-sm dark:border-linen/15 dark:bg-white/5"
          >
            <option value="">Automático</option>
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
          {selected && (
            <button
              type="button"
              onClick={() => preview(selected)}
              className="rounded-control border border-ink/10 px-3 py-2 text-xs hover:border-verdigris dark:border-linen/10"
            >
              ▶ Testar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
