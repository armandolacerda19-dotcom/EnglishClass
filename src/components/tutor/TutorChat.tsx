"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { Spinner } from "@/components/ui/Spinner";
import { StampBadge } from "@/components/ui/StampBadge";
import { RecordButton } from "@/components/ui/RecordButton";
import { useEnglishVariant } from "@/components/ui/EnglishVariantContext";
import { TUTOR_PERSONALITIES, type TutorPersonalityKey } from "@/lib/ai/personalities";
import type { ConversationEvaluation } from "@/lib/ai/evaluateConversation";

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
  const [usedVoice, setUsedVoice] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<ConversationEvaluation | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const variant = useEnglishVariant();
  const hasUserTurn = messages.some((m) => m.role === "user");

  // Avaliação estruturada de fim de conversa (Exercise Engine, 2026-08-28) —
  // fecha os tipos "Conversação com IA" e "Role-play e simulações". Antes, a
  // conversa era só um chat corrido sem nenhum resumo — o próprio schema já
  // tinha `AIConversation.feedbackJson` reservado para isto, mas nunca era
  // escrito.
  async function finishConversation() {
    if (!conversationId) return;
    setEvaluating(true);
    setEvalError(null);
    try {
      const res = await fetch("/api/ai/tutor/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, usedVoice }),
      });
      if (!res.ok) throw new Error(`Evaluation request failed: ${res.status}`);
      const data: ConversationEvaluation = await res.json();
      setEvaluation(data);
    } catch {
      setEvalError("Não foi possível avaliar a conversa agora — verifique a ligação e tente novamente.");
    } finally {
      setEvaluating(false);
    }
  }

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

  if (evaluation) {
    const axes: { label: string; value: number | null }[] = [
      { label: "Gramática", value: evaluation.grammar },
      { label: "Vocabulário", value: evaluation.vocabulary },
      { label: "Fluência", value: evaluation.fluency },
      { label: "Confiança", value: evaluation.confidence },
      { label: "Pronúncia", value: evaluation.pronunciation },
    ];
    const scored = axes.filter((a) => a.value !== null);
    const overall = scored.length > 0 ? Math.round(scored.reduce((sum, a) => sum + (a.value ?? 0), 0) / scored.length) : 0;
    return (
      <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <StampBadge code={`${overall}%`} tone="verdigris" />
          <h1 className="font-display text-2xl">Avaliação da conversa</h1>
        </div>

        <Card className="mb-4">
          <div className="flex flex-col gap-3">
            {axes.map((a) => (
              <div key={a.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{a.label}</span>
                  <span className="font-mono">{a.value === null ? "—" : `${a.value}%`}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-ink/10 dark:bg-linen/10">
                  <div className="h-1.5 rounded-full bg-verdigris" style={{ width: `${a.value ?? 0}%` }} />
                </div>
              </div>
            ))}
          </div>
          {evaluation.pronunciation === null && (
            <p className="mt-3 text-xs text-inkNeutral/50 dark:text-linen/50">
              Pronúncia sem dados — esta conversa foi só por texto (use o microfone para uma estimativa).
            </p>
          )}
        </Card>

        <Card className="mb-4">
          <p className="text-sm">{evaluation.summary}</p>
        </Card>

        {evaluation.topErrors.length > 0 && (
          <Card className="mb-4 border-clay">
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-clay">Principais erros</p>
            <ul className="flex flex-col gap-2 text-sm">
              {evaluation.topErrors.map((e, i) => (
                <li key={i}>
                  <span className="text-clay line-through">{e.original}</span>{" "}
                  <span className="text-verdigris">→ {e.correct}</span>
                  <p className="text-xs text-inkNeutral/60 dark:text-linen/60">{e.tip}</p>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {evaluation.newWords.length > 0 && (
          <Card className="mb-4 border-brass">
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-brass">Palavras novas</p>
            <p className="text-sm">{evaluation.newWords.join(", ")}</p>
          </Card>
        )}

        <Link href="/speak">
          <Button>Voltar</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-screen max-w-lg lg:max-w-2xl flex-col px-6 py-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-verdigris">{TUTOR_PERSONALITIES[personality].label}</p>
        {hasUserTurn && (
          <button
            type="button"
            onClick={finishConversation}
            disabled={evaluating}
            className="font-mono text-xs text-inkNeutral/50 underline hover:text-verdigris disabled:opacity-50 dark:text-linen/50"
          >
            {evaluating ? "A avaliar..." : "Terminar e avaliar"}
          </button>
        )}
      </div>
      {evalError && (
        <p role="alert" className="mb-3 text-sm text-clay">
          {evalError}
        </p>
      )}

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
        <RecordButton
          onTranscript={(text) => {
            setUsedVoice(true);
            setInput((prev) => (prev ? `${prev} ${text}` : text));
          }}
        />
      </div>
    </main>
  );
}
