import { DiscoveredLead, Research } from "@/types/lead";
import { crawlWebsite } from "./website";
import { fastModel } from "../model";
import { LEAD_RESEARCH_PROMPT } from "../prompts";



export async function leadResearch(
    lead: DiscoveredLead
): Promise<Research> {

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

    const pages = await crawlWebsite(lead.website);

    const text = pages
        .map((page: any) => page.text)
        .join("\n\n")
        .slice(0, 15000); // prevent huge prompts



    const prompt = LEAD_RESEARCH_PROMPT
        .replace("{{BUSINESS}}", lead.business)
        .replace("{{WEBSITE}}", lead.website)
        .replace("{{CONTENT}}", text);

    // fastModel.invoke expects a string prompt (not an object with `input`)
    const response = await fastModel.invoke(prompt);
    const content = (response.content as string)
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const parsed = JSON.parse(content);

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