import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Point to the root directory (../) from web/
// In production (GitHub Actions), the repo is checked out, so ../script exists.
const contentDirectory = path.join(process.cwd(), "..");

export function getAllStories() {
  const scriptsDir = path.join(contentDirectory, "script");
  if (!fs.existsSync(scriptsDir)) return [];

  const fileNames = fs.readdirSync(scriptsDir);
  const stories = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(scriptsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse metadata if exists, otherwise manual
      const { data, content } = matter(fileContents);

      // Extract title from first line if not in frontmatter
      let title = data.title;
      if (!title) {
        const match = content.match(/^#\s+(.+)$/m);
        if (match) {
          title = match[1];
        } else {
          title = slug;
        }
      }

      return {
        slug,
        title,
        ...data,
      };
    })
    // Sort stories numerically by title (Story 1, Story 2, etc.)
    .sort((a, b) => {
      const getStoryNumber = (title: string) => {
        const match = title.match(/Story\s+(\d+)/i);
        return match ? parseInt(match[1], 10) : 999;
      };
      return getStoryNumber(a.title) - getStoryNumber(b.title);
    });

  return stories;
}

export function getStory(slug: string) {
  const fullPath = path.join(contentDirectory, "script", `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  let title = data.title;
  if (!title) {
    const match = content.match(/^#\s+(.+)$/m);
    if (match) {
      title = match[1];
    } else {
      title = slug;
    }
  }

  return {
    slug,
    title,
    content,
    ...data,
  };
}

export function getAllWords() {
  const wordsDir = path.join(contentDirectory, "words");
  if (!fs.existsSync(wordsDir)) return null;

  // Assuming words.md is the main file
  const fullPath = path.join(wordsDir, "words.md");
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  return fileContents;
}

export function getMethod() {
  const methodDir = path.join(contentDirectory, "method");
  if (!fs.existsSync(methodDir)) return null;

  const fullPath = path.join(methodDir, "method.md");
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  return fileContents;
}

export interface WordRef {
  word: string;
  meaning: string;
  domain: string;
  affix: string;
  description: string;
}

export function getWordsRef(): WordRef[] {
  const wordsDir = path.join(contentDirectory, "words");
  if (!fs.existsSync(wordsDir)) return [];

  const fullPath = path.join(wordsDir, "words_ref.tsv");
  if (!fs.existsSync(fullPath)) return [];

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const lines = fileContents
    .split("\n")
    .filter((l) => l.trim() && l.trim() !== ".");
  if (lines.length <= 1) return []; // header only

  return lines
    .slice(1)
    .map((line) => {
      const [word, meaning, domain, affix, description] = line.split("\t");
      return {
        word: word?.trim() ?? "",
        meaning: meaning?.trim() ?? "",
        domain: domain?.trim() ?? "",
        affix: affix?.trim() ?? "",
        description: description?.trim() ?? "",
      };
    })
    .filter((w) => w.word);
}
