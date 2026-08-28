import { prisma } from "@/lib/prisma";
import { formatLevelCode } from "@/lib/level";

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

// Traduzido para português: ficava em inglês bruto no certificado público
// /verify/[code] e em /progress, na única app que promete 100% português
// europeu. Certificados já emitidos guardam o texto antigo em inglês — é um
// registo histórico imutável, não é retroativamente reescrito, o que é o
// comportamento correto para um documento já assinado/publicado. Ver
// docs/decisions.md, auditoria 2026-08-26.
// Exportada (Fase 8, auditoria 2026-08-27) para ter um teste unitário direto
// sobre as fronteiras de classificação, sem precisar de mockar o Prisma.
export function classify(average: number): string {
  if (average < 50) return "Ainda não pronto";
  if (average < 65) return "Em desenvolvimento";
  if (average < 80) return "Competente";
  if (average < 90) return "Forte";
  return "Excecional";
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

  const certificate = await prisma.certificate.create({
    data: {
      userId,
      cefr: profile.currentLevel,
      overallScore: average,
      classification: classify(average),
      skillBreakdownJson: Object.fromEntries(PILLAR_FIELDS.map((f, i) => [f, scores[i]])),
    },
  });

  // Fase 13 (auditoria 2026-08-27, achado real, o mesmo padrão de "conta mas
  // não age" já corrigido para UserError.occurrences na Fase 11) —
  // `currentLevel`/`currentSublevel` só eram escritos UMA vez, no placement
  // test (`api/placement/submit/route.ts`), e nunca mais mudavam. Um
  // utilizador podia completar o currículo inteiro de vários níveis a
  // seguir ao seu, ganhar certificado atrás de certificado no MESMO nível
  // congelado, e o crachá/nível mostrado em toda a app nunca avançava.
  // Agora: ganhar o certificado do nível atual avança para o subnível
  // seguinte, se existir (Sublevel.order é sequencial e único — ver
  // levels.json). Sem próximo subnível seedado (hoje, depois de B2.2), fica
  // no nível atual — não é um erro, só o teto do currículo por agora.
  const currentSublevelRow = await prisma.sublevel.findUnique({ where: { code: formatLevelCode(profile) } });
  if (currentSublevelRow) {
    const nextSublevelRow = await prisma.sublevel.findUnique({
      where: { order: currentSublevelRow.order + 1 },
      include: { level: true },
    });
    if (nextSublevelRow) {
      await prisma.learningProfile.update({
        where: { userId },
        data: { currentLevel: nextSublevelRow.level.cefr, currentSublevel: nextSublevelRow.number },
      });
    }
  }

  return certificate;
}
