import { runDiscovery } from "./scheduler";
import { generateOutreachForLeads } from "./generateOutreach";
import { sendOutreach } from "./leadOutreach";

export async function runAlfred() {
    console.log("[ALFRED] Starting...");

    await runDiscovery();

    await generateOutreachForLeads();

    await sendOutreach();

    console.log("[ALFRED] Finished.");
}