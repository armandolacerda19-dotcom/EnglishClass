import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { EnglishVariantProvider } from "@/components/ui/EnglishVariantContext";
import { requireUserWithProfile } from "@/lib/session";

// accessibleReadingMode aplicado aqui (não por página) — item #18 da lista de
// melhorias: um único sítio garante consistência em toda a app.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, learningProfile } = await requireUserWithProfile();

  return (
    <EnglishVariantProvider value={learningProfile.englishVariant}>
      <div className={`min-h-screen pb-20 ${learningProfile.accessibleReadingMode ? "accessible-reading" : ""}`}>
        {/* Cabeçalho com mais presença (redesenho 2026-09-02, pedido do
            utilizador: "quase uma app nova") — ganha a marca do produto ao
            lado do nome, e uma borda subtil a separar do conteúdo (antes era
            só texto solto no topo, sem nenhuma fronteira visual). */}
        <header className="flex items-center justify-between gap-3 border-b border-ink/5 px-6 py-4 dark:border-linen/5">
          {/* Fase 6 ("Família") — mostra sempre o primeiro nome do perfil ativo,
              para nunca ficar ambíguo quem está a usar a app num dispositivo
              partilhado. Ver src/lib/session.ts. */}
          <div className="flex items-baseline gap-2 overflow-hidden">
            <span className="font-display text-base font-semibold text-verdigris">Plataforma de Inglês</span>
            <span className="hidden truncate font-mono text-xs text-inkNeutral/50 dark:text-linen/50 sm:inline">
              · {user.name.split(" ")[0]}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Link
              href="/profile/settings"
              className="rounded-control px-2 py-1 font-mono text-xs text-inkNeutral/60 hover:text-verdigris dark:text-linen/60"
            >
              Definições
            </Link>
            <Link
              href="/profile/privacy"
              className="rounded-control px-2 py-1 font-mono text-xs text-inkNeutral/60 hover:text-verdigris dark:text-linen/60"
            >
              Perfil
            </Link>
          </div>
        </header>
        {children}
        <BottomNav />
      </div>
    </EnglishVariantProvider>
  );
}
