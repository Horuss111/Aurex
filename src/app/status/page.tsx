"use client";

import { useEffect, useRef, useState } from "react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { GlassNavbar } from "@/components/ui/glass-navbar";
import { NavClient } from "@/components/ui/nav-client";

type AppStatus = "reviewing" | "approved" | "shipped" | "rejected";

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

const STATUS_LABELS: Record<AppStatus, string> = {
  reviewing: "Under Review",
  approved: "Approved",
  shipped: "Card Shipped",
  rejected: "Not Approved",
};

const timelineSteps = [
  { key: "submitted",  label: "Submitted",     meta: (date: string) => `Received ${date}` },
  { key: "reviewing",  label: "Under Review",  meta: () => "In progress — usually under 60 seconds" },
  { key: "approved",   label: "Approved",      meta: () => "Application accepted" },
  { key: "shipped",    label: "Card Shipped",  meta: () => "On its way to you" },
];

type StepState = "done" | "active" | "pending" | "rejected";

function getStepState(stepKey: string, status: AppStatus): StepState {
  if (status === "rejected") {
    if (stepKey === "submitted" || stepKey === "reviewing") return "done";
    return "rejected";
  }
  const order = ["submitted", "reviewing", "approved", "shipped"];
  const statusIdx = order.indexOf(status === "reviewing" ? "reviewing" : status);
  const stepIdx   = order.indexOf(stepKey);
  if (stepIdx < statusIdx) return "done";
  if (stepIdx === statusIdx) return "active";
  return "pending";
}

export default function StatusPage() {
  const [app, setApp]           = useState<ApplicationData | null>(null);
  const [liveStatus, setLive]   = useState<AppStatus | null>(null);
  const [loaded, setLoaded]     = useState(false);
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null);

  // Read localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem("aurex_application");
    if (raw) {
      try { setApp(JSON.parse(raw)); } catch { /* ignore */ }
    }
    setLoaded(true);
  }, []);

  // Poll live status once we have a referenceId
  useEffect(() => {
    if (!app?.referenceId) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/status/${app.referenceId}`);
        if (res.ok) {
          const data = await res.json();
          setLive(data.status);
          // Stop polling once a terminal state is reached
          if (data.status === "shipped" || data.status === "rejected") {
            intervalRef.current && clearInterval(intervalRef.current);
          }
        }
      } catch { /* ignore network blips */ }
    };

    poll(); // immediate first fetch
    intervalRef.current = setInterval(poll, 10_000);
    return () => { intervalRef.current && clearInterval(intervalRef.current); };
  }, [app?.referenceId]);

  const status: AppStatus = liveStatus ?? "reviewing";

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

      {!loaded && <div style={{ minHeight: "100dvh" }} />}

      {loaded && !app && (
        <div className="status-empty">
          <div className="status-empty-icon">💳</div>
          <h1 className="status-empty-title">No application found</h1>
          <p className="status-empty-desc">It looks like you haven&apos;t applied for an Aurex card yet.</p>
          <a href="/request-card" className="btn-primary-solid">Apply Now →</a>
        </div>
      )}

      {loaded && app && (
        <div className="status-page">

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
                <div className={`status-badge-dot ${status === "rejected" ? "dash-dot-rejected" : ""}`} />
                <span className="status-badge-label">{STATUS_LABELS[status]}</span>
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

            {status === "rejected" ? (
              <p className="status-subtitle">
                Unfortunately your application wasn&apos;t approved this time. You can reapply at any time or{" "}
                <a href="https://wa.me/201006741810" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-primary)", textDecoration: "underline" }}>
                  contact support
                </a>{" "}
                for details.
              </p>
            ) : (
              <p className="status-subtitle">
                We&apos;re reviewing your application. Decisions are usually made within seconds — check your inbox at <strong>{app.email}</strong>.
              </p>
            )}

            {/* Live timeline */}
            <div className="status-timeline">
              {timelineSteps.map((step, i) => {
                const state = getStepState(step.key, status);
                const isRejected = state === "rejected";
                return (
                  <div
                    key={step.key}
                    className={`status-step ${state === "done" ? "status-step-done" : ""} ${state === "active" ? "status-step-active" : ""} ${(state === "pending" || isRejected) ? "status-step-pending" : ""}`}
                  >
                    <div className="status-step-indicator">
                      <div className={`status-step-dot ${isRejected ? "dash-step-rejected" : ""}`}>
                        {state === "done" && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        {state === "active" && <div className="status-step-pulse" />}
                        {isRejected && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        )}
                      </div>
                      {i < timelineSteps.length - 1 && <div className="status-step-connector" />}
                    </div>
                    <div className="status-step-content">
                      <span className="status-step-label">{step.label}</span>
                      {(state === "done" || state === "active") && (
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
                { label: "Name",       value: `${app.firstName} ${app.lastName}` },
                { label: "Email",      value: app.email },
                { label: "Card Type",  value: cardTypeLabels[app.cardType] },
                { label: "Submitted",  value: submittedDate },
              ].map((row) => (
                <div className="status-summary-row" key={row.label}>
                  <span className="status-summary-label">{row.label}</span>
                  <span className="status-summary-value">{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", marginTop: "1.5rem" }}>
              <a href="https://wa.me/201006741810" target="_blank" rel="noopener noreferrer" className="status-support-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Questions? Contact support
              </a>
              {status === "rejected" && (
                <a href="/request-card" className="btn-primary-solid" style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem" }}>
                  Reapply →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
