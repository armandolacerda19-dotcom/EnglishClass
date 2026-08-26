import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink text-linen">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-24">
        <span className="font-mono text-xs uppercase tracking-widest text-brass">Pre-A1 → C2</span>
        <h1 className="font-display text-4xl leading-tight">
          O seu professor particular de inglês, disponível 24/7.
        </h1>
        <p className="max-w-xl text-lg text-linen/80">
          Um sistema que sabe o que precisa de aprender, porque está a errar, e o que deve
          praticar a seguir — não uma coleção de exercícios.
        </p>
        <div className="flex gap-3">
          <Link href="/signup">
            <Button>Começar agora</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" className="border-linen text-linen hover:bg-linen/10">
              Iniciar sessão
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
