import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { checkApiLimit, increseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const apiKey = process.env.API_KEY;
const openai = new OpenAI({
  apiKey: apiKey,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const formData = await req.formData();
    
    const audioFile = formData.get('file');
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!audioFile || !(audioFile instanceof File)) {
      return new NextResponse("Audio file is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial is expired", { status: 403 });
    }

    const audioBuffer = await audioFile.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: audioFile.type });
    const file = new File([audioBlob], audioFile.name, {
      type: audioFile.type,
      lastModified: Date.now(),
    });

    const response = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: file,
    });

    await increseApiLimit();

    return NextResponse.json({ transcription: response.text });
  } catch (error) {
    console.log('[SPEECH_TO_TEXT_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
