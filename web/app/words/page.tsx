/* eslint-disable @typescript-eslint/ban-ts-comment */
import Link from "next/link";
import { getAllWords } from "@/lib/content";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function WordsPage() {
  const content = getAllWords();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-slate-950 dark:text-slate-100 font-[family-name:var(--font-geist-sans)] selection:bg-rose-200 selection:text-rose-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100">
      <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32">
        <header className="mb-12 text-center">
          <Link
            href="/"
            className="text-stone-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-indigo-400 transition-colors mb-4 inline-block text-sm font-medium hover:bg-rose-50 dark:hover:bg-indigo-900/40 px-3 py-1 rounded-full"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mt-2 text-stone-900 dark:text-slate-100 font-[family-name:var(--font-lora)]">
            Words
          </h1>
        </header>

        <article className="prose prose-xl prose-stone dark:prose-invert max-w-none">
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // specific styling for words list
                p: ({ node, ...props }) => (
                  <p
                    className="mb-4 p-6 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl hover:border-rose-300 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md hover:shadow-rose-100 dark:hover:shadow-indigo-500/10"
                    {...props}
                  />
                ),
                strong: ({ node, ...props }) => (
                  <strong
                    className="text-rose-800 dark:text-indigo-300 font-bold block mb-1 font-serif text-2xl"
                    {...props}
                  />
                ),
                // @ts-ignore
                ul: ({ node, ...props }) => (
                  <ul className="space-y-4 list-none pl-0" {...props} />
                ),
                // @ts-ignore
                li: ({ node, ...props }) => (
                  <li className="contents" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-center text-stone-500 dark:text-slate-400">
              No words found.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
