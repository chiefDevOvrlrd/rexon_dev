// Blog storage on Upstash Redis (already used by the site for rate limiting).
// One hash holds every post, keyed by slug. Posts are published from the Rexon
// WhatsApp agent through /api/blog, so there is no deploy step per post.

import { unstable_cache } from "next/cache";
import { Redis } from "@upstash/redis";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  content: string; // markdown
  tags: string[];
  publishedAt: string; // ISO
  updatedAt: string; // ISO
  readingMinutes: number;
};

export type BlogInput = {
  title: string;
  description: string;
  content: string;
  slug?: string;
  tags?: string[];
};

const HASH = "rexon:blog:posts";

function client(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function parse(value: unknown): BlogPost | null {
  try {
    const post = (typeof value === "string" ? JSON.parse(value) : value) as BlogPost;
    if (post && typeof post.slug === "string" && typeof post.title === "string" && typeof post.content === "string") {
      return post;
    }
  } catch {
    /* ignore a corrupt entry rather than breaking the whole blog */
  }
  return null;
}

async function readAll(): Promise<BlogPost[]> {
  const redis = client();
  if (!redis) return [];
  const all = await redis.hgetall<Record<string, unknown>>(HASH);
  if (!all) return [];
  return Object.values(all)
    .map(parse)
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

async function readPost(slug: string): Promise<BlogPost | null> {
  const redis = client();
  if (!redis) return null;
  return parse(await redis.hget(HASH, slug));
}

// Reads are cached (and cleared with revalidateTag("blog") on every publish/unpublish)
// so blog pages stay fast and static. A failed read throws, so errors are never cached.
const cachedAll = unstable_cache(readAll, ["blog:all"], { revalidate: 300, tags: ["blog"] });
const cachedPost = unstable_cache(readPost, ["blog:post"], { revalidate: 300, tags: ["blog"] });

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    return await cachedAll();
  } catch (error) {
    console.error("Blog: could not load posts", error);
    return [];
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    return await cachedPost(slug);
  } catch (error) {
    console.error("Blog: could not load post", error);
    return null;
  }
}

/** Uncached list, for the owner's #blogs command. */
export async function listFresh(): Promise<BlogPost[]> {
  return readAll();
}

export class BlogStoreUnavailable extends Error {}

/** Creates a post, or updates it when the slug already exists (keeps the original publish date). */
export async function savePost(input: BlogInput): Promise<{ post: BlogPost; created: boolean }> {
  const redis = client();
  if (!redis) throw new BlogStoreUnavailable("Upstash Redis is not configured");

  const slug = slugify(input.slug || input.title);
  if (!slug) throw new Error("Could not make a slug from that title");

  const existing = await readPost(slug); // fresh read, never the cache
  const now = new Date().toISOString();
  const post: BlogPost = {
    slug,
    title: input.title.trim(),
    description: input.description.trim(),
    content: input.content.trim(),
    tags: (input.tags ?? []).map((t) => t.trim()).filter(Boolean).slice(0, 6),
    publishedAt: existing?.publishedAt ?? now,
    updatedAt: now,
    readingMinutes: readingMinutes(input.content),
  };

  await redis.hset(HASH, { [slug]: JSON.stringify(post) });
  return { post, created: !existing };
}

export async function deletePost(slug: string): Promise<boolean> {
  const redis = client();
  if (!redis) throw new BlogStoreUnavailable("Upstash Redis is not configured");
  return (await redis.hdel(HASH, slug)) > 0;
}
