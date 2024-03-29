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
      "meta/musicgen:b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38",
      {
        input: {
          top_k: 250,
          top_p: 0,
          prompt: prompt,
          duration: 15,
          temperature: 1,
          continuation: false,
          model_version: "stereo-large",
          output_format: "wav",
          continuation_start: 0,
          multi_band_diffusion: false,
          normalization_strategy: "peak",
          classifier_free_guidance: 3
        }
      }
    );

    await increseApiLimit();
    console.log(response);
    
    return NextResponse.json(response);
  } catch (error) {
    console.log('[MUSIC_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};