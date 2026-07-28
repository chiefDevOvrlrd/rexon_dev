import { apifyDiscovery } from "@/lib/alfred/service/apify";
import { DiscoveredLead } from "@/types/lead";
import { DISCOVERY_LIMITS } from "./config";
import { canUse, recordUsage } from "./budget";

function extractPhoneNumber(bio: string): string | null {
    if (!bio) return null;

    const match = bio.match(
        /(?:\+234|234|0)(?:70|71|80|81|90|91)\d{8}/
    );

    return match?.[0] ?? null;
}

export async function searchIgProfiles(query: string): Promise<string[]> {
    
    console.log(`[INSTAGRAM] Searching "${query}"`);
    if (!(await canUse("instagramSearchResults"))) {
        console.log("[LIMIT] Instagram search budget exhausted");
        return [];
    }

    const run = await apifyDiscovery.actor("apify/instagram-scraper").call({
        search: query,
        searchType: "user",
        resultsLimit: DISCOVERY_LIMITS.instagramSearchResults,
    });

    await recordUsage("instagramSearchResults");

    const { items } = await apifyDiscovery
        .dataset(run.defaultDatasetId)
        .listItems();

        console.log(`[INSTAGRAM] Found ${items.length} profile candidates`);

    return items
        .map((item: any) => item.username ?? item.ownerUsername)
        .filter(Boolean);
}
export async function searchIgHashtags(query: string): Promise<string[]> {
    
    console.log(`[INSTAGRAM] Searching "${query}"`);
    if (!(await canUse("instagramSearchResults"))) {
        console.log("[LIMIT] Instagram search budget exhausted");
        return [];
    }

    const run = await apifyDiscovery.actor("apify/instagram-search-scraper").call({
        search: query,
        searchType: "hashtag",
        searchLimit: 1,
        liveSearch: true,
    });

    const { items } = await apifyDiscovery
        .dataset(run.defaultDatasetId)
        .listItems();

    console.log("[HASHTAG]", items)

    if (!items.length){ 
        console.log("[INSTAGRAM] Hastag doesnt exist")
        return []
    }
    const hashtagUrl = items[0].url;
    const mediaCount = items[0].mediaCount

    console.log(`[INSTAGRAM] hashtag url is  ${hashtagUrl} and it have ${mediaCount} posts under it`)
    return await scrapeHashtagPosts(hashtagUrl as string)
}

export async function scrapeHashtagPosts(
    hashtagUrl: string
): Promise<string[]> {

    const run = await apifyDiscovery.actor("apify/instagram-scraper").call({
        directUrls: [hashtagUrl],
        resultsType: "posts",
        resultsLimit: DISCOVERY_LIMITS.instagramSearchResults,
        addParentData: false,
    });

    const { items } = await apifyDiscovery
        .dataset(run.defaultDatasetId)
        .listItems();

    console.log(`[INSTAGRAM] Found ${items.length} posts`);

    return [
        ...new Set(
            items
                .map((item: any) => item.ownerUsername)
                .filter(Boolean)
        ),
    ];
}

export async function getIgProfiles(usernames: string[]) {
    console.log(`[INSTAGRAM] Fetching ${usernames.length} profiles`);
  if (!(await canUse("instagramProfiles"))) {
    console.log("[LIMIT] Instagram profile budget exhausted");
    return [];
  }

    const run = await apifyDiscovery.actor("apify/instagram-profile-scraper").call({
        usernames: usernames.slice(0, DISCOVERY_LIMITS.instagramProfiles),
    });

    await recordUsage("instagramProfiles");

    const { items } = await apifyDiscovery
        .dataset(run.defaultDatasetId)
        .listItems();

        console.log(`[INSTAGRAM] Retrieved ${items.length} profiles`);

    return items;
}

export async function searchIgEnrichment(
    query: string
): Promise<DiscoveredLead[]> {

    const usernames = await searchIgProfiles(query);

    if (!usernames.length) {
        return [];
    }

    const profiles = await getIgProfiles(usernames);

    return profiles.map((profile: any) => ({
        business: profile.fullName || profile.username,

        website: profile.externalUrl ?? "",

        instagram: profile.url,

        phone:
            profile.businessPhoneNumber ??
            extractPhoneNumber(profile.biography ?? "") ??
            "",

        email: profile.businessEmail ?? "",

        industry:
            profile.businessCategoryName ??
            query,

        source: "Instagram",
    }));
}

export async function searchIgDiscovery(
    query: string
): Promise<DiscoveredLead[]> {

    const usernames = await searchIgHashtags(query);

    if (!usernames.length) {
        console.log(`[INSTAGRAM] No usernames found for "${query}"`);
        return [];
    }

    const profiles = await getIgProfiles(usernames);

    const businessProfiles = profiles.filter(
        (profile: any) =>
            profile.isBusinessAccount ||
            profile.businessCategoryName
    );

    console.log(
        `[INSTAGRAM] ${businessProfiles.length}/${profiles.length} business accounts`
    );

    return businessProfiles.map((profile: any) => ({
        business: profile.fullName || profile.username,

        website: profile.externalUrl ?? "",

        instagram: profile.url,

        phone:
            profile.businessPhoneNumber ??
            extractPhoneNumber(profile.biography ?? "") ??
            "",

        email: profile.businessEmail ?? "",

        industry:
            profile.businessCategoryName ??
            query,

        source: "Instagram",
    }));
}