import type { Components } from "react-markdown";
import type { WordRef } from "@/lib/content";
import { EnglishParagraph } from "./EnglishParagraph";
import { JapaneseList } from "./JapaneseList";
import { ClickableWord } from "./ClickableWord";

type ViewMode = "show-all" | "hide-en" | "hide-jp";
type RankMap = Record<string, number>;
type RevealedMap = Record<string, boolean>;

export function createSceneMarkdownComponents({
  viewMode,
  ranks,
  revealedParagraphIds,
  onRevealParagraph,
  onRankChange,
  wordRefs,
}: {
  viewMode: ViewMode;
  ranks: RankMap;
  revealedParagraphIds: RevealedMap;
  onRevealParagraph: (hash: string) => void;
  onRankChange: (hash: string, rank: number) => void;
  wordRefs?: WordRef[];
}): Components {
  // Build a lookup map for fast matching (lowercase word -> WordRef)
  const wordRefMap = new Map<string, WordRef>();
  if (wordRefs) {
    for (const ref of wordRefs) {
      wordRefMap.set(ref.word.toLowerCase(), ref);
    }
  }

  const components: Components = {
    blockquote: ({ ...props }) => (
      <blockquote
        className="not-italic border-l-4 border-orange-300 dark:border-cyan-500 pl-6 py-2 my-6 bg-orange-50 dark:bg-cyan-950/30 text-stone-600 dark:text-cyan-100 font-serif text-lg leading-snug shadow-[inset_4px_0_0_0_rgba(6,182,212,1)]"
        {...props}
      />
    ),
    strong: ({ children, ...props }) => {
      // Extract text from children
      const text =
        typeof children === "string"
          ? children
          : Array.isArray(children)
            ? children.map((c) => (typeof c === "string" ? c : "")).join("")
            : "";

      // Check if any word in the TSV matches (case-insensitive)
      const textLower = text.toLowerCase();
      let matchedRef: WordRef | undefined;
      for (const [word, ref] of wordRefMap) {
        if (textLower.includes(word)) {
          matchedRef = ref;
          break;
        }
      }

      if (matchedRef) {
        return (
          <ClickableWord wordRef={matchedRef} {...props}>
            {children}
          </ClickableWord>
        );
      }

      return (
        <strong
          className="text-foreground font-bold bg-orange-100 dark:bg-cyan-900/50 dark:text-cyan-200 px-1 rounded mx-0.5 font-sans tracking-wide text-base align-baseline dark:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
          {...props}
        >
          {children}
        </strong>
      );
    },
    hr: ({ ...props }) => (
      <div
        className="my-10 flex items-center justify-center gap-4 opacity-30 dark:opacity-40"
        {...props}
      >
        <div className="h-px w-full bg-stone-300 dark:bg-cyan-900"></div>
        <div className="text-stone-400 dark:text-cyan-600 text-xl dark:shadow-[0_0_10px_rgba(8,145,178,0.5)]">
          ❦
        </div>
        <div className="h-px w-full bg-stone-300 dark:bg-cyan-900"></div>
      </div>
    ),
    a: ({ ...props }) => (
      <a
        className="text-orange-700 dark:text-cyan-400 hover:text-orange-900 dark:hover:text-cyan-300 underline decoration-orange-300 dark:decoration-cyan-600 hover:decoration-orange-600 dark:hover:decoration-cyan-400 transition-all font-medium decoration-1 underline-offset-4 shadow-[0_1px_0_0_rgba(34,211,238,0.3)]"
        {...props}
      />
    ),
    p: ({ node, ...props }) => (
      <EnglishParagraph
        node={node}
        viewMode={viewMode}
        ranks={ranks}
        revealedParagraphIds={revealedParagraphIds}
        onRevealParagraph={onRevealParagraph}
        onRankChange={onRankChange}
        {...props}
      />
    ),
    ul: ({ ...props }) => (
      <JapaneseList key={`jp-${viewMode}`} viewMode={viewMode} {...props} />
    ),
    ol: ({ ...props }) => (
      <ol
        className="list-decimal list-outside ml-6 mb-6 space-y-1 text-stone-700 dark:text-slate-300"
        {...props}
      />
    ),
    li: ({ ...props }) => <li className="" {...props} />,
  };

  return components;
}
