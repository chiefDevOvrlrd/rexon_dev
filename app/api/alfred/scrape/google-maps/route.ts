import { NextResponse } from "next/server";
import { searchGoogleMaps } from "@/lib/alfred/discovery/maps";

export async function GET() {
    const result = await searchGoogleMaps("internet and wifi provider abuja")

    return NextResponse.json(result)
}