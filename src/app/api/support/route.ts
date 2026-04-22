import { auth } from "@clerk/nextjs/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "You must be signed in to submit a support request." }, { status: 401 });
  }

  const { subject, message, referenceId, email } = await request.json();

  if (!subject?.trim() || !message?.trim()) {
    return Response.json({ error: "Subject and message are required." }, { status: 400 });
  }

  if (message.trim().length < 10) {
    return Response.json({ error: "Please provide more detail in your message." }, { status: 400 });
  }

  const ticketId = "TKT-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#070707;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070707;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding-bottom:24px;">
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.25em;color:#888888;">Support Ticket · ${ticketId}</p>
          <h1 style="margin:8px 0 0;font-size:24px;font-weight:500;letter-spacing:-0.03em;">
            New support request
          </h1>
        </td></tr>
        <tr><td style="background:#111111;border-radius:12px;padding:24px;border:1px solid rgba(255,255,255,0.08);">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["Ticket ID", ticketId],
              ["User ID", userId],
              ["Email", email || "—"],
              ["Reference ID", referenceId || "—"],
              ["Subject", subject],
            ].map(([label, value]) => `
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font-size:12px;color:#888888;width:35%;">${label}</td>
                <td style="font-size:13px;font-weight:500;text-align:right;">${value}</td>
              </tr></table>
            </td></tr>`).join("")}
            <tr><td style="padding:16px 0 4px;">
              <p style="margin:0 0 8px;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
              <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding-top:20px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#444444;">Aurex support ticket — reply to ${email || "user"}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const userConfirmHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#070707;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070707;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding-bottom:32px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </td>
            <td style="font-size:17px;font-weight:500;letter-spacing:-0.02em;">Aurex</td>
          </tr></table>
        </td></tr>
        <tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:14px;padding:36px;border:1px solid rgba(255,255,255,0.08);">
          <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.25em;color:#888888;">Support Ticket Received</p>
          <h1 style="margin:0 0 16px;font-size:26px;font-weight:500;letter-spacing:-0.04em;line-height:1.1;">
            We&apos;ve got your request.
          </h1>
          <p style="margin:0 0 28px;font-size:14px;color:#aaaaaa;line-height:1.7;">
            Your support ticket has been received and our team has been notified. We typically respond within a few hours.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border-radius:10px;border:1px solid rgba(255,255,255,0.08);">
            <tr><td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font-size:12px;color:#888888;">Ticket ID</td>
                <td align="right" style="font-size:13px;font-weight:600;letter-spacing:0.05em;">${ticketId}</td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:14px 18px;">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font-size:12px;color:#888888;">Subject</td>
                <td align="right" style="font-size:13px;font-weight:500;">${subject}</td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#555555;">© 2026 Aurex, Inc. — support@aurex.co</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const adminResult = await resend.emails.send({
    from: "Aurex Support <onboarding@resend.dev>",
    to: ADMIN_EMAIL,
    replyTo: email || undefined,
    subject: `[${ticketId}] Support: ${subject}`,
    html: adminHtml,
  });

  if (adminResult.error) {
    console.error("Support ticket email error:", adminResult.error);
    return Response.json({ error: "Failed to submit ticket. Please try again." }, { status: 500 });
  }

  // Best-effort confirmation to the user
  if (email) {
    resend.emails.send({
      from: "Aurex Support <onboarding@resend.dev>",
      to: email,
      subject: `Your support ticket — ${ticketId}`,
      html: userConfirmHtml,
    }).catch((err) => console.error("Support confirmation email failed:", err));
  }

  return Response.json({ success: true, ticketId });
}
