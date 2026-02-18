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

const RANK_OPTIONS: Rank[] = [5, 4, 3, 2, 1, 0];
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
    case 2:
      return "text-orange-600 dark:text-orange-400 decoration-orange-300 underline decoration-2 underline-offset-4";
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
  const rankMenuRef = useRef<HTMLDivElement>(null);

  const id = useMemo(() => getParagraphId(node), [node]);
  const rank = ranks[id] ?? 3;
  const rankColor = RANK_COLORS[(rank in RANK_COLORS ? rank : 3) as Rank];
  const isHidden = viewMode === "hide-en" && !revealedParagraphIds?.[id];

  useEffect(() => {
    if (!isExpanded) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (
        rankMenuRef.current &&
        target &&
        !rankMenuRef.current.contains(target)
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

      <div
        ref={rankMenuRef}
        className={cn(
          "relative z-30 mt-1 inline-flex md:absolute md:-left-9 md:top-1 md:mt-0",
          isExpanded && "z-40",
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
          className={cn(
            "h-5 w-5 md:h-4 md:w-4 rounded-full border-2 transition-all duration-200 hover:scale-110 shadow-sm",
            rankColor,
            isExpanded && "ring-2 ring-stone-400/70 dark:ring-slate-400/70",
          )}
          aria-label={`Open rank options (current rank ${rank})`}
          title={`Rank ${rank} - click to change`}
        />

        {isExpanded && (
          <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 flex flex-row gap-1.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-1.5 shadow-xl backdrop-blur-md z-40 md:left-auto md:right-full md:ml-0 md:mr-2 md:flex-col">
            {RANK_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={(e) => {
                  e.stopPropagation();
                  onRankChange(id, r);
                  setIsExpanded(false);
                }}
                className={cn(
                  "h-6 w-6 md:h-5 md:w-5 rounded-full border-2 transition-all duration-150 hover:scale-110",
                  rank === r
                    ? `${RANK_COLORS[r]} ring-2 ring-stone-400/70 dark:ring-slate-400/70`
                    : `${RANK_COLORS[r]} opacity-40 hover:opacity-100`,
                )}
                title={`Rank ${r}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="h-4" />
    </div>
  );
};
