import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PillarIcon } from "@/components/ui/PillarIcon";
import { PILLAR_ACCENT } from "@/lib/pillarDisplay";

// Redesenho 2026-09-02 (pedido do utilizador: "cores pesadas", "quase uma
// app nova") — antes era um bloco `bg-ink` sólido (Atlantic Ink em navy
// escuro em toda a página, claro ou escuro). Passa a herdar o fundo normal
// da app (linen claro / inkNeutral escuro, já ajustado em globals.css) com
// uma faixa decorativa de gradiente no topo (mesmas cores do sistema de
// pilares, nunca Clay) — convidativo sem depender de imagem/fotografia
// (sem orçamento para isso).
export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <div className="h-1.5 w-full bg-gradient-to-r from-verdigris via-indigo to-plum" />
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-24">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">Pre-A1 → C2</span>
        <h1 className="font-display text-4xl leading-tight">
          O seu professor particular de inglês, disponível 24/7.
        </h1>
        <p className="max-w-xl text-lg text-inkNeutral/80 dark:text-linen/80">
          Um sistema que sabe o que precisa de aprender, porque está a errar, e o que deve
          praticar a seguir — não uma coleção de exercícios.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/signup">
            <Button>Começar agora</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Iniciar sessão</Button>
          </Link>
        </div>

        <div className="mt-10 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
          {(
            [
              { icon: "grammar", label: "Gramática", pillar: "GRAMMAR" },
              { icon: "vocabulary", label: "Vocabulário", pillar: "VOCABULARY" },
              { icon: "speaking", label: "Fala", pillar: "SPEAKING" },
              { icon: "listening", label: "Compreensão", pillar: "LISTENING" },
            ] as const
          ).map((item) => (
            <div key={item.icon} className="flex flex-col items-center gap-2 rounded-card border border-ink/10 bg-white/50 p-4 text-center dark:border-linen/10 dark:bg-white/5">
              <PillarIcon name={item.icon} className={`h-6 w-6 ${PILLAR_ACCENT[item.pillar]!.text}`} />
              <span className="text-sm text-inkNeutral/70 dark:text-linen/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
