import { NextRequest, NextResponse } from "next/server";
import { buildPrompt, DesignOptions } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const options: DesignOptions = await req.json();
    const prompt = buildPrompt(options);

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("OpenAI error:", err);
      return NextResponse.json(
        { error: "Error al generar el diseño. Intenta de nuevo." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const imageUrl = data.data[0]?.url;
    const revisedPrompt = data.data[0]?.revised_prompt;

    return NextResponse.json({ imageUrl, revisedPrompt, prompt });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
