import { Spinner } from "@/components/ui/Spinner";

// Um único loading.tsx aqui cobre TODAS as páginas do grupo (app) — home,
// aprender, praticar, progresso, falar, definições — porque o layout.tsx deste
// grupo persiste entre navegações e cada page.tsx é automaticamente envolvida
// num Suspense boundary por este ficheiro. Antes disto não existia NENHUM
// loading.tsx na app inteira: a navegação para /progress (8 queries em
// paralelo) ou qualquer outra página ficava com o ecrã anterior congelado, sem
// qualquer sinal de que algo estava a acontecer. Ver docs/decisions.md,
// auditoria 2026-08-26.
export default function AppLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-8 w-8 text-verdigris" />
    </div>
  );
}
