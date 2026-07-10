import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/alfred/tools/sendOutreachEmail";

export async function GET() {
    const result = await sendEmail({
        to: "anetojoseph@gmail.com",
        subject: "Alfred Test",
        html: "<h1>It works 🚀</h1>",
    });

    return NextResponse.json(result);
}