import { Button } from "@/components/ui/Button";
import { updatePassword } from "./actions";

export default function ResetPasswordPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <h1 className="font-display text-2xl">Definir nova palavra-passe</h1>

      {searchParams.error && (
        <p role="alert" className="rounded-card border-l-4 border-clay bg-clay/5 p-3 text-sm text-clay">
          {searchParams.error}
        </p>
      )}

      <form action={updatePassword} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Nova palavra-passe
          <input name="password" type="password" minLength={8} required className="rounded-control border border-ink/20 px-3 py-2" />
        </label>
        <Button type="submit">Guardar</Button>
      </form>
    </main>
  );
}
