interface Lead {
    business: string;
    website: string;
    phone: string;
    email: string;
}

export function deduplicate(leads: Lead[]) {
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