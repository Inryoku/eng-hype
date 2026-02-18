"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SunoPlayer } from "./SunoPlayer";

interface Scene {
  title?: string;
  image?: {
    src: string;
    alt?: string;
  };
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
const EnglishParagraph = ({ node, viewMode, ...props }: any) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [rank, setRank] = useState<number>(2); // Default 2 (Neutral/Yellow)
  const isHidden = viewMode === "hide-en" && !isRevealed;

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

  const rankColors = [
    "bg-red-500 border-red-600", // 0
    "bg-yellow-400 border-yellow-500", // 1
    "bg-orange-500 border-orange-600", // 2
    "bg-stone-500 border-stone-600", // 3 (Black/Neutral)
    "bg-green-500 border-green-600", // 4
    "bg-purple-500 border-purple-600", // 5 (Mastered)
  ];

  return (
    <div className="group/paragraph relative">
      <p
        onClick={() => {
          if (isHidden) setIsRevealed(true);
        }}
        className={cn(
          "mb-2 text-stone-700 dark:text-slate-300 leading-normal transition-all duration-300 relative z-10",
          isHidden
            ? "blur-[6px] opacity-40 select-none hover:blur-[4px] hover:opacity-60 cursor-pointer"
            : getRankStyle(rank),
        )}
        {...props}
      />
      {/* Ranking Controls - Always visible (even when hidden) */}
      <div className="absolute -left-3 top-0 transform -translate-x-full flex flex-col gap-1 p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-lg shadow-sm border border-stone-100 dark:border-slate-800 transition-opacity duration-300 opacity-60 hover:opacity-100 z-20">
        {[5, 4, 3, 2, 1, 0].map((r) => (
          <button
            key={r}
            onClick={(e) => {
              e.stopPropagation();
              setRank(r);
            }}
            className={cn(
              "w-3 h-3 rounded-full border border-stone-300 dark:border-slate-600 hover:scale-125 transition-transform",
              rank === r
                ? rankColors[r] +
                    " scale-110 shadow-sm ring-1 ring-stone-400 dark:ring-slate-500"
                : "bg-stone-100 dark:bg-slate-800 opacity-50 hover:opacity-100",
            )}
            title={`Rank ${r}`}
          />
        ))}
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

  return (
    <div className="relative">
      {/* Floating Toggle Controls */}
      <div className="sticky top-4 z-50 flex justify-center mb-8 pointer-events-none">
        <div className="flex gap-2 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-lg rounded-full border border-stone-200 dark:border-slate-700 pointer-events-auto">
          <button
            onClick={() => setViewMode("hide-en")}
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
            onClick={() => setViewMode("hide-jp")}
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
            onClick={() => setViewMode("show-all")}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              viewMode === "show-all"
                ? "bg-stone-800 text-white dark:bg-cyan-900 dark:text-cyan-100 shadow-sm"
                : "text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800",
            )}
          >
            Show All
          </button>
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
                          // Use custom components with passed viewMode
                          // @ts-ignore
                          p: ({ node, ...props }) => (
                            <EnglishParagraph viewMode={viewMode} {...props} />
                          ),
                          // @ts-ignore
                          ul: ({ node, ...props }) => (
                            <JapaneseList viewMode={viewMode} {...props} />
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
