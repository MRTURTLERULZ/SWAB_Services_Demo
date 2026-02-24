import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.meta.title, description: post.meta.description };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/blog" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">← Blog</Link>
      <h1 className="text-3xl font-bold mb-2">{post.meta.title}</h1>
      <p className="text-muted-foreground text-sm mb-8">{post.meta.date}</p>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
}
