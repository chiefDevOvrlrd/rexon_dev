import { apifyDiscovery } from "../service/apify";
import { DiscoveredLead } from "@/types/lead";
import { DISCOVERY_LIMITS } from "./config";

const client = apifyDiscovery

export async function searchGoogleMaps(query: string, limit = DISCOVERY_LIMITS.maps) : Promise<DiscoveredLead[]> {
    const run = await client.actor("compass/crawler-google-places").call({
        searchStringsArray: [query],
        maxCrawledPlacesPerSearch: limit,
    });
    console.log(`[MAPS] Searching "${query}"`);

    const { items } = await client
        .dataset(run.defaultDatasetId)
        .listItems();
        
    console.log(`[MAPS] Found ${items.length} businesses`);


    const leads = items.map((item: any) => ({
        business: item.title,
        website: item.website ?? "",
        phone: item.phone ?? "",
        email: "",
        source: "Google Maps" as const,
        industry: query,
        status: "NEW",
    }));

    console.log(`[MAPS] Returning ${leads.length} leads`)

    return leads
}

export async function searchGoogleMapsBusiness(
    business: string
): Promise<DiscoveredLead | null> {
    const results = await searchGoogleMaps(business);

    if (!results.length) return null;

    return results[0];
}