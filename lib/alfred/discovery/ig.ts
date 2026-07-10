import { apify } from "@/lib/alfred/service/apify";
import { DiscoveredLead } from "@/types/lead";
import { DISCOVERY_LIMITS } from "./config";
import { canUse, recordUsage } from "./budget";

export async function searchIgProfiles(query: string): Promise<string[]> {
  // if (!(await canUse("instagramSearchResults"))) {
  //   console.log("[LIMIT] Instagram search budget exhausted");
  //   return [];
  // }

    const run = await apify.actor("apify/instagram-scraper").call({
        search: query,
        searchType: "user",
        resultsLimit: DISCOVERY_LIMITS.instagramSearchResults,
    });

    await recordUsage("instagramSearchResults");

    const { items } = await apify
        .dataset(run.defaultDatasetId)
        .listItems();

        console.log("SEARCH RESULT:", items)

    return items
        .map((item: any) => item.username ?? item.ownerUsername)
        .filter(Boolean);
}

export async function getIgProfiles(usernames: string[]) {
  // if (!(await canUse("instagramProfiles"))) {
  //   console.log("[LIMIT] Instagram profile budget exhausted");
  //   return [];
  // }

    const run = await apify.actor("apify/instagram-profile-scraper").call({
        usernames: usernames.slice(0, DISCOVERY_LIMITS.instagramProfiles),
    });

    await recordUsage("instagramProfiles");

    const { items } = await apify
        .dataset(run.defaultDatasetId)
        .listItems();

        console.log("PROFILE RESULT:", items)

    return items;
}

export async function searchIg(
    query: string
): Promise<DiscoveredLead[]> {

    const usernames = await searchIgProfiles(query);

    if (!usernames.length) return [];

    const profiles = await getIgProfiles(usernames);

    return profiles.map((profile: any) => ({
        business: profile.fullName || profile.username,

        website: profile.externalUrl ?? "",

        instagram: profile.url,

        phone: profile.businessPhoneNumber ?? "",

        email: profile.businessEmail ?? "",

        industry:
            profile.businessCategoryName ??
            query,

        source: "Instagram",
    }));
}