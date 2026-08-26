import { NextRequest, NextResponse } from "next/server";

// Transcrição via Whisper API — decisão registada em docs/decisions.md
// ("usar Whisper API já no MVP1" em vez de Web Speech API, por fiabilidade cross-browser).
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const audio = form.get("audio");

  if (!audio || !(audio instanceof Blob)) {
    return NextResponse.json({ error: "Ficheiro de áudio em falta." }, { status: 400 });
  }

  const whisperForm = new FormData();
  whisperForm.append("file", audio, "recording.webm");
  whisperForm.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: whisperForm,
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: `Falha na transcrição: ${errorText}` }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json({ transcript: data.text as string });
}
