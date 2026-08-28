"use server";

import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { updateSkillScore } from "@/lib/skillProfile";
import { getMicroChallenge } from "@/lib/microChallenges";
import { checkDictation } from "@/lib/dictation";

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
export async function completeMicroChallenge(challengeId: string, selectedIndex?: number, transcript?: string) {
  const user = await requireUser();
  const challenge = getMicroChallenge(challengeId);
  if (!challenge) return;

  await recordActivity(user.id, "MICRO_CHALLENGE");

  if (challenge.kind === "shadow") {
    // Fase 9 (auditoria 2026-08-27, achado B: "o transcript nunca é comparado
    // com a frase alvo — ficar em silêncio dá a mesma nota"). Sem gravação
    // real de áudio não há forma de pontuar a PRONÚNCIA, mas há forma de
    // pontuar se a pessoa disse (aproximadamente) a frase certa: reaproveita
    // checkDictation (já testado em src/lib/dictation.test.ts) para comparar
    // o transcript reconhecido com `challenge.sentence`, palavra a palavra —
    // a nota reflete agora quantas palavras bateram certo, com um mínimo de
    // 30 para não penalizar demasiado erros normais de reconhecimento de
    // voz (nomes próprios, ruído de fundo) que não são culpa do utilizador.
    // Fase 16 (auditoria 2026-08-28, achado S3, risco aceite e documentado
    // conscientemente, não corrigido): `challenge.sentence` é mostrado no
    // ecrã E lido por TTS (ver MicroChallengeRunner.tsx) antes de o
    // utilizador falar — por design, é exatamente isso que "shadowing"
    // significa (repetir o que se vê/ouve). Um pedido direto à action com
    // `transcript = challenge.sentence` (sem nunca usar o microfone) recebe
    // sempre a nota máxima, porque não há forma de o servidor distinguir
    // "pronunciou bem" de "enviou a string alvo" sem áudio real gravado — e
    // penalizar coincidências exatas penalizaria também quem genuinamente
    // pronunciou bem. Mesma raiz do teto da Fase 9 (áudio real bloqueado por
    // decisão financeira do utilizador, não por esquecimento): sem gravação
    // e verificação de áudio pagas, este canal continua a ser, na prática,
    // um autorrelato — como `submitSpeaking`'s `confidenceSelfRating`. Não
    // corrigido aqui porque não há correção honesta possível a custo zero;
    // registado para não ser confundido com um bug esquecido.
    const score = transcript ? shadowScoreFromTranscript(transcript, challenge.sentence) : 30;
    await updateSkillScore(user.id, "SPEAKING", score);
    return;
  }

  // "listen": a correção é recalculada aqui, comparando o índice escolhido
  // com o challenge.correctIndex real — nunca confiando num booleano/score
  // já calculado pelo cliente.
  const correct = selectedIndex === challenge.correctIndex;
  await updateSkillScore(user.id, "LISTENING", correct ? 100 : 20);
}

// % de palavras do transcript reconhecido que batem certo com a frase alvo,
// mapeado para 30-100 (nunca 0 — reconhecimento de voz imperfeito não deve
// arrasar o score de quem genuinamente tentou). `checkDictation` já compara
// palavra a palavra ignorando maiúsculas/pontuação; aqui só se aproveita o
// `diff`, não o `isCorrect` (que exige a frase perfeita — bom demais para o
// shadowing, onde o objetivo é praticar oralmente, não escrever com rigor).
function shadowScoreFromTranscript(transcript: string, targetSentence: string): number {
  const { diff } = checkDictation(transcript, targetSentence);
  if (diff.length === 0) return 30;
  const percentCorrect = diff.filter((w) => w.correct).length / diff.length;
  return Math.round(30 + percentCorrect * 70);
}
