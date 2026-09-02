import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { AuthShell } from "@/components/ui/AuthShell";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage({ searchParams }: { searchParams: { sent?: string } }) {
  if (searchParams.sent) {
    return (
      <AuthShell title="Verifique o seu email">
        <p className="text-center text-sm text-inkNeutral/70 dark:text-linen/70">
          Se existir uma conta com esse email, enviámos um link para repor a palavra-passe.
        </p>
        <Link href="/login" className="mt-5 block text-center text-sm text-verdigris underline">
          Voltar ao login
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Recuperar palavra-passe">
      <form action={requestPasswordReset} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          Email
          <TextField name="email" type="email" required />
        </label>
        <Button type="submit" className="mt-2 w-full">
          Enviar link
        </Button>
      </form>
      <Link href="/login" className="mt-5 block text-center text-sm text-verdigris underline">
        Voltar ao login
      </Link>
    </AuthShell>
  );
}
