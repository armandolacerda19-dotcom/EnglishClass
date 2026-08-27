import { prisma } from "@/lib/prisma";

// Certificação interna — item #17 da lista de melhorias. O modelo Certificate já
// existia no schema (Fase 0) mas nunca era escrito. Sem biblioteca de geração de
// QR disponível nesta sessão (sem npm install possível no fluxo de trabalho desta
// app — só o build da Netlify instala dependências), a "prova" de progresso é um
// código de verificação (verificationCode, já gerado pelo Prisma) e uma página
// /verify/[code] pública — não uma imagem de QR code real. Ver docs/decisions.md.

const PILLAR_FIELDS = [
  "grammarScore",
  "vocabularyScore",
  "listeningScore",
  "speakingScore",
  "pronunciationScore",
  "readingScore",
  "writingScore",
  "translationScore",
] as const;

function classify(average: number): string {
  if (average < 50) return "Not ready";
  if (average < 65) return "Developing";
  if (average < 80) return "Competent";
  if (average < 90) return "Strong";
  return "Exceptional";
}

// Chamado após um Diagnóstico Semanal — se a média dos 8 pilares justificar
// (Competent ou acima) e ainda não existir certificado para este nível, emite um.
// Devolve null se já existia (não é "novo"), para o chamador só celebrar a
// primeira vez que este nível é certificado.
export async function maybeIssueCertificate(userId: string) {
  const profile = await prisma.learningProfile.findUnique({ where: { userId } });
  if (!profile) return null;

  const scores = PILLAR_FIELDS.map((f) => (profile as unknown as Record<string, number>)[f] ?? 0);
  const withSignal = scores.filter((s) => s > 0);
  if (withSignal.length < PILLAR_FIELDS.length) return null; // precisa de sinal em todos os pilares

  const average = Math.round(withSignal.reduce((a, b) => a + b, 0) / withSignal.length);
  if (average < 65) return null;

  const existing = await prisma.certificate.findFirst({
    where: { userId, cefr: profile.currentLevel },
  });
  if (existing) return null;

  return prisma.certificate.create({
    data: {
      userId,
      cefr: profile.currentLevel,
      overallScore: average,
      classification: classify(average),
      skillBreakdownJson: Object.fromEntries(PILLAR_FIELDS.map((f, i) => [f, scores[i]])),
    },
  });
}
