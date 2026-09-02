"use client";

import { useState } from "react";
import type { CefrLevel } from "@prisma/client";
import { WordAssistSheet } from "./WordAssistSheet";

// Quebra o texto em frases primeiro (o contexto que a IA/dicionário recebem
// é sempre a frase inteira, nunca só a palavra) e cada frase em tokens de
// palavra vs. resto (espaços, pontuação, quebras de linha) — só os tokens de
// palavra viram <button>. `\n` sobrevive dentro dos tokens "resto" porque o
// contentor mantém a classe `whitespace-pre-line` já usada por este texto
// antes do Smart Word Assist (ver ReadingRunner.tsx).
// `split` com lookbehind descarta o espaço que separava as frases (ele fica
// "consumido" pelo match, sem entrar em nenhum dos dois pedaços) — por isso
// cada frase mantém o espaço a seguir (se existir no texto original), em vez
// de o remover como o `.trim()` ingénuo fazia antes.
function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])(?=\s)/).filter(Boolean);
}

// Unicode-aware: \p{L} apanha também letras acentuadas ("café", "à", "naïve")
// como parte da palavra — a versão anterior (A-Za-z) cortava "café" em
// "caf" + "é", tornando a palavra inteira impossível de tocar corretamente.
function tokenize(sentence: string): { word: boolean; value: string }[] {
  return Array.from(sentence.matchAll(/[\p{L}']+|[^\p{L}']+/gu)).map((m) => ({
    word: /\p{L}/u.test(m[0]),
    value: m[0],
  }));
}

export function TappableText({
  text,
  cefrLevel,
  className = "text-sm leading-relaxed",
}: {
  text: string;
  cefrLevel?: CefrLevel;
  className?: string;
}) {
  const [open, setOpen] = useState<{ word: string; sentence: string } | null>(null);
  const sentences = splitSentences(text);

  return (
    <>
      <p className={`whitespace-pre-line ${className}`}>
        {sentences.map((sentence, si) => (
          <span key={si}>
            {tokenize(sentence).map((token, ti) =>
              token.word ? (
                <button
                  key={ti}
                  type="button"
                  onClick={() => setOpen({ word: token.value, sentence })}
                  className="rounded-sm decoration-verdigris/40 decoration-dotted underline-offset-4 hover:underline active:bg-verdigris/15"
                >
                  {token.value}
                </button>
              ) : (
                <span key={ti}>{token.value}</span>
              )
            )}
          </span>
        ))}
      </p>

      {open && (
        <WordAssistSheet word={open.word} sentence={open.sentence} cefrLevel={cefrLevel} onClose={() => setOpen(null)} />
      )}
    </>
  );
}
