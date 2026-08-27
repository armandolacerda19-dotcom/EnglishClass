import { requireUserWithProfile } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { SettingsToggles } from "@/components/profile/SettingsToggles";

export default async function SettingsPage() {
  const { learningProfile } = await requireUserWithProfile();

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-6 font-display text-2xl">Definições</h1>

      <Card className="mb-4">
        <SettingsToggles
          immersionMode={learningProfile.immersionMode}
          accessibleReadingMode={learningProfile.accessibleReadingMode}
        />
      </Card>
    </main>
  );
}
