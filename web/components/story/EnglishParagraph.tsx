import {
  useState,
  useMemo,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/lib/utils";
import { contentHash } from "@/lib/hash";

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
  0: "bg-rose-500 border-rose-600",
  1: "bg-amber-400 border-amber-500",
  2: "bg-orange-500 border-orange-600",
  3: "bg-stone-500 border-stone-600",
  4: "bg-emerald-500 border-emerald-600",
  5: "bg-violet-500 border-violet-600",
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
    <div className="group/paragraph relative">
      <p
        onClick={() => {
          if (isHidden) onRevealParagraph(id);
        }}
        className={cn(
          "mb-2 text-stone-700 dark:text-slate-300 leading-normal transition-all duration-300 relative z-10",
          isHidden
            ? "blur-[6px] opacity-40 select-none hover:blur-xs hover:opacity-60 cursor-pointer"
            : getEnglishRankStyle(rank, isHidden),
        )}
        {...props}
      />

      {/* Capsule Slider Rank UI (Click to Expand) */}
      <div
        ref={containerRef}
        onClick={(e) => {
          e.stopPropagation();
          if (!isExpanded) setIsExpanded(true);
        }}
        className={cn(
          "relative z-30 mt-1 inline-flex items-center md:absolute md:-left-9 md:top-1 md:mt-0",
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
            "absolute left-0 top-0 w-6 h-6 flex items-center justify-center pointer-events-none transition-opacity duration-200",
            isExpanded ? "opacity-0" : "opacity-100",
          )}
        >
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full",
              RANK_COLORS[rank].split(" ")[0],
            )}
          />
        </div>

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

      <div className="h-4" />
    </div>
  );
};
