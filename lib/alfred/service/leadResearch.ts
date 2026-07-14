import { DiscoveredLead, Research } from "@/types/lead";
import { crawlWebsite } from "./website";
import { fastModel } from "../model";
import { searchIgEnrichment } from "../discovery/ig";
import { searchGoogleMapsBusiness } from "../discovery/maps";
import { enrichContactInfo } from "./contact";
import { LEAD_RESEARCH_PROMPT } from "../prompts";



export async function leadResearch(
    lead: DiscoveredLead
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
    await enrichContactInfo(lead);
    
    console.log(`[CRAWLER] Crawling ${lead.website}`);

    const pages = await crawlWebsite(lead.website);

    console.log(`[CRAWLER] ${pages.length} pages crawled`);

    const text = pages
        .map((page: any) => page.text)
        .join("\n\n")
        .slice(0, 15000); // prevent huge prompts



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
        .trim();

    let parsed;

    try {
        parsed = JSON.parse(content);
    } catch (err) {
        console.error("[AI] Invalid JSON");
        console.error(content);

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