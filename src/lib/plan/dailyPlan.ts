// "Inglês de Hoje" — secção 47 do master prompt da auditoria (2026-08-26):
// a app devia gerar um plano concreto para o dia, adaptado ao tempo
// disponível (15/30/60/90 min), em vez de deixar o utilizador a escolher às
// cegas entre uma lista de atalhos sempre igual. Função pura, sem escrita na
// base de dados — deriva-se de `dailyMinutesTarget` (já existe em
// LearningProfile) e é recalculada a cada visita à Home, por isso nunca fica
// desatualizada nem precisa de schema novo.

import { PILLAR_LABEL } from "@/lib/pillarDisplay";

export interface DailyPlanItem {
  label: string;
  minutes: number;
  href: string;
}

// Auditoria 2026-08-27, "Top 5 ações imediatas" #4: o item dizia "Tema à
// escolha (pilar mais fraco)" mas ligava sempre para o seletor genérico
// /practice/topic, nunca para /practice/topic/[pillar] com o pilar real —
// a UI prometia adaptação que não acontecia. `/practice/topic/[pillar]` só
// aceita os 5 pilares com exercícios discretos seedados (não SPEAKING/
// WRITING/PRONUNCIATION, que não têm banco de exercícios de escolha
// múltipla) — por isso só se usa o primeiro `weakArea` que pertença a este
// conjunto; sem nenhum, cai de volta no seletor genérico.
const TOPIC_PRACTICE_PILLARS = new Set(["GRAMMAR", "VOCABULARY", "LISTENING", "READING", "TRANSLATION"]);

function topicItem(minutes: number, weakestPillar: string | undefined): DailyPlanItem {
  if (!weakestPillar) return { label: "Tema à escolha", minutes, href: "/practice/topic" };
  const label = PILLAR_LABEL[weakestPillar] ?? weakestPillar.toLowerCase();
  return { label: `Tema à escolha: ${label}`, minutes, href: `/practice/topic/${weakestPillar.toLowerCase()}` };
}

// Escalões alinhados com generateStandardPlan (src/lib/plan/generate.ts) —
// "Hábito mínimo" (≤5), "Normal" (≤15), "Acelerado" (≤30), "Compromisso
// elevado" (>30) — para os dois textos nunca se contradizerem.
// `weakAreas` (opcional, retrocompatível): `LearningProfile.weakAreas`, na
// ordem em que o octógono os calcula — o primeiro elegível para
// /practice/topic/[pillar] é o usado.
export function generateDailyPlan(dailyMinutes: number, hasDueReviews: boolean, weakAreas: string[] = []): DailyPlanItem[] {
  const items: DailyPlanItem[] = [];
  const weakestPillar = weakAreas.find((p) => TOPIC_PRACTICE_PILLARS.has(p));

  if (dailyMinutes <= 5) {
    items.push({ label: "Micro-desafio rápido", minutes: dailyMinutes, href: "/practice/micro-challenges" });
    return items;
  }

  if (dailyMinutes <= 15) {
    if (hasDueReviews) items.push({ label: "Revisão espaçada", minutes: 5, href: "/practice/review" });
    items.push(topicItem(hasDueReviews ? dailyMinutes - 5 : dailyMinutes, weakestPillar));
    return items;
  }

  if (dailyMinutes <= 30) {
    // Fase 8 (auditoria 2026-08-27) — bug real encontrado ao escrever o
    // primeiro teste automático deste ficheiro: para 16-19 min COM revisões
    // pendentes, `dailyMinutes - 20` dava um valor negativo (revisão 10 +
    // desafio diário 10 = 20, mais do que o total disponível nesses casos),
    // mostrando ao utilizador um item de "-4 min". `Math.max(5, ...)` garante
    // um mínimo de 5 minutos de tema mesmo nesse extremo — o total do dia
    // pode ultrapassar ligeiramente `dailyMinutes` nesse caso raro, o que é
    // preferível a um número sem sentido no ecrã.
    if (hasDueReviews) items.push({ label: "Revisão espaçada", minutes: 10, href: "/practice/review" });
    items.push(topicItem(Math.max(5, hasDueReviews ? dailyMinutes - 20 : dailyMinutes - 10), weakestPillar));
    items.push({ label: "Desafio Diário de vocabulário", minutes: 10, href: "/practice/daily-challenge" });
    return items;
  }

  // > 30 min: "Compromisso elevado" — inclui sempre speaking, o pilar mais
  // difícil de praticar sozinho e a prioridade declarada da app.
  if (hasDueReviews) items.push({ label: "Revisão espaçada", minutes: 10, href: "/practice/review" });
  items.push(topicItem(15, weakestPillar));
  items.push({ label: "Sessão de speaking com o Tutor", minutes: 15, href: "/speak" });
  const remaining = dailyMinutes - (hasDueReviews ? 40 : 30);
  if (remaining >= 15) {
    items.push({ label: "Texto de leitura", minutes: 10, href: "/practice/reading" });
    items.push({ label: "Diagnóstico Semanal (se ainda não fez esta semana)", minutes: remaining - 10, href: "/practice/weekly-test" });
  } else if (remaining > 0) {
    items.push({ label: "Texto de leitura", minutes: remaining, href: "/practice/reading" });
  }
  return items;
}
