import { timingSafeEqual } from "crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { BlogStoreUnavailable, deletePost, listFresh, savePost, slugify } from "@/lib/blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMITS = { title: 120, description: 200, content: 60_000, minContent: 400 };

function authorised(request: Request): "ok" | "unconfigured" | "denied" {
  const secret = process.env.BLOG_API_KEY;
  if (!secret) return "unconfigured";

  const header = request.headers.get("authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b) ? "ok" : "denied";
}

function guard(request: Request): NextResponse | null {
  const result = authorised(request);
  if (result === "unconfigured") {
    return NextResponse.json({ success: false, message: "Blog publishing is not configured." }, { status: 503 });
  }
  if (result === "denied") {
    return NextResponse.json({ success: false, message: "Unauthorised." }, { status: 401 });
  }
  return null;
}

function refresh(slug?: string) {
  revalidateTag("blog");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

function storeError(error: unknown) {
  if (error instanceof BlogStoreUnavailable) {
    return NextResponse.json({ success: false, message: "Blog storage is not configured." }, { status: 503 });
  }
  console.error("Blog API error", error);
  return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
}

// List posts (used by the agent's #blogs command)
export async function GET(request: Request) {
  const denied = guard(request);
  if (denied) return denied;

  const posts = await listFresh();
  return NextResponse.json({
    success: true,
    posts: posts.map(({ slug, title, publishedAt, updatedAt }) => ({ slug, title, publishedAt, updatedAt })),
  });
}

// Publish a new post or update an existing one (same slug)
export async function POST(request: Request) {
  const denied = guard(request);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug : undefined;
  const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === "string") : [];

  if (!title || title.length > LIMITS.title) {
    return NextResponse.json({ success: false, message: `Title is required (max ${LIMITS.title} characters).` }, { status: 400 });
  }
  if (!description || description.length > LIMITS.description) {
    return NextResponse.json({ success: false, message: `Description is required (max ${LIMITS.description} characters).` }, { status: 400 });
  }
  if (content.length < LIMITS.minContent || content.length > LIMITS.content) {
    return NextResponse.json({ success: false, message: "Content is missing or the wrong length." }, { status: 400 });
  }

  try {
    const { post, created } = await savePost({ title, description, content, slug, tags });
    refresh(post.slug);
    return NextResponse.json({ success: true, created, slug: post.slug, url: `/blog/${post.slug}` }, { status: created ? 201 : 200 });
  } catch (error) {
    return storeError(error);
  }
}

// Unpublish: DELETE /api/blog?slug=my-post
export async function DELETE(request: Request) {
  const denied = guard(request);
  if (denied) return denied;

  const slug = slugify(new URL(request.url).searchParams.get("slug") ?? "");
  if (!slug) {
    return NextResponse.json({ success: false, message: "Slug is required." }, { status: 400 });
  }

  try {
    const removed = await deletePost(slug);
    if (!removed) return NextResponse.json({ success: false, message: "No post with that slug." }, { status: 404 });
    refresh(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return storeError(error);
  }
}
