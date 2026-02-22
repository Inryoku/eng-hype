"use client";

import { useTheme } from "next-themes";

interface SunoPlayerProps {
  sunoId: string;
}

export function SunoPlayer({ sunoId }: SunoPlayerProps) {
  const { resolvedTheme } = useTheme();

  // Build the embed URL, handling both theme param and existing query params
  const baseUrl = `https://suno.com/embed/${sunoId}`;
  const separator = sunoId.includes("?") ? "&" : "?";
  const themeParam = resolvedTheme === "dark" ? `${separator}theme=dark` : "";
  const src = `${baseUrl}${themeParam}`;

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border border-stone-200 dark:border-slate-800 bg-stone-100 dark:bg-stone-900">
      <iframe
        suppressHydrationWarning
        src={src}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="w-full bg-transparent"
        style={{ colorScheme: "normal" }}
      />
    </div>
  );
}
