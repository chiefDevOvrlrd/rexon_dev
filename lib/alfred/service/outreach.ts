import { Lead } from "@/types/lead";
import { fastModel } from "../model"
import { buildOutreachPrompt } from "../prompts";

export async function generateOutreach(
    lead: Lead
) {
    const prompt = buildOutreachPrompt(lead);

    const response = await fastModel.invoke(prompt);

    const content = String(response.content)
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]")
        .trim();

    return JSON.parse(content) as {
        subject: string;
        body: string;
    };
}