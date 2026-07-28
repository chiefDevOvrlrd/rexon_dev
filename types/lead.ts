export type LeadStatus =
    | "NEW"
    | "CONTACTED_US"
    | "CONTACTED"
    | "REPLIED"
    | "FOLLOW_UP"
    | "BOOKED"
    | "NOT_INTERESTED"
    | "NO_RWSPONSE";

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

export interface DiscoveredLead {
  business: string;
  website: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  phone: string;
  email: string;
  industry: string;
  source: LeadSource;
}

export interface Research extends DiscoveredLead {
    summary: string;
    category:
        | "Real Estate"
        | "Logistics"
        | "Healthcare"
        | "Dental"
        | "ISP"
        | "Hotel"
        | "Restaurant"
        | "Automotive"
        | "Law Firm"
        | "Beauty"
        | "Gym"
        | "Education"
        | "Travel Agency"
        | "Construction"
        | "E-commerce"
        | "Laundry"
        | "Retail"
        | "Finance"
        | "Insurance"
        | "Other";

    services: string[];
    painPoints: string[];
    qualification: "HOT" | "WARM" | "COLD";
    leadScore: number;
    scoreReason: string;
    personalization: string;
    crawlText?: string;
}
export interface Lead extends Research {
  ID: string;
  leadType: LeadType;
  status: LeadStatus;
  firstContacted?: string;
  lastContacted?: string;
  followUpCount: number;
  nextFollowUp?: string;
  lastFollowUp: string;
  
  lastInteraction?: string;
  lastReply?: string;
  subject?: string;
  outreachMessage?: string;
}