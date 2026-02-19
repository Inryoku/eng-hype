import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LicensesPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-stone-900 dark:text-slate-100 font-sans selection:bg-orange-200 selection:text-orange-900 dark:selection:bg-cyan-900 dark:selection:text-cyan-100">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-stone-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-cyan-400 mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <header className="mb-12 border-b border-stone-200 dark:border-slate-800 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Licenses & Credits
          </h1>
          <p className="text-stone-600 dark:text-slate-400 text-lg">
            Software, technologies, and assets used in this project.
          </p>
        </header>

        <div className="space-y-12">
          {/* Open Source Software */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-orange-600 dark:text-cyan-400">
              Open Source Software
            </h2>
            <div className="grid gap-4">
              <LicenseItem
                title="Next.js"
                url="https://nextjs.org"
                license="MIT License"
                copyright="© 2024 Vercel, Inc."
              />
              <LicenseItem
                title="React"
                url="https://react.dev"
                license="MIT License"
                copyright="© Meta Platforms, Inc."
              />
              <LicenseItem
                title="Tailwind CSS"
                url="https://tailwindcss.com"
                license="MIT License"
                copyright="© Tailwind Labs Inc."
              />
              <LicenseItem
                title="Lucide React"
                url="https://lucide.dev"
                license="ISC License"
                copyright="© Lucide Contributors"
              />
              <LicenseItem
                title="Supabase JS"
                url="https://supabase.com"
                license="MIT License"
                copyright="© Supabase Inc."
              />
              <LicenseItem
                title="React Markdown"
                url="https://github.com/remarkjs/react-markdown"
                license="MIT License"
                copyright="© Titus Wormer"
              />
              <LicenseItem
                title="next-themes"
                url="https://github.com/pacocoursey/next-themes"
                license="MIT License"
                copyright="© Paco Coursey"
              />
            </div>
          </section>

          {/* AI Services */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-orange-600 dark:text-cyan-400">
              AI Technologies
            </h2>
            <div className="grid gap-4">
              <LicenseItem
                title="OpenAI"
                url="https://openai.com"
                description="Text-to-Speech (TTS) generation powered by TTS-1 model."
              />
              <LicenseItem
                title="Suno AI"
                url="https://suno.com"
                description="Music generation and audio embedding."
              />
              <LicenseItem
                title="Google Gemini"
                url="https://deepmind.google/technologies/gemini/"
                description="Assisted in code generation and content development."
              />
            </div>
          </section>

          {/* Fonts & Icons */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-orange-600 dark:text-cyan-400">
              Assets
            </h2>
            <div className="grid gap-4">
              <LicenseItem
                title="Inter Font"
                url="https://rsms.me/inter/"
                license="SIL Open Font License 1.1"
              />
              <LicenseItem
                title="Lora Font"
                url="https://fonts.google.com/specimen/Lora"
                license="SIL Open Font License 1.1"
              />
            </div>
          </section>
        </div>

        <footer className="mt-20 pt-8 border-t border-stone-200 dark:border-slate-800 text-center text-stone-500 dark:text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Eng-Hype. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

function LicenseItem({
  title,
  url,
  license,
  copyright,
  description,
}: {
  title: string;
  url: string;
  license?: string;
  copyright?: string;
  description?: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold hover:underline decoration-orange-400 dark:decoration-cyan-400 underline-offset-4"
        >
          {title}
        </a>
        {license && (
          <span className="text-xs uppercase tracking-wider font-medium text-stone-500 dark:text-slate-500 bg-stone-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            {license}
          </span>
        )}
      </div>
      {description && (
        <p className="text-stone-600 dark:text-slate-400 text-sm mt-1">
          {description}
        </p>
      )}
      {copyright && (
        <p className="text-stone-500 dark:text-slate-500 text-xs mt-1 font-mono">
          {copyright}
        </p>
      )}
    </div>
  );
}
