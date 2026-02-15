import Link from "next/link";
import { getMethod } from "@/lib/content";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MethodPage() {
  const content = getMethod();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32">
        <header className="mb-12 text-center">
          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 transition-colors mb-4 inline-block text-sm font-medium"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
            Method
          </h1>
        </header>

        <article className="prose prose-invert prose-lg prose-emerald max-w-none">
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            <p className="text-center text-slate-500">
              No method content found.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
