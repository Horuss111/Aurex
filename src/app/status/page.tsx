"use client";

import { useEffect, useState } from "react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { GlassNavbar } from "@/components/ui/glass-navbar";
import { NavClient } from "@/components/ui/nav-client";

interface ApplicationData {
  referenceId: string;
  submittedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  cardType: "virtual" | "physical" | "both";
}

const cardTypeLabels: Record<string, string> = {
  virtual: "Virtual Card",
  physical: "Physical Card",
  both: "Virtual + Physical Card",
};

const timelineSteps = [
  { key: "submitted", label: "Submitted", meta: (date: string) => `Received ${date}` },
  { key: "reviewing", label: "Under Review", meta: () => "In progress — usually under 60 seconds" },
  { key: "approved", label: "Approved", meta: () => "" },
  { key: "shipped", label: "Card Shipped", meta: () => "" },
];

export default function StatusPage() {
  const [app, setApp] = useState<ApplicationData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("aurex_application");
    if (raw) {
      try { setApp(JSON.parse(raw)); } catch { /* ignore */ }
    }
    setLoaded(true);
  }, []);

  const submittedDate = app
    ? new Date(app.submittedAt).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : "";

  return (
    <>
      <DottedSurface className="size-full fixed inset-0 -z-20 bg-[var(--bg)]" />
      <div className="status-nav-wrap">
        <GlassNavbar><NavClient /></GlassNavbar>
      </div>

      {/* Loading — invisible placeholder so background stays mounted */}
      {!loaded && <div style={{ minHeight: "100dvh" }} />}

      {loaded && !app && (
        <div className="status-empty">
          <div className="status-empty-icon">💳</div>
          <h1 className="status-empty-title">No application found</h1>
          <p className="status-empty-desc">It looks like you haven&apos;t applied for an Aurex card yet.</p>
          <a href="/request-card" className="btn-primary-solid">Apply Now →</a>
        </div>
      )}

      {loaded && app && <div className="status-page">

        {/* ── Left — card mockup ────────────────────────────── */}
        <div className="status-left">
          <div className="status-left-inner">
            <p className="status-eyebrow">
              <span className="eyebrow-line" />
              Application Submitted
              <span className="eyebrow-line" />
            </p>

            <div className="rc-card-stage">
              <div className="rc-card-glow" />
              <div className="rc-card-mockup">
                <div className="rc-card-shine" />
                <div className="rc-card-logo-wrap">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
                  </svg>
                  <span>Aurex</span>
                </div>
                <div className="rc-card-chip">
                  <div className="rc-chip-inner"><span /><span /><span /></div>
                </div>
                <div className="rc-card-number">•••• •••• •••• 1234</div>
                <div className="rc-card-footer">
                  <div>
                    <div className="rc-card-meta-label">Card Holder</div>
                    <div className="rc-card-meta-value" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {app.firstName} {app.lastName}
                    </div>
                  </div>
                  <div>
                    <div className="rc-card-meta-label">Expires</div>
                    <div className="rc-card-meta-value">04/29</div>
                  </div>
                  <div className="rc-card-brand">
                    <svg viewBox="0 0 38 24" width="38" height="24">
                      <circle cx="15" cy="12" r="10" fill="rgba(255,255,255,0.45)" />
                      <circle cx="23" cy="12" r="10" fill="rgba(255,255,255,0.2)" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="status-badge-wrap">
              <div className="status-badge-dot" />
              <span className="status-badge-label">Under Review</span>
            </div>

            <p className="status-card-type-label">{cardTypeLabels[app.cardType]} requested</p>
          </div>
        </div>

        {/* ── Right — status details ────────────────────────── */}
        <div className="status-right">

          <div className="status-ref-row">
            <span className="status-ref-label">Reference</span>
            <span className="status-ref-id">{app.referenceId}</span>
          </div>

          <h1 className="status-title">Application Status</h1>
          <p className="status-subtitle">
            We&apos;re reviewing your application. Decisions are usually made within seconds — check your inbox at <strong>{app.email}</strong>.
          </p>

          {/* Timeline */}
          <div className="status-timeline">
            {timelineSteps.map((step, i) => {
              const isDone = i === 0;
              const isActive = i === 1;
              const isPending = i > 1;
              return (
                <div
                  key={step.key}
                  className={`status-step ${isDone ? "status-step-done" : ""} ${isActive ? "status-step-active" : ""} ${isPending ? "status-step-pending" : ""}`}
                >
                  <div className="status-step-indicator">
                    <div className="status-step-dot">
                      {isDone && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {isActive && <div className="status-step-pulse" />}
                    </div>
                    {i < timelineSteps.length - 1 && <div className="status-step-connector" />}
                  </div>
                  <div className="status-step-content">
                    <span className="status-step-label">{step.label}</span>
                    {(isDone || isActive) && (
                      <span className="status-step-meta">
                        {step.meta(submittedDate)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Application summary */}
          <div className="status-summary">
            <p className="status-summary-title">Application Details</p>
            {[
              { label: "Name", value: `${app.firstName} ${app.lastName}` },
              { label: "Email", value: app.email },
              { label: "Card Type", value: cardTypeLabels[app.cardType] },
              { label: "Submitted", value: submittedDate },
            ].map((row) => (
              <div className="status-summary-row" key={row.label}>
                <span className="status-summary-label">{row.label}</span>
                <span className="status-summary-value">{row.value}</span>
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/201006741810"
            target="_blank"
            rel="noopener noreferrer"
            className="status-support-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Questions? Contact support
          </a>
        </div>
      </div>}

    </>
  );
}
