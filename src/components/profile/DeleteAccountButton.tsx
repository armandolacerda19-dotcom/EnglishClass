"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { deleteAccount } from "@/app/(app)/profile/privacy/actions";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button variant="secondary" className="border-clay text-clay hover:bg-clay/5" onClick={() => setConfirming(true)}>
        Eliminar a minha conta
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border border-clay/40 bg-clay/5 p-4">
      <p className="text-sm text-clay">
        Esta ação é permanente: todo o seu histórico de aprendizagem, conversas e certificados serão eliminados.
        Tem a certeza?
      </p>
      <div className="flex gap-2">
        <form action={deleteAccount}>
          <Button type="submit" className="bg-clay hover:bg-clay/90">
            Sim, eliminar tudo
          </Button>
        </form>
        <Button variant="ghost" onClick={() => setConfirming(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
