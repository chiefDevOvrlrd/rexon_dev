import { redis } from "../redis";
import { crawlWebsite } from "./website";

const TTL = 60 * 60; // 1 hour

export async function crawlLead(url: string) {
    const key = `crawl:${url}`;

    const cached = await redis.get<string>(key);

    if (cached) {
        console.log("[CACHE HIT]", url);
        return cached;
    }

    console.log("[CRAWL]", url);

    const pages = await crawlWebsite(url);

    const text = pages
        .map(page =>
            String(
                page.text ??
                page.content ??
                page.body ??
                page.html ??
                ""
            )
        )
        .join("\n");

    await redis.set(key, text, {
        ex: TTL,
    });

    return text;
}