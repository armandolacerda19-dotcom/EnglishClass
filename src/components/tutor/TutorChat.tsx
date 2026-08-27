"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Spinner } from "@/components/ui/Spinner";
import { RecordButton } from "@/components/ui/RecordButton";
import { useEnglishVariant } from "@/components/ui/EnglishVariantContext";
import { TUTOR_PERSONALITIES, type TutorPersonalityKey } from "@/lib/ai/personalities";

// Mesma preferência de sotaque BRITISH/AMERICAN da Fase 9 (ver
// PlayTranscript.tsx), duplicada aqui em vez de extraída para um ficheiro
// partilhado: é uma função pequena e autocontida, e PlayTranscript já está
// verificado a funcionar — preferível a arriscar mexer nele sem build local
// para poupar ~10 linhas.
function speakWithVariant(text: string, variant: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
  const prefix = variant === "BRITISH" ? "en-gb" : variant === "AMERICAN" ? "en-us" : null;
  const matchesVariant = (v: SpeechSynthesisVoice) => (prefix ? v.lang.toLowerCase().startsWith(prefix) : false);
  const voice =
    voices.find((v) => matchesVariant(v) && /natural|neural|online/i.test(v.name)) ??
    voices.find(matchesVariant) ??
    voices.find((v) => /natural|neural|online/i.test(v.name)) ??
    voices.find((v) => v.lang.toLowerCase() === "en-us") ??
    voices[0];

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang ?? "en-US";
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

const GREETINGS: Record<TutorPersonalityKey, string> = {
  coach: "Hi! I'm your Coach. What would you like to practise today?",
  professor: "Good day. What grammar point would you like me to explain?",
  conversation_partner: "Hey! What's on your mind today? Let's just chat.",
  examiner: "We'll begin the assessment when you're ready.",
  interviewer: "Thanks for coming in. Let's start — can you tell me a bit about yourself?",
  native_friend: "Heeey! What's up? How's your day going?",
  roleplay: "Alright, let's set the scene! I'll stay in character — jump in whenever you're ready.",
};

export function TutorChat({
  personality = "coach",
  sessionFocus,
}: {
  personality?: TutorPersonalityKey;
  sessionFocus?: string;
}) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: GREETINGS[personality] },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const variant = useEnglishVariant();

  // try/catch + verificação de res.ok obrigatórios: sem eles, uma falha de rede
  // ou uma sessão expirada (o endpoint faz redirect) deixava o chat preso em
  // "está a escrever..." para sempre, sem mensagem nenhuma ao utilizador.
  async function send() {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: userMessage.text, personality, sessionFocus }),
      });
      if (!res.ok) throw new Error(`Tutor request failed: ${res.status}`);

      const data = await res.json();
      if (data.conversationId) setConversationId(data.conversationId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply ?? "Não recebi resposta. Tente novamente." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Não consegui responder agora — verifique a ligação e tente novamente." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto flex h-screen max-w-lg lg:max-w-2xl flex-col px-6 py-8">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-verdigris">
        {TUTOR_PERSONALITIES[personality].label}
      </p>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex max-w-[85%] items-start gap-2 rounded-card px-3 py-2 text-sm ${
              m.role === "user" ? "ml-auto bg-verdigris text-white" : "bg-ink/5 dark:bg-linen/10"
            }`}
          >
            <span className="flex-1">{m.text}</span>
            {m.role === "assistant" && (
              // Canal de voz do AI Tutor (Fase 10, auditoria 2026-08-27) — antes só
              // texto; ouvir a resposta ajuda quem está a treinar compreensão oral
              // sem depender de ler tudo. Botão discreto por mensagem em vez do
              // PlayTranscript completo (com controlo de velocidade) para não
              // sobrecarregar cada balão de chat — aqui o objetivo é só ouvir.
              <button
                type="button"
                onClick={() => speakWithVariant(m.text, variant)}
                aria-label="Ouvir esta mensagem"
                className="shrink-0 text-inkNeutral/50 hover:text-inkNeutral dark:text-linen/50 dark:hover:text-linen"
              >
                🔊
              </button>
            )}
          </div>
        ))}
        {sending && (
          <p className="flex items-center gap-2 text-sm text-inkNeutral/60 dark:text-linen/60">
            <Spinner /> {TUTOR_PERSONALITIES[personality].label} is typing...
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="mt-4 flex flex-wrap gap-2"
      >
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write in English..."
          className="flex-1"
        />
        <Button type="submit" disabled={sending}>
          Send
        </Button>
      </form>
      {/* Fase 10 — em vez de exigir escrever, o utilizador também pode falar: o
          reconhecimento de voz preenche o campo de texto (não envia sozinho),
          para dar hipótese de rever/corrigir antes de enviar, tal como já
          acontece noutros sítios da app com RecordButton. */}
      <div className="mt-2">
        <RecordButton onTranscript={(text) => setInput((prev) => (prev ? `${prev} ${text}` : text))} />
      </div>
    </main>
  );
}
