"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface WordItem {
  phrase: string;
  meaning: string;
  usage: string;
}

export function WordCard({ word }: { word: WordItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => !isOpen && setIsOpen(true)}
      className={`bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-4 md:p-5 transition-all flex flex-col group ${
        !isOpen
          ? "cursor-pointer shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-indigo-500 dark:hover:shadow-indigo-500/10"
          : "shadow-sm"
      }`}
    >
      {/* 1st line: Phrase + Meaning */}
      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
        <div className="flex items-center justify-between w-full md:w-auto gap-2">
          <h3
            className={`text-xl md:text-2xl font-bold font-serif transition-colors shrink-0 ${
              !isOpen
                ? "text-rose-800 dark:text-indigo-300 group-hover:text-rose-600 dark:group-hover:text-indigo-400"
                : "text-rose-800 dark:text-indigo-300"
            }`}
          >
            {word.phrase}
          </h3>
          {!isOpen && (
            <span className="md:hidden text-stone-400 text-xs">▼</span>
          )}
        </div>
        <div className="flex items-baseline gap-2 grow">
          <span className="text-xs font-semibold bg-rose-100 dark:bg-indigo-900/50 text-rose-700 dark:text-indigo-200 px-2 py-0.5 rounded whitespace-nowrap">
            意味
          </span>
          <span className="text-stone-700 dark:text-slate-300 md:text-lg grow">
            {word.meaning}
          </span>
          {!isOpen && (
            <span className="hidden md:block text-stone-400 text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              クリックで開く ▼
            </span>
          )}
        </div>
      </div>

      {/* 2nd line: Usage (Collapsible) */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-3"
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex items-start gap-2 pt-2 border-t border-stone-100 dark:border-slate-800/50">
            <span className="text-xs font-semibold bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400 px-2 py-0.5 rounded whitespace-nowrap mt-1">
              用例
            </span>
            <div className="text-stone-600 dark:text-slate-400 italic leading-relaxed md:text-lg">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  p: ({ node, ...props }) => <span {...props} />,
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  strong: ({ node, ...props }) => (
                    <strong
                      className="font-semibold text-stone-900 dark:text-slate-200 not-italic"
                      {...props}
                    />
                  ),
                }}
              >
                {word.usage}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
