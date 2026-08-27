import { requireUser } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { DeleteAccountButton } from "@/components/profile/DeleteAccountButton";

export default async function PrivacyPage() {
  await requireUser();

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-6 font-display text-2xl">Privacidade e dados</h1>

      <Card className="mb-4">
        <p className="mb-1 font-display text-lg">Exportar os meus dados</p>
        <p className="mb-3 text-sm text-inkNeutral/70 dark:text-linen/70">
          Descarregue uma cópia de todo o seu histórico de aprendizagem, conversas com IA e certificados em formato
          JSON.
        </p>
        <a href="/api/profile/export" className="text-sm text-verdigris underline">
          Descarregar os meus dados
        </a>
      </Card>

      <Card>
        <p className="mb-1 font-display text-lg">Eliminar este perfil</p>
        <p className="mb-3 text-sm text-inkNeutral/70 dark:text-linen/70">
          Elimina permanentemente este perfil e todo o histórico associado a ele. Se for o único perfil da conta, a
          conta em si também é eliminada. Outros perfis da mesma conta (ex. outros membros da família) não são
          afetados.
        </p>
        <DeleteAccountButton />
      </Card>
    </main>
  );
}
