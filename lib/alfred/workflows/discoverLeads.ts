import { searchGoogleMaps } from "../discovery/maps"; 
import { searchIgDiscovery } from "../discovery/ig";
import { deduplicate } from "../discovery/deduplication";
import { createLead, getLeads } from "../repositories/leadRepository";
import { leadResearch } from "../service/leadResearch";
import { getProgress, saveProgress } from "../discovery/campaign";


export async function discoverLeads(
    query: string,
    platform: "maps" | "instagram" = "maps"
) {
    // Existing leads already in the CRM
    const existing = await getLeads();

    // Discover from Maps, Instagram for now 
    const discovered =
        platform === "maps"
            ? deduplicate(await searchGoogleMaps(query))
            : deduplicate(await searchIgDiscovery(query));

    const progress = await getProgress();
    
    const startLead = progress?.lead ?? 0;

    console.log(
        "[DISCOVERY]",
        discovered.map(l => ({
            business: l.business,
            source: l.source,
        }))
    );

    const existingBusinesses = new Set(
        existing.map((lead) => lead.business.trim().toLowerCase())
    );

    const existingWebsites = new Set(
        existing
            .map((lead) => lead.website.trim().toLowerCase())
            .filter(Boolean)
    );

    let imported = 0;
    for (
        let i = startLead;
        i < discovered.length;
        i++
    ) {
        const lead = discovered[i];
        const business = lead.business.trim().toLowerCase();
        const website = lead.website.trim().toLowerCase();
        const duplicate =
            existingBusinesses.has(business) ||
            (website && existingWebsites.has(website));

        if (duplicate) continue;

        await saveProgress({
            lead: i,
        });

        try {
            const researchedLead =
                await leadResearch(lead);
            await createLead(researchedLead);
        }
        catch(err){
            console.error(err);
            continue;
        }

        // Prevent duplicates within this run
        existingBusinesses.add(business);
        if (website) existingWebsites.add(website);

        imported++;
    }
    await saveProgress({
        lead: 0,
    });
    return {
        imported,
        skipped: discovered.length - imported,
        total: discovered.length,
    };
}