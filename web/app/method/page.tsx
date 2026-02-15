import Link from "next/link";
import { getMethod } from "@/lib/content";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MethodPage() {
  const content = getMethod();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-[family-name:var(--font-geist-sans)] selection:bg-amber-200 selection:text-amber-900">
      <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32">
        <header className="mb-12 text-center">
          <Link
            href="/"
            className="text-stone-500 hover:text-amber-600 transition-colors mb-4 inline-block text-sm font-medium hover:bg-amber-50 px-3 py-1 rounded-full"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mt-2 text-stone-900 font-[family-name:var(--font-lora)]">
            Method
          </h1>
        </header>

        <article className="prose prose-xl prose-stone max-w-none">
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            <p className="text-center text-stone-500">
              No method content found.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
