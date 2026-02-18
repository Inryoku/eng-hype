import { NextRequest, NextResponse } from "next/server";

// --- Gemini TTS: WAV header helper ---
const SAMPLE_RATE = 24000;
const NUM_CHANNELS = 1;
const BIT_DEPTH = 16;

function addWavHeader(pcmData: Buffer): Buffer {
  const header = Buffer.alloc(44);
  const byteRate = (SAMPLE_RATE * NUM_CHANNELS * BIT_DEPTH) / 8;
  const blockAlign = (NUM_CHANNELS * BIT_DEPTH) / 8;
  const dataSize = pcmData.length;
  const chunkSize = 36 + dataSize;

  header.write("RIFF", 0);
  header.writeUInt32LE(chunkSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(NUM_CHANNELS, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(BIT_DEPTH, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmData]);
}

// --- OpenAI TTS ---
async function generateOpenAI(text: string): Promise<NextResponse> {
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
      voice: "nova",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI API Error:", errorText);
    return NextResponse.json({ error: errorText }, { status: response.status });
  }

  const arrayBuffer = await response.arrayBuffer();
  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": arrayBuffer.byteLength.toString(),
    },
  });
}

// --- Gemini TTS ---
async function generateGemini(text: string): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API Error:", errorText);
    return NextResponse.json({ error: errorText }, { status: response.status });
  }

  const data = await response.json();

  const part = data.candidates?.[0]?.content?.parts?.find(
    (p: Record<string, unknown>) =>
      (p.inlineData as { mimeType?: string } | undefined)?.mimeType
        ?.toString()
        .startsWith("audio"),
  );

  if (part?.inlineData?.data) {
    const pcmBuffer = Buffer.from(part.inlineData.data as string, "base64");
    const wavBuffer = addWavHeader(pcmBuffer);
    return new NextResponse(new Uint8Array(wavBuffer), {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": wavBuffer.length.toString(),
      },
    });
  }

  console.error(
    "Gemini response did not contain audio data:",
    JSON.stringify(data, null, 2),
  );
  return NextResponse.json(
    { error: "No audio data generated" },
    { status: 500 },
  );
}

// --- Route Handler ---
export async function POST(req: NextRequest) {
  try {
    const { text, provider = "openai" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (provider === "gemini") {
      return await generateGemini(text);
    }
    return await generateOpenAI(text);
  } catch (error) {
    console.error("TTS API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
