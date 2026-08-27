import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { SettingsToggles } from "@/components/profile/SettingsToggles";
import { SwitchProfileButton } from "@/components/profile/SwitchProfileButton";
import { renameProfile } from "./actions";

const AVATAR_BG: Record<string, string> = {
  verdigris: "bg-verdigris",
  brass: "bg-brass",
  clay: "bg-clay",
};

export default async function SettingsPage() {
  const { user, learningProfile } = await requireUserWithProfile();

  // Fase 6 ("Família") — mostrado sempre, mesmo com um só perfil, para que
  // "adicionar um familiar" seja descobrível a partir daqui. Ver src/lib/session.ts.
  const otherProfiles = await prisma.profile.findMany({
    where: { userId: user.accountId, id: { not: user.id } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-6 font-display text-2xl">Definições</h1>

      <Card className="mb-4">
        <SettingsToggles
          immersionMode={learningProfile.immersionMode}
          accessibleReadingMode={learningProfile.accessibleReadingMode}
        />
      </Card>

      <Card>
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-verdigris">Família</p>
        <div className="mb-3 flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-base text-white ${AVATAR_BG[user.avatarColor] ?? "bg-verdigris"}`}
          >
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="flex-1">
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Perfil ativo</p>
            {/* Fase 12 — antes não havia forma de corrigir o nome de um perfil
                depois de criado. `key={user.name}` força o TextField a
                remontar com o valor atualizado depois do submit (Server
                Actions não devolvem o novo valor para um `defaultValue`
                atualizar sozinho). */}
            <form action={renameProfile} className="mt-1 flex gap-2">
              <TextField key={user.name} name="name" defaultValue={user.name} maxLength={60} required className="text-sm" />
              <Button type="submit" variant="ghost">
                Guardar
              </Button>
            </form>
          </div>
        </div>
        {otherProfiles.length > 0 && (
          <p className="mb-3 text-xs text-inkNeutral/60 dark:text-linen/60">
            Também nesta conta: {otherProfiles.map((p) => p.name).join(", ")}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <SwitchProfileButton />
          <Link
            href="/profiles"
            className="rounded-control border border-ink/10 px-4 py-2 text-sm hover:border-verdigris dark:border-linen/10"
          >
            Gerir perfis
          </Link>
        </div>
      </Card>
    </main>
  );
}
