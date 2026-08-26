"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const name = String(formData.get("name"));

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });

  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  if (!data.user) redirect(`/signup?error=${encodeURIComponent("Não foi possível criar a conta.")}`);

  await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });

  redirect("/onboarding");
}
