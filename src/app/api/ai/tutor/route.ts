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

// AI Tutor v1 — desde 2026-08-26 expõe coach/conversation_partner/interviewer/native_friend
// (ver docs/decisions.md e src/lib/ai/personalities.ts para o porquê de professor/examiner
// continuarem fechados).
export async function POST(req: NextRequest) {
  const user = await requireUser();
  const body = (await req.json()) as {
    conversationId: string | null;
    message: string;
    personality?: string;
    sessionFocus?: string;
  };
  const { conversationId, message, sessionFocus } = body;

  const requestedPersonality = body.personality as TutorPersonalityKey | undefined;
  const personality: TutorPersonalityKey =
    requestedPersonality && TUTOR_PERSONALITIES[requestedPersonality]?.availableInMvp1
      ? requestedPersonality
      : "coach";

  const [profile, recentErrors] = await Promise.all([
    prisma.learningProfile.findUniqueOrThrow({ where: { userId: user.id } }),
    prisma.userError.findMany({ where: { userId: user.id, resolvedAt: null }, orderBy: { lastOccurredAt: "desc" }, take: 5 }),
  ]);

  let conversation = conversationId
    ? await prisma.aIConversation.findUnique({ where: { id: conversationId } })
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
    },
    sessionFocus
  );

  let replyText: string;
  let succeeded = true;
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
      const errorType = errorMatch[1]!;
      const correction = errorMatch[2]!;
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
