export interface MediaExtraction {
  audioUrl: string | null;
  images: { src: string; alt: string }[];
  text: string;
}

export function extractMedia(markdown: string): MediaExtraction {
  let text = markdown;
  let audioUrl: string | null = null;
  const images: { src: string; alt: string }[] = [];

  // 1. Extract Suno Embed/Song Links
  // Matches: [Title](https://suno.com/...)
  const sunoLinkRegex =
    /\[.*?\]\((https:\/\/suno\.com\/(?:song|embed)\/[a-zA-Z0-9-]+)\)/g;
  let sunoMatch;
  while ((sunoMatch = sunoLinkRegex.exec(text)) !== null) {
    if (!audioUrl) {
      audioUrl = sunoMatch[1]; // Take the first one found
    }
  }
  // Remove all suno links from text
  text = text.replace(sunoLinkRegex, "");

  // 2. Extract Images
  // Matches: ![Alt](Src)
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  let imageMatch;
  while ((imageMatch = imageRegex.exec(text)) !== null) {
    images.push({
      alt: imageMatch[1],
      src: imageMatch[2],
    });
  }
  // Remove all images from text
  text = text.replace(imageRegex, "");

  // 3. Clean up extra newlines left behind
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  return { audioUrl, images, text };
}
