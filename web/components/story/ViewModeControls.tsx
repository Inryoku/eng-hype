import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "show-all" | "hide-en" | "hide-jp";

interface ViewModeControlsProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  showOfflineBadge: boolean;
}

export function ViewModeControls({
  viewMode,
  onChange,
  showOfflineBadge,
}: ViewModeControlsProps) {
  return (
    <div className="sticky top-4 z-50 flex justify-center mb-8 pointer-events-none">
      <div className="flex gap-2 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-lg rounded-full border border-stone-200 dark:border-slate-700 pointer-events-auto">
        <button
          onClick={() => onChange("hide-en")}
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
          onClick={() => onChange("hide-jp")}
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
          onClick={() => onChange("show-all")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
            viewMode === "show-all"
              ? "bg-stone-800 text-white dark:bg-cyan-900 dark:text-cyan-100 shadow-sm"
              : "text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800",
          )}
        >
          Show All
        </button>

        {showOfflineBadge && (
          <span className="hidden md:inline text-xs text-stone-500 dark:text-slate-400 px-2">
            Offline rank mode
          </span>
        )}
      </div>
    </div>
  );
}
