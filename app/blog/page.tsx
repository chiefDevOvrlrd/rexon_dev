import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/footer/Footer";
import AskAlfredButton from "@/components/ui/AskAlfredButton";
import { getAllPosts } from "@/lib/blog";
import styles from "./blog.module.scss";

export const revalidate = 300; // posts also refresh instantly when published from WhatsApp

export const metadata: Metadata = {
  title: "Blog | Rexon Dev",
  description:
    "Practical guides on AI agents, WhatsApp automation and software for growing businesses, from the team at Rexon Dev.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The Rexon Dev Blog",
    description: "Practical guides on AI agents, WhatsApp automation and software for growing businesses.",
    url: "https://rexon.dev/blog",
    type: "website",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" });
}

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>The Rexon blog</span>
        <h1>Straight talk on AI agents and automation for your business.</h1>
        <p>
          Practical guides on WhatsApp automation, AI agents and the software that keeps a growing business running.
        </p>
      </header>

      {posts.length === 0 ? (
        <section className={styles.empty}>
          <h2>First posts are on the way.</h2>
          <p>In the meantime, ask Alfred anything about how an AI agent could work for your business.</p>
          <AskAlfredButton
            message="Hi Alfred, I'd like to know how an AI agent could help my business."
            label="Ask Alfred"
            variant="solid"
          />
        </section>
      ) : (
        <section className={styles.grid} aria-label="Blog posts">
          {posts.map((post) => (
            <article key={post.slug} className={styles.card}>
              <div className={styles.meta}>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span>{post.readingMinutes} min read</span>
              </div>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.description}</p>
              {post.tags.length > 0 && (
                <ul className={styles.tags}>
                  {post.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
              <Link href={`/blog/${post.slug}`} className={styles.more}>
                Read the post →
              </Link>
            </article>
          ))}
        </section>
      )}

      <Footer />
    </main>
  );
}
