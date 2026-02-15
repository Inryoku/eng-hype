import Link from "next/link";
import { getAllWords } from "@/lib/content";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function WordsPage() {
  const content = getAllWords();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-[family-name:var(--font-geist-sans)] selection:bg-rose-200 selection:text-rose-900">
      <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32">
        <header className="mb-12 text-center">
          <Link
            href="/"
            className="text-stone-500 hover:text-rose-600 transition-colors mb-4 inline-block text-sm font-medium hover:bg-rose-50 px-3 py-1 rounded-full"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mt-2 text-stone-900 font-[family-name:var(--font-lora)]">
            Words
          </h1>
        </header>

        <article className="prose prose-xl prose-stone max-w-none">
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // specific styling for words list
                p: ({ node, ...props }) => (
                  <p
                    className="mb-4 p-6 bg-white border border-stone-200 rounded-xl hover:border-rose-300 transition-all shadow-sm hover:shadow-md hover:shadow-rose-100"
                    {...props}
                  />
                ),
                strong: ({ node, ...props }) => (
                  <strong
                    className="text-rose-800 font-bold block mb-1 font-serif text-2xl"
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
            <p className="text-center text-stone-500">No words found.</p>
          )}
        </article>
      </div>
    </div>
  );
}
