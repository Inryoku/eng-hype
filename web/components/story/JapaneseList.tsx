import { useState, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ViewMode = "show-all" | "hide-en" | "hide-jp";

interface JapaneseListProps {
  viewMode: ViewMode;
}

type JapaneseListComponentProps = JapaneseListProps &
  Omit<ComponentPropsWithoutRef<"ul">, keyof JapaneseListProps>;

export const JapaneseList = ({
  viewMode,
  ...props
}: JapaneseListComponentProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const isHidden = viewMode === "hide-jp" && !isRevealed;

  return (
    <ul
      onClick={() => {
        if (isHidden) setIsRevealed(true);
      }}
      className={cn(
        "list-none pl-0 mb-6 space-y-1 text-stone-500 dark:text-slate-400 text-sm font-sans transition-all duration-300 relative z-10",
        isHidden
          ? "blur-[5px] opacity-40 select-none hover:blur-[3px] hover:opacity-60 cursor-pointer"
          : "",
      )}
      {...props}
    />
  );
};
