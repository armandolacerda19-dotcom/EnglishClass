import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { signUp } from "./actions";

export default function SignupPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <h1 className="font-display text-2xl">Criar conta</h1>

      {searchParams.error && (
        <p role="alert" className="rounded-card border-l-4 border-clay bg-clay/5 p-3 text-sm text-clay">
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
        <Button type="submit">Criar conta</Button>
      </form>

      <p className="text-sm text-inkNeutral/70">
        Já tem conta?{" "}
        <Link href="/login" className="text-verdigris underline">
          Iniciar sessão
        </Link>
      </p>
    </main>
  );
}
