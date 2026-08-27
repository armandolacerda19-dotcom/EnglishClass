"use server";

import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { updateSkillScore } from "@/lib/skillProfile";
import { getMicroChallenge } from "@/lib/microChallenges";

// Fase 8 (auditoria 2026-08-27, ACHADO CRÍTICO) — esta action aceitava
// `pillar`/`score` DIRETAMENTE do cliente. Uma Server Action é um endpoint
// POST público: `Pillar` é só uma anotação TypeScript, apagada em runtime —
// nada impedia `completeMicroChallenge("WRITING", 100)` chamado à mão, que
// somado às outras 5 rotas do mesmo tipo bastava para pôr os 8 pilares do
// octógono a 100 e emitir um certificado público forjado (ver
// src/lib/certificate.ts). Corrigido: o cliente passa só `challengeId` (e,
// para "listen", o índice escolhido) — pilar e nota são SEMPRE derivados no
// servidor a partir do desafio real (src/lib/microChallenges.ts), nunca do
// que o cliente diz que aconteceu.
export async function completeMicroChallenge(challengeId: string, selectedIndex?: number) {
  const user = await requireUser();
  const challenge = getMicroChallenge(challengeId);
  if (!challenge) return;

  await recordActivity(user.id, "MICRO_CHALLENGE");

  if (challenge.kind === "shadow") {
    // Sem gravação real de áudio, não há forma de verificar a pronúncia — o
    // score de participação (65) é uma constante fixa no servidor, não um
    // valor recebido do cliente.
    await updateSkillScore(user.id, "SPEAKING", 65);
    return;
  }

  // "listen": a correção é recalculada aqui, comparando o índice escolhido
  // com o challenge.correctIndex real — nunca confiando num booleano/score
  // já calculado pelo cliente.
  const correct = selectedIndex === challenge.correctIndex;
  await updateSkillScore(user.id, "LISTENING", correct ? 100 : 20);
}
