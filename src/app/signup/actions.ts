"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const name = String(formData.get("name"));

  const supabase = createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name }, emailRedirectTo: `${siteUrl}/auth/callback` },
  });

  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  if (!data.user) redirect(`/signup?error=${encodeURIComponent("Não foi possível criar a conta.")}`);

  await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });

  // Se a confirmação de email estiver ativa no Supabase (por omissão), não há sessão
  // ainda aqui — o utilizador só entra depois de clicar no link, via /auth/callback.
  if (!data.session) redirect("/signup/check-email");

  redirect("/onboarding");
}
