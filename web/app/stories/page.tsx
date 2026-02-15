import Link from "next/link";
import { getAllStories } from "@/lib/content";

export default function StoriesPage() {
  const stories = getAllStories();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-8 font-[family-name:var(--font-geist-sans)] selection:bg-orange-200 selection:text-orange-900">
      <header className="mb-12 text-center">
        <Link
          href="/"
          className="text-orange-600 hover:text-orange-800 transition-colors mb-4 inline-block text-sm font-medium bg-orange-50 px-3 py-1 rounded-full hover:bg-orange-100"
        >
          ← Back to Home
        </Link>
        <h1 className="text-5xl font-bold mt-2 font-[family-name:var(--font-lora)] text-stone-900 pb-2">
          Stories
        </h1>
        <p className="text-stone-500 mt-2 font-serif italic">
          Select a story to begin reading.
        </p>
      </header>

      <div className="max-w-3xl mx-auto space-y-4">
        {stories.map((story) => (
          <Link
            key={story.slug}
            href={`/stories/${story.slug}`}
            className="block p-8 bg-white border border-stone-200 rounded-xl hover:border-orange-400 transition-all hover:bg-stone-50 group shadow-sm hover:shadow-lg hover:shadow-orange-500/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl font-serif text-orange-900">❦</span>
            </div>
            <h2 className="text-2xl font-serif font-semibold text-stone-800 group-hover:text-orange-700 transition-colors">
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
