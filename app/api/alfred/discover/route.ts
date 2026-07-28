import { NextResponse } from "next/server";
import { runDiscovery } from "@/lib/alfred/workflows/scheduler";

export async function GET() {
    try {
        const result = await runDiscovery();
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Discovery failed" },
            { status: 500 }
        );
    }
}