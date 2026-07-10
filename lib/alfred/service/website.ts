import { apify } from "./apify";

export async function crawlWebsite(url: string) {
    const run = await apify.actor(
        "apify/website-content-crawler"
    ).call({
        startUrls: [{ url }],
        maxCrawlPages: 3,
    });

    const { items } = await apify
        .dataset(run.defaultDatasetId)
        .listItems();

    return items;
}