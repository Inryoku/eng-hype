import Link from "next/link";
import { getAllStories } from "@/lib/content";

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
        {stories.map((story) => (
          <Link
            key={story.slug}
            href={`/stories/${story.slug}`}
            className="block p-8 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl hover:border-orange-400 dark:hover:border-sky-500 transition-all hover:bg-stone-50 dark:hover:bg-slate-900/70 group shadow-sm hover:shadow-lg hover:shadow-orange-500/5 dark:hover:shadow-sky-500/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl font-serif text-orange-900 dark:text-sky-200">
                ❦
              </span>
            </div>
            <h2 className="text-2xl font-serif font-semibold text-stone-800 dark:text-slate-200 group-hover:text-orange-700 dark:group-hover:text-sky-400 transition-colors">
              {story.title}
            </h2>
          </Link>
        ))}
        {stories.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400">
            No stories found.
          </p>
        )}
      </div>
    </div>
  );
}
