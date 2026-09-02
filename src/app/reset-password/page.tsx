import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { AuthShell } from "@/components/ui/AuthShell";
import { updatePassword } from "./actions";

export default function ResetPasswordPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <AuthShell title="Definir nova palavra-passe">
      {searchParams.error && (
        <p role="alert" className="mb-4 rounded-card border-l-4 border-clay bg-clay/5 p-3 text-sm text-clay">
          {searchParams.error}
        </p>
      )}

      <form action={updatePassword} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          Nova palavra-passe
          <TextField name="password" type="password" minLength={8} required />
        </label>
        <Button type="submit" className="mt-2 w-full">
          Guardar
        </Button>
      </form>
    </AuthShell>
  );
}
