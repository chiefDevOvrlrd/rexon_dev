import { NextRequest, NextResponse } from "next/server";
import { searchIg } from "@/lib/alfred/discovery/ig";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("query");

    if (!query) {
        return NextResponse.json(
        { error: "Missing query" },
        { status: 400 }
        );
    }

    return NextResponse.json(await searchIg(query))
}