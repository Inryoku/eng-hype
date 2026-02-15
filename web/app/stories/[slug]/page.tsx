import { getAllStories, getStory } from "@/lib/content";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  const stories = getAllStories();
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStory(slug);

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Story not found</h1>
          <Link href="/stories" className="text-cyan-400 hover:underline">
            Return to stories
          </Link>
        </div>
      </div>
    );
  }

  // Preprocess content to fix image paths
  // Converts ../images/foo.png to /eng-hype/images/foo.png
  const content = story.content.replace(/\.\.\/images\//g, "/eng-hype/images/");

  return (
    <div className="min-h-screen bg-slate-950 text-stone-200 font-[family-name:var(--font-lora)] selection:bg-orange-500/30 selection:text-orange-100">
      <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32">
        <Link
          href="/stories"
          className="group inline-flex items-center gap-2 text-stone-500 hover:text-orange-400 mb-12 transition-colors text-sm font-sans font-medium tracking-wide"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          Back to Stories
        </Link>

        {/* Story Header Area */}
        {story.title && (
          <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-orange-400 to-rose-500 leading-tight pb-2">
              {story.title}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent mx-auto rounded-full"></div>
          </header>
        )}

        <article className="prose prose-xl prose-invert max-w-none prose-headings:font-bold prose-headings:text-stone-100 prose-p:text-stone-300 prose-p:leading-normal prose-p:font-serif prose-p:text-lg md:prose-p:text-xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // @ts-ignore
              img: ({ node, ...props }) => (
                <span className="block my-8 rounded-xl overflow-hidden border border-white/5 shadow-2xl shadow-black/40 bg-slate-900/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    {...props}
                    className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                    alt={props.alt || ""}
                  />
                </span>
              ),
              // @ts-ignore
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="not-italic border-l-2 border-orange-500/50 pl-6 py-2 my-6 bg-gradient-to-r from-orange-900/10 to-transparent text-stone-400 font-serif text-lg leading-snug"
                  {...props}
                />
              ),
              // @ts-ignore
              strong: ({ node, ...props }) => (
                <strong
                  className="text-orange-300 font-bold bg-orange-900/10 px-1 rounded mx-0.5 font-sans tracking-wide text-base align-baseline"
                  {...props}
                />
              ),
              // @ts-ignore
              a: ({ node, ...props }) => (
                <a
                  className="text-orange-400 hover:text-orange-300 underline decoration-orange-500/30 hover:decoration-orange-500 transition-all font-medium decoration-1 underline-offset-4"
                  {...props}
                />
              ),
              // @ts-ignore
              h1: ({ node, ...props }) => (
                // Render h1 invisible if it matches title to avoid duplication, or style it if used within content
                <h1
                  className="text-3xl md:text-4xl font-bold mt-10 mb-6 text-stone-100 border-b border-white/5 pb-3"
                  {...props}
                />
              ),
              // @ts-ignore
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-stone-200 font-sans tracking-tight"
                  {...props}
                />
              ),
              // @ts-ignore
              h3: ({ node, ...props }) => (
                <h3
                  className="text-xl md:text-2xl font-bold mt-8 mb-3 text-stone-300 font-sans"
                  {...props}
                />
              ),
              // @ts-ignore
              hr: ({ node, ...props }) => (
                <div className="my-10 flex items-center justify-center gap-4 opacity-30">
                  <div className="h-px w-full bg-stone-500"></div>
                  <div className="text-stone-500 text-xl">❦</div>
                  <div className="h-px w-full bg-stone-500"></div>
                </div>
              ),
              // @ts-ignore
              p: ({ node, ...props }) => (
                <p
                  className="mb-6 text-stone-300/90 leading-normal"
                  {...props}
                />
              ),
              // @ts-ignore
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc list-outside ml-6 mb-6 space-y-1 text-stone-300"
                  {...props}
                />
              ),
              // @ts-ignore
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal list-outside ml-6 mb-6 space-y-1 text-stone-300"
                  {...props}
                />
              ),
              // @ts-ignore
              li: ({ node, ...props }) => <li className="pl-2" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
