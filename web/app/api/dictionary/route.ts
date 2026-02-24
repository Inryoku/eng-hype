import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
// Fallback to OpenAI or throw error based on preference, but here we require Gemini.
const genAI = new GoogleGenerativeAI(apiKey || "");

export const maxDuration = 60; // Allow up to 60 seconds (useful for Vercel/Next.js limits)

export async function POST(req: Request) {
  try {
    const { word, context } = await req.json();

    if (!word || !context) {
      return NextResponse.json(
        { error: "Missing word or context" },
        { status: 400 },
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment variables." },
        { status: 500 },
      );
    }

    // Initialize the model. Gemini 2.5 Flash is highly capable, fast, and very cheap.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.2, // Low temperature for factual dictionary definitions
        responseMimeType: "application/json",
      },
    });

    const prompt = `あなたは優秀な英語教師です。以下の文脈で使われている単語 '${word}' の情報を提供してください。

文脈:
"${context}"

以下のJSONスキーマに従って出力してください:
{
  "word": "見出し語（原形が好ましいが文脈による）",
  "meaning": "この文脈での端的な日本語の意味（短く）",
  "simple": "この単語の英語でのかんたんな言い換え",
  "domain": "単語の分野・カテゴリ（例：政治、感情、一般、医学等。短く）",
  "affix": "語源や接辞（例：de(離れて) + tect(覆う) + ive(人)、なければ空文字）",
  "description": "50文字程度の単語の簡単な解説。もし語源や接辞（affix）がある場合はその成り立ちを踏まえた解説を、ない場合はその単語のコアとなるニュアンスや使われ方を50文字程度で解説してください。あくまで文脈よりも『単語そのもの』の解説をメインにしてください。"
}`;

    console.log(`[Dictionary API] Requesting definition for word: "${word}"`);

    // Retry logic for 503 Service Unavailable errors
    let text = "";
    let retries = 3;
    let delayMs = 1000;

    while (retries > 0) {
      try {
        const result = await model.generateContent(prompt);
        text = result.response.text();
        break; // Success, exit retry loop
      } catch (err: unknown) {
        retries--;
        const error = err as { status?: number };
        if (retries === 0 || error?.status !== 503) {
          throw err; // Out of retries or not a 503 error, throw to outer catch
        }
        console.warn(
          `[Dictionary API] 503 Service Unavailable. Retrying in ${delayMs}ms... (${retries} retries left)`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2; // Exponential backoff
      }
    }

    console.log(
      `[Dictionary API] Raw response from Gemini for "${word}":\n`,
      text,
    );

    try {
      // In case Gemini wraps the response in markdown code blocks like ```json ... ```
      const cleanedText = text
        .replace(/```json\n/g, "")
        .replace(/```/g, "")
        .trim();
      const parsed = JSON.parse(cleanedText);
      return NextResponse.json(parsed);
    } catch (parseError: unknown) {
      console.error(
        `[Dictionary API] JSON Parse Error for word "${word}":`,
        parseError,
      );
      console.error(`[Dictionary API] Failing Text:\n`, text);
      return NextResponse.json(
        { error: "Failed to parse definition json" },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    console.error("[Dictionary API] Fatal Error:", error);
    // Vercel logs will show error.message and stack
    const err = error as { message?: string };
    return NextResponse.json(
      {
        error: "Failed to fetch definition",
        details: err?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
