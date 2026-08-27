"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { RecordButton } from "@/components/ui/RecordButton";
import { StampBadge } from "@/components/ui/StampBadge";
import { completeMicroChallenge } from "@/app/(app)/practice/micro-challenges/actions";
import type { MicroChallenge } from "@/lib/microChallenges";

export function MicroChallengeRunner({ challenge }: { challenge: MicroChallenge }) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <main className="mx-auto flex max-w-lg lg:max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center">
        <StampBadge code="✓" tone="verdigris" />
        <h1 className="font-display text-xl">Boa! Micro-desafio concluído.</h1>
        <Link href="/practice/micro-challenges">
          <Button variant="secondary">Ver outros micro-desafios</Button>
        </Link>
        <Link href="/home">
          <Button variant="ghost">Voltar à Home</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-verdigris">{challenge.title}</p>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">{challenge.subtitle}</p>

      {challenge.kind === "shadow" ? (
        <ShadowRunner sentence={challenge.sentence} translation={challenge.translation} onDone={() => setDone(true)} />
      ) : (
        <ListenRunner challenge={challenge} onDone={() => setDone(true)} />
      )}
    </main>
  );
}

function ShadowRunner({ sentence, translation, onDone }: { sentence: string; translation: string; onDone: () => void }) {
  const [transcript, setTranscript] = useState<string | null>(null);

  async function finish() {
    await completeMicroChallenge("SPEAKING", 65);
    onDone();
  }

  return (
    <Card>
      <p className="mb-4 font-display text-xl">{sentence}</p>
      <p className="mb-4 text-sm italic text-inkNeutral/60 dark:text-linen/60">{translation}</p>
      <PlayTranscript text={sentence} />
      <div className="mt-4">
        <RecordButton onTranscript={setTranscript} />
      </div>
      {transcript && <p className="mt-3 text-sm">Ouvimos: "{transcript}"</p>}
      <Button className="mt-4" onClick={finish}>
        Concluir
      </Button>
    </Card>
  );
}

function ListenRunner({
  challenge,
  onDone,
}: {
  challenge: Extract<MicroChallenge, { kind: "listen" }>;
  onDone: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  async function confirm() {
    if (selected === null) return;
    setAnswered(true);
    await completeMicroChallenge("LISTENING", selected === challenge.correctIndex ? 100 : 20);
  }

  return (
    <Card>
      <PlayTranscript text={challenge.dialogue.join(". ")} />
      <p className="mb-3 mt-4 text-sm">{challenge.question}</p>
      <fieldset className="flex flex-col gap-2">
        {challenge.options.map((opt, i) => (
          <label key={opt} className="flex items-center gap-2 rounded-control border border-ink/10 p-3 text-sm">
            <input type="radio" name="answer" checked={selected === i} onChange={() => setSelected(i)} disabled={answered} />
            {opt}
          </label>
        ))}
      </fieldset>

      {!answered ? (
        <Button className="mt-4" onClick={confirm} disabled={selected === null}>
          Confirmar
        </Button>
      ) : (
        <>
          <p className={`mt-3 text-sm ${selected === challenge.correctIndex ? "text-verdigris" : "text-clay"}`}>
            {selected === challenge.correctIndex ? "Correto!" : `A resposta certa era: ${challenge.options[challenge.correctIndex]}`}
          </p>
          <Button className="mt-4" onClick={onDone}>
            Concluir
          </Button>
        </>
      )}
    </Card>
  );
}
