"use client";

import { useState } from "react";
import { setImmersionMode, setAccessibleReadingMode } from "@/app/(app)/profile/settings/actions";

interface SettingsTogglesProps {
  immersionMode: boolean;
  accessibleReadingMode: boolean;
}

// Modo Imersão (#12) e Leitura Facilitada (#18) da lista de melhorias.
// accessibleReadingMode aplica-se de imediato via refresh do layout (server
// component); immersionMode só é lido nas lições (LessonRunner), por isso não
// precisa de refresh imediato aqui.
export function SettingsToggles({ immersionMode, accessibleReadingMode }: SettingsTogglesProps) {
  const [immersion, setImmersion] = useState(immersionMode);
  const [accessible, setAccessible] = useState(accessibleReadingMode);

  async function toggleImmersion() {
    const next = !immersion;
    setImmersion(next);
    await setImmersionMode(next);
  }

  async function toggleAccessible() {
    const next = !accessible;
    setAccessible(next);
    await setAccessibleReadingMode(next);
    // Precisa de recarregar para o layout do servidor aplicar a classe nova.
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-5">
      <SettingRow
        title="Modo Imersão"
        description="Esconde as traduções em português nas lições — mostra só inglês, com opção de revelar."
        checked={immersion}
        onChange={toggleImmersion}
      />
      <SettingRow
        title="Leitura Facilitada"
        description="Mais espaço entre linhas e letras, sem itálico — pensado para dislexia/baixa visão."
        checked={accessible}
        onChange={toggleAccessible}
      />
    </div>
  );
}

function SettingRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-display text-base">{title}</p>
        <p className="text-xs text-inkNeutral/60 dark:text-linen/60">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-verdigris" : "bg-ink/15 dark:bg-linen/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
