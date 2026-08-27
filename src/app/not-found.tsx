import Link from "next/link";

// Sem este ficheiro, os 4 `notFound()` da app (lição, micro-desafio, texto de
// leitura, tema de prática) caíam no 404 cru do Next.js: sem estilo, em inglês,
// sem navegação. Ver docs/decisions.md 2026-08-26 (auditoria).
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg lg:max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-verdigris">Erro 404</p>
      <h1 className="font-display text-2xl">Não encontrámos esta página</h1>
      <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
        O conteúdo que procura pode ter sido movido ou já não existe.
      </p>
      <Link href="/home" className="text-sm text-verdigris underline">
        Voltar à Home
      </Link>
    </main>
  );
}
