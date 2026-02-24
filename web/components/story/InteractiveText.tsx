"use client";

import { useState, useMemo } from "react";
import type { WordRef } from "@/lib/content";
import { WordRefPopup } from "./WordRefPopup";
import { Loader2 } from "lucide-react";
import { useParagraphHidden } from "./ParagraphHiddenContext";

interface InteractiveTextProps {
  text: string;
  contextText: string;
}

// Global cache for the session to prevent repeated API calls
const dictionaryCache = new Map<string, WordRef>();

export function InteractiveText({ text, contextText }: InteractiveTextProps) {
  const isHidden = useParagraphHidden();
  const [loadingWord, setLoadingWord] = useState<string | null>(null);
  const [wordRef, setWordRef] = useState<WordRef | null>(null);

  // Tokenize text into words and non-words
  const tokens = useMemo(() => {
    // Splits by word boundaries, keeping punctuation and spaces separate
    // This regex looks for English words (including apostrophes like don't)
    return text.split(/(\b[a-zA-Z]+(?:'[a-zA-Z]+)?\b)/g);
  }, [text]);

  const handleWordClick = async (word: string) => {
    if (isHidden) return; // Ignore clicks if paragraph is hidden (blurred)

    const cacheKey = `${word.toLowerCase()}|${contextText}`;
    if (dictionaryCache.has(cacheKey)) {
      setWordRef(dictionaryCache.get(cacheKey)!);
      return;
    }

    setLoadingWord(word);
    try {
      const res = await fetch("/api/dictionary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, context: contextText }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch dictionary definition");
      }

      const data: WordRef = await res.json();
      dictionaryCache.set(cacheKey, data);
      setWordRef(data);
    } catch (e) {
      console.error(e);
      // Fail silently for now, or could show a small error toast
    } finally {
      setLoadingWord(null);
    }
  };

  return (
    <>
      {tokens.map((token, i) => {
        // Is it a word?
        if (/^[a-zA-Z]+(?:'[a-zA-Z]+)?$/.test(token)) {
          if (isHidden) {
            return <span key={i}>{token}</span>;
          }
          return (
            <span
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                handleWordClick(token);
              }}
              className="relative cursor-pointer transition-colors hover:bg-stone-200/60 dark:hover:bg-slate-700/60 rounded px-0.5"
            >
              {token}
              {loadingWord === token && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Loader2 className="w-3 h-3 animate-spin text-amber-600 dark:text-teal-400" />
                </span>
              )}
            </span>
          );
        }
        // Non-word punctuation/spaces
        return <span key={i}>{token}</span>;
      })}

      {wordRef && (
        <WordRefPopup wordRef={wordRef} onClose={() => setWordRef(null)} />
      )}
    </>
  );
}
