import { requireUserWithProfile } from "@/lib/session";
import { getDailyOrderingSet } from "@/lib/sentenceOrdering";
import { OrderingRunner } from "@/components/challenge/OrderingRunner";

// Ordenar Frases — tipo de exercício novo (pedido do utilizador, 2026-08-28).
// Mesmo padrão de entrada direta do Ditado: um conjunto de 5 frases já
// selecionado por dia, sem hub de escolha antes.
export default async function OrderingPage() {
  await requireUserWithProfile();
  const items = getDailyOrderingSet();

  return <OrderingRunner items={items} />;
}
