import { searchIgDiscovery } from "@/lib/alfred/discovery/ig";
import { NextResponse } from "next/server";

export async function GET() {
    const result = await searchIgDiscovery("plumbingtexas");

    return NextResponse.json(result)
}