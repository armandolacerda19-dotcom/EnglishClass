"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { Spinner } from "@/components/ui/Spinner";
import { submitWritingChallenge } from "@/app/(app)/practice/writing-challenge/actions";
import type { WritingChallengeItem } from "@/content/writingChallenges";
import type { WritingChallengeResult } from "@/lib/ai/gradeWritingChallenge";

// Desafio de Escrita Livre — formato ❌⚠️✅ pedido explicitamente (relatório
// de 2026-08-28, prioridade 🟠): frase original, problema, versão correta —
// além da sugestão de como um nativo escreveria.
export function WritingChallengeRunner({ item }: { item: WritingChallengeItem }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<WritingChallengeResult | null>(null);

  async function submit() {
    if (!text.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitWritingChallenge(item.id, text);
      setResult(res);
    } catch {
      setSubmitError("Não foi possível avaliar o texto — verifique a ligação e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-verdigris">Desafio de Escrita Livre · {item.level}</p>
      <p className="mb-1 font-display text-xl">{item.prompt}</p>
      <p className="mb-6 text-xs italic text-inkNeutral/60 dark:text-linen/60">{item.promptPt}</p>

      <Card className="mb-4">
        <TextAreaField
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!!result || submitting}
          placeholder="Write freely in English..."
        />
      </Card>

      {submitError && (
        <p role="alert" className="mb-3 text-sm text-clay">
          {submitError}
        </p>
      )}

      {!result && (
        <div className="flex justify-end">
          <Button onClick={submit} disabled={!text.trim() || submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <Spinner /> A avaliar...
              </span>
            ) : (
              "Enviar"
            )}
          </Button>
        </div>
      )}

      {result && (
        <>
          <Card className="mb-4">
            <div className="flex flex-col gap-3">
              {[
                { label: "Gramática", value: result.grammarScore },
                { label: "Vocabulário", value: result.vocabularyScore },
                { label: "Escrita", value: result.writingScore },
              ].map((a) => (
                <div key={a.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{a.label}</span>
                    <span className="font-mono">{a.value}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-ink/10 dark:bg-linen/10">
                    <div className="h-1.5 rounded-full bg-verdigris" style={{ width: `${a.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-4">
            <p className="text-sm">{result.summary}</p>
          </Card>

          {result.corrections.length > 0 && (
            <Card className="mb-4 border-clay">
              <p className="mb-3 font-mono text-xs uppercase tracking-wide text-clay">Correções</p>
              <ul className="flex flex-col gap-4 text-sm">
                {result.corrections.map((c, i) => (
                  <li key={i}>
                    <p>❌ {c.original}</p>
                    <p className="text-inkNeutral/70 dark:text-linen/70">⚠️ {c.issue}</p>
                    <p className="text-verdigris">✅ {c.corrected}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {result.nativeVersion && (
            <Card className="mb-4 border-brass">
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-brass">Como um nativo escreveria</p>
              <p className="text-sm italic">{result.nativeVersion}</p>
            </Card>
          )}

          <Link href="/practice/writing-challenge">
            <Button>Outro desafio</Button>
          </Link>
        </>
      )}
    </main>
  );
}
