import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// Garante um utilizador autenticado e devolve o registo correspondente na
// nossa base de dados (criando-o na primeira visita a seguir ao signup do Supabase).
export async function requireUser() {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const user = await prisma.user.upsert({
    where: { email: authUser.email! },
    update: {},
    create: {
      email: authUser.email!,
      name: authUser.user_metadata?.name ?? authUser.email!.split("@")[0],
    },
  });

  return user;
}

export async function requireUserWithProfile() {
  const user = await requireUser();
  const learningProfile = await prisma.learningProfile.findUnique({ where: { userId: user.id } });

  if (!learningProfile) redirect("/onboarding");

  return { user, learningProfile };
}
