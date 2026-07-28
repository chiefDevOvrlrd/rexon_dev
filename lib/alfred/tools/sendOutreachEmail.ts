import { resend } from "../service/resend";

type SendEmailParams = {
    to: string;
    subject: string;
    html: string;
    from?: string;
};

export async function sendEmail({
    to,
    subject,
    html,
    from = "Alfred <alfred@rexon.dev>",
}: SendEmailParams) {
    const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
    });

    if (error) {
        throw new Error(error.message);
    }

    console.log(`[EMAIL] Sent to ${to}. ID: ${data?.id}`)

    return data;
}