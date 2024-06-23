import { auth } from "@clerk/nextjs";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { NextResponse } from "next/server";
import { checkApiLimit, increseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const apiKey = process.env.API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

const instructionMessage: ChatCompletionMessageParam = {
  role: "system",
  content: "Answer questions as short and quickly as possible. You must do it under 75 tokens.",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse("Messages are required and should be an array", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial is expired", { status: 403 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
    });

    await increseApiLimit();

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
