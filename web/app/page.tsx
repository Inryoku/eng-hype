import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-orange-200 selection:text-orange-900 dark:selection:bg-sky-900 dark:selection:text-sky-100">
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-6xl md:text-8xl font-bold font-[family-name:var(--font-lora)] text-foreground tracking-tight mb-4">
            Eng Hype
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 dark:text-slate-400 max-w-lg mx-auto font-light leading-relaxed">
            Your premium English learning library. <br />
            <span className="font-medium text-orange-700 dark:text-sky-300 bg-orange-100/60 dark:bg-sky-900/40 px-2 py-0.5 rounded-sm">
              Stories, words, and methods
            </span>{" "}
            designed for immersion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full z-10">
          <Link
            href="/stories"
            className="group relative p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-stone-200 dark:border-slate-800 rounded-2xl hover:border-orange-400 dark:hover:border-sky-500 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-sky-500/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 dark:from-sky-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-2xl font-serif font-semibold mb-3 flex items-center gap-2 text-stone-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-sky-400 transition-colors">
              Stories
              <span className="text-stone-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </h2>
            <p className="text-stone-500 dark:text-slate-400 text-sm leading-relaxed">
              Immerse yourself in business dramas and adventures tailored for
              learning.
            </p>
          </Link>

          <Link
            href="/words"
            className="group relative p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-stone-200 dark:border-slate-800 rounded-2xl hover:border-rose-400 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10 dark:hover:shadow-indigo-500/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 dark:from-indigo-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-2xl font-serif font-semibold mb-3 flex items-center gap-2 text-stone-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-indigo-400 transition-colors">
              Words
              <span className="text-stone-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </h2>
            <p className="text-stone-500 dark:text-slate-400 text-sm leading-relaxed">
              Expand your vocabulary with curated lists and context-rich
              examples.
            </p>
          </Link>

          <Link
            href="/method"
            className="group relative p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-stone-200 dark:border-slate-800 rounded-2xl hover:border-amber-400 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 dark:hover:shadow-cyan-500/10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 dark:from-cyan-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-2xl font-serif font-semibold mb-3 flex items-center gap-2 text-stone-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-cyan-400 transition-colors">
              Method
              <span className="text-stone-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Learn the effective strategies behind our content-first approach.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
