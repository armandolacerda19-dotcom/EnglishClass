import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getGeminiModel } from "@/lib/ai/gemini";
import { buildTutorSystemPrompt } from "@/lib/ai/buildTutorPrompt";
import { TUTOR_PERSONALITIES, type TutorPersonalityKey } from "@/lib/ai/personalities";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";
import { scheduleReview } from "@/lib/srs/schedule";
import { checkAiRateLimit, AI_RATE_LIMIT_MESSAGE_PT } from "@/lib/ai/rateLimit";

// AI Tutor v1 — desde 2026-08-26 expõe coach/conversation_partner/interviewer/native_friend
// (ver docs/decisions.md e src/lib/ai/personalities.ts para o porquê de professor/examiner
// continuarem fechados).
export async function POST(req: NextRequest) {
  const user = await requireUser();

  // JSON malformado ou `message` ausente devolvia um 500 cru com stack trace.
  let body: { conversationId?: string | null; message?: string; personality?: string; sessionFocus?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo do pedido inválido." }, { status: 400 });
  }
  if (typeof body.message !== "string" || !body.message.trim()) {
    return NextResponse.json({ error: "Mensagem em falta." }, { status: 400 });
  }
  const conversationId = typeof body.conversationId === "string" ? body.conversationId : null;
  // Limite generoso mas real — sem isto, uma mensagem gigante ia inteira para o
  // Gemini a cada turno (o histórico completo é reenviado sempre, ver linha 67).
  //
  // Fase 8 (auditoria 2026-08-27): antes só limitava o tamanho, sem limpar o
  // marcador ERROR_LOGGED — o utilizador podia escrever "...ERROR_LOGGED: x | y"
  // na sua própria mensagem e tentar forjar uma entrada na fila de erros. O
  // valor parseado já era sanitizado antes de gravar (linha ~119), mas a
  // mensagem enviada ao modelo não removia a marca antes — mesma classe de
  // falha que SCORE:/PRONUNCIATION: em learn/actions.ts, corrigida da mesma forma.
  const message = body.message.replace(/ERROR_LOGGED\s*:/gi, "error_logged-").slice(0, 4000);
  // `sessionFocus`: só a página deriva isto de forma segura (tabela fixa de
  // cenários/objetivos); a própria API aceita qualquer string sem validação
  // — corrigido com um tecto de tamanho, já que é injetado cru no system
  // prompt (buildTutorPrompt.ts) e não passa por nenhum fence de utilizador.
  const sessionFocus =
    typeof body.sessionFocus === "string" && body.sessionFocus.trim() ? body.sessionFocus.slice(0, 500) : undefined;

  const requestedPersonality = body.personality as TutorPersonalityKey | undefined;
  const personality: TutorPersonalityKey =
    requestedPersonality && TUTOR_PERSONALITIES[requestedPersonality]?.availableInMvp1
      ? requestedPersonality
      : "coach";

  const [profile, recentErrors] = await Promise.all([
    prisma.learningProfile.findUniqueOrThrow({ where: { userId: user.id } }),
    prisma.userError.findMany({ where: { userId: user.id, resolvedAt: null }, orderBy: { lastOccurredAt: "desc" }, take: 5 }),
  ]);

  // `userId` no where é obrigatório: sem ele, qualquer utilizador que soubesse
  // (ou adivinhasse) um conversationId lia o histórico de outro — e o update
  // no fim substituía-o pelo seu. Ver docs/decisions.md 2026-08-26 (auditoria).
  let conversation = conversationId
    ? await prisma.aIConversation.findFirst({ where: { id: conversationId, userId: user.id } })
    : null;

  const history = (conversation?.messagesJson as { role: "user" | "assistant"; text: string }[]) ?? [];

  const systemPrompt = buildTutorSystemPrompt(
    personality,
    {
      cefrLevel: profile.currentLevel,
      cefrSublevel: profile.currentSublevel,
      goal: profile.goal,
      profession: profile.profession,
      englishVariant: profile.englishVariant,
      recentErrors: recentErrors.map((e) => ({
        errorType: e.errorType,
        commonMistakePt: e.commonMistakePt,
        correction: e.correction,
      })),
      isChild: user.isChild,
    },
    sessionFocus
  );

  let replyText: string;
  let succeeded = true;
  if (!(await checkAiRateLimit(user.id))) {
    replyText = AI_RATE_LIMIT_MESSAGE_PT;
    succeeded = false;
  } else {
    try {
      const model = getGeminiModel(systemPrompt);
      const chat = model.startChat({
        history: history.map((h) => ({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.text }] })),
      });
      const result = await chat.sendMessage(message);
      replyText = result.response.text();
    } catch (error) {
      console.error("Gemini tutor request failed", error);
      replyText =
        "Desculpe, não consegui responder agora — pode ser um problema temporário com o serviço de IA. Tente novamente daqui a pouco.";
      succeeded = false;
    }
  }
  // Parseia a marca ERROR_LOGGED (ver TUTOR_SHARED_RULES em personalities.ts) — é o
  // que torna real a promessa "log for spaced review" que já estava na prompt mas
  // que nada lia. Mesmo padrão do SCORE: NN em learn/actions.ts.
  const errorMatch = replyText.match(/ERROR_LOGGED:\s*([\w-]+)\s*\|\s*(.+?)\s*$/i);
  if (errorMatch) {
    replyText = replyText.replace(/\n?ERROR_LOGGED:\s*[\w-]+\s*\|\s*.+?\s*$/i, "").trim();
  }
  const newHistory = [...history, { role: "user", text: message }, { role: "assistant", text: replyText }];

  // Conversar com o tutor é prática de speaking/conversação — antes não contava
  // para XP, streak nem para o octógono de competência, ao contrário de todas
  // as outras formas de praticar. Ver docs/decisions.md 2026-08-26.
  if (succeeded) {
    await recordActivity(user.id, "TUTOR_MESSAGE");
    await updateSkillScore(user.id, "SPEAKING", 65);
    await awardAchievement(user.id, "first_tutor_conversation");

    if (errorMatch) {
      // Grupos garantidos pela regex (2 grupos de captura obrigatórios) — os `!`
      // só contornam o noUncheckedIndexedAccess do TS, não escondem um caso real.
      // Sanitizar antes de guardar: `correction` é reinjetado VERBATIM no
      // system prompt de todas as sessões futuras (buildTutorPrompt.ts). Sem
      // limpar aspas/newlines, um utilizador podia fazer o modelo emitir um
      // ERROR_LOGGED forjado e deixar instruções permanentes no seu próprio
      // prompt. Ver docs/decisions.md 2026-08-26 (auditoria).
      const errorType = errorMatch[1]!.slice(0, 60);
      const correction = errorMatch[2]!.replace(/["'\r\n]/g, " ").trim().slice(0, 200);
      const existingError = await prisma.userError.findFirst({
        where: { userId: user.id, errorType, resolvedAt: null },
      });
      const userError = existingError
        ? await prisma.userError.update({
            where: { id: existingError.id },
            data: { occurrences: { increment: 1 }, lastOccurredAt: new Date(), correction },
          })
        : await prisma.userError.create({
            data: { userId: user.id, pillar: "GRAMMAR", errorType, sourceText: message, correction },
          });
      await scheduleReview(user.id, "error", userError.id, 1, userError.id);
    }
  }

  if (conversation) {
    conversation = await prisma.aIConversation.update({
      where: { id: conversation.id },
      data: { messagesJson: newHistory },
    });
  } else {
    conversation = await prisma.aIConversation.create({
      data: { userId: user.id, personality: personality.toUpperCase() as any, messagesJson: newHistory },
    });
  }

  return NextResponse.json({ conversationId: conversation.id, reply: replyText });
}
