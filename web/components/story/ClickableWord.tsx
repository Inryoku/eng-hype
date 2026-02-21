"use client";

import { useState, type ReactNode } from "react";
import type { WordRef } from "@/lib/content";
import { WordRefPopup } from "./WordRefPopup";
import { useParagraphHidden } from "./ParagraphHiddenContext";

interface ClickableWordProps {
  wordRef: WordRef;
  children: ReactNode;
  [key: string]: unknown;
}

export function ClickableWord({
  wordRef,
  children,
  ...props
}: ClickableWordProps) {
  const [showPopup, setShowPopup] = useState(false);
  const isHidden = useParagraphHidden();

  // When paragraph is hidden (blurred), render as normal strong without click behavior
  if (isHidden) {
    return (
      <strong
        className="text-foreground font-bold bg-orange-100 dark:bg-cyan-900/50 dark:text-cyan-200 px-1 rounded mx-0.5 font-sans tracking-wide text-base align-baseline dark:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
        {...props}
      >
        {children}
      </strong>
    );
  }

  return (
    <>
      <strong
        onClick={(e) => {
          e.stopPropagation();
          setShowPopup(true);
        }}
        className="text-foreground font-bold bg-amber-100 dark:bg-teal-900/50 dark:text-teal-200 px-1 rounded mx-0.5 font-sans tracking-wide text-base align-baseline cursor-pointer border-b-2 border-amber-400 dark:border-teal-400 hover:bg-amber-200 dark:hover:bg-teal-800/70 transition-colors dark:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
        {...props}
      >
        {children}
      </strong>

      {showPopup && (
        <WordRefPopup wordRef={wordRef} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
