"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { requireUser, ACTIVE_PROFILE_COOKIE } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// Eliminação — RGPD, disponível desde o MVP1. Desde a Fase 6 ("Família"),
// isto elimina o PERFIL ativo, não a conta inteira — numa conta com vários
// perfis, apagar o teu não deve apagar o progresso dos outros. A maioria
// das relações de Profile tem onDelete: Cascade (ver prisma/schema.prisma),
// por isso apagar o Profile remove todo o histórico de aprendizagem
// associado a ele, mas nada mais.
export async function deleteAccount() {
  const user = await requireUser();
  const supabase = createClient();

  const remainingProfilesAfter = await prisma.profile.count({
    where: { userId: user.accountId, id: { not: user.id } },
  });

  await prisma.profile.delete({ where: { id: user.id } });
  cookies().delete(ACTIVE_PROFILE_COOKIE);

  if (remainingProfilesAfter === 0) {
    // Era o último perfil da conta — sem mais ninguém a usar este login,
    // apaga também a conta e termina a sessão.
    await prisma.user.delete({ where: { id: user.accountId } }).catch(() => {});
    await supabase.auth.signOut();
    redirect("/");
  }

  redirect("/profiles");
}
