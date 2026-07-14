import { searchGoogleMaps } from "./maps"; 
import { searchIgDiscovery } from "./ig";
import { deduplicate } from "./deduplication";

export async function discoverLeadsFromPlatforms(query: string) {
    const maps = await searchGoogleMaps(query);
    const ig = await searchIgDiscovery(query);

    console.log(
        `[DISCOVERY] Maps=${maps.length}, Instagram=${ig.length}`
    );

    console.log("[IG]", ig);

    return deduplicate([...maps, ...ig]);
}