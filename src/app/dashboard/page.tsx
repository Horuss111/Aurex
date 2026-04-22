"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { GlassNavbar } from "@/components/ui/glass-navbar";
import { NavClient } from "@/components/ui/nav-client";

type DashTab = "status" | "controls" | "support";

interface Application {
  id: string;
  reference_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  dob: string | null;
  card_type: string;
  employment: string | null;
  income: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  status: "reviewing" | "approved" | "shipped" | "rejected";
  submitted_at: string;
}

const CARD_TYPE_LABELS: Record<string, string> = {
  virtual: "Virtual Card",
  physical: "Physical Card",
  both: "Virtual + Physical",
};

const STATUS_LABELS: Record<string, string> = {
  reviewing: "Under Review",
  approved: "Approved",
  shipped: "Shipped",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<string, string> = {
  reviewing: "dash-badge-reviewing",
  approved: "dash-badge-approved",
  shipped: "dash-badge-shipped",
  rejected: "dash-badge-rejected",
};

type StepState = "done" | "active" | "pending" | "rejected";

function getStepState(stepKey: string, status: Application["status"]): StepState {
  const order = ["reviewing", "approved", "shipped"];

  if (status === "rejected") {
    if (stepKey === "submitted" || stepKey === "reviewing") return "done";
    return "rejected";
  }

  if (stepKey === "submitted") return "done";

  const statusIdx = order.indexOf(status);
  const stepIdx = order.indexOf(stepKey);

  if (stepIdx < statusIdx) return "done";
  if (stepIdx === statusIdx) return "active";
  return "pending";
}

const timelineSteps = [
  { key: "submitted", label: "Application Submitted" },
  { key: "reviewing", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "shipped", label: "Card Shipped" },
];

function CardMockup({ name }: { name: string }) {
  return (
    <div className="rc-card-stage">
      <div className="rc-card-glow" />
      <div className="rc-card-mockup">
        <div className="rc-card-shine" />
        <div className="rc-card-logo-wrap">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span>Aurex</span>
        </div>
        <div className="rc-card-chip">
          <div className="rc-chip-inner">
            <span /><span /><span />
          </div>
        </div>
        <div className="rc-card-number">•••• •••• •••• 1234</div>
        <div className="rc-card-footer">
          <div>
            <div className="rc-card-meta-label">Card Holder</div>
            <div className="rc-card-meta-value" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {name}
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
  );
}

function Timeline({ status }: { status: Application["status"] }) {
  return (
    <div className="status-timeline">
      {timelineSteps.map((step, i) => {
        const state = getStepState(step.key, status);
        const isRejected = state === "rejected";
        return (
          <div
            key={step.key}
            className={`status-step ${state === "done" ? "status-step-done" : ""} ${state === "active" ? "status-step-active" : ""} ${state === "pending" || isRejected ? "status-step-pending" : ""}`}
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
              {state === "active" && step.key === "reviewing" && (
                <span className="status-step-meta">In progress — usually under 60 seconds</span>
              )}
              {status === "rejected" && step.key === "reviewing" && (
                <span className="status-step-meta" style={{ color: "#ef4444" }}>Application not approved</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DashTab>("status");

  // Card controls
  const [frozen, setFrozen] = useState(false);
  const [freezeLoading, setFreezeLoading] = useState(false);
  const [freezeMsg, setFreezeMsg] = useState<string | null>(null);

  // Support form
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportResult, setSupportResult] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { setLoading(false); return; }

    fetch("/api/dashboard/application")
      .then(async (r) => {
        const text = await r.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error(`Server error (${r.status})`);
        }
      })
      .then((d) => {
        if (d.error) setError(d.error);
        else {
          const list: Application[] = d.applications ?? [];
          setApps(list);
          if (list.length > 0) setSelectedId(list[0].id);
        }
      })
      .catch((e: Error) => setError(e.message || "Failed to load your application."))
      .finally(() => setLoading(false));
  }, [isLoaded, user]);

  async function handleFreeze(appId: string, nextFrozen: boolean) {
    setFreezeLoading(true);
    setFreezeMsg(null);
    try {
      const res = await fetch(`/api/card/${appId}/freeze`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frozen: nextFrozen }),
      });
      const data = await res.json();
      if (data.success) {
        setFrozen(nextFrozen);
        setFreezeMsg(nextFrozen ? "Card frozen successfully." : "Card unfrozen successfully.");
      } else {
        setFreezeMsg(data.error ?? "Failed to update card.");
      }
    } catch {
      setFreezeMsg("Network error. Please try again.");
    } finally {
      setFreezeLoading(false);
    }
  }

  async function handleSupportSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSupportLoading(true);
    setSupportResult(null);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: supportSubject,
          message: supportMessage,
          referenceId: apps.find((a) => a.id === selectedId)?.reference_id ?? "",
          email: user?.emailAddresses[0]?.emailAddress ?? "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSupportResult({ type: "success", msg: `Ticket submitted — ${data.ticketId}. We'll reply within a few hours.` });
        setSupportSubject("");
        setSupportMessage("");
      } else {
        setSupportResult({ type: "error", msg: data.error ?? "Failed to submit ticket." });
      }
    } catch {
      setSupportResult({ type: "error", msg: "Network error. Please try again." });
    } finally {
      setSupportLoading(false);
    }
  }

  // Loading
  if (!isLoaded || loading) {
    return (
      <>
        <DottedSurface className="size-full fixed inset-0 -z-20 bg-[var(--bg)]" />
        <div className="admin-loading">
          <div className="admin-spinner" />
          <p>Loading your dashboard…</p>
        </div>
      </>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <>
        <DottedSurface className="size-full fixed inset-0 -z-20 bg-[var(--bg)]" />
        <div className="admin-gate">
          <h1 className="admin-gate-title">Sign in to view your dashboard</h1>
          <a href="/sign-in" className="btn-primary-solid">Sign in</a>
        </div>
      </>
    );
  }

  const selected = apps.find((a) => a.id === selectedId) ?? null;

  const submittedDate = selected
    ? new Date(selected.submitted_at).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : "";

  return (
    <>
      <DottedSurface className="size-full fixed inset-0 -z-20 bg-[var(--bg)]" />
      <div className="admin-nav-wrap">
        <GlassNavbar><NavClient /></GlassNavbar>
      </div>

      <div className="dash-page">

        {/* ── Header ──────────────────────────────────── */}
        <div className="dash-header">
          <div>
            <p className="admin-eyebrow">My Account</p>
            <h1 className="admin-title">Dashboard</h1>
          </div>
          <div className="dash-header-meta">
            <span className="admin-user-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {user.emailAddresses[0]?.emailAddress}
            </span>
          </div>
        </div>

        {/* ── Error ───────────────────────────────────── */}
        {error && <div className="admin-error">{error}</div>}

        {/* ── No applications ─────────────────────────── */}
        {!error && apps.length === 0 && (
          <div className="dash-empty">
            <div className="dash-empty-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <h2 className="dash-empty-title">No applications yet</h2>
              <p className="dash-empty-desc">Apply for your Aurex card to get started.</p>
              <a href="/request-card" className="btn-primary-solid" style={{ marginTop: "1.5rem" }}>
                Apply Now →
              </a>
            </div>
          </div>
        )}

        {/* ── Dashboard content ────────────────────────── */}
        {!error && apps.length > 0 && selected && (
          <div className="dash-content">

            {/* Multiple applications — tab picker */}
            {apps.length > 1 && (
              <div className="dash-app-tabs">
                <p className="dash-app-tabs-label">Your applications</p>
                <div className="dash-app-tabs-list">
                  {apps.map((a) => (
                    <button
                      key={a.id}
                      className={`dash-app-tab ${selectedId === a.id ? "dash-app-tab-active" : ""}`}
                      onClick={() => setSelectedId(a.id)}
                    >
                      <span className="dash-app-tab-ref">{a.reference_id}</span>
                      <span className={`admin-badge ${STATUS_COLORS[a.status]}`}>
                        {STATUS_LABELS[a.status]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main panel */}
            <div className="dash-main">

              {/* Left — card mockup + status badge */}
              <div className="dash-left">
                <p className="status-eyebrow">
                  <span className="eyebrow-line" />
                  {CARD_TYPE_LABELS[selected.card_type] ?? selected.card_type}
                  <span className="eyebrow-line" />
                </p>

                <div style={{ position: "relative" }}>
                  <CardMockup name={`${selected.first_name} ${selected.last_name}`} />
                  {frozen && (
                    <div className="dash-frozen-overlay">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Card Frozen
                    </div>
                  )}
                </div>

                <div className="status-badge-wrap">
                  <div className={`status-badge-dot ${selected.status === "rejected" ? "dash-dot-rejected" : ""}`} />
                  <span className="status-badge-label">{STATUS_LABELS[selected.status]}</span>
                </div>

                <div className="dash-ref-pill">
                  <span className="dash-ref-pill-label">Ref</span>
                  <span className="dash-ref-pill-value">{selected.reference_id}</span>
                </div>
              </div>

              {/* Right — tabbed content */}
              <div className="dash-right">

                {/* Tab bar */}
                <div className="dash-tabs">
                  {(["status", "controls", "support"] as DashTab[]).map((tab) => (
                    <button
                      key={tab}
                      className={`dash-tab ${activeTab === tab ? "dash-tab-active" : ""}`}
                      onClick={() => { setActiveTab(tab); setFreezeMsg(null); setSupportResult(null); }}
                    >
                      {tab === "status" && "Application Status"}
                      {tab === "controls" && "Card Controls"}
                      {tab === "support" && "Support"}
                    </button>
                  ))}
                </div>

                {/* ── Tab: Status ── */}
                {activeTab === "status" && (
                  <>
                    {selected.status === "rejected" && (
                      <div className="dash-rejected-notice">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Your application was not approved. You may reapply at any time.
                      </div>
                    )}

                    <Timeline status={selected.status} />

                    <div className="status-summary" style={{ marginTop: "2rem" }}>
                      <p className="status-summary-title">Application Details</p>
                      {[
                        { label: "Name", value: `${selected.first_name} ${selected.last_name}` },
                        { label: "Email", value: selected.email },
                        { label: "Card Type", value: CARD_TYPE_LABELS[selected.card_type] ?? selected.card_type },
                        { label: "Submitted", value: submittedDate },
                        selected.phone ? { label: "Phone", value: selected.phone } : null,
                        selected.employment ? { label: "Employment", value: selected.employment } : null,
                      ]
                        .filter(Boolean)
                        .map((row) => row && (
                          <div className="status-summary-row" key={row.label}>
                            <span className="status-summary-label">{row.label}</span>
                            <span className="status-summary-value">{row.value}</span>
                          </div>
                        ))}
                    </div>

                    <div className="dash-actions-row">
                      <button className="status-support-btn" onClick={() => setActiveTab("support")}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Contact support
                      </button>
                      {selected.status === "rejected" && (
                        <a href="/request-card" className="btn-primary-solid" style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem" }}>
                          Reapply →
                        </a>
                      )}
                    </div>
                  </>
                )}

                {/* ── Tab: Card Controls ── */}
                {activeTab === "controls" && (
                  <div className="dash-controls">
                    <h2 className="dash-section-title">Card Controls</h2>
                    <p className="dash-controls-desc">
                      Manage your card security settings. Freezing your card instantly blocks all new transactions while keeping your account active.
                    </p>

                    <div className="dash-control-row">
                      <div className="dash-control-info">
                        <div className="dash-control-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                        <div>
                          <p className="dash-control-title">Freeze Card</p>
                          <p className="dash-control-sub">
                            {frozen ? "Your card is currently frozen. No transactions will be processed." : "Temporarily block all transactions on this card."}
                          </p>
                        </div>
                      </div>
                      <button
                        className={`dash-freeze-btn ${frozen ? "dash-freeze-btn-active" : ""}`}
                        onClick={() => handleFreeze(selected.id, !frozen)}
                        disabled={freezeLoading || selected.status !== "approved" && selected.status !== "shipped"}
                      >
                        {freezeLoading ? "…" : frozen ? "Unfreeze" : "Freeze"}
                      </button>
                    </div>

                    {(selected.status === "reviewing" || selected.status === "rejected") && (
                      <p className="dash-controls-notice">Card controls are available once your application is approved.</p>
                    )}

                    {freezeMsg && (
                      <div className={`dash-control-msg ${frozen ? "dash-control-msg-info" : "dash-control-msg-ok"}`}>
                        {freezeMsg}
                      </div>
                    )}

                    <div className="dash-control-row" style={{ marginTop: "1rem", opacity: 0.4, pointerEvents: "none" }}>
                      <div className="dash-control-info">
                        <div className="dash-control-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                        <div>
                          <p className="dash-control-title">Spending Limits</p>
                          <p className="dash-control-sub">Set daily or per-transaction spend caps.</p>
                        </div>
                      </div>
                      <span className="service-badge">Coming soon</span>
                    </div>

                    <div className="dash-control-row" style={{ opacity: 0.4, pointerEvents: "none" }}>
                      <div className="dash-control-info">
                        <div className="dash-control-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                          </svg>
                        </div>
                        <div>
                          <p className="dash-control-title">Request Replacement</p>
                          <p className="dash-control-sub">Order a new card if yours is lost or damaged.</p>
                        </div>
                      </div>
                      <span className="service-badge">Coming soon</span>
                    </div>
                  </div>
                )}

                {/* ── Tab: Support ── */}
                {activeTab === "support" && (
                  <div className="dash-support">
                    <h2 className="dash-section-title">Contact Support</h2>
                    <p className="dash-controls-desc">
                      Submit a support request and our team will reply via email within a few hours.
                    </p>

                    <form onSubmit={handleSupportSubmit} className="dash-support-form">
                      <div className="dash-field">
                        <label className="dash-field-label">Subject</label>
                        <input
                          className="dash-field-input"
                          type="text"
                          placeholder="e.g. I have a question about my application"
                          value={supportSubject}
                          onChange={(e) => setSupportSubject(e.target.value)}
                          required
                        />
                      </div>
                      <div className="dash-field">
                        <label className="dash-field-label">Message</label>
                        <textarea
                          className="dash-field-input dash-field-textarea"
                          placeholder="Describe your issue in detail…"
                          rows={5}
                          value={supportMessage}
                          onChange={(e) => setSupportMessage(e.target.value)}
                          required
                        />
                      </div>
                      {supportResult && (
                        <div className={`dash-control-msg ${supportResult.type === "success" ? "dash-control-msg-ok" : "dash-control-msg-err"}`}>
                          {supportResult.msg}
                        </div>
                      )}
                      <button
                        type="submit"
                        className="btn-primary-solid"
                        disabled={supportLoading}
                        style={{ fontSize: "0.88rem", padding: "0.6rem 1.4rem", width: "fit-content" }}
                      >
                        {supportLoading ? "Submitting…" : "Submit Ticket →"}
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
