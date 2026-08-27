"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { completeIdiom } from "@/app/(app)/practice/idioms/actions";
import type { Idiom } from "@/content/idioms";

export function IdiomRunner({ idiom, options }: { idiom: Idiom; options: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = selected === idiom.meaningEn;

  async function check() {
    if (!selected) return;
    setChecked(true);
    await completeIdiom(isCorrect);
  }

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-brass">Idioma do Dia</p>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">Um phrasal verb ou expressão idiomática nova a cada dia.</p>

      <Card className="border-brass/30">
        <p className="mb-1 font-display text-2xl">{idiom.phrase}</p>
        <p className="mb-4 text-xs italic text-inkNeutral/50 dark:text-linen/50">
          tradução literal: "{idiom.literalPt}" (não é o que significa!)
        </p>
        <PlayTranscript text={idiom.phrase} />

        <p className="mb-3 mt-4 text-sm font-semibold">O que significa realmente?</p>
        <fieldset className="flex flex-col gap-2">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 rounded-control border border-ink/10 p-3 text-sm">
              <input
                type="radio"
                name="idiom"
                checked={selected === opt}
                onChange={() => setSelected(opt)}
                disabled={checked}
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {checked && (
          <div className="mt-4 border-t border-ink/10 pt-4 dark:border-linen/10">
            <p role="status" aria-live="polite" className={`mb-2 text-sm ${isCorrect ? "text-verdigris" : "text-clay"}`}>
              {isCorrect ? "Correto!" : `Não. Significa: ${idiom.meaningEn}`}
            </p>
            <p className="mb-1 text-xs text-inkNeutral/60 dark:text-linen/60">Em português: {idiom.meaningPt}</p>
            <p className="text-sm italic">"{idiom.example}"</p>
          </div>
        )}
      </Card>

      <div className="mt-4 flex justify-end">
        {!checked ? (
          <Button onClick={check} disabled={!selected}>
            Verificar
          </Button>
        ) : (
          <Link href="/home">
            <Button>Voltar à Home</Button>
          </Link>
        )}
      </div>
    </main>
  );
}
