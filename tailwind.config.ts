import type { Config } from "tailwindcss";

// Tokens de docs/09-sistema-design.md — não alterar sem atualizar esse documento.
const config: Config = {
  darkMode: "media",
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
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.25rem",
        xl: "1.5625rem",
        "2xl": "1.953rem",
        "3xl": "2.441rem",
        "4xl": "3.052rem",
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
