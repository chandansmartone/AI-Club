import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { checkApiLimit, increseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const apiKey=process.env.API_KEY;
const openai = new OpenAI({
    apiKey:apiKey,
  });

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt,voice="alloy" } = body;
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    
    const freeTrial=await checkApiLimit();
    const isPro=await checkSubscription();
      if(!freeTrial && !isPro) {
        return new NextResponse("Free trial is expired", {status: 403})
      }

  

      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice,
        input: prompt,
    });

    
    await increseApiLimit();

    const music=Buffer.from(await mp3.arrayBuffer());
    

    return NextResponse.json({ audioBuffer: music.toString('base64') });
  } catch (error) {
    console.log('[IMAGE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};