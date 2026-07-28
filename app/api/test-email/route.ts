import { NextResponse } from "next/server";
import { getLead } from "@/lib/alfred/repositories/leadRepository";
import { sendEmail } from "@/lib/alfred/tools/sendOutreachEmail";

export async function GET() {
    // Pick any researched lead
    const lead = await getLead("c33b158b-82ef-4df6-9040-6c6b5af643f2");

    if (!lead) {
        return NextResponse.json(
            { error: "Lead not found" },
            { status: 404 }
        );
    }

    await sendEmail({
        // YOUR EMAIL HERE
        to: "joe@rexon.dev",

        subject: lead.subject || "Testing Alfred",

        html: lead.outreachMessage || "<p>No message found.</p>",
    });

    return NextResponse.json({
        success: true,
    });
}