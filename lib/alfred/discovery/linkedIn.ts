import { ApifyClient } from "apify-client";
import { DiscoveredLead } from "@/types/lead";

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN!,
});

export async function searchLinkedin(query: string): Promise<DiscoveredLead[]> {
  const run = await client.actor(
    "curious_coder/linkedin-company-profile-scraper"
  ).call({
    search: query,
    maxItems: 10,
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  return items.map((item: any) => ({
    ID: `lead-${Date.now()}-${item.id}`,
    business: item.companyName,
    website: item.website ?? "",
    phone: "",
    email: "",
    source: "LinkedIn",
    industry: item.industry ?? query,
    status: "NEW",
  }));
}