import {randomUUID} from "crypto";
import {
    sheets,
    spreadsheetId,
    sheetName
} from "../service/sheet";
import { Research } from "@/types/lead";

export type LeadStatus =
    | "NEW"
    | "CONTACTED_US"
    | "CONTACTED"
    | "REPLIED"
    | "FOLLOW_UP"
    | "BOOKED"
    | "NOT_INTERESTED";

export type LeadType = 
    | "OUTBOUND"
    | "INBOUND";

export type LeadSource =
    | "Google Maps"
    | "Instagram"
    | "LinkedIn"
    | "TikTok"
    | "Referral"
    | "Website Chat"
    | "WhatsApp"
    | "Email"
    | "Referral"
    | "Manual";

export interface Lead {
    ID: string;

    business: string;
    website: string;
    email: string;
    phone: string;

    industry: string;
    category: string;

    source: LeadSource;
    leadType: LeadType;
    status: LeadStatus;

    research: Research;

    firstContactedAt?: string;
    lastContactedAt?: string;
    nextFollowUp?: string;

    lastInteraction?: string;
    lastReply?: string;

    outreachMessage?: string;
}

export async function createLead(lead: Omit<
    Lead, 
    | 'ID' 
    | 'status'
    | 'leadType'
    | "firstContactedAt"
    | "lastContactedAt"
    | "nextFollowUp"
    | "lastReply"
    | "lastInteraction"
    | "outreachMessage"
    >) {
    const row: Lead = {
        ID: randomUUID(),
        leadType: "OUTBOUND",
        status: "NEW",
        firstContactedAt: "",
        lastContactedAt: "",
        nextFollowUp: "",
        lastReply: "",
        lastInteraction: "",
        outreachMessage: "",
        ...lead,
    };

    // save row

    const valuesRow = [
        row.ID,
        row.business,
        row.industry,
        row.website,
        row.email,
        row.phone,
        row.source,
        row.status,
    ];

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:J`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [valuesRow],
        },
    });

    return row;
}

export async function getLeads() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:J`,
    });

    const rows = response.data.values ?? [];

    // Skip the header row
    return rows.slice(1).map((row) => ({
        id: row[0],
        business: row[1],
        industry: row[2],
        website: row[3],
        email: row[4],
        phone: row[5],
        source: row[6],
        status: row[7],
        firstContact: row[8],
        lastContact: row[9],
    }));
}

export async function updateLead(
    id: string,
    updates: Record<string, string>
) {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:J`,
    });

    const rows = response.data.values ?? [];

    // Find the row containing the lead ID
    const rowIndex = rows.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
        throw new Error("Lead not found");
    }

    const row = rows[rowIndex];

    const updatedRow = [
        row[0], // ID
        updates.business ?? row[1],
        updates.industry ?? row[2],
        updates.website ?? row[3],
        updates.email ?? row[4],
        updates.phone ?? row[5],
        updates.source ?? row[6],
        updates.status ?? row[7],
        updates.firstContact ?? row[8],
        updates.lastContact ?? row[9],
    ];

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A${rowIndex + 1}:J${rowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
        values: [updatedRow],
        },
    });

    return updatedRow;
}

export async function getLead(id: string) {
    const leads = await getLeads();

    return leads.find((lead) => lead.id === id) ?? null;
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