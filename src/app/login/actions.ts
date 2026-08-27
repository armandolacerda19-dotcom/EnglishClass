"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Só aceita caminhos internos ("/algo"). Sem isto, `?next=https://site-falso`
// fazia a app redirecionar para fora após um login legítimo — uma cadeia de
// phishing que começa no domínio verdadeiro. Ver docs/decisions.md (auditoria).
function safeNext(raw: unknown): string {
  const value = typeof raw === "string" ? raw : "";
  return /^\/(?!\/)/.test(value) ? value : "/home";
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const next = safeNext(formData.get("next"));

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect(next);
}
