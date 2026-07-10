import { ApifyClient } from "apify-client";
import { DiscoveredLead } from "@/types/lead";

const client = new ApifyClient({
    token: process.env.APIFY_TOKEN!,
});

export async function searchGoogleMaps(query: string, limit = 10) : Promise<DiscoveredLead[]> {
    const run = await client.actor("compass/crawler-google-places").call({
        searchStringsArray: [query],
        maxCrawledPlacesPerSearch: limit,
    });

    const { items } = await client
        .dataset(run.defaultDatasetId)
        .listItems();

    return items.map((item: any) => ({
        business: item.title,
        website: item.website ?? "",
        phone: item.phone ?? "",
        email: "",
        source: "Google Maps",
        industry: query,
        status: "NEW",
    }));
}