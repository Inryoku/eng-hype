import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: "nova", // Options: alloy, echo, fable, onyx, nova, shimmer
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      return NextResponse.json(
        { error: errorText },
        { status: response.status },
      );
    }

    // OpenAI returns audio/mpeg (buffers) directly
    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
