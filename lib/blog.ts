import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

export type PostMeta = { title: string; slug: string; description: string; date: string };

export function getPostSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } | null {
  const p = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, "utf8");
  const { data, content } = matter(raw);
  const d = data.date;
  const dateStr = d instanceof Date ? d.toISOString().slice(0, 10) : typeof d === "string" ? d : "";
  return {
    meta: {
      title: data.title ?? slug,
      slug: data.slug ?? slug,
      description: data.description ?? "",
      date: dateStr,
    },
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  const slugs = getPostSlugs();
  return slugs
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is { meta: PostMeta; content: string } => p !== null)
    .map((p) => p.meta)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}
