import {randomUUID} from "crypto";
import {
    sheets,
    spreadsheetId,
    sheetName
} from "../service/sheet";
import { Lead, LeadType, LeadStatus } from "@/types/lead";




export async function createLead(lead: Omit<
    Lead, 
    | 'ID' 
    | 'status'
    | 'leadType'
    | "firstContacted"
    | "lastContacted"
    | "nextFollowUp"
    | "lastReply"
    | "subject"
    | "followUpCount"
    | "lastFollowUp"
    | "outreachMessage"
    >) {
    const row: Lead = {
        ID: randomUUID(),
        leadType: "OUTBOUND",
        status: "NEW",
        firstContacted: "",
        lastContacted: "",
        nextFollowUp: "",
        lastReply: "",
        subject: "",
        followUpCount: 0,
        lastFollowUp: "",
        outreachMessage: "",
        ...lead,
    };

    // save row

const valuesRow = [
    row.ID,
    row.business,
    row.industry,
    row.category,
    row.website,
    row.email,
    row.phone,
    row.source,
    row.services.join(", "),
    row.summary,
    row.painPoints.join(", "),
    row.qualification,
    row.leadScore,
    row.scoreReason,
    row.personalization,
    row.leadType,
    row.status,
    row.firstContacted,
    row.lastContacted,
    row.followUpCount,
    row.nextFollowUp,
    row.lastFollowUp,
    row.subject,
    row.outreachMessage,
    row.lastReply,
];

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:Y`,
        valueInputOption: "RAW",
        requestBody: {
            values: [valuesRow],
        },
    });
    console.log(`[SHEETS] Saved ${lead.business}`);
    return row;
}

export async function getLeads() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:Y`,
    });

    const rows = response.data.values ?? [];

    return rows.slice(1).map((row) => ({
        ID: row[0],
        business: row[1],
        industry: row[2],
        category: row[3],
        website: row[4],
        email: row[5],
        phone: row[6],
        source: row[7],

        services: row[8]
            ? row[8].split(", ").filter(Boolean)
            : [],

        summary: row[9],

        painPoints: row[10]
            ? row[10].split(", ").filter(Boolean)
            : [],

        qualification: row[11] as Lead["qualification"],

        leadScore: Number(row[12]),

        scoreReason: row[13],

        personalization: row[14],

        leadType: row[15] as LeadType,

        status: row[16] as LeadStatus,

        firstContacted: row[17],

        lastContacted: row[18],

        followUpCount: Number(row[19] ?? 0),

        nextFollowUp: row[20],

        lastFollowUp: row[21],

        subject: row[22],

        outreachMessage: row[23],

        lastReply: row[24],
    }));
}

const COLUMN_INDEX = {
    business: 1,
    industry: 2,
    category: 3,
    website: 4,
    email: 5,
    phone: 6,
    source: 7,
    services: 8,
    summary: 9,
    painPoints: 10,
    qualification: 11,
    leadScore: 12,
    scoreReason: 13,
    personalization: 14,
    leadType: 15,
    status: 16,
    firstContacted: 17,
    lastContacted: 18,
    followUpCount: 19,
    nextFollowUp: 20,
    lastFollowUp: 21,
    subject: 22,
    outreachMessage: 23,
    lastReply: 24,
} as const;

export async function updateLead(
    id: string,
    updates: Partial<Lead>
) {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:Y`,
    });

    const rows = response.data.values ?? [];

    // Find the row containing the lead ID
    const rowIndex = rows.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
        throw new Error("Lead not found");
    }

    const row = rows[rowIndex];

    const updatedRow = [...row];

    for (const [key, value] of Object.entries(updates)) {
        const index =
            COLUMN_INDEX[key as keyof typeof COLUMN_INDEX];

        if (index === undefined) continue;
        if (value === undefined) continue;

        updatedRow[index] = Array.isArray(value)
            ? value.join(", ")
            : String(value);
    }

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A${rowIndex + 1}:Y${rowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
        values: [updatedRow],
        },
    });

    return updatedRow;
}

export async function getLead(id: string) {
    const leads = await getLeads();

    return leads.find((lead) => lead.ID === id) ?? null;
}

export async function getLeadsByStatus(status: LeadStatus) {
    const leads = await getLeads();

    return leads.filter((lead) => lead.status === status);
}

// export async function getFollowUps() {
//   const leads = await getLeads();

//   const now = new Date();

//   return leads.filter((lead) => {
//     if (!lead.nextFollowUp) return false;

//     return new Date(lead.nextFollowUp) <= now;
//   });
// }