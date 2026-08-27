import { prisma } from "@/lib/prisma";

// Item #16 da lista de melhorias — o modelo AnalyticsEvent existia no schema
// desde a Fase 0 mas nunca era escrito. Instrumentação básica (não um dashboard
// completo — isso fica para quando houver volume real de dados de uso, como já
// estava planeado em docs/10-scope-mvp1.md).
export async function logEvent(userId: string, eventName: string, props?: Record<string, unknown>) {
  try {
    await prisma.analyticsEvent.create({
      data: { userId, eventName, propsJson: props ?? {} },
    });
  } catch (error) {
    // Analytics nunca deve quebrar uma ação do utilizador.
    console.error("Failed to log analytics event", eventName, error);
  }
}
