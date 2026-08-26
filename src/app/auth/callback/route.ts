import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Troca o código de confirmação de email / magic link do Supabase por uma sessão.
// Necessário para o fluxo de signup em produção (Site URL + Redirect URLs configurados
// no Supabase — ver docs/11-deploy-netlify-supabase.md, passo 4).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Não foi possível confirmar o email. Tente novamente.")}`);
}
