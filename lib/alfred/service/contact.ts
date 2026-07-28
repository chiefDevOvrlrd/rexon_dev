import * as cheerio from "cheerio";
import { DiscoveredLead } from "@/types/lead";
import { renderWebsite } from "./playwright";

const EMAIL_REGEX =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

const PHONE_REGEX =
    /(?:\+?[0-9]{1,3})?[\s()-]*[0-9][0-9\s()-]{7,}/g;

function normalize(url: string) {
    let website = url.trim();

    if (!/^https?:\/\//i.test(website)) {
        website = `https://${website}`;
    }

    return website.replace(/\/$/, "");
}

export async function enrichContactInfo(
    lead: DiscoveredLead
) {
    if (!lead.website) return;

    const base = normalize(lead.website);

    const pages = [
        base,
        `${base}/contact`,
        `${base}/contact-us`,
        `${base}/about`,
        `${base}/about-us`,
    ];

    for (const pageUrl of pages) {
        try {
            console.log(`[CONTACT] ${pageUrl}`);
            const rendered = await renderWebsite(pageUrl);
            if (!rendered) continue;

            const html = String(
                rendered.html ??
                rendered.text ??
                ""
            );
            
            const $ = cheerio.load(html);

            let email =
                $('a[href^="mailto:"]')
                    .first()
                    .attr("href")
                    ?.replace("mailto:", "") ?? "";

            const text = $("body").text();

            if (!email) {
                email =
                    text.match(EMAIL_REGEX)?.[0] ?? "";
            }

            const phone =
                text.match(PHONE_REGEX)?.[0] ?? "";

            if (email && !lead.email) {
                lead.email = email;
            }

            if (phone && !lead.phone) {
                lead.phone = phone.replace(
                    /[^\d+]/g,
                    ""
                );
            }

            if (lead.email || lead.phone) {
                console.log(
                    `[CONTACT] Found ${lead.business}`,
                    {
                        email: lead.email,
                        phone: lead.phone,
                    }
                );

                return;
            }
        } catch {
            continue;
        }
    }

    console.log(
        `[CONTACT] Nothing found for ${lead.business}`
    );
}