import type { Config } from "tailwindcss";

// Tokens de docs/09-sistema-design.md — não alterar sem atualizar esse documento.
const config: Config = {
  // "class" em vez de "media" (2026-08-26) — feedback do utilizador: "as cores
  // são sempre muito pesadas, nunca muda". Causa real: com "media" a app seguia
  // sempre o tema do sistema operativo — se o Windows do utilizador estiver em
  // modo escuro, TODAS as páginas ficavam sempre em fundo navy escuro, sem
  // controlo nenhum. Com "class" o claro passa a ser o default e o utilizador
  // escolhe explicitamente com o ThemeToggle (src/components/ui/ThemeToggle.tsx).
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2A4A", // Atlantic Ink
        linen: "#F5F2EC",
        verdigris: "#3E7C6B",
        brass: "#B8863B",
        clay: "#B34B3C",
        inkNeutral: "#2B2E33",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      // Aumentado ~10% em toda a escala (2026-08-26) — pedido do utilizador: "deve
      // aumentar o tamanho da letra, para uma leitura mais fácil". Mantém a mesma
      // proporção entre níveis (escala modular), só desloca a base para cima.
      fontSize: {
        xs: "0.8125rem",
        sm: "0.9375rem",
        base: "1.0625rem",
        lg: "1.3125rem",
        xl: "1.6875rem",
        "2xl": "2.0625rem",
        "3xl": "2.5625rem",
        "4xl": "3.1875rem",
      },
      borderRadius: {
        control: "6px",
        card: "2px",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
