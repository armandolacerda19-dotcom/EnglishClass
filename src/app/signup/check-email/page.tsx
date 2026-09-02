import { AuthShell } from "@/components/ui/AuthShell";

export default function CheckEmailPage() {
  return (
    <AuthShell title="Confirme o seu email">
      <p className="text-center text-sm text-inkNeutral/70 dark:text-linen/70">
        Enviámos um link de confirmação para o seu email. Clique nele para ativar a sua conta e começar o
        onboarding.
      </p>
    </AuthShell>
  );
}
