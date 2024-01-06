import { auth } from "@clerk/nextjs";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {NextResponse} from "next/server"
import { checkApiLimit, increseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
  apiKey:process.env.API_KEY,
});
const instructionMessage: ChatCompletionMessageParam = {
  role: "system",
  content: "you are a code generator. You must answer only in markdown code snippets.use code comments for explanations"
}
export async function POST(req: Request) {
    try {
      // check for user
      const { userId } = auth();
      const body = await req.json();
      const { messages } = body;
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      
  
      // check for openAi Key
      if (!openai.apiKey) {
        return new NextResponse("OpenAI Api Key not Configured", { status: 500 });
      }
  // check for messages
      if (!messages) {
        return new NextResponse("Messages are required", { status: 400 });
      }
  
      const freeTrial = await checkApiLimit()
      const isPro=await checkSubscription();
      if(!freeTrial && !isPro) {
        return new NextResponse("Free trial is expired", {status: 403})
      }
  
     
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [instructionMessage, ...messages]
      });
  
      
      await increseApiLimit();
     
  
      return NextResponse.json(response.choices[0].message);
    } catch (error) {
      console.log('[Code_ERROR]', error);
  
      return new NextResponse("Internal Error", { status: 500 });
    }
  }