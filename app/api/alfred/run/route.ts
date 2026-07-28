import { NextResponse } from "next/server";
import { runAlfred } from "@/lib/alfred/workflows/run";

export async function GET() {
    try {
        await runAlfred();

        return NextResponse.json({
            success: true,
            message: "Alfred completed successfully.",
        });
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            {
                success: false,
                error:
                    err instanceof Error
                        ? err.message
                        : "Unknown error",
            },
            { status: 500 }
        );
    }
}