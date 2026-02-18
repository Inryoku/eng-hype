"use client";
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo } from "react";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import { contentHash } from "@/lib/hash";
import { SunoPlayer } from "./SunoPlayer";

interface Scene {
  title?: string;
  image?: {
    src: string;
    alt?: string;
  } | null;
  content: string;
}

interface Chapter {
  title: string;
  audioUrl?: string;
  content?: string;
  scenes: Scene[];
}

interface BilingualStoryProps {
  chapters: Chapter[];
}

type ViewMode = "show-all" | "hide-en" | "hide-jp";

// Custom renderer components to use hooks properly
const EnglishParagraph = ({
  node,
  viewMode,
  ranks,
  revealedParagraphIds,
  onRevealParagraph,
  onRankChange,
  ...props
}: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rankMenuRef = useRef<HTMLDivElement>(null);

  // Calculate hash for this paragraph content
  const textContent = node.children
    .map((child: any) => child.value || "")
    .join("");
  const id = useMemo(() => contentHash(textContent), [textContent]);

  // Use rank from props (lifted state) or default to 3 (Neutral/Black)
  const rank = ranks?.[id] !== undefined ? ranks[id] : 3;

  const isHidden = viewMode === "hide-en" && !revealedParagraphIds?.[id];

  // Rank Styles
  const getRankStyle = (r: number) => {
    if (isHidden) return ""; // Overridden by blur
    switch (r) {
      case 0: // Unknown - Red
        return "font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 -mx-2 rounded";
      case 1: // Yellow
        return "decoration-yellow-400 dark:decoration-yellow-500 underline decoration-2 underline-offset-4";
      case 2: // Orange
        return "text-orange-600 dark:text-orange-400 decoration-orange-300 underline decoration-2 underline-offset-4";
      case 4: // Green
        return "text-green-600 dark:text-green-400 font-medium";
      case 5: // Mastered - Purple
        return "text-purple-600 dark:text-purple-400 font-medium";
      default: // 3 - Neutral (Black/Gray)
        return "";
    }
  };

  const rankColors: Record<number, string> = {
    0: "bg-rose-500 border-rose-600",
    1: "bg-amber-400 border-amber-500",
    2: "bg-orange-500 border-orange-600",
    3: "bg-stone-500 border-stone-600",
    4: "bg-emerald-500 border-emerald-600",
    5: "bg-violet-500 border-violet-600",
  };

  useEffect(() => {
    if (!isExpanded) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (rankMenuRef.current && target && !rankMenuRef.current.contains(target)) {
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
            : getRankStyle(rank),
        )}
        {...props}
      />
      {/* Expandable Rank Indicator */}
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
            setIsExpanded(!isExpanded);
          }}
          className={cn(
            "h-5 w-5 md:h-4 md:w-4 rounded-full border-2 transition-all duration-200 hover:scale-110 shadow-sm",
            rankColors[rank],
            isExpanded && "ring-2 ring-stone-400/70 dark:ring-slate-400/70",
          )}
          aria-label={`Open rank options (current rank ${rank})`}
          title={`Rank ${rank} - click to change`}
        />

        {isExpanded && (
          <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 flex flex-row gap-1.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-1.5 shadow-xl backdrop-blur-md z-40 md:left-auto md:right-full md:ml-0 md:mr-2 md:flex-col">
            {[5, 4, 3, 2, 1, 0].map((r) => (
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
                    ? rankColors[r] + " ring-2 ring-stone-400/70 dark:ring-slate-400/70"
                    : rankColors[r] + " opacity-40 hover:opacity-100",
                )}
                title={`Rank ${r}`}
              ></button>
            ))}
          </div>
        )}
      </div>
      {/* Spacer for Japanese list below */}
      <div className="h-4" />
    </div>
  );
};

const JapaneseList = ({ node, viewMode, ...props }: any) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const isHidden = viewMode === "hide-jp" && !isRevealed;

  return (
    <ul
      onClick={() => {
        if (isHidden) setIsRevealed(true);
      }}
      className={cn(
        "list-none ml-0 mb-8 space-y-1 text-stone-500 dark:text-slate-400 text-base italic transition-all duration-300 border-l-2 border-stone-200 dark:border-slate-800 pl-4 py-1",
        isHidden
          ? "blur-[6px] opacity-40 select-none hover:blur-[4px] hover:opacity-60 cursor-pointer"
          : "",
      )}
      {...props}
    />
  );
};

export function BilingualStory({ chapters }: BilingualStoryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("hide-en");

  // State for ranks: { [contentHash]: rank }
  const [ranks, setRanks] = useState<Record<string, number>>({});
  const [revealedParagraphIds, setRevealedParagraphIds] = useState<
    Record<string, boolean>
  >({});
  const [userId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;

    let storedUserId = localStorage.getItem("eng-hype-user-id");
    if (!storedUserId) {
      storedUserId = crypto.randomUUID();
      localStorage.setItem("eng-hype-user-id", storedUserId);
    }
    return storedUserId;
  });

  // Initialize User ID and load ranks
  useEffect(() => {
    // Fetch ranks from Supabase
    const client = supabase;
    if (userId && client) {
      const fetchRanks = async () => {
        const { data, error } = await client
          .from("sentence_ranks")
          .select("content_hash, rank")
          .eq("user_id", userId);

        if (data && !error) {
          const loadedRanks: Record<string, number> = {};
          data.forEach((row) => {
            loadedRanks[row.content_hash] = row.rank;
          });
          setRanks(loadedRanks);
        }
      };
      fetchRanks();
    }
  }, [userId]);

  const handleRankChange = async (hash: string, newRank: number) => {
    if (!userId) return;

    // Optimistic Update
    setRanks((prev) => ({ ...prev, [hash]: newRank }));

    // Save to Supabase
    const client = supabase;
    if (!client) return;

    const { error } = await client.from("sentence_ranks").upsert(
      {
        user_id: userId,
        content_hash: hash,
        rank: newRank,
        // updated_at is handled by default now() or trigger, but good to send if needed.
        // Our schema has default now(), but existing rows might need explicit update if we want to track last modified time accurately on client update implies new timestamp.
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id, content_hash" },
    );

    if (error) {
      console.error("Failed to save rank:", error);
    }
  };

  const handleRevealParagraph = (hash: string) => {
    setRevealedParagraphIds((prev) => ({ ...prev, [hash]: true }));
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setRevealedParagraphIds({});
  };

  return (
    <div className="relative">
      {/* Floating Toggle Controls */}
      <div className="sticky top-4 z-50 flex justify-center mb-8 pointer-events-none">
        <div className="flex gap-2 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-lg rounded-full border border-stone-200 dark:border-slate-700 pointer-events-auto">
          <button
            onClick={() => handleViewModeChange("hide-en")}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              viewMode === "hide-en"
                ? "bg-stone-800 text-white dark:bg-cyan-900 dark:text-cyan-100 shadow-sm"
                : "text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800",
            )}
          >
            {viewMode === "hide-en" ? <EyeOff size={14} /> : <Eye size={14} />}
            Hide EN
          </button>
          <button
            onClick={() => handleViewModeChange("hide-jp")}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              viewMode === "hide-jp"
                ? "bg-stone-800 text-white dark:bg-cyan-900 dark:text-cyan-100 shadow-sm"
                : "text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800",
            )}
          >
            {viewMode === "hide-jp" ? <EyeOff size={14} /> : <Eye size={14} />}
            Hide JP
          </button>
          <button
            onClick={() => handleViewModeChange("show-all")}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              viewMode === "show-all"
                ? "bg-stone-800 text-white dark:bg-cyan-900 dark:text-cyan-100 shadow-sm"
                : "text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800",
            )}
          >
            Show All
          </button>
          {!isSupabaseEnabled && (
            <span className="hidden md:inline text-xs text-stone-500 dark:text-slate-400 px-2">
              Offline rank mode
            </span>
          )}
        </div>
      </div>

      <div className="space-y-32">
        {chapters.map((chapter, index) => {
          const sunoId = chapter.audioUrl
            ? chapter.audioUrl.match(
                /suno\.com\/(?:song|embed|s)\/([a-zA-Z0-9-]+)/,
              )?.[1]
            : null;

          return (
            <section
              key={index}
              className="scroll-mt-8"
              id={`chapter-${index}`}
            >
              {/* Chapter Header */}
              <div className="mb-12 text-center max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-slate-200 font-sans tracking-tight mb-8">
                  {chapter.title}
                </h2>

                {/* Chapter Audio Player */}
                {sunoId && <SunoPlayer sunoId={sunoId} />}

                {chapter.content && (
                  <div className="mt-8 prose prose-xl prose-stone dark:prose-invert max-w-none text-left">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {chapter.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Scenes Loop */}
              <div className="space-y-24">
                {chapter.scenes.map((scene, sIndex) => (
                  <div
                    key={sIndex}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16"
                  >
                    {/* Left: Image (Sticky within scene) */}
                    <div className="lg:col-span-5 relative">
                      <div className="lg:sticky lg:top-8">
                        {scene.image ? (
                          <div className="rounded-xl overflow-hidden shadow-lg shadow-stone-200 dark:shadow-cyan-900/20 border border-stone-100 dark:border-slate-800 bg-stone-100 dark:bg-slate-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={scene.image.src}
                              alt={scene.image.alt || scene.title}
                              className="w-full h-auto object-cover opacity-95 hover:opacity-100 transition-opacity duration-700 mix-blend-multiply dark:mix-blend-normal"
                            />
                            {scene.image.alt && (
                              <div className="p-3 text-sm text-stone-500 dark:text-slate-400 font-sans bg-stone-50 dark:bg-slate-900 border-t border-stone-100 dark:border-slate-800">
                                {scene.image.alt}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="hidden lg:block h-32 w-full border-2 border-dashed border-stone-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-stone-300 dark:text-slate-700">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Text */}
                    <article className="lg:col-span-7 prose prose-xl prose-stone dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-stone-700 dark:prose-p:text-slate-300 prose-p:leading-normal prose-p:font-serif prose-p:text-lg md:prose-p:text-xl">
                      {scene.title && (
                        <h3 className="text-xl md:text-2xl font-bold mb-4 text-stone-800 dark:text-slate-200 font-sans mt-0">
                          {scene.title}
                        </h3>
                      )}
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Simplified components since structure is handled by outer loop
                          // @ts-ignore
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="not-italic border-l-4 border-orange-300 dark:border-cyan-500 pl-6 py-2 my-6 bg-orange-50 dark:bg-cyan-950/30 text-stone-600 dark:text-cyan-100 font-serif text-lg leading-snug shadow-[inset_4px_0_0_0_rgba(6,182,212,1)]"
                              {...props}
                            />
                          ),
                          // @ts-ignore
                          strong: ({ node, ...props }) => (
                            <strong
                              className="text-foreground font-bold bg-orange-100 dark:bg-cyan-900/50 dark:text-cyan-200 px-1 rounded mx-0.5 font-sans tracking-wide text-base align-baseline dark:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                              {...props}
                            />
                          ),
                          // @ts-ignore
                          hr: ({ node, ...props }) => (
                            <div className="my-10 flex items-center justify-center gap-4 opacity-30 dark:opacity-40">
                              <div className="h-px w-full bg-stone-300 dark:bg-cyan-900"></div>
                              <div className="text-stone-400 dark:text-cyan-600 text-xl dark:shadow-[0_0_10px_rgba(8,145,178,0.5)]">
                                ❦
                              </div>
                              <div className="h-px w-full bg-stone-300 dark:bg-cyan-900"></div>
                            </div>
                          ),
                          // @ts-ignore
                          a: ({ node, ...props }) => (
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
                              onRevealParagraph={handleRevealParagraph}
                              onRankChange={handleRankChange}
                              {...props}
                            />
                          ),
                          // @ts-ignore
                          ul: ({ node, ...props }) => (
                            <JapaneseList
                              key={`jp-${viewMode}`}
                              viewMode={viewMode}
                              {...props}
                            />
                          ),
                          // @ts-ignore
                          ol: ({ node, ...props }) => (
                            <ol
                              className="list-decimal list-outside ml-6 mb-6 space-y-1 text-stone-700 dark:text-slate-300"
                              {...props}
                            />
                          ),
                          // @ts-ignore
                          li: ({ node, ...props }) => (
                            // Remove list styling since we handle container
                            <li className="" {...props} />
                          ),
                        }}
                      >
                        {scene.content}
                      </ReactMarkdown>
                    </article>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
