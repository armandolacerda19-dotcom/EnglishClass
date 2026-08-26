import { requireUser } from "@/lib/session";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default async function OnboardingPage() {
  await requireUser();
  return <OnboardingWizard />;
}
