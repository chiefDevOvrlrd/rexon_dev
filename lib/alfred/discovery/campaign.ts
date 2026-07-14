import { redis } from "../redis";
import { DISCOVERY_CAMPAIGNS } from "./discoverCampaigns";

interface Progress {
    campaign: string;
    platform: "maps" | "instagram";
    query: number;
    lead: number;
}

const COOLDOWN_DAYS = 30;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function saveProgress(data: Partial<Progress>) {
    const current = await getProgress();

    await redis.set(
        "campaign:progress",
        JSON.stringify({
            ...current,
            ...data,
        })
    );
}

export async function getProgress(): Promise<Progress| null> {
    return await redis.get("campaign:progress");
}

export async function clearProgress() {
    await redis.del("campaign:progress");
}

export async function resumeCampaign() {
    const progress = await getProgress();

    if (!progress) return null;

    return {
        ...progress,
        maps:
            DISCOVERY_CAMPAIGNS[
                progress.campaign as keyof typeof DISCOVERY_CAMPAIGNS
            ].maps,
        instagram:
            DISCOVERY_CAMPAIGNS[
                progress.campaign as keyof typeof DISCOVERY_CAMPAIGNS
            ].instagram,
    };
}

export async function nextCampaign() {
  const campaigns = Object.keys(DISCOVERY_CAMPAIGNS);
  const start = Number(await redis.get("campaign:index") ?? 0);

  for (let i = 0; i < campaigns.length; i++) {
    const index = (start + i) % campaigns.length;
    const campaign = campaigns[index];

    const nextRun = await redis.get(`campaign:${campaign}`);

    if (!nextRun || String(nextRun) <= today()) {
      await redis.set(
        "campaign:index",
        (index + 1) % campaigns.length
      );
      console.log(`[CAMPAIGN] ${campaign}`)
        return {
            name: campaign,
            maps: DISCOVERY_CAMPAIGNS[campaign as keyof typeof DISCOVERY_CAMPAIGNS].maps,
            instagram: DISCOVERY_CAMPAIGNS[campaign as keyof typeof DISCOVERY_CAMPAIGNS].instagram,
        };
    }
  }

  return null;
}

export async function completeCampaign(campaign: string) {
  await redis.set(
    `campaign:${campaign}`,
    addDays(new Date(), COOLDOWN_DAYS)
  );
}