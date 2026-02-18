"use client";
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */

import { useCallback, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isSupabaseEnabled } from "@/lib/supabase";
import { SunoPlayer } from "./SunoPlayer";
import { useSentenceRanks } from "@/hooks/useSentenceRanks";
import { ViewModeControls } from "./story/ViewModeControls";
import { createSceneMarkdownComponents } from "./story/markdown-config";

interface Scene {
  title: string;
  image?: { src: string; alt: string } | null;
  content: string;
}

interface Chapter {
  title: string;
  sunoId?: string;
  scenes: Scene[];
  content?: string; // Fallback
}

interface BilingualStoryProps {
  chapters: Chapter[];
}

type ViewMode = "show-all" | "hide-en" | "hide-jp";
type RevealedMap = Record<string, boolean>;

const DEFAULT_SHARED_UID = "eng-hype-shared-user";
const SHARED_UID =
  process.env.NEXT_PUBLIC_SHARED_UID?.trim() || DEFAULT_SHARED_UID;

export function BilingualStory({ chapters }: BilingualStoryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("hide-en");
  const [revealedParagraphIds, setRevealedParagraphIds] = useState<RevealedMap>(
    {},
  );
  const [userId] = useState<string>(SHARED_UID);

  const { ranks, saveRank } = useSentenceRanks(userId);

  const handleRevealParagraph = useCallback((hash: string) => {
    setRevealedParagraphIds((prev) => ({ ...prev, [hash]: true }));
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    setRevealedParagraphIds({});
  }, []);

  const markdownComponents = useMemo(
    () =>
      createSceneMarkdownComponents({
        viewMode,
        ranks,
        revealedParagraphIds,
        onRevealParagraph: handleRevealParagraph,
        onRankChange: saveRank,
      }),
    [viewMode, ranks, revealedParagraphIds, handleRevealParagraph, saveRank],
  );

  return (
    <div className="relative">
      <ViewModeControls
        viewMode={viewMode}
        onChange={handleViewModeChange}
        showOfflineBadge={!isSupabaseEnabled}
      />

      <div className="space-y-32">
        {chapters.map((chapter, index) => {
          const sunoId = chapter.sunoId;

          return (
            <section
              key={index}
              className="scroll-mt-8"
              id={`chapter-${index}`}
            >
              <div className="mb-12 text-center max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-slate-200 font-sans tracking-tight mb-8">
                  {chapter.title}
                </h2>

                {sunoId && <SunoPlayer sunoId={sunoId} />}

                {chapter.content && (
                  <div className="prose prose-lg dark:prose-invert mx-auto mb-8">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {chapter.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              <div className="space-y-24">
                {chapter.scenes.map((scene, sIndex) => (
                  <div
                    key={sIndex}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16"
                  >
                    <div className="lg:col-span-5 relative">
                      <div className="lg:sticky lg:top-8">
                        {scene.image ? (
                          <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-md border border-stone-200 dark:border-slate-800 group">
                            <img
                              src={scene.image.src}
                              alt={scene.image.alt}
                              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full aspect-square bg-stone-100 dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800">
                            <span className="text-stone-400 dark:text-slate-600 text-sm font-medium">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <article className="lg:col-span-7 prose prose-xl prose-stone dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-stone-700 dark:prose-p:text-slate-300 prose-p:leading-normal prose-p:font-serif prose-p:text-lg md:prose-p:text-xl">
                      {scene.title && (
                        <h3 className="text-xl md:text-2xl font-bold mb-4 text-stone-800 dark:text-slate-200 font-sans mt-0">
                          {scene.title}
                        </h3>
                      )}

                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
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
