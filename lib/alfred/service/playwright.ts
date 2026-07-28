import { apifyResearch } from "./apify";

export async function renderWebsite(url: string) {
    const run = await apifyResearch
        .actor("apify/playwright-scraper")
        .call({
            startUrls: [{ url }],
            maxCrawlPages: 1,
            maxRequestsPerCrawl: 1,
            pageFunction: `
async function pageFunction(context) {
    const { page, request } = context;

    await page.waitForLoadState("networkidle");

    return {
        url: request.url,
        html: await page.content(),
    };
}
            `,
        });

    const { items } = await apifyResearch
        .dataset(run.defaultDatasetId)
        .listItems();

    return items[0];
}