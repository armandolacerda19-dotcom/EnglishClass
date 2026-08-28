import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { evaluateConversation } from "@/lib/ai/evaluateConversation";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";

// Avaliação estruturada de fim de conversa — Exercise Engine (docs/12-exercise-engine.md).
// Rota irmã de api/ai/tutor/route.ts, mesmo padrão de verificação de dono
// (userId no where, nunca só o id recebido) para ninguém avaliar/ler a
// conversa de outra pessoa.
export async function POST(req: NextRequest) {
  const user = await requireUser();

  let body: { conversationId?: string; usedVoice?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo do pedido inválido." }, { status: 400 });
  }
  if (typeof body.conversationId !== "string") {
    return NextResponse.json({ error: "conversationId em falta." }, { status: 400 });
  }

  const conversation = await prisma.aIConversation.findFirst({
    where: { id: body.conversationId, userId: user.id },
  });
  if (!conversation) {
    return NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });
  }

  const messages = conversation.messagesJson as { role: "user" | "assistant"; text: string }[];
  const evaluation = await evaluateConversation(messages, body.usedVoice === true, user.id);

  await prisma.aIConversation.update({
    where: { id: conversation.id },
    data: { feedbackJson: evaluation as any, endedAt: new Date() },
  });

  // As 3 dimensões avaliadas de verdade a partir do conteúdo real da
  // conversa substituem, com um sinal muito melhor, o SPEAKING=65 fixo já
  // atribuído por mensagem em api/ai/tutor/route.ts — mesma EMA, só mais uma
  // amostra, desta vez uma amostra informada em vez de um valor constante.
  await updateSkillScore(user.id, "GRAMMAR", evaluation.grammar);
  await updateSkillScore(user.id, "VOCABULARY", evaluation.vocabulary);
  await updateSkillScore(user.id, "SPEAKING", evaluation.fluency);
  if (evaluation.pronunciation !== null) {
    await updateSkillScore(user.id, "PRONUNCIATION", evaluation.pronunciation);
  }

  await recordActivity(user.id, "SPEAKING");
  await awardAchievement(user.id, "first_conversation_evaluation");

  return NextResponse.json(evaluation);
}
