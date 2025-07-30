import { InferenceClient } from "@huggingface/inference";
import { NextRequest, NextResponse } from "next/server";

const client = new InferenceClient(process.env.HF_TOKEN);

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const chatCompletion = await client.chatCompletion({
      provider: "hf-inference",
      model: "HuggingFaceTB/SmolLM3-3B",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let message = chatCompletion.choices?.[0]?.message?.content || chatCompletion.error || "No response from model.";
    if (typeof message === 'string') {
      message = message.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    }
    return NextResponse.json({ response: message, raw: chatCompletion });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to fetch from Hugging Face", details: e?.message || e }, { status: 500 });
  }
}