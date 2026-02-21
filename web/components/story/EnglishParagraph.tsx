import {
  useState,
  useMemo,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/lib/utils";
import { contentHash } from "@/lib/hash";
import { Volume2, Loader2, Square } from "lucide-react";

// Simple TTS Hook removed (moved to context)

import { useTTS } from "@/components/TTSContext";
import { ParagraphHiddenProvider } from "./ParagraphHiddenContext";

function extractText(node: unknown, emphatic = false): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { type?: string; value?: string; children?: unknown[] };

  // Text leaf node
  if (n.type === "text" && typeof n.value === "string") {
    return emphatic ? n.value.toUpperCase() : n.value;
  }

  if (!Array.isArray(n.children)) return "";

  // If this node is a "strong" (bold), mark children as emphatic
  const isStrong = n.type === "strong";
  return n.children
    .map((child) => extractText(child, emphatic || isStrong))
    .join("");
}

type Rank = 0 | 1 | 2 | 3 | 4 | 5;
type ViewMode = "show-all" | "hide-en" | "hide-jp";
type RankMap = Record<string, number>;
type RevealedMap = Record<string, boolean>;

interface EnglishParagraphProps {
  node?: unknown;
  viewMode: ViewMode;
  ranks: RankMap;
  revealedParagraphIds: RevealedMap;
  onRevealParagraph: (hash: string) => void;
  onRankChange: (hash: string, rank: number) => void;
}

type ParagraphElementProps = ComponentPropsWithoutRef<"p">;

type EnglishParagraphComponentProps = EnglishParagraphProps &
  Omit<ParagraphElementProps, keyof EnglishParagraphProps>;

const RANK_OPTIONS: Rank[] = [0, 1, 2, 3, 4, 5];
const RANK_COLORS: Record<Rank, string> = {
  0: "bg-rose-700/50 border-rose-800/40",
  1: "bg-yellow-400/60 border-yellow-500/50",
  2: "bg-orange-600/50 border-orange-700/40",
  3: "bg-stone-500/50 border-stone-600/40",
  4: "bg-emerald-700/50 border-emerald-800/40",
  5: "bg-violet-700/50 border-violet-800/40",
};

function getEnglishRankStyle(rank: number, isHidden: boolean): string {
  if (isHidden) return "";

  switch (rank) {
    case 0:
      return "font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 -mx-2 rounded";
    case 1:
      return "decoration-yellow-400 dark:decoration-yellow-500 underline decoration-2 underline-offset-4";
    // Rank 2 (Orange) and 3 (Stone) intentionally has no text styling (neutral) as requested
    case 4:
      return "text-green-600 dark:text-green-400 font-medium";
    case 5:
      return "text-purple-600 dark:text-purple-400 font-medium";
    default:
      return "";
  }
}

function getParagraphId(node?: unknown): string {
  if (!node || typeof node !== "object") return contentHash("");

  const maybeChildren = (node as { children?: unknown }).children;
  if (!Array.isArray(maybeChildren)) return contentHash("");

  const textContent = maybeChildren
    .map((child) => {
      if (!child || typeof child !== "object") return "";
      const value = (child as { value?: unknown }).value;
      return typeof value === "string" ? value : "";
    })
    .join("");

  return contentHash(textContent);
}

export const EnglishParagraph = ({
  node,
  viewMode,
  ranks,
  revealedParagraphIds,
  onRevealParagraph,
  onRankChange,
  ...props
}: EnglishParagraphComponentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use global TTS context
  const {
    play,
    stop,
    isPlaying: isGlobalPlaying,
    isLoading: isGlobalLoading,
    activeText,
  } = useTTS();

  // Extract text for this paragraph
  const text = useMemo(() => extractText(node), [node]);

  // Determine if this specific paragraph is playing
  const isMePlaying = isGlobalPlaying && activeText === text;
  const isMeLoading = isGlobalLoading && activeText === text;

  const id = useMemo(() => getParagraphId(node), [node]);
  // Ensure rank is a valid Rank type (0-5), fallback to 3
  const rawRank = ranks[id] ?? 3;
  const rank = (rawRank >= 0 && rawRank <= 5 ? rawRank : 3) as Rank;

  const isHidden = viewMode === "hide-en" && !revealedParagraphIds?.[id];

  useEffect(() => {
    if (!isExpanded) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (
        containerRef.current &&
        target &&
        !containerRef.current.contains(target)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isExpanded]);

  return (
    <ParagraphHiddenProvider isHidden={isHidden}>
      <div className="group/paragraph relative flex flex-col md:block items-start">
        {/* Capsule Slider Rank UI (Click to Expand) */}
        <div
          ref={containerRef}
          onClick={(e) => {
            e.stopPropagation();
            if (!isExpanded) setIsExpanded(true);
          }}
          className={cn(
            "relative z-30 mb-2 inline-flex items-center md:absolute md:-left-9 md:top-1 md:mt-0 md:mb-0",
            "h-6 rounded-full shadow-sm transition-all duration-300 ease-out overflow-hidden cursor-pointer",
            isExpanded
              ? "w-auto pr-1 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700"
              : `w-6 hover:scale-110 border-2 ${RANK_COLORS[rank]}`,
          )}
          title={!isExpanded ? `Current Rank: ${rank}. Click to change.` : ""}
        >
          {/* Current Rank Indicator (Visible only when collapsed) */}
          <div
            className={cn(
              "absolute left-0 top-0 w-6 h-6 rounded-full pointer-events-none transition-opacity duration-200",
              isExpanded ? "opacity-0" : "opacity-100",
            )}
          />

          {/* Retracted Rank Options (Visible when expanded) */}
          <div
            className={cn(
              "flex items-center gap-1 px-1 transition-opacity duration-200 delay-75",
              isExpanded ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            {RANK_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={(e) => {
                  e.stopPropagation();
                  onRankChange(id, r);
                  setIsExpanded(false);
                }}
                className={cn(
                  "w-4 h-4 rounded-full transition-all duration-150 active:scale-95",
                  rank === r
                    ? `${RANK_COLORS[r]} ring-1 ring-stone-400/70 dark:ring-slate-400/70 scale-110`
                    : `${RANK_COLORS[r]} opacity-40 hover:opacity-100 hover:scale-125`,
                )}
                title={`Rank ${r}`}
              />
            ))}
          </div>
        </div>

        <p
          onClick={() => {
            if (isHidden) onRevealParagraph(id);
          }}
          className={cn(
            "mb-2 text-stone-700 dark:text-slate-300 leading-normal transition-all duration-300 relative z-10 w-full pr-8",
            isHidden
              ? "blur-[6px] opacity-40 select-none hover:blur-xs hover:opacity-60 cursor-pointer"
              : getEnglishRankStyle(rank, isHidden),
          )}
          {...props}
        />

        {/* TTS Play Button */}
        {!isHidden && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isMePlaying) {
                stop();
              } else {
                if (text) play(text);
              }
            }}
            className="absolute -right-2 top-0 p-2 text-stone-400 hover:text-stone-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors z-20"
            aria-label={isMePlaying ? "Stop reading" : "Read aloud"}
          >
            {isMeLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isMePlaying ? (
              <Square className="h-4 w-4 fill-current" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        )}

        <div className="h-4 md:hidden" />
      </div>
    </ParagraphHiddenProvider>
  );
};
