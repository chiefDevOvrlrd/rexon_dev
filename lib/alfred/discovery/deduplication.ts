import { DiscoveredLead } from "@/types/lead"; 
export function deduplicate(leads: DiscoveredLead[]) {
    const seen = new Set<string>();

    return leads.filter((lead) => {
        const key =
        lead.website ||
        lead.email ||
        lead.phone ||
        lead.business.toLowerCase();

        if (seen.has(key)) return false;

        seen.add(key);

        return true;
    });
}

