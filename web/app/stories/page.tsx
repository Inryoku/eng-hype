import Link from "next/link";
import { getAllStories } from "@/lib/content";
import {
  BookOpen,
  Sprout,
  ScrollText,
  Users,
  Cpu,
  Stethoscope,
} from "lucide-react";

export default function StoriesPage() {
  const stories = getAllStories();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-stone-900 dark:text-slate-100 p-8 font-[family-name:var(--font-geist-sans)] selection:bg-orange-200 selection:text-orange-900 dark:selection:bg-sky-900 dark:selection:text-sky-100">
      <header className="mb-12 text-center">
        <Link
          href="/"
          className="text-orange-600 dark:text-sky-400 hover:text-orange-800 dark:hover:text-sky-300 transition-colors mb-4 inline-block text-sm font-medium bg-orange-50 dark:bg-sky-900/30 px-3 py-1 rounded-full hover:bg-orange-100 dark:hover:bg-sky-900/50"
        >
          ← Back to Home
        </Link>
        <h1 className="text-5xl font-bold mt-2 font-[family-name:var(--font-lora)] text-stone-900 dark:text-slate-100 pb-2">
          Stories
        </h1>
        <p className="text-stone-500 dark:text-slate-400 mt-2 font-serif italic">
          Select a story to begin reading.
        </p>
      </header>

      <div className="max-w-3xl mx-auto space-y-4">
        {stories.map((story) => {
          // Icon Mapping
          let Icon = BookOpen;
          let iconColor = "text-stone-400";

          if (story.slug.includes("Nature")) {
            Icon = Sprout;
            iconColor = "text-emerald-500 dark:text-emerald-400";
          } else if (story.slug.includes("History")) {
            Icon = ScrollText;
            iconColor = "text-amber-600 dark:text-amber-500";
          } else if (story.slug.includes("Social")) {
            Icon = Users;
            iconColor = "text-blue-500 dark:text-blue-400";
          } else if (story.slug.includes("Technology")) {
            Icon = Cpu;
            iconColor = "text-indigo-500 dark:text-indigo-400";
          } else if (story.slug.includes("Medical")) {
            Icon = Stethoscope;
            iconColor = "text-rose-500 dark:text-rose-400";
          }

          return (
            <Link
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="block p-6 md:p-8 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl hover:border-orange-400 dark:hover:border-sky-500 transition-all hover:bg-stone-50 dark:hover:bg-slate-900/70 group shadow-sm hover:shadow-lg hover:shadow-orange-500/5 dark:hover:shadow-sky-500/10 relative overflow-hidden"
            >
              <div className="absolute top-1/2 -translate-y-1/2 right-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl font-serif text-orange-900 dark:text-sky-200">
                  ❦
                </span>
              </div>

              <div className="flex items-center gap-4 md:gap-6 relative z-10">
                <div
                  className={`p-3 rounded-full bg-stone-100 dark:bg-slate-800 ${iconColor} ring-1 ring-stone-200 dark:ring-slate-700 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-serif font-semibold text-stone-800 dark:text-slate-200 group-hover:text-orange-700 dark:group-hover:text-sky-400 transition-colors">
                    {story.title}
                  </h2>
                  <p className="text-sm text-stone-500 dark:text-slate-400 mt-1 font-medium opacity-60">
                    Read Story →
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
        {stories.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400">
            No stories found.
          </p>
        )}
      </div>
    </div>
  );
}
