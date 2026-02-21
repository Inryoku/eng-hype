import { getAllStories, getStory, getWordsRef } from "@/lib/content";
import { parseStoryStructure } from "@/lib/markdown";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SunoPlayer } from "@/components/SunoPlayer";
import { BilingualStory } from "@/components/BilingualStory";

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
  const wordRefs = getWordsRef();

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
  const rawContent = story.content.replace(
    /\.\.\/images\//g,
    "/eng-hype/images/",
  );

  const { intro, chapters } = await parseStoryStructure(rawContent);

  return (
    <div className="min-h-screen bg-background text-foreground font-[family-name:var(--font-lora)] selection:bg-orange-200 selection:text-orange-900 dark:selection:bg-cyan-900 dark:selection:text-cyan-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 pb-32">
        <Link
          href="/stories"
          className="group inline-flex items-center gap-2 text-stone-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-cyan-400 mb-8 transition-colors text-sm font-sans font-medium tracking-wide"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          Back to Stories
        </Link>

        {/* Story Header Area */}
        {story.title && (
          <header className="mb-12 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight pb-2">
              {story.title}
            </h1>
            <div className="h-1 w-24 bg-orange-200 dark:bg-cyan-600 mx-auto rounded-full dark:shadow-[0_0_10px_rgba(8,145,178,0.5)]"></div>
          </header>
        )}

        {/* Intro Section */}
        {intro && (
          <div className="max-w-3xl mx-auto mb-16 prose prose-xl prose-stone dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{intro}</ReactMarkdown>
          </div>
        )}

        {/* Story Content Wrapper */}
        <BilingualStory chapters={chapters} wordRefs={wordRefs} />
      </div>
    </div>
  );
}
