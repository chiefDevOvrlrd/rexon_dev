export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY!,
        },
        body: JSON.stringify({
            sender: {
                name: "Joseph Aneto",
                email: process.env.BREVO_SENDER!,
            },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        }),
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json();
}