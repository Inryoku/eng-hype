import { NextRequest, NextResponse } from "next/server";
import { supabaseServer, isSupabaseServerEnabled } from "@/lib/supabase-server";
import { contentHash } from "@/lib/hash";

const MAX_TTS_TEXT_LENGTH = 1000;
// Allow most characters, but block non-printable control chars (except tab/newline/carriage return).
const DISALLOWED_CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (typeof text !== "string") {
      return NextResponse.json(
        { error: "Text must be a string" },
        { status: 400 },
      );
    }

    const normalizedText = text.trim();

    if (!normalizedText) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (normalizedText.length > MAX_TTS_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Text is too long (max ${MAX_TTS_TEXT_LENGTH} chars)` },
        { status: 400 },
      );
    }

    if (DISALLOWED_CONTROL_CHARS.test(normalizedText)) {
      return NextResponse.json(
        { error: "Text contains unsupported control characters" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    // --- 1. Check Supabase Storage Cache ---
    let cacheKey = "";
    if (isSupabaseServerEnabled && supabaseServer) {
      try {
        cacheKey = `${contentHash(normalizedText)}.mp3`;
        const { data, error } = await supabaseServer.storage
          .from("tts-cache")
          .download(cacheKey);

        if (data && !error) {
          console.log(`TTS Cache HIT: ${cacheKey}`);
          const arrayBuffer = await data.arrayBuffer();
          return new NextResponse(arrayBuffer, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": arrayBuffer.byteLength.toString(),
              "X-TTS-Cache": "HIT",
            },
          });
        }
      } catch (err) {
        console.warn("Supabase Storage Cache Check Failed:", err);
      }
    }

    // --- 2. Generate Audio via OpenAI ---
    console.log(`TTS Cache MISS: ${cacheKey} (Generating...)`);
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: normalizedText,
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

    // --- 3. Save to Supabase Storage Cache ---
    if (isSupabaseServerEnabled && supabaseServer && cacheKey) {
      try {
        const { error: uploadError } = await supabaseServer.storage
          .from("tts-cache")
          .upload(cacheKey, arrayBuffer, {
            contentType: "audio/mpeg",
            upsert: true,
          });

        if (uploadError) {
          console.warn("Supabase Storage Upload Failed:", uploadError);
        } else {
          console.log(`TTS Saved to Cache: ${cacheKey}`);
        }
      } catch (err) {
        console.warn("Supabase Storage Save Error:", err);
      }
    }

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": arrayBuffer.byteLength.toString(),
        "X-TTS-Cache": "MISS",
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
