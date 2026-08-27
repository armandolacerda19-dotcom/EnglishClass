import { requireUserWithProfile } from "@/lib/session";
import { getDueReviews } from "@/lib/srs/schedule";
import { ReviewRunner } from "@/components/challenge/ReviewRunner";
import { Card } from "@/components/ui/Card";

// Fila de revisão espaçada (SM-2) — src/lib/srs/. Junta palavras e erros
// vencidos num único fluxo, mais antigo primeiro.
export default async function ReviewPage() {
  const { user } = await requireUserWithProfile();
  const reviews = await getDueReviews(user.id);

  if (reviews.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-6 py-10">
        <h1 className="mb-4 font-display text-2xl">Revisão</h1>
        <Card>
          <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
            Sem revisões pendentes agora. Continue a fazer o Desafio Diário e as lições — os itens que precisar de
            reforçar aparecem aqui automaticamente, no momento certo para não os esquecer.
          </p>
        </Card>
      </main>
    );
  }

  return <ReviewRunner reviews={reviews} />;
}
