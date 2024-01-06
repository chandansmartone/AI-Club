import Replicate from "replicate";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { checkApiLimit, increseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt  } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    const freeTrial=await checkApiLimit();
    const isPro=await checkSubscription();
      if(!freeTrial && !isPro) {
        return new NextResponse("Free trial is expired", {status: 403})
      }

 
   
    const response = await replicate.run(
        "anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f",
        {
          input: {
            prompt,
          }
        }
      );
      await increseApiLimit();
  
    return NextResponse.json(response);
  } catch (error) {
    console.log('[Video_Error]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};