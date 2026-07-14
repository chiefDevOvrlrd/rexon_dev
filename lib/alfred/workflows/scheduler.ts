import { nextCampaign, completeCampaign, resumeCampaign, saveProgress, clearProgress} from "../discovery/campaign";
import { discoverLeads } from "./discoverLeads";

export async function runDiscovery() {
  const resumed = await resumeCampaign();

  let campaign;

  if (resumed) {
      campaign = resumed;

      console.log(
          `[DISCOVERY] Resuming ${campaign.campaign}`
      );
  } else {
      campaign = await nextCampaign();

      if (!campaign) {
          console.log("[DISCOVERY] No campaign.");
          return;
      }

      campaign = {
          campaign: campaign.name,
          platform: "maps",
          query: 0,
          ...campaign,
      };
  }

  if (campaign.platform === "maps") {
      for (
          let i = campaign.query;
          i < campaign.maps.length;
          i++
      ) {
          await saveProgress({
              campaign: campaign.campaign,
              platform: "maps",
              query: i,
              lead: 0,
          });

          await discoverLeads(
              campaign.maps[i],
              "maps"
          );
      }

      // 👇 ADD THIS RIGHT HERE
      await saveProgress({
          campaign: campaign.campaign,
          platform: "instagram",
          query: 0,
          lead: 0,
      });

      campaign.platform = "instagram";
      campaign.query = 0;
  }

  // Instagram loop starts AFTER that
  for (
      let i = campaign.query;
      i < campaign.instagram.length;
      i++
  ) {
    await saveProgress({
      campaign: campaign.campaign,
      platform: "instagram",
      query: i,
      lead: 0,
    });

    await discoverLeads(
      campaign.instagram[i],
      "instagram"
    );
  };

  await completeCampaign(campaign.campaign);
  await clearProgress();
}