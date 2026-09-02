"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { RecordButton } from "@/components/ui/RecordButton";
import { StampBadge } from "@/components/ui/StampBadge";
import { completeMicroChallenge } from "@/app/(app)/practice/micro-challenges/actions";
import { PILLAR_ACCENT } from "@/lib/pillarDisplay";
import type { MicroChallenge } from "@/lib/microChallenges";

// 5ª auditoria (Fase 2 do roteiro visual, 2026-09-02) — não migrado para
// ExerciseShell: ShadowRunner/ListenRunner são dois sub-componentes com o seu
// próprio Card e ações internas; encaixá-los num único ExerciseShell exigiria
// desmontar essa estrutura (Card dentro de Card, ou reescrever para expor as
// ações via prop), risco desproporcional para um exercício sem numeração de
// sequência. Só a cor de identidade passa a depender do tipo: "shadow"
// (repetir em voz alta) usa Speaking, "listen" (compreensão) usa Listening —
// antes ambos usavam verdigris fixo, sem ligação a nenhum pilar.
const KIND_ACCENT = { shadow: PILLAR_ACCENT.SPEAKING!, listen: PILLAR_ACCENT.LISTENING! };

export function MicroChallengeRunner({ challenge }: { challenge: MicroChallenge }) {
  const [done, setDone] = useState(false);
  const accent = KIND_ACCENT[challenge.kind];

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
      <p className={`mb-1 font-mono text-xs uppercase tracking-widest ${accent.text}`}>{challenge.title}</p>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">{challenge.subtitle}</p>

      {challenge.kind === "shadow" ? (
        <ShadowRunner id={challenge.id} sentence={challenge.sentence} translation={challenge.translation} onDone={() => setDone(true)} />
      ) : (
        <ListenRunner challenge={challenge} onDone={() => setDone(true)} />
      )}
    </main>
  );
}

function ShadowRunner({
  id,
  sentence,
  translation,
  onDone,
}: {
  id: string;
  sentence: string;
  translation: string;
  onDone: () => void;
}) {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function finish() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Fase 9 — o transcript reconhecido é enviado para o servidor comparar
      // com a frase alvo (ver micro-challenges/actions.ts): sem gravação, ir
      // buscar a nota exigia dizer ALGUMA coisa reconhecível, já não é fixa.
      await completeMicroChallenge(id, undefined, transcript ?? undefined);
      onDone();
    } catch {
      setSubmitError("Não foi possível guardar — verifique a ligação e tente novamente.");
      setSubmitting(false);
    }
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
      {submitError && (
        <p role="alert" className="mt-3 text-sm text-clay">
          {submitError}
        </p>
      )}
      <Button className="mt-4" onClick={finish} disabled={submitting}>
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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function confirm() {
    if (selected === null) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await completeMicroChallenge(challenge.id, selected);
      setAnswered(true);
    } catch {
      setSubmitError("Não foi possível guardar — verifique a ligação e tente novamente.");
    } finally {
      setSubmitting(false);
    }
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

      {submitError && (
        <p role="alert" className="mt-3 text-sm text-clay">
          {submitError}
        </p>
      )}

      {!answered ? (
        <Button className="mt-4" onClick={confirm} disabled={selected === null || submitting}>
          Confirmar
        </Button>
      ) : (
        <>
          <p role="status" aria-live="polite" className={`mt-3 text-sm ${selected === challenge.correctIndex ? PILLAR_ACCENT.LISTENING!.text : "text-clay"}`}>
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
