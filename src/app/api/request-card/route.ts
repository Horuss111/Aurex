import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "karimdiab7800@gmail.com";

// In-memory rate limiting (5 submissions per IP per minute)
// Note: resets on cold starts in serverless environments
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { firstName, lastName, email, phone, cardType, employment, income, address, city, country, dob } = body;

  const refId = "AXR-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  // Save to Supabase
  const { error: dbError } = await supabaseAdmin.from("card_applications").insert({
    reference_id: refId,
    first_name: firstName,
    last_name: lastName,
    email,
    phone: phone ?? null,
    dob: dob ?? null,
    card_type: cardType,
    employment: employment ?? null,
    income: income ?? null,
    address: address ?? null,
    city: city ?? null,
    country: country ?? null,
    status: "reviewing",
  });
  if (dbError) console.error("Supabase insert error:", dbError.message);

  const cardLabels: Record<string, string> = {
    virtual: "Virtual Card",
    physical: "Physical Card",
    both: "Virtual + Physical Card",
  };
  const cardLabel = cardLabels[cardType] ?? cardType;

  // ── 1. Confirmation email to applicant ──────────────────────────────────
  const applicantHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#070707;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070707;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding-bottom:40px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:10px;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </td>
            <td style="font-size:18px;font-weight:500;letter-spacing:-0.02em;color:#ffffff;">Aurex</td>
          </tr></table>
        </td></tr>
        <tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);border-radius:16px;padding:40px;border:1px solid rgba(255,255,255,0.08);">
          <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.25em;color:#888888;">Application Received</p>
          <h1 style="margin:0 0 16px;font-size:28px;font-weight:500;letter-spacing:-0.04em;line-height:1.1;">
            We&apos;ve got your<br/>application, ${firstName}.
          </h1>
          <p style="margin:0 0 32px;font-size:15px;color:#aaaaaa;line-height:1.7;">
            Our AI-powered review is underway. You&apos;ll receive a decision shortly — usually within seconds.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border-radius:10px;border:1px solid rgba(255,255,255,0.08);margin-bottom:32px;">
            <tr><td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font-size:13px;color:#888888;">Applicant</td>
                <td align="right" style="font-size:13px;font-weight:500;">${firstName} ${lastName}</td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font-size:13px;color:#888888;">Email</td>
                <td align="right" style="font-size:13px;font-weight:500;">${email}</td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:16px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font-size:13px;color:#888888;">Card Type</td>
                <td align="right" style="font-size:13px;font-weight:500;">${cardLabel}</td>
              </tr></table>
            </td></tr>
          </table>
          <p style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:0.15em;color:#888888;">What happens next</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:0 0 12px;"><table cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:18px;padding-right:12px;vertical-align:top;">⚡</td>
              <td><p style="margin:0;font-size:13px;font-weight:600;">Instant decision</p>
              <p style="margin:4px 0 0;font-size:12px;color:#888888;">Our system reviews your application in seconds.</p></td>
            </tr></table></td></tr>
            <tr><td style="padding:0 0 12px;"><table cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:18px;padding-right:12px;vertical-align:top;">💳</td>
              <td><p style="margin:0;font-size:13px;font-weight:600;">Virtual card ready immediately</p>
              <p style="margin:4px 0 0;font-size:12px;color:#888888;">Use it online the moment you&apos;re approved.</p></td>
            </tr></table></td></tr>
            ${cardType !== "virtual" ? `<tr><td><table cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:18px;padding-right:12px;vertical-align:top;">📦</td>
              <td><p style="margin:0;font-size:13px;font-weight:600;">Physical card ships in 3–5 days</p>
              <p style="margin:4px 0 0;font-size:12px;color:#888888;">Your premium Aurex card is on its way.</p></td>
            </tr></table></td></tr>` : ""}
          </table>
        </td></tr>
        <tr><td style="padding-top:32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#555555;line-height:1.6;">
            © 2026 Aurex, Inc. · <a href="https://aurex.co/privacy" style="color:#555555;">Privacy Policy</a> · <a href="https://aurex.co/terms" style="color:#555555;">Terms of Service</a>
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#444444;">You received this email because you applied for an Aurex card.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // ── 2. Admin notification email ─────────────────────────────────────────
  const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#070707;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070707;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding-bottom:24px;">
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.25em;color:#888888;">New Application</p>
          <h1 style="margin:8px 0 0;font-size:24px;font-weight:500;letter-spacing:-0.03em;">
            ${firstName} ${lastName} just applied
          </h1>
        </td></tr>
        <tr><td style="background:#111111;border-radius:12px;padding:24px;border:1px solid rgba(255,255,255,0.08);">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["Name", `${firstName} ${lastName}`],
              ["Email", email],
              ["Phone", phone ?? "—"],
              ["Date of Birth", dob ?? "—"],
              ["Card Type", cardLabel],
              ["Employment", employment ?? "—"],
              ["Annual Income", income ?? "—"],
              ["Address", address ? `${address}, ${city}, ${country}` : "—"],
            ].map(([label, value]) => `
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font-size:12px;color:#888888;width:40%;">${label}</td>
                <td style="font-size:13px;font-weight:500;text-align:right;">${value}</td>
              </tr></table>
            </td></tr>`).join("")}
          </table>
        </td></tr>
        <tr><td style="padding-top:20px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#444444;">Aurex admin notification — do not reply to this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // Send admin notification (critical) and applicant confirmation (best-effort)
  const adminResult = await resend.emails.send({
    from: "Aurex <onboarding@resend.dev>",
    to: ADMIN_EMAIL,
    subject: `New card application — ${firstName} ${lastName} (${cardLabel})`,
    html: adminHtml,
  });

  if (adminResult.error) {
    console.error("Resend admin email error:", adminResult.error);
    return Response.json({ error: adminResult.error.message }, { status: 500 });
  }

  // Applicant confirmation is best-effort — don't fail the submission if it errors
  resend.emails.send({
    from: "Aurex <onboarding@resend.dev>",
    to: email,
    subject: "Your Aurex Card Application — Received",
    html: applicantHtml,
  }).catch((err) => console.error("Applicant confirmation email failed:", err));

  return Response.json({ success: true, referenceId: refId });
}
