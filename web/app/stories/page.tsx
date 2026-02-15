import Link from "next/link";
import { getAllStories } from "@/lib/content";

export default function StoriesPage() {
  const stories = getAllStories();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-12 text-center">
        <Link
          href="/"
          className="text-orange-400 hover:text-orange-300 transition-colors mb-4 inline-block text-sm font-medium"
        >
          ← Back to Home
        </Link>
        <h1 className="text-5xl font-bold mt-2 font-[family-name:var(--font-lora)] bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-orange-400 to-rose-500 pb-2">
          Stories
        </h1>
      </header>

      <div className="max-w-3xl mx-auto space-y-4">
        {stories.map((story) => (
          <Link
            key={story.slug}
            href={`/stories/${story.slug}`}
            className="block p-8 bg-slate-900/40 border border-white/5 rounded-xl hover:border-orange-500/30 transition-all hover:bg-slate-900/60 group shadow-lg shadow-black/20"
          >
            <h2 className="text-2xl font-serif font-semibold text-stone-200 group-hover:text-orange-400 transition-colors">
              {story.title}
            </h2>
          </Link>
        ))}
        {stories.length === 0 && (
          <p className="text-center text-slate-500">No stories found.</p>
        )}
      </div>
    </div>
  );
}
