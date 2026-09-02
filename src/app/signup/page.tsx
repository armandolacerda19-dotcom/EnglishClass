import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { AuthShell } from "@/components/ui/AuthShell";
import { signUp } from "./actions";

export default function SignupPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <AuthShell
      title="Criar conta"
      subtitle="Comece a aprender inglês de verdade, hoje."
      footer={
        <p className="text-inkNeutral/70 dark:text-linen/70">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-verdigris underline">
            Iniciar sessão
          </Link>
        </p>
      }
    >
      {searchParams.error && (
        <p role="alert" className="mb-4 rounded-card border-l-4 border-clay bg-clay/5 p-3 text-sm text-clay">
          {searchParams.error}
        </p>
      )}

      <form action={signUp} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          Nome
          <TextField name="name" type="text" required />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Email
          <TextField name="email" type="email" required />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Palavra-passe
          <TextField name="password" type="password" minLength={8} required />
        </label>
        <Button type="submit" className="mt-2 w-full">
          Criar conta
        </Button>
      </form>
    </AuthShell>
  );
}
