import { NextResponse } from "next/server";
import { generateOutreachForLeads } from "@/lib/alfred/workflows/generateOutreach";

export async function GET() {
     await generateOutreachForLeads();

    return NextResponse.json({
        success: true,
    });
}