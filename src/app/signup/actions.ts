"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  // NÃO criar/atualizar o utilizador aqui. O Supabase, por proteção contra
  // enumeração de contas, devolve sucesso mesmo quando o email JÁ existe — o
  // `update: { name }` reescrevia então o nome do dono verdadeiro da conta, sem
  // autenticação nenhuma (e esse nome aparece no certificado público
  // /verify/[code]). A linha do utilizador é criada de forma segura em
  // requireUser() (src/lib/session.ts), já com sessão válida.
  // Ver docs/decisions.md 2026-08-26 (auditoria).

  // Se a confirmação de email estiver ativa no Supabase (por omissão), não há sessão
  // ainda aqui — o utilizador só entra depois de clicar no link, via /auth/callback.
  if (!data.session) redirect("/signup/check-email");

  redirect("/onboarding");
}
