import { Research } from "@/types/lead";
import { outreachKnowledge } from "../knowledge";
import { sendEmail } from "../tools/sendOutreachEmail";
import { leadResearch } from "../service/leadResearch";
import { updateLead, getLeadsByStatus } from "../repositories/leadRepository";

export function buildOutreach(lead: Research
): string {
    // Prefer Research.category but fall back to Lead.industry or default
    const industryKey = ((lead as any).category ?? (lead as any).industry ?? 'Real Estate') as keyof typeof outreachKnowledge;
    const template = outreachKnowledge[industryKey] ?? outreachKnowledge['Real Estate'];
    const source = (lead as any).source ?? '';
    const personalization = (lead as any).personalization ?? '';

    return `
        Hi ${lead.business}, I'm Joe, founder of Rexon Dev — we build ${template.solution}, so your team can focus on ${template.benefit} instead of ${template.repetitiveTask}.

        I came across ${lead.business} on ${source} and noticed ${personalization}.

        Curious how you're currently handling that?
        `.trim();

}

export async function outreach() {

    const leads = await getLeadsByStatus("NEW");

    for (const lead of leads) {
        if (!lead.email) continue;

        const research = await leadResearch(lead)
        const outreachMessage = buildOutreach(research);
        await sendEmail({
            to: lead.email,
            subject: `Let's Talk About ${lead.business}`,
            html: outreachMessage,
        });
        await updateLead(lead.id, { 
            status: "contacted",
            firstContactedAt: new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
        });
    }

}

