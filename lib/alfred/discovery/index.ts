import { searchGoogleMaps } from "./maps";
import { searchLinkedin } from "./linkedIn";
import { searchIg } from "./ig";
import { searchTikTok } from "./tt";
import { deduplicate } from "./deduplication";

export async function discoverLeadsFromPlatforms(query: string) {
    const results = await Promise.all([
        searchGoogleMaps(query),
        searchLinkedin(query),
        searchIg(query),
        searchTikTok(query),
    ]);

    return deduplicate(results.flat());
}