import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-cyan-500 selection:text-white">
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 sm:text-7xl tracking-tight">
            Eng Hype
          </h1>
          <p className="text-xl text-slate-400 max-w-lg mx-auto">
            Your premium English learning companion. Stories, vocabulary, and
            methods designed for immersion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full z-10">
          <Link
            href="/stories"
            className="group relative p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 group-hover:text-cyan-400 transition-colors">
              Stories
              <span className="text-slate-500 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </h2>
            <p className="text-slate-400 text-sm">
              Immerse yourself in business dramas and adventures tailored for
              learning.
            </p>
          </Link>

          <Link
            href="/words"
            className="group relative p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 group-hover:text-purple-400 transition-colors">
              Words
              <span className="text-slate-500 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </h2>
            <p className="text-slate-400 text-sm">
              Expand your vocabulary with curated lists and context-rich
              examples.
            </p>
          </Link>

          <Link
            href="/method"
            className="group relative p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
              Method
              <span className="text-slate-500 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </h2>
            <p className="text-slate-400 text-sm">
              Learn the effective strategies behind our content-first approach.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
