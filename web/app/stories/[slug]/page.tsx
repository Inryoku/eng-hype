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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32">
        <Link
          href="/stories"
          className="group inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 mb-8 transition-colors text-sm font-medium"
        >
          <span>←</span> Back to Stories
        </Link>

        <article className="prose prose-invert prose-lg prose-cyan max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // @ts-ignore
              img: ({ node, ...props }) => (
                <span className="block my-10 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    {...props}
                    className="w-full h-auto object-cover"
                    alt={props.alt || ""}
                  />
                </span>
              ),
              // @ts-ignore
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="not-italic border-l-4 border-cyan-500 pl-6 py-4 my-8 bg-slate-900/60 rounded-r-xl text-slate-300 shadow-sm"
                  {...props}
                />
              ),
              // @ts-ignore
              strong: ({ node, ...props }) => (
                <strong
                  className="text-cyan-300 font-bold bg-cyan-900/20 px-1 rounded"
                  {...props}
                />
              ),
              // @ts-ignore
              a: ({ node, ...props }) => (
                <a
                  className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/30 hover:decoration-cyan-500 transition-all font-medium"
                  {...props}
                />
              ),
              // @ts-ignore
              h1: ({ node, ...props }) => (
                <h1
                  className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 to-blue-400"
                  {...props}
                />
              ),
              // @ts-ignore
              hr: ({ node, ...props }) => (
                <hr className="border-slate-800 my-12" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
