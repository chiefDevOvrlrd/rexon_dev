import { getLeadsByStatus, updateLead } from "../repositories/leadRepository";
import { generateOutreach } from "../service/outreach";

export async function generateOutreachForLeads() {
    const leads = await getLeadsByStatus("NEW");

    for (const lead of leads) {
        // Already generated
        if (lead.subject && lead.outreachMessage) continue;

        try {
            const outreach = await generateOutreach(lead);

            await updateLead(lead.ID, {
                subject: outreach.subject,
                outreachMessage: outreach.body,
            });

            console.log(
                `[OUTREACH] Generated for ${lead.business}`
            );
        } catch (err) {
            console.error(
                `[OUTREACH] Failed for ${lead.business}`,
                err
            );
        }
    }
}