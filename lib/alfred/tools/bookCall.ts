type CalLead = {
  name: string;
  email: string;
  project: string;
  company?: string;
  website?: string;
};

export async function bookCall({
  calApiKey,
  eventTypeId,
  lead,
  ownerEmail,
  ownerName,
}: {
  calApiKey: string;
  eventTypeId: string;
  lead: CalLead;
  ownerEmail: string;
  ownerName: string;
}): Promise<string> {
  if (!calApiKey) throw new Error("Missing CAL_API_KEY");
  if (!eventTypeId) throw new Error("Missing CAL_EVENT_TYPE_ID");

  const payload = {
    eventTypeId,
    name: lead.name,
    email: lead.email,
    questions: [
      { question: "Project", answer: lead.project },
      ...(lead.company ? [{ question: "Company", answer: lead.company }] : []),
      ...(lead.website ? [{ question: "Website", answer: lead.website }] : []),
    ],
    owner: {
      email: ownerEmail,
      name: ownerName,
    },
  };

  const res = await fetch("https://api.cal.com/v1/bookings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${calApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Cal.com booking failed: ${res.status} ${res.statusText} ${body}`
    );
  }

  const data = (await res.json()) as {
    url?: string;
    bookingUrl?: string;
    confirmationUrl?: string;
  };

  const confirmationUrl = data.url || data.bookingUrl || data.confirmationUrl;
  if (!confirmationUrl) {
    throw new Error(
      "Cal.com booking succeeded but no confirmation URL was returned"
    );
  }

  return confirmationUrl;
}
