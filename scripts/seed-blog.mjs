// Publishes the sample posts so you can see how the blog looks.
//
//   BLOG_API_KEY=your-key node scripts/seed-blog.mjs
//   BLOG_API_URL=http://localhost:3000/api/blog BLOG_API_KEY=your-key node scripts/seed-blog.mjs
//
// Remove them again from WhatsApp:  #blogs   then   #blog unpublish <slug>
import { readFile } from 'node:fs/promises';

const api = process.env.BLOG_API_URL || 'https://rexon.dev/api/blog';
const key = process.env.BLOG_API_KEY;
if (!key) {
  console.error('Set BLOG_API_KEY first (same value as on the website and the agent).');
  process.exit(1);
}

const posts = JSON.parse(await readFile(new URL('./sample-posts.json', import.meta.url), 'utf8'));
const origin = new URL(api).origin;

for (const post of posts) {
  const res = await fetch(api, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  const json = await res.json().catch(() => ({}));
  console.log(res.ok ? `OK   ${origin}/blog/${post.slug}` : `FAIL ${post.slug}: ${res.status} ${json.message ?? ''}`);
}
