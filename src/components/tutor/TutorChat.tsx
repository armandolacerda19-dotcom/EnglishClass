"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TUTOR_PERSONALITIES, type TutorPersonalityKey } from "@/lib/ai/personalities";

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
};

export function TutorChat({ personality = "coach" }: { personality?: TutorPersonalityKey }) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: GREETINGS[personality] },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    const res = await fetch("/api/ai/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, message: userMessage.text, personality }),
    });
    const data = await res.json();
    setConversationId(data.conversationId);
    setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    setSending(false);
  }

  return (
    <main className="mx-auto flex h-screen max-w-lg flex-col px-6 py-8">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-verdigris">
        {TUTOR_PERSONALITIES[personality].label}
      </p>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-card px-3 py-2 text-sm ${
              m.role === "user" ? "ml-auto bg-verdigris text-white" : "bg-ink/5 dark:bg-linen/10"
            }`}
          >
            {m.text}
          </div>
        ))}
        {sending && <p className="text-sm text-inkNeutral/60">The Coach is typing...</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write in English..."
          className="flex-1 rounded-control border border-ink/20 px-3 py-2 text-sm"
        />
        <Button type="submit" disabled={sending}>
          Send
        </Button>
      </form>
    </main>
  );
}
