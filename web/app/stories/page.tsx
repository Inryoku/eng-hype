import Link from "next/link";
import { getAllStories } from "@/lib/content";

export default function StoriesPage() {
  const stories = getAllStories();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-12 text-center">
        <Link
          href="/"
          className="text-cyan-400 hover:text-cyan-300 transition-colors mb-4 inline-block text-sm font-medium"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Stories
        </h1>
      </header>

      <div className="max-w-3xl mx-auto space-y-4">
        {stories.map((story) => (
          <Link
            key={story.slug}
            href={`/stories/${story.slug}`}
            className="block p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-all hover:bg-slate-800/50 group"
          >
            <h2 className="text-xl font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
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
