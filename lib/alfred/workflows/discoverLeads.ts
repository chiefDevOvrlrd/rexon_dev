import { discoverLeadsFromPlatforms } from "../discovery";
import { createLead, getLeads } from "../repositories/leadRepository";
import { leadResearch } from "../service/leadResearch";
import { deduplicate } from "../discovery/deduplication";

export async function discoverLeads(query: string) {
    // Existing leads already in the CRM
    const existing = await getLeads();

    // Discover from Maps, LinkedIn, Instagram & TikTok
    const discovered = await discoverLeadsFromPlatforms(query);

    const existingBusinesses = new Set(
        existing.map((lead) => lead.business.trim().toLowerCase())
    );

    const existingWebsites = new Set(
        existing
            .map((lead) => lead.website.trim().toLowerCase())
            .filter(Boolean)
    );

    let imported = 0;

    for (const lead of discovered) {
        const business = lead.business.trim().toLowerCase();
        const website = lead.website.trim().toLowerCase();

        const duplicate =
            existingBusinesses.has(business) ||
            (website && existingWebsites.has(website));

        if (duplicate) continue;

        // Research & enrich the lead
        const researchedLead = await leadResearch(lead as any);

        // Save to Google Sheets
        await createLead({
            ...(lead as any),
            research: researchedLead,
        } as any);

        // Prevent duplicates within this run
        deduplicate(discovered);

        imported++;
    }

    return {
        imported,
        skipped: discovered.length - imported,
        total: discovered.length,
    };
}