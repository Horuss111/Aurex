import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return Response.json({ error: "Name, email, and message are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email address." }, { status: 400 });
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#070707;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070707;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding-bottom:24px;">
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.25em;color:#888888;">Contact Form</p>
          <h1 style="margin:8px 0 0;font-size:22px;font-weight:500;letter-spacing:-0.03em;">
            New message from ${name}
          </h1>
        </td></tr>
        <tr><td style="background:#111111;border-radius:12px;padding:24px;border:1px solid rgba(255,255,255,0.08);">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["From", name],
              ["Email", email],
              ["Subject", subject || "—"],
            ].map(([label, value]) => `
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font-size:12px;color:#888888;width:30%;">${label}</td>
                <td style="font-size:13px;font-weight:500;">${value}</td>
              </tr></table>
            </td></tr>`).join("")}
            <tr><td style="padding:16px 0 4px;">
              <p style="margin:0 0 8px;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
              <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding-top:20px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#444444;">Aurex contact form — reply directly to ${email}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const result = await resend.emails.send({
    from: "Aurex Contact <onboarding@resend.dev>",
    to: ADMIN_EMAIL,
    replyTo: email,
    subject: `Contact: ${subject || "New message"} — ${name}`,
    html,
  });

  if (result.error) {
    console.error("Contact email error:", result.error);
    return Response.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }

  return Response.json({ success: true });
}
