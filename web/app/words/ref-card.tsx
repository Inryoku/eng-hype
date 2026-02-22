"use client";

import { useState } from "react";
import type { WordRef } from "@/lib/content";

export function RefCard({ ref_item }: { ref_item: WordRef }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => !isOpen && setIsOpen(true)}
      className={`bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-4 md:p-5 transition-all flex flex-col group ${
        !isOpen
          ? "cursor-pointer shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-teal-500 dark:hover:shadow-teal-500/10"
          : "shadow-sm"
      }`}
    >
      {/* 1st line: Word + Meaning + Affix */}
      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
        <div className="flex items-center justify-between w-full md:w-auto gap-2">
          <h3
            className={`text-xl md:text-2xl font-bold font-serif transition-colors shrink-0 ${
              !isOpen
                ? "text-amber-800 dark:text-teal-300 group-hover:text-amber-600 dark:group-hover:text-teal-400"
                : "text-amber-800 dark:text-teal-300"
            }`}
          >
            {ref_item.word}
          </h3>
          {!isOpen && (
            <span className="md:hidden text-stone-400 text-xs">▼</span>
          )}
        </div>
        <div className="flex items-baseline gap-2 grow flex-wrap">
          <span className="text-xs font-semibold bg-amber-100 dark:bg-teal-900/50 text-amber-700 dark:text-teal-200 px-2 py-0.5 rounded whitespace-nowrap">
            {ref_item.meaning}
          </span>
          {ref_item.domain && (
            <span className="text-xs font-medium bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 px-2 py-0.5 rounded whitespace-nowrap">
              {ref_item.domain}
            </span>
          )}
          <span className="text-stone-500 dark:text-slate-400 text-sm font-mono">
            {ref_item.affix}
          </span>
          {!isOpen && (
            <span className="hidden md:block text-stone-400 text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              クリックで開く ▼
            </span>
          )}
        </div>
      </div>

      {/* 2nd line: Description (Collapsible) */}
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
              解説
            </span>
            <p className="text-stone-600 dark:text-slate-400 leading-relaxed md:text-lg">
              {ref_item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
