/* eslint-disable @typescript-eslint/ban-ts-comment */
import Link from "next/link";
import { getMethod } from "@/lib/content";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MethodPage() {
  const methodContent = getMethod();
  // Fix image paths for github pages deployment
  const content = methodContent
    ? methodContent.replace(/\.\.\/images\//g, "/eng-hype/images/")
    : null;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-slate-950 dark:text-slate-100 font-[family-name:var(--font-geist-sans)] selection:bg-amber-200 selection:text-amber-900 dark:selection:bg-cyan-900 dark:selection:text-cyan-100">
      <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32">
        <header className="mb-12 text-center">
          <Link
            href="/"
            className="text-stone-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-cyan-400 transition-colors mb-4 inline-block text-sm font-medium hover:bg-amber-50 dark:hover:bg-cyan-900/40 px-3 py-1 rounded-full"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mt-2 text-stone-900 dark:text-slate-100 font-[family-name:var(--font-lora)]">
            Method
          </h1>
        </header>

        <article className="prose prose-xl prose-stone dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-stone-900 dark:prose-headings:text-slate-100 prose-p:text-stone-700 dark:prose-p:text-slate-300 prose-p:leading-normal prose-p:font-serif prose-p:text-lg md:prose-p:text-xl">
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // @ts-ignore
                img: ({ node, ...props }) => (
                  <span className="block my-8 rounded-xl overflow-hidden border border-stone-200 dark:border-slate-800 shadow-lg shadow-stone-200 dark:shadow-black/40 bg-stone-100 dark:bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      {...props}
                      className="w-full h-auto object-cover opacity-95 hover:opacity-100 transition-opacity duration-700 mix-blend-multiply dark:mix-blend-normal"
                      alt={props.alt || ""}
                    />
                  </span>
                ),
                // @ts-ignore
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="not-italic border-l-4 border-amber-300 dark:border-cyan-700 pl-6 py-2 my-6 bg-amber-50 dark:bg-slate-900/50 text-stone-600 dark:text-slate-400 font-serif text-lg leading-snug"
                    {...props}
                  />
                ),
                // @ts-ignore
                strong: ({ node, ...props }) => (
                  <strong
                    className="text-stone-900 dark:text-cyan-100 font-bold bg-amber-100 dark:bg-cyan-900/40 px-1 rounded mx-0.5 font-sans tracking-wide text-base align-baseline"
                    {...props}
                  />
                ),
                // @ts-ignore
                a: ({ node, ...props }) => (
                  <a
                    className="text-amber-700 dark:text-cyan-400 hover:text-amber-900 dark:hover:text-cyan-300 underline decoration-amber-300 dark:decoration-cyan-700 hover:decoration-amber-600 dark:hover:decoration-cyan-500 transition-all font-medium decoration-1 underline-offset-4"
                    {...props}
                  />
                ),
                // @ts-ignore
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-3xl md:text-4xl font-bold mt-10 mb-6 text-stone-900 dark:text-slate-100 border-b border-stone-200 dark:border-slate-800 pb-3"
                    {...props}
                  />
                ),
                // @ts-ignore
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-stone-800 dark:text-slate-200 font-sans tracking-tight"
                    {...props}
                  />
                ),
                // @ts-ignore
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-xl md:text-2xl font-bold mt-8 mb-3 text-stone-800 dark:text-slate-200 font-sans"
                    {...props}
                  />
                ),
                // @ts-ignore
                hr: ({ node, ...props }) => (
                  <div className="my-10 flex items-center justify-center gap-4 opacity-30 dark:opacity-20">
                    <div className="h-px w-full bg-stone-300 dark:bg-slate-700"></div>
                    <div className="text-stone-400 dark:text-slate-600 text-xl">❦</div>
                    <div className="h-px w-full bg-stone-300 dark:bg-slate-700"></div>
                  </div>
                ),
                // @ts-ignore
                p: ({ node, ...props }) => (
                  <p
                    className="mb-6 text-stone-700 dark:text-slate-300 leading-normal"
                    {...props}
                  />
                ),
                // @ts-ignore
                ul: ({ node, ...props }) => (
                  <ul
                    className="list-disc list-outside ml-6 mb-6 space-y-1 text-stone-700 dark:text-slate-300"
                    {...props}
                  />
                ),
                // @ts-ignore
                ol: ({ node, ...props }) => (
                  <ol
                    className="list-decimal list-outside ml-6 mb-6 space-y-1 text-stone-700 dark:text-slate-300"
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
            <p className="text-center text-stone-500 dark:text-slate-400">
              No method content found.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
