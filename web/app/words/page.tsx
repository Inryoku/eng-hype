import Link from "next/link";
import { getAllWords } from "@/lib/content";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function WordsPage() {
  const content = getAllWords();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32">
        <header className="mb-12 text-center">
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-300 transition-colors mb-4 inline-block text-sm font-medium"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Words
          </h1>
        </header>

        <article className="prose prose-invert prose-lg prose-purple max-w-none">
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // specific styling for words list
                p: ({ node, ...props }) => (
                  <p
                    className="mb-6 p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-purple-500/30 transition-colors"
                    {...props}
                  />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="text-purple-300" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-center text-slate-500">No words found.</p>
          )}
        </article>
      </div>
    </div>
  );
}
