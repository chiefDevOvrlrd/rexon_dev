import { apifyResearch } from "./apify";

export async function crawlWebsite(url: string) {
    const run = await apifyResearch.actor(
        "apify/website-content-crawler"
    ).call({
        startUrls: [{ url }],
        maxCrawlPages: 3,
    });

    const { items } = await apifyResearch
        .dataset(run.defaultDatasetId)
        .listItems();

    return items;
}