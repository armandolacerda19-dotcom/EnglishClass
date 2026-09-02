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
        // Sistema de cor por pilar (5ª auditoria, 2026-09-01) — antes só 3 cores
        // (verdigris/brass/clay) cobriam os 8 pilares, com GRAMMAR/READING e
        // VOCABULARY/TRANSLATION indistinguíveis entre si, e LISTENING a
        // reutilizar Clay (violando a regra do próprio docs/09-sistema-design.md
        // de que Clay é exclusivo para erros PT→EN). 6 cores novas, mesma família
        // tonal muted/editorial (saturação/luminosidade próximas das existentes).
        moss: "#4F7A52", // READING
        teal: "#2E7A8C", // LISTENING
        slate: "#46607A", // WRITING
        indigo: "#5A5FA0", // SPEAKING
        plum: "#96477A", // PRONUNCIATION
        berry: "#A83E5C", // TRANSLATION
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      // Escala aumentada uma 2ª vez (5ª auditoria, redesenho 2026-09-02) — pedido
      // explícito do utilizador: "letra maior, para mais fácil leitura". Já tinha
      // subido ~10% em 2026-08-26; esta ronda sobe outra vez (base 17px→18px) E
      // acrescenta `line-height` generoso por nível (antes só o tamanho mudava, a
      // altura de linha ficava ao critério de cada componente) — texto de corpo a
      // 1.65 em vez do 1.5 implícito do Tailwind, mais fácil de seguir em blocos
      // longos (regras de gramática, feedback de IA).
      fontSize: {
        xs: ["0.875rem", { lineHeight: "1.4" }],
        sm: ["1rem", { lineHeight: "1.5" }],
        base: ["1.125rem", { lineHeight: "1.65" }],
        lg: ["1.375rem", { lineHeight: "1.5" }],
        xl: ["1.75rem", { lineHeight: "1.35" }],
        "2xl": ["2.25rem", { lineHeight: "1.25" }],
        "3xl": ["2.75rem", { lineHeight: "1.15" }],
        "4xl": ["3.5rem", { lineHeight: "1.1" }],
      },
      // Raio de canto aumentado (2026-08-26) — pedido explícito do utilizador:
      // "estilo profissional, mais semelhante ao Busuu". docs/09-sistema-design.md
      // pedia originalmente cantos discretos (6px/2px, "evitar 24px+") como
      // escolha deliberada de sofisticação — este pedido do utilizador substitui
      // essa decisão de propósito, documentado em docs/decisions.md. Mantemos
      // fora do território "app infantil" (sem pill-shape em tudo), mas bem mais
      // arredondado e tátil do que antes.
      borderRadius: {
        control: "14px",
        card: "18px",
      },
      boxShadow: {
        // Sombra suave usada em cards e botões para dar sensação de elevação/
        // impacto (Busuu usa isto consistentemente) — antes o produto não tinha
        // nenhuma sombra, era completamente plano.
        soft: "0 2px 8px 0 rgb(27 42 74 / 0.08)",
        lift: "0 4px 16px 0 rgb(27 42 74 / 0.16)",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
