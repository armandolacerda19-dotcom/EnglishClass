import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getGeminiModel } from "@/lib/ai/gemini";
import { buildTutorSystemPrompt } from "@/lib/ai/buildTutorPrompt";

// AI Tutor v1 — MVP1 expõe apenas a personalidade "coach" (docs/10-scope-mvp1.md).
export async function POST(req: NextRequest) {
  const user = await requireUser();
  const { conversationId, message } = (await req.json()) as { conversationId: string | null; message: string };

  const [profile, recentErrors] = await Promise.all([
    prisma.learningProfile.findUniqueOrThrow({ where: { userId: user.id } }),
    prisma.userError.findMany({ where: { userId: user.id, resolvedAt: null }, orderBy: { lastOccurredAt: "desc" }, take: 5 }),
  ]);

  let conversation = conversationId
    ? await prisma.aIConversation.findUnique({ where: { id: conversationId } })
    : null;

  const history = (conversation?.messagesJson as { role: "user" | "assistant"; text: string }[]) ?? [];

  const systemPrompt = buildTutorSystemPrompt("coach", {
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
  });

  let replyText: string;
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
  }
  const newHistory = [...history, { role: "user", text: message }, { role: "assistant", text: replyText }];

  if (conversation) {
    conversation = await prisma.aIConversation.update({
      where: { id: conversation.id },
      data: { messagesJson: newHistory },
    });
  } else {
    conversation = await prisma.aIConversation.create({
      data: { userId: user.id, personality: "COACH", messagesJson: newHistory },
    });
  }

  return NextResponse.json({ conversationId: conversation.id, reply: replyText });
}
