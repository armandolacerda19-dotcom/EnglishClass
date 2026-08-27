import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const ACTIVE_PROFILE_COOKIE = "active_profile_id";

// Conta autenticada no Supabase — o "login da família" (Fase 6: uma conta
// pode ter vários perfis, ver Profile em prisma/schema.prisma). Nunca usar
// isto para filtrar dados de aprendizagem — usar requireUser() abaixo, que
// devolve o PERFIL ativo, não a conta partilhada.
export async function requireAccount() {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const account = await prisma.user.upsert({
    where: { email: authUser.email! },
    update: {},
    create: {
      email: authUser.email!,
      name: authUser.user_metadata?.name ?? authUser.email!.split("@")[0],
    },
  });

  return account;
}

// Perfil ativo dentro da conta — Fase 6 ("Família": perfis múltiplos sob um
// único login, estilo Netflix). Devolve um objeto com o MESMO formato que
// existia antes desta funcionalidade (id, name, email, createdAt), para que
// todo o resto do código continue a funcionar sem alterações — só que
// `.id` passa a identificar o PERFIL, não a conta partilhada. A conta real
// fica disponível em `.accountId`/`.accountEmail` para os poucos sítios que
// precisam mesmo dela (ex. apagar a conta quando o último perfil é apagado).
//
// Contas com um só perfil (o caso comum, incluindo todas as contas criadas
// antes desta funcionalidade existir) nunca veem nenhum seletor — o perfil
// único é escolhido automaticamente. O seletor em /profiles só aparece com
// 2+ perfis e nenhum cookie de perfil ativo válido (ex. primeira visita
// depois de um segundo perfil ser criado, ou mudou de conta no mesmo browser).
export async function requireUser() {
  const account = await requireAccount();

  const profiles = await prisma.profile.findMany({
    where: { userId: account.id },
    orderBy: { createdAt: "asc" },
  });

  let activeProfile = profiles[0] ?? null;

  if (profiles.length === 0) {
    // Primeira visita desta conta — cria o perfil inicial automaticamente
    // com o nome da conta, replicando o comportamento de sempre (1 conta =
    // 1 perfil) sem exigir um passo extra a quem já usa a app.
    activeProfile = await prisma.profile.create({
      data: { userId: account.id, name: account.name },
    });
  } else if (profiles.length > 1) {
    const cookieStore = cookies();
    const activeId = cookieStore.get(ACTIVE_PROFILE_COOKIE)?.value;
    const match = activeId ? profiles.find((p) => p.id === activeId) : undefined;
    if (!match) redirect("/profiles");
    activeProfile = match;
  }

  return {
    id: activeProfile!.id,
    name: activeProfile!.name,
    email: account.email,
    createdAt: activeProfile!.createdAt,
    avatarColor: activeProfile!.avatarColor,
    isChild: activeProfile!.isChild,
    accountId: account.id,
    accountEmail: account.email,
  };
}

export async function requireUserWithProfile() {
  const user = await requireUser();
  const learningProfile = await prisma.learningProfile.findUnique({ where: { userId: user.id } });

  if (!learningProfile) redirect("/onboarding");

  return { user, learningProfile };
}
