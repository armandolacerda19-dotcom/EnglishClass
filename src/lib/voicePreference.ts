// Preferência de voz de TTS — device-specific de propósito (as vozes
// instaladas variam por browser/SO, uma voz escolhida no telemóvel pode não
// existir no portátil), por isso vive em localStorage, nunca no perfil da BD.
// Ver PlayTranscript.tsx (consumidor) e VoicePreferenceSettings.tsx (UI).

const STORAGE_KEY = "ip:voicePreferredName";

export function getPreferredVoiceName(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setPreferredVoiceName(name: string | null): void {
  try {
    if (name) window.localStorage.setItem(STORAGE_KEY, name);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage indisponível (privado/bloqueado) — preferência simplesmente não persiste.
  }
}

// `getVoices()` costuma devolver [] na primeira chamada — a lista carrega de
// forma assíncrona e só fica pronta quando `voiceschanged` dispara (Chrome é
// o caso mais comum). Sem isto, `PlayTranscript` picava a voz certa só a
// partir da 2ª reprodução em muitas sessões, ignorando silenciosamente o
// sotaque escolhido no onboarding e a preferência de voz na primeira vez.
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    const onChange = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", onChange);
    // Alguns browsers (Safari, sobretudo) nunca disparam `voiceschanged` —
    // sem timeout de segurança, a promessa ficava pendurada para sempre e o
    // primeiro "Ouvir" nunca tocava nada nesses casos.
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      resolve(window.speechSynthesis.getVoices());
    }, 1000);
  });
}

export function englishVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
}
