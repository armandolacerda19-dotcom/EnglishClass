import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PlacementTestRunner } from "@/components/placement/PlacementTestRunner";
import { EnglishVariantProvider } from "@/components/ui/EnglishVariantContext";

export default async function PlacementPage() {
  const user = await requireUser();
  // Fase 9 — o sotaque já foi escolhido no passo anterior do onboarding
  // (saveOnboardingBasics), antes de chegar aqui; sem este Provider, o teste
  // de nível (que já usa PlayTranscript em perguntas de listening) ouvia
  // sempre a voz "internacional" por omissão, ignorando essa escolha.
  const learningProfile = await prisma.learningProfile.findUnique({ where: { userId: user.id } });

  return (
    <EnglishVariantProvider value={learningProfile?.englishVariant ?? "INTERNATIONAL"}>
      <PlacementTestRunner />
    </EnglishVariantProvider>
  );
}
