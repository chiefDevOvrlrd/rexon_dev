import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Footer from "@/components/footer/Footer";
import AskAlfredButton from "@/components/ui/AskAlfredButton";
import { getPost } from "@/lib/blog";
import styles from "../blog.module.scss";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

// no posts are pre-built; each one is generated on first visit, then cached (and refreshed on publish)
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found | Rexon Dev", robots: { index: false } };

  const url = `https://rexon.dev/blog/${post.slug}`;
  return {
    title: `${post.title} | Rexon Dev`,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: ["/og-image.png"] },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" });
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: post.tags.join(", "),
    mainEntityOfPage: `https://rexon.dev/blog/${post.slug}`,
    author: { "@type": "Organization", name: "Rexon Dev", url: "https://rexon.dev" },
    publisher: {
      "@type": "Organization",
      name: "Rexon Dev",
      url: "https://rexon.dev",
      logo: { "@type": "ImageObject", url: "https://rexon.dev/og-image.png" },
    },
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        // escape "<" so post content can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className={styles.post}>
        <Link href="/blog" className={styles.back}>
          ← All posts
        </Link>
        <header className={styles.post__header}>
          <div className={styles.meta}>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1>{post.title}</h1>
          <p className={styles.lede}>{post.description}</p>
          {post.tags.length > 0 && (
            <ul className={styles.tags}>
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </header>

        <div className={styles.prose}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            disallowedElements={["img", "script", "iframe"]}
            unwrapDisallowed
            components={{
              // the page title is the only h1
              h1: ({ children }) => <h2>{children}</h2>,
              a: ({ href, children }) => {
                const external = !!href && /^https?:\/\//i.test(href) && !href.startsWith("https://rexon.dev");
                return (
                  <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}>
                    {children}
                  </a>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <aside className={styles.cta}>
          <h2>Want this working in your business?</h2>
          <p>Tell Alfred what you do and what is eating your time. He will loop in the team.</p>
          <AskAlfredButton
            message={`Hi Alfred, I just read "${post.title}" on your blog. How could this work for my business?`}
            label="Ask Alfred about this"
            variant="solid"
          />
        </aside>
      </article>

      <Footer />
    </main>
  );
}
