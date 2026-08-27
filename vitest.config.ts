import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Fase 8 (auditoria 2026-08-27) — primeiros testes automáticos do projeto.
// `vite-tsconfig-paths` lê o `paths` do tsconfig.json (@/* -> ./src/*) para os
// testes poderem importar exatamente como o resto da app, sem duplicar o
// mapeamento aqui. Testes só cobrem lógica pura (SM-2, correção de ditado,
// classificação de certificado) — nada que precise de Prisma/BD real, para
// correr sem depender de uma ligação à base de dados.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
