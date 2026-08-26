import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { signIn } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <h1 className="font-display text-2xl">Iniciar sessão</h1>

      {searchParams.error && (
        <p role="alert" className="rounded-card border-l-4 border-clay bg-clay/5 p-3 text-sm text-clay">
          {searchParams.error}
        </p>
      )}

      <form action={signIn} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={searchParams.next ?? "/home"} />
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input name="email" type="email" required className="rounded-control border border-ink/20 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Palavra-passe
          <input name="password" type="password" required className="rounded-control border border-ink/20 px-3 py-2" />
        </label>
        <Button type="submit">Entrar</Button>
      </form>

      <p className="text-sm text-inkNeutral/70">
        Ainda não tem conta?{" "}
        <Link href="/signup" className="text-verdigris underline">
          Criar conta
        </Link>
      </p>
    </main>
  );
}
