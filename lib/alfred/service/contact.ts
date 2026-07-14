import { DiscoveredLead } from "@/types/lead";

export async function enrichContactInfo(lead: DiscoveredLead) {
    if (!lead.website) return;

    try {
        const html = await fetch(lead.website, {
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
        }).then(r => r.text());

        const email = html.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
        )?.[0];

        const phone = html.match(
            /(?:\+?234|0)[\d\s()-]{9,15}/
        )?.[0];

        lead.email ||= email ?? "";
        lead.phone ||= phone?.replace(/[^\d+]/g, "") ?? "";
    } catch (err) {
        console.error("[CONTACT]", err);
    }
}