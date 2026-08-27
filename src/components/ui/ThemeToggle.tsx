"use client";

import { useEffect, useState } from "react";

// Controlo explícito de tema — antes seguia sempre o sistema operativo
// (prefers-color-scheme), o que fazia o utilizador ficar preso em modo escuro
// sem controlo se o Windows estivesse assim configurado. Ver docs/decisions.md
// 2026-08-26 e o script inline em src/app/layout.tsx que evita o "flash" do
// tema errado antes do React montar.
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage indisponível — o tema só não persiste entre visitas, sem mais consequência
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className="rounded-control px-2 py-1 font-mono text-xs text-inkNeutral/60 hover:text-verdigris dark:text-linen/60"
    >
      {isDark ? "☀ Claro" : "☾ Escuro"}
    </button>
  );
}
