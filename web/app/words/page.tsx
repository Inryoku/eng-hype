import Link from "next/link";
import { getAllWords, getWordsRef } from "@/lib/content";
import { WordCard, type WordItem } from "./word-card";
import { RefCard } from "./ref-card";

function parseWords(content: string | null): WordItem[] {
  if (!content) return [];

  const lines = content.split("\n");
  const words: WordItem[] = [];
  let currentWord: Partial<WordItem> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith("- (意味/類語)")) {
      currentWord.meaning = line.replace("- (意味/類語)", "").trim();
    } else if (line.startsWith("- (Usage)")) {
      currentWord.usage = line.replace("- (Usage)", "").trim();
      if (currentWord.phrase && currentWord.meaning && currentWord.usage) {
        words.push(currentWord as WordItem);
        currentWord = {};
      }
    } else {
      currentWord.phrase = line;
    }
  }

  return words;
}

export default function WordsPage() {
  const content = getAllWords();
  const words = parseWords(content);
  const refs = getWordsRef();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-slate-950 dark:text-slate-100 font-[family-name:var(--font-geist-sans)] selection:bg-rose-200 selection:text-rose-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100">
      <div className="max-w-4xl mx-auto p-6 md:p-12 pb-32">
        <header className="mb-12 text-center">
          <Link
            href="/"
            className="text-stone-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-indigo-400 transition-colors mb-4 inline-block text-sm font-medium hover:bg-rose-50 dark:hover:bg-indigo-900/40 px-3 py-1 rounded-full"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mt-2 text-stone-900 dark:text-slate-100 font-[family-name:var(--font-lora)] mb-4">
            Words
          </h1>
          <p className="text-stone-500 dark:text-slate-400 max-w-lg mx-auto">
            Vocabulary collected from the stories, along with meanings and usage
            examples.
          </p>
        </header>

        {words.length > 0 ? (
          <div className="flex flex-col gap-3">
            {words.map((w, i) => (
              <WordCard key={i} word={w} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800">
            <p className="text-stone-500 dark:text-slate-400">
              No words found.
            </p>
          </div>
        )}

        {/* Word Reference Section */}
        {refs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-slate-100 font-[family-name:var(--font-lora)] mb-2 text-center">
              Word Reference
            </h2>
            <p className="text-stone-500 dark:text-slate-400 text-center mb-8 text-sm">
              語源・接辞から単語を理解する
            </p>
            <div className="flex flex-col gap-3">
              {refs.map((r, i) => (
                <RefCard key={i} ref_item={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
