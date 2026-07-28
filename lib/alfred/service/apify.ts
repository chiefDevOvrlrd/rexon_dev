import { ApifyClient } from "apify-client";

export const apifyDiscovery = new ApifyClient({
    token: process.env.APIFY_DISCOVERY_TOKEN!,
});

export const apifyResearch = new ApifyClient({
    token: process.env.APIFY_RESEARCH_TOKEN
})