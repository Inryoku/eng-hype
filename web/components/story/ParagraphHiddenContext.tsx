"use client";

import { createContext, useContext } from "react";

/**
 * Context to communicate paragraph-level hidden state to child components
 * (e.g. ClickableWord needs to know if its parent paragraph is blurred)
 */
const ParagraphHiddenContext = createContext(false);

export function ParagraphHiddenProvider({
  isHidden,
  children,
}: {
  isHidden: boolean;
  children: React.ReactNode;
}) {
  return (
    <ParagraphHiddenContext.Provider value={isHidden}>
      {children}
    </ParagraphHiddenContext.Provider>
  );
}

export function useParagraphHidden() {
  return useContext(ParagraphHiddenContext);
}
