import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "Tips and guides for visiting the Boston area, Concord, and Methuen.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">Posts coming soon.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="block rounded-lg border p-4 hover:bg-muted/50">
                <h2 className="font-semibold">{post.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{post.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{String(post.date)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
