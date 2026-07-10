import { NextResponse } from "next/server";
import { searchGoogleMaps} from "@/lib/alfred/discovery/maps";
import { leadResearch } from "@/lib/alfred/service/leadResearch";
import { buildOutreach } from "@/lib/alfred/workflows/outreach";
import { sendEmail } from "@/lib/alfred/tools/sendOutreachEmail";

export async function GET() {
    const [lead] = await searchGoogleMaps("Spa's porthacourt");
    if (!lead) {
        return NextResponse.json({
            success: false,
            message: "No leads found",
        });
    }

    // 2. Research it
    const research = await leadResearch(lead);

    // 3. Generate outreach
    const message = buildOutreach(research);

    // 4. Send to yourself
    await sendEmail({
        to: "anetojoseph@gmail.com",
        subject: `TEST • ${lead.business}`,
        html: message.replace(/\n/g, "<br>"),
    });

    return NextResponse.json({
        success: true,
        lead: lead.business,
    });

}