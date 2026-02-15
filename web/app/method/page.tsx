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

        <article className="prose prose-xl prose-stone max-w-none prose-headings:font-bold prose-headings:text-stone-900 prose-p:text-stone-700 prose-p:leading-normal prose-p:font-serif prose-p:text-lg md:prose-p:text-xl">
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // @ts-ignore
                img: ({ node, ...props }) => (
                  <span className="block my-8 rounded-xl overflow-hidden border border-stone-200 shadow-lg shadow-stone-200 bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      {...props}
                      className="w-full h-auto object-cover opacity-95 hover:opacity-100 transition-opacity duration-700 mix-blend-multiply"
                      alt={props.alt || ""}
                    />
                  </span>
                ),
                // @ts-ignore
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="not-italic border-l-4 border-amber-300 pl-6 py-2 my-6 bg-amber-50 text-stone-600 font-serif text-lg leading-snug"
                    {...props}
                  />
                ),
                // @ts-ignore
                strong: ({ node, ...props }) => (
                  <strong
                    className="text-stone-900 font-bold bg-amber-100 px-1 rounded mx-0.5 font-sans tracking-wide text-base align-baseline"
                    {...props}
                  />
                ),
                // @ts-ignore
                a: ({ node, ...props }) => (
                  <a
                    className="text-amber-700 hover:text-amber-900 underline decoration-amber-300 hover:decoration-amber-600 transition-all font-medium decoration-1 underline-offset-4"
                    {...props}
                  />
                ),
                // @ts-ignore
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-3xl md:text-4xl font-bold mt-10 mb-6 text-stone-900 border-b border-stone-200 pb-3"
                    {...props}
                  />
                ),
                // @ts-ignore
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-stone-800 font-sans tracking-tight"
                    {...props}
                  />
                ),
                // @ts-ignore
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-xl md:text-2xl font-bold mt-8 mb-3 text-stone-800 font-sans"
                    {...props}
                  />
                ),
                // @ts-ignore
                hr: ({ node, ...props }) => (
                  <div className="my-10 flex items-center justify-center gap-4 opacity-30">
                    <div className="h-px w-full bg-stone-300"></div>
                    <div className="text-stone-400 text-xl">❦</div>
                    <div className="h-px w-full bg-stone-300"></div>
                  </div>
                ),
                // @ts-ignore
                p: ({ node, ...props }) => (
                  <p
                    className="mb-6 text-stone-700 leading-normal"
                    {...props}
                  />
                ),
                // @ts-ignore
                ul: ({ node, ...props }) => (
                  <ul
                    className="list-disc list-outside ml-6 mb-6 space-y-1 text-stone-700"
                    {...props}
                  />
                ),
                // @ts-ignore
                ol: ({ node, ...props }) => (
                  <ol
                    className="list-decimal list-outside ml-6 mb-6 space-y-1 text-stone-700"
                    {...props}
                  />
                ),
                // @ts-ignore
                li: ({ node, ...props }) => <li className="pl-2" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
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
