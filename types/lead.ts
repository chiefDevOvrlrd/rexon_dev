export interface DiscoveredLead {
  business: string;
  website: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  phone: string;
  email: string;
  industry: string;
  source: string;
}

export interface Research extends DiscoveredLead {
    summary: string;
    industry: string;      // e.g. "Real Estate Investment Company"
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
}
export interface Lead extends Research {
  ID: string;
  status: "NEW" | "CONTACTED" | "REPLIED" | "BOOKED";
}