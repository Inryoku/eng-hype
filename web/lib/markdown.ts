export interface Scene {
  title: string; // e.g. "Scene 1: The Beginning"
  image?: { src: string; alt: string } | null;
  content: string; // The text content of the scene
}

export interface Chapter {
  title: string; // e.g. "Chapter 1: The Voyage"
  audioUrl?: string;
  sunoId?: string; // Extracted ID for embedding
  content: string; // Intro text before the first scene
  scenes: Scene[];
}

export interface StoryStructure {
  intro: string; // Content before the first chapter
  chapters: Chapter[];
}

export async function parseStoryStructure(
  markdown: string,
): Promise<StoryStructure> {
  // 1. Split by "## " (Chapter)
  // The first part is the intro (before any chapter)
  const chapterSplits = markdown.split(/^## /m);
  let intro = chapterSplits.shift()?.trim() || "";

  // Remove the H1 title from the intro if it exists (since we render it separately)
  intro = intro.replace(/^# .*$/m, "").trim();

  const chapters = await Promise.all(
    chapterSplits.map(async (chapterBlock) => {
      // Extract Title (first line)
      const titleMatch = chapterBlock.match(/^(.*)$/m);
      const title = titleMatch ? titleMatch[1].trim() : "Untitled Chapter";

      // Remove title from block to process rest
      let content = chapterBlock.replace(/^(.*)$/m, "").trim();

      // Extract Suno Link (Support both full and short links)
      // Matches: [Title](https://suno.com/...)
      // Allow /song/, /embed/, or /s/
      const sunoLinkRegex =
        /\[.*?\]\((https:\/\/suno\.com\/(?:song|embed|s)\/[a-zA-Z0-9-]+)\)/;
      const sunoMatch = content.match(sunoLinkRegex);
      let audioUrl: string | undefined = sunoMatch ? sunoMatch[1] : undefined;

      // If it's a short link, resolve it to get the UUID
      if (audioUrl && audioUrl.includes("/s/")) {
        try {
          const response = await fetch(audioUrl, {
            method: "HEAD",
            redirect: "follow",
          });
          if (response.ok) {
            audioUrl = response.url; // This should be the full canonical URL
          }
        } catch (e) {
          console.error("Failed to resolve Suno short link", audioUrl, e);
        }
      }

      // Extract ID from the final URL
      // https://suno.com/song/UUID or https://suno.com/embed/UUID
      let sunoId: string | undefined;
      if (audioUrl) {
        const parts = audioUrl.split("/");
        sunoId = parts[parts.length - 1];
      }

      // Remove Suno link from content
      if (sunoMatch) {
        content = content.replace(sunoMatch[0], "").trim();
      }

      // 2. Split by "### " (Scene)
      // The first part is the chapter intro text
      const sceneSplits = content.split(/^### /m);
      const chapterIntro = sceneSplits.shift()?.trim() || "";

      const scenes = sceneSplits.map((sceneBlock) => {
        // Extract Scene Title
        const sceneTitleMatch = sceneBlock.match(/^(.*)$/m);
        const sceneTitle = sceneTitleMatch ? sceneTitleMatch[1].trim() : "";

        let sceneContent = sceneBlock.replace(/^(.*)$/m, "").trim();

        // Extract Image
        const imageRegex = /!\[(.*?)\]\((.*?)\)/;
        const imageMatch = sceneContent.match(imageRegex);
        let image: { src: string; alt: string } | undefined = undefined;

        if (imageMatch) {
          image = {
            alt: imageMatch[1],
            src: imageMatch[2],
          };
          // Remove image from text
          sceneContent = sceneContent.replace(imageMatch[0], "").trim();
        }

        // Clean up extra newlines
        sceneContent = sceneContent.replace(/\n{3,}/g, "\n\n").trim();

        return {
          title: sceneTitle,
          image,
          content: sceneContent,
        };
      });

      return {
        title,
        audioUrl,
        sunoId,
        content: chapterIntro,
        scenes,
      };
    }),
  );

  return { intro, chapters };
}
