import sgMail from "@sendgrid/mail";

export type AlfredLead = {
  name: string;
  email: string;
  project: string;
  company?: string;
  website?: string;
};

export type SendEmailType = "qualified_client" | "qualified_owner" | "borderline_owner";

type SendEmailArgs = {
  type: SendEmailType;
  lead: AlfredLead;
  bookingUrl?: string;
};

function buildSubject(type: SendEmailType, lead: AlfredLead) {
  const base = `Rexon Dev — Lead Verification (${lead.name})`;
  if (type === "qualified_owner") return base;
  if (type === "borderline_owner") return `[BORDERLINE] ${base}`;
  // qualified_client
  return `Next step for your Rexon Dev project, ${lead.name} ✅`;
}

function buildTextAndHtml(type: SendEmailType, lead: AlfredLead, bookingUrl?: string) {
  const details = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.company ? `Company: ${lead.company}` : null,
    lead.website ? `Website: ${lead.website}` : null,
    `Project: ${lead.project}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (type === "qualified_client") {
    const safeBookingUrl = bookingUrl ?? "";
    const text = `Hi ${lead.name},

Great news — your lead is verified and the next step is ready.

Booking link:
${safeBookingUrl}

Project details:
${details}

If you need to change anything, reply to this email.

— Alfred (Rexon Dev)`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <p>Hi <strong>${lead.name}</strong>,</p>
        <p>Great news — your lead is verified and the next step is ready.</p>
        <p><strong>Booking link:</strong> <a href="${safeBookingUrl}">${safeBookingUrl}</a></p>
        <h4 style="margin-top: 18px;">Project details</h4>
        <pre style="background:#f6f6f6; padding:12px; border-radius:8px; white-space:pre-wrap;">${details}</pre>
        <p>If you need to change anything, reply to this email.</p>
        <p>— Alfred (Rexon Dev)</p>
      </div>
    `;

    return { text, html };
  }

  if (type === "borderline_owner") {
    const text = `[BORDERLINE] Alfred found a lead that needs clarification.

Lead details:
${details}

Booking link: (not provided)`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <p><strong>[BORDERLINE]</strong> Alfred found a lead that needs clarification.</p>
        <h4>Lead details</h4>
        <pre style="background:#f6f6f6; padding:12px; border-radius:8px; white-space:pre-wrap;">${details}</pre>
        <p>Booking link: (not provided)</p>
      </div>
    `;
    return { text, html };
  }

  // qualified_owner
  const text = `Alfred verified a lead — ready to book.

Lead details:
${details}

Client booking link:
${bookingUrl ?? "(not provided)"}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <p>Alfred verified a lead — ready to book.</p>
      <h4>Lead details</h4>
      <pre style="background:#f6f6f6; padding:12px; border-radius:8px; white-space:pre-wrap;">${details}</pre>
      <p><strong>Client booking link:</strong> ${bookingUrl ? `<a href="${bookingUrl}">${bookingUrl}</a>` : "(not provided)"}</p>
    </div>
  `;

  return { text, html };
}

export async function sendAlfredEmail({ type, lead, bookingUrl }: SendEmailArgs): Promise<void> {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
  const OWNER_EMAIL = process.env.OWNER_EMAIL;
  const OWNER_NAME = process.env.OWNER_NAME;

  if (!SENDGRID_API_KEY) throw new Error("Missing env var: SENDGRID_API_KEY");
  if (!SENDGRID_FROM_EMAIL) throw new Error("Missing env var: SENDGRID_FROM_EMAIL");
  if (!OWNER_EMAIL) throw new Error("Missing env var: OWNER_EMAIL");
  if (!OWNER_NAME) throw new Error("Missing env var: OWNER_NAME");

  sgMail.setApiKey(SENDGRID_API_KEY);

  const subject = buildSubject(type, lead);
  const { text, html } = buildTextAndHtml(type, lead, bookingUrl);

  let to: string;
  if (type === "qualified_client") {
    to = lead.email;
  } else {
    to = OWNER_EMAIL;
  }

  const from = {
    email: SENDGRID_FROM_EMAIL,
    name: OWNER_NAME,
  };

  const msg = {
    to,
    from,
    subject,
    text,
    html,
    headers: {
      "X-Alfred-Sent": "true",
    },
  };

  await sgMail.send(msg);
}
