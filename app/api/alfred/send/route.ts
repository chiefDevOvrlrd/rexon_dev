import { NextResponse } from "next/server";
import { sendOutreach } from "@/lib/alfred/workflows/leadOutreach";

export async function GET() {
    try {
        await sendOutreach();

        return NextResponse.json({
            success: true,
            message: "Outreach emails sent.",
        });
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to send outreach.",
            },
            { status: 500 }
        );
    }
}