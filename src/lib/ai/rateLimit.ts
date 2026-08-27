import { prisma } from "@/lib/prisma";

// Limite simples por utilizador para proteger a quota gratuita partilhada do
// Gemini (ver src/lib/ai/gemini.ts) — sem isto, um único utilizador em loop
// (ou um script) podia esgotar a quota diária do projeto e desligar a IA para
// TODOS os utilizadores, sem qualquer aviso. Usa a tabela AnalyticsEvent que já
// existe, com índice em (userId, createdAt) — não precisa de alterar o schema.
// Ver docs/decisions.md, auditoria 2026-08-26.
const WINDOW_MINUTES = 10;
const MAX_CALLS_PER_WINDOW = 20;

// Teto GLOBAL diário (todos os utilizadores juntos) — auditoria ALTO #6
// ("sem rate limiting em nenhum endpoint de IA... pode esgotar a quota gratuita
// partilhada e deixar a IA offline para todos"), sinalizado como NÃO CORRIGIDO.
// O limite por utilizador acima protege contra UM utilizador em loop, mas não
// contra vários utilizadores (ou várias contas) a usarem a quota livremente até
// ao limite diário do Gemini — que é partilhado por todo o projeto, não por
// utilizador. 800/dia é uma estimativa conservadora e deliberadamente bem abaixo
// de qualquer nível gratuito plausível do Gemini flash (não confirmada por teste
// ao vivo, já que os deploys estão pausados) — o objetivo não é usar a quota até
// ao limite exato, é nunca sequer chegar perto dele. Ajustável aqui sem tocar em
// mais nenhum sítio do código se a família precisar de mais.
const GLOBAL_WINDOW_HOURS = 24;
const GLOBAL_MAX_CALLS_PER_WINDOW = 800;

// true = pode chamar o Gemini agora. Regista a chamada como efeito colateral
// quando permite — por isso só deve ser chamada imediatamente antes de, de
// facto, chamar o Gemini (não em modo "dry run").
//
// Falha aberta (allow) em caso de erro na própria verificação: esta função
// protege a quota do Gemini, mas nunca deve ser ELA a quebrar uma funcionalidade
// que de outra forma funcionaria — uma falha transitória na tabela de analytics
// não pode impedir o utilizador de usar o tutor.
export async function checkAiRateLimit(userId: string): Promise<boolean> {
  try {
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
    const count = await prisma.analyticsEvent.count({
      where: { userId, eventName: "ai_call", createdAt: { gte: since } },
    });
    if (count >= MAX_CALLS_PER_WINDOW) return false;

    const globalSince = new Date(Date.now() - GLOBAL_WINDOW_HOURS * 60 * 60 * 1000);
    const globalCount = await prisma.analyticsEvent.count({
      where: { eventName: "ai_call", createdAt: { gte: globalSince } },
    });
    if (globalCount >= GLOBAL_MAX_CALLS_PER_WINDOW) return false;

    await prisma.analyticsEvent.create({ data: { userId, eventName: "ai_call" } });
    return true;
  } catch (error) {
    console.error("checkAiRateLimit failed, allowing by default", error);
    return true;
  }
}

export const AI_RATE_LIMIT_MESSAGE_PT =
  "Fez muitos pedidos à IA em pouco tempo. Espere alguns minutos e tente novamente.";
