"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Só aceita caminhos internos ("/algo"). Sem isto, `?next=https://site-falso`
// fazia a app redirecionar para fora após um login legítimo — uma cadeia de
// phishing que começa no domínio verdadeiro. Ver docs/decisions.md (auditoria).
//
// Fase 8 (auditoria 2026-08-27): a verificação original só bloqueava um
// segundo caractere "/" ("//evil.com"), mas não "\" — e os browsers, por
// especificação do WHATWG URL, normalizam "\" para "/" em esquemas
// especiais, por isso "/\evil.com" resolve na prática a "//evil.com" →
// "https://evil.com". Corrigido para rejeitar também "\" logo a seguir à
// primeira barra, e a limitar o tamanho do valor.
function safeNext(raw: unknown): string {
  const value = typeof raw === "string" ? raw.slice(0, 200) : "";
  return /^\/[^/\\]/.test(value) ? value : "/home";
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
