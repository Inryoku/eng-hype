import { getAllStories, getStory } from "@/lib/content";
import { extractMedia } from "@/lib/markdown";
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
  const rawContent = story.content.replace(
    /\.\.\/images\//g,
    "/eng-hype/images/",
  );

  const { audioUrl, images, text } = extractMedia(rawContent);
  const sunoId = audioUrl
    ? audioUrl.match(/suno\.com\/(?:song|embed)\/([a-zA-Z0-9-]+)/)?.[1]
    : null;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-[family-name:var(--font-lora)] selection:bg-orange-200 selection:text-orange-900">
      <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 pb-32">
        <Link
          href="/stories"
          className="group inline-flex items-center gap-2 text-stone-500 hover:text-orange-600 mb-8 transition-colors text-sm font-sans font-medium tracking-wide"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          Back to Stories
        </Link>

        {/* Story Header Area */}
        {story.title && (
          <header className="mb-12 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-stone-900 leading-tight pb-2">
              {story.title}
            </h1>
            <div className="h-1 w-24 bg-orange-200 mx-auto rounded-full"></div>
          </header>
        )}

        {/* Audio Player (Full Width) */}
        {sunoId && (
          <div className="w-full max-w-4xl mx-auto mb-16 rounded-xl overflow-hidden shadow-lg border border-stone-200 bg-stone-900">
            <iframe
              src={`https://suno.com/embed/${sunoId}`}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="w-full bg-transparent"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Visuals (Sticky) */}
          <div className="lg:col-span-5 h-fit lg:sticky lg:top-8 space-y-8">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden shadow-lg shadow-stone-200 border border-stone-100 bg-stone-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto object-cover opacity-95 hover:opacity-100 transition-opacity duration-700 mix-blend-multiply"
                />
                {img.alt && (
                  <div className="p-3 text-sm text-stone-500 font-sans bg-stone-50 border-t border-stone-100">
                    {img.alt}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column: Text Content */}
          <article className="lg:col-span-7 prose prose-xl prose-stone max-w-none prose-headings:font-bold prose-headings:text-stone-900 prose-p:text-stone-700 prose-p:leading-normal prose-p:font-serif prose-p:text-lg md:prose-p:text-xl">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // @ts-ignore
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="not-italic border-l-4 border-orange-300 pl-6 py-2 my-6 bg-orange-50 text-stone-600 font-serif text-lg leading-snug"
                    {...props}
                  />
                ),
                // @ts-ignore
                strong: ({ node, ...props }) => (
                  <strong
                    className="text-stone-900 font-bold bg-orange-100 px-1 rounded mx-0.5 font-sans tracking-wide text-base align-baseline"
                    {...props}
                  />
                ),
                // @ts-ignore
                a: ({ node, ...props }) => (
                  <a
                    className="text-orange-700 hover:text-orange-900 underline decoration-orange-300 hover:decoration-orange-600 transition-all font-medium decoration-1 underline-offset-4"
                    {...props}
                  />
                ),
                // @ts-ignore
                h1: ({ node, ...props }) => (
                  // Render h1 invisible if it matches title to avoid duplication, or style it if used within content
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
              {text}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
