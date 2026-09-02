import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { AuthShell } from "@/components/ui/AuthShell";
import { signIn } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  return (
    <AuthShell
      title="Iniciar sessão"
      footer={
        <p className="text-inkNeutral/70 dark:text-linen/70">
          Ainda não tem conta?{" "}
          <Link href="/signup" className="font-semibold text-verdigris underline">
            Criar conta
          </Link>
        </p>
      }
    >
      {searchParams.error && (
        <p role="alert" className="mb-4 rounded-card border-l-4 border-clay bg-clay/5 p-3 text-sm text-clay">
          {searchParams.error}
        </p>
      )}

      <form action={signIn} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={searchParams.next ?? "/home"} />
        <label className="flex flex-col gap-1.5 text-sm">
          Email
          <TextField name="email" type="email" required />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Palavra-passe
          <TextField name="password" type="password" required />
        </label>
        <Button type="submit" className="mt-2 w-full">
          Entrar
        </Button>
      </form>

      <Link href="/forgot-password" className="mt-5 block text-center text-sm text-verdigris underline">
        Esqueceu-se da palavra-passe?
      </Link>
    </AuthShell>
  );
}
