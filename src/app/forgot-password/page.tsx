import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage({ searchParams }: { searchParams: { sent?: string } }) {
  if (searchParams.sent) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-2xl">Verifique o seu email</h1>
        <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
          Se existir uma conta com esse email, enviámos um link para repor a palavra-passe.
        </p>
        <Link href="/login" className="text-sm text-verdigris underline">
          Voltar ao login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <h1 className="font-display text-2xl">Recuperar palavra-passe</h1>
      <form action={requestPasswordReset} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input name="email" type="email" required className="rounded-control border border-ink/20 px-3 py-2" />
        </label>
        <Button type="submit">Enviar link</Button>
      </form>
      <Link href="/login" className="text-sm text-verdigris underline">
        Voltar ao login
      </Link>
    </main>
  );
}
