import { getLeadsByStatus, updateLead } from "../repositories/leadRepository";
import { sendEmail } from "../tools/sendOutreachEmail";


export async function sendOutreach() {
    const leads = (await getLeadsByStatus("NEW"))
        .filter(lead => lead.leadScore >= 75);

    const format = (date: Date) =>
        date.toLocaleString("en-US", {
            timeZone: "Africa/Lagos",
    });


    for (const lead of leads) {
        if (!lead.email) continue;
        if (!lead.subject) continue;
        if (!lead.outreachMessage) continue;

        try {
            await sendEmail({
                to: lead.email,
                subject: lead.subject,
                html: lead.outreachMessage,
            });

            const now = new Date();
            const days =
                lead.qualification === "HOT"
                    ? 3
                    : lead.qualification === "WARM"
                    ? 7
                    : 14;

            
            const followUp = new Date(now);
            followUp.setDate(followUp.getDate() + days);
            await updateLead(lead.ID, {
                status: "CONTACTED",
                firstContacted: lead.firstContacted || format(now),
                lastContacted: format(now),
                followUpCount: lead.followUpCount + 1,
                nextFollowUp: format(followUp),
                lastFollowUp: format(now),
            });

            console.log(`[SENT] ${lead.business}`);
        } catch (err) {
            console.error(`[SEND] ${lead.business}`, err);
        }
    }
}