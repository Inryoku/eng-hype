"use client";

import { useTheme } from "next-themes";

interface SunoPlayerProps {
  sunoId: string;
}

export function SunoPlayer({ sunoId }: SunoPlayerProps) {
  const { resolvedTheme } = useTheme();

  // Suno supports theme param: ?theme=dark
  // If light mode, we can omit or explicitly check if they support theme=light
  // Assuming default is light if omitted, or standard if dark is not specified.
  const themeParam = resolvedTheme === "dark" ? "?theme=dark" : "";

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border border-stone-200 dark:border-slate-800 bg-stone-100 dark:bg-stone-900">
      <iframe
        src={`https://suno.com/embed/${sunoId}${themeParam}`}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="w-full bg-transparent"
        style={{ colorScheme: "normal" }} // Ensure iframe isn't forced by browser color-scheme
      />
    </div>
  );
}
