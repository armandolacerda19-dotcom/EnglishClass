import Link from "next/link";
import { cookies } from "next/headers";
import { requireAccount, ACTIVE_PROFILE_COOKIE } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { selectProfile, createProfile } from "./actions";

// Tem de ficar em sincronia com MAX_PROFILES_PER_ACCOUNT em ./actions.ts —
// não pode ser importado daqui porque um ficheiro "use server" só pode
// exportar funções async (restrição do Next.js), nunca uma constante.
const MAX_PROFILES_PER_ACCOUNT = 6;

const AVATAR_BG: Record<string, string> = {
  verdigris: "bg-verdigris",
  brass: "bg-brass",
  clay: "bg-clay",
};

// Seletor de perfil — Fase 6 ("Família": perfis múltiplos sob um único
// login, estilo Netflix). Contas com um só perfil nunca veem isto: o
// perfil único é escolhido automaticamente em requireUser() e este ecrã só
// existe para quando há mais do que um. Ver src/lib/session.ts.
export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const account = await requireAccount();
  const profiles = await prisma.profile.findMany({
    where: { userId: account.id },
    orderBy: { createdAt: "asc" },
  });

  // Fase 12 (auditoria 2026-08-27, "beco sem saída em /profiles") — uma conta
  // com 1 só perfil que chega aqui via "Gerir perfis" (Definições)
  // não tinha forma nenhuma de voltar atrás sem cancelar a navegação do
  // browser: só o cartão "Adicionar pessoa" aparecia. Mostra-se "Voltar" só
  // quando é seguro (`/home` não vai fazer bounce de volta para aqui): com 1
  // perfil, requireUser() escolhe-o sempre automaticamente; com 2+, só se o
  // cookie de perfil ativo já apontar para um perfil válido desta conta.
  const activeProfileId = cookies().get(ACTIVE_PROFILE_COOKIE)?.value;
  const canGoBack = profiles.length === 1 || profiles.some((p) => p.id === activeProfileId);

  // Alcançável de duas formas: (1) automaticamente por requireUser() quando
  // há 2+ perfis e nenhum ativo — nesse caso profiles.length é sempre > 1;
  // (2) manualmente a partir de "Gerir perfis" em Definições, incluindo com
  // um só perfil, para adicionar o segundo. Por isso não há redirect
  // automático aqui — só se mostra o seletor quando há mesmo o que escolher.
  return (
    <main className="mx-auto flex min-h-screen max-w-lg lg:max-w-2xl flex-col justify-center px-6 py-10">
      <h1 className="mb-2 text-center font-display text-2xl">Quem está a aprender?</h1>
      <p className="mb-8 text-center text-sm text-inkNeutral/70 dark:text-linen/70">
        Cada pessoa tem o seu próprio progresso, XP e revisões.
      </p>

      {searchParams.error && <p className="mb-4 text-center text-sm text-clay">{searchParams.error}</p>}

      {profiles.length > 1 && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {profiles.map((profile) => (
            <form key={profile.id} action={selectProfile.bind(null, profile.id)}>
              <button type="submit" className="flex w-full flex-col items-center gap-2 rounded-card p-3 hover:bg-ink/5 dark:hover:bg-linen/5">
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl text-white ${AVATAR_BG[profile.avatarColor] ?? "bg-verdigris"}`}
                >
                  {profile.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm">{profile.name}</span>
                {profile.isChild && <span className="font-mono text-[10px] text-inkNeutral/50 dark:text-linen/50">criança</span>}
              </button>
            </form>
          ))}
        </div>
      )}

      {profiles.length < MAX_PROFILES_PER_ACCOUNT ? (
        <Card>
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-verdigris">Adicionar pessoa</p>
          <form action={createProfile} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5 text-sm">
              Nome
              <TextField name="name" required maxLength={60} />
            </label>
            <label className="flex items-center gap-2 text-sm text-inkNeutral/70 dark:text-linen/70">
              <input type="checkbox" name="isChild" className="h-4 w-4" />
              É uma criança (ajusta o tom das explicações)
            </label>
            <Button type="submit" variant="secondary">
              Criar perfil
            </Button>
          </form>
        </Card>
      ) : (
        <p className="text-center text-sm text-inkNeutral/60 dark:text-linen/60">
          Limite de {MAX_PROFILES_PER_ACCOUNT} perfis por conta atingido.
        </p>
      )}

      {canGoBack && (
        <Link href="/home" className="mt-6 text-center text-sm text-inkNeutral/60 hover:text-verdigris dark:text-linen/60">
          ← Voltar
        </Link>
      )}
    </main>
  );
}
