"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

// Fronteira de erro global. Sem isto, qualquer exceção num server component
// (ex. findUniqueOrThrow sem registo) mostrava o ecrã de erro cru do Next.js,
// em inglês e sem forma de recuperar. Ver docs/decisions.md 2026-08-26.
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled app error", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg lg:max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-clay">Erro inesperado</p>
      <h1 className="font-display text-2xl">Algo correu mal</h1>
      <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
        Houve um problema ao carregar esta página. Pode tentar novamente — o seu progresso está guardado.
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </main>
  );
}
