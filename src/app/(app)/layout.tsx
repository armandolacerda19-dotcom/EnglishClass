import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { requireUserWithProfile } from "@/lib/session";

// accessibleReadingMode aplicado aqui (não por página) — item #18 da lista de
// melhorias: um único sítio garante consistência em toda a app.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, learningProfile } = await requireUserWithProfile();

  return (
    <div className={`min-h-screen pb-20 ${learningProfile.accessibleReadingMode ? "accessible-reading" : ""}`}>
      <header className="flex items-center justify-end gap-3 px-6 pt-4">
        {/* Fase 6 ("Família") — mostra sempre o primeiro nome do perfil ativo,
            para nunca ficar ambíguo quem está a usar a app num dispositivo
            partilhado. Ver src/lib/session.ts. */}
        <span className="mr-auto font-mono text-xs text-inkNeutral/50 dark:text-linen/50">
          {user.name.split(" ")[0]}
        </span>
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
      </header>
      {children}
      <BottomNav />
    </div>
  );
}
