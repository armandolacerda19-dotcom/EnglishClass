"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Fronteira de erro do grupo (app) — Fase 8 (auditoria 2026-08-27, item 9).
// Antes só existia src/app/error.tsx (fronteira global), que também apanha
// erros aqui por herança do App Router, mas remonta a app inteira. Esta
// fronteira mais granular evita perder o layout/BottomNav por causa de um
// erro isolado numa única página do grupo autenticado.
export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled (app) error", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg lg:max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-clay">Erro inesperado</p>
      <h1 className="font-display text-2xl">Algo correu mal</h1>
      <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
        Houve um problema nesta página. Pode tentar novamente — o seu progresso está guardado.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={reset}>Tentar novamente</Button>
        <Link href="/home">
          <Button variant="secondary">Voltar à Home</Button>
        </Link>
      </div>
    </main>
  );
}
