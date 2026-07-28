import { DiscoveredLead, Research } from "@/types/lead";
import { fastModel } from "../model";
import { searchIgEnrichment } from "../discovery/ig";
import { searchGoogleMapsBusiness } from "../discovery/maps";
import { enrichContactInfo } from "../service/contact";
import { LEAD_RESEARCH_PROMPT } from "../prompts";



export async function leadResearch(
    lead: DiscoveredLead,
    crawlText: string
): Promise<Research> {

    if (!lead.website) {
        const [ig] = await searchIgEnrichment(lead.business);

        if (ig) {
            lead.website = ig.website || lead.website;
            lead.phone = ig.phone || lead.phone;
            lead.email = ig.email || lead.email;
            lead.instagram = ig.instagram || lead.instagram;
            lead.industry = ig.industry || lead.industry;
            console.log(`[INSTAGRAM] Enriched ${lead.business}`);
        } else {
            console.log(`[INSTAGRAM] No match for ${lead.business}`);
        }
    }

    if (!lead.website || !lead.phone || !lead.email) {
        const mapsLead = await searchGoogleMapsBusiness(lead.business);
    
        if (mapsLead) {
            lead.website ||= mapsLead.website;
            lead.phone ||= mapsLead.phone;
            lead.email ||= mapsLead.email;
    
            console.log(`[MAPS] Enriched ${lead.business}`);
        } else {
            console.log(`[MAPS] No match for ${lead.business}`);
        }
    }
    
    if (!lead.website) return {
        ...lead,
        summary: "",
        industry: "",
        category: "Other",
        services: [],
        painPoints: [],
        personalization: "",
        leadScore: 0,
        scoreReason: "",
        qualification: "COLD"
    };
    if (lead.website && (!lead.email || !lead.phone)) {
        await enrichContactInfo(lead);
    }
    
    console.log(`[CRAWLER] Crawling ${lead.website}`);

    const text = crawlText;


    const prompt = LEAD_RESEARCH_PROMPT
        .replace("{{BUSINESS}}", lead.business)
        .replace("{{WEBSITE}}", lead.website)
        .replace("{{CONTENT}}", text);
    console.log(`[AI] Researching ${lead.business}`);
    // fastModel.invoke expects a string prompt (not an object with `input`)
    const response = await fastModel.invoke(prompt);
    const content = (response.content as string)
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/,\s*(?=[}\]])/g, "")
        .trim();

    let parsed;

    try {
        parsed = JSON.parse(content);
    } catch (err) {
        console.error("[AI] Invalid JSON for", lead.business );
        console.log(content);
        throw err;
    }

    console.log(
        `[AI] ${lead.business} (${parsed.qualification}, ${parsed.leadScore}/100, ${parsed.scoreReason})`
    );
    return {
        ...lead,
        category: parsed.category || "Other",
        summary: parsed.summary || "",
        industry: parsed.industry || "",
        services: parsed.services || [],
        painPoints: parsed.painPoints || [],
        qualification: (parsed.qualification as "HOT" | "WARM" | "COLD") || "COLD",
        personalization: parsed.personalization || "",
        leadScore: parsed.leadScore || 0,
        scoreReason: parsed.scoreReason || "",
    };
}