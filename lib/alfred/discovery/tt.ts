import { ApifyClient } from "apify-client";
import { DiscoveredLead } from "@/types/lead";

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN!,
});

export async function searchTikTok(query: string): Promise<DiscoveredLead[]> {
  const run = await client.actor("clockworks/free-tiktok-scraper").call({
    search: query,
    maxItems: 10,
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  return items.map((item: any) => ({
    business: item.nickname || item.author,
    website: item.bioLink ?? "",
    phone: "",
    email: "",
    source: "TikTok",
    industry: query,
    status: "NEW",
  }));
}