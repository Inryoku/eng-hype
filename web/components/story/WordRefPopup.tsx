"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { WordRef } from "@/lib/content";

interface WordRefPopupProps {
  wordRef: WordRef;
  onClose: () => void;
}

export function WordRefPopup({ wordRef, onClose }: WordRefPopupProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-teal-700 rounded-2xl shadow-2xl shadow-amber-200/30 dark:shadow-teal-900/50 p-6 animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-lg"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Word + Meaning */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-2xl md:text-3xl font-bold text-amber-800 dark:text-teal-300 font-serif">
            {wordRef.word}
          </span>
          <span className="text-xs font-semibold bg-amber-100 dark:bg-teal-900/50 text-amber-700 dark:text-teal-200 px-2 py-0.5 rounded">
            {wordRef.meaning}
          </span>
        </div>

        {/* Affix breakdown */}
        <div className="flex items-start gap-2 mb-3">
          <span className="text-xs font-semibold bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400 px-2 py-0.5 rounded whitespace-nowrap mt-0.5">
            接辞
          </span>
          <span className="text-stone-700 dark:text-slate-300 font-mono text-sm md:text-base">
            {wordRef.affix}
          </span>
        </div>

        {/* Description */}
        <div className="flex items-start gap-2">
          <span className="text-xs font-semibold bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400 px-2 py-0.5 rounded whitespace-nowrap mt-0.5">
            解説
          </span>
          <span className="text-stone-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
            {wordRef.description}
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
