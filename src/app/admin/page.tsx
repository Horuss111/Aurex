"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { GlassNavbar } from "@/components/ui/glass-navbar";
import { NavClient } from "@/components/ui/nav-client";

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

const STATUS_LABELS: Record<string, string> = {
  reviewing: "Under Review",
  approved: "Approved",
  shipped: "Shipped",
  rejected: "Rejected",
};

const CARD_TYPE_LABELS: Record<string, string> = {
  virtual: "Virtual",
  physical: "Physical",
  both: "Both",
};

const STATUS_COLORS: Record<string, string> = {
  reviewing: "admin-badge-reviewing",
  approved: "admin-badge-approved",
  shipped: "admin-badge-shipped",
  rejected: "admin-badge-rejected",
};

const STATUS_ACTIONS: Record<string, { label: string; next: string }[]> = {
  reviewing: [
    { label: "Approve", next: "approved" },
    { label: "Reject", next: "rejected" },
  ],
  approved: [
    { label: "Mark Shipped", next: "shipped" },
    { label: "Reject", next: "rejected" },
  ],
  shipped: [],
  rejected: [{ label: "Re-review", next: "reviewing" }],
};

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const isAdmin = isLoaded && !!user && (!adminEmail || userEmail === adminEmail);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isAdmin) { setLoading(false); return; }

    fetch("/api/admin/applications")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setApps(d.applications ?? []);
      })
      .catch(() => setError("Failed to load applications."))
      .finally(() => setLoading(false));
  }, [isLoaded, isAdmin]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id + status);
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setApps((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: status as Application["status"] } : a))
      );
    }
    setUpdating(null);
  };

  const filtered = apps.filter((a) => {
    const matchesFilter = filter === "all" || a.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      a.first_name.toLowerCase().includes(q) ||
      a.last_name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.reference_id.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: apps.length,
    reviewing: apps.filter((a) => a.status === "reviewing").length,
    approved: apps.filter((a) => a.status === "approved").length,
    shipped: apps.filter((a) => a.status === "shipped").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  if (!isLoaded || loading) {
    return (
      <>
        <DottedSurface className="size-full fixed inset-0 -z-20 bg-[var(--bg)]" />
        <div className="admin-loading">
          <div className="admin-spinner" />
          <p>Loading…</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <DottedSurface className="size-full fixed inset-0 -z-20 bg-[var(--bg)]" />
        <div className="admin-gate">
          <h1 className="admin-gate-title">Sign in required</h1>
          <a href="/sign-in" className="btn-primary-solid">Sign in</a>
        </div>
      </>
    );
  }

  return (
    <>
      <DottedSurface className="size-full fixed inset-0 -z-20 bg-[var(--bg)]" />
      <div className="admin-nav-wrap">
        <GlassNavbar><NavClient /></GlassNavbar>
      </div>

      <div className="admin-page">

        {/* ── Header ──────────────────────────────────── */}
        <div className="admin-header">
          <div>
            <p className="admin-eyebrow">Admin Panel</p>
            <h1 className="admin-title">Applications</h1>
          </div>
          <div className="admin-header-meta">
            <span className="admin-user-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {userEmail}
            </span>
          </div>
        </div>

        {/* ── Stats ───────────────────────────────────── */}
        <div className="admin-stats">
          {[
            { label: "Total", value: counts.all, cls: "" },
            { label: "Under Review", value: counts.reviewing, cls: "admin-stat-reviewing" },
            { label: "Approved", value: counts.approved, cls: "admin-stat-approved" },
            { label: "Shipped", value: counts.shipped, cls: "admin-stat-shipped" },
            { label: "Rejected", value: counts.rejected, cls: "admin-stat-rejected" },
          ].map((s) => (
            <div key={s.label} className={`admin-stat-card ${s.cls}`}>
              <span className="admin-stat-value">{s.value}</span>
              <span className="admin-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Filters + Search ────────────────────────── */}
        <div className="admin-toolbar">
          <div className="admin-filters">
            {(["all", "reviewing", "approved", "shipped", "rejected"] as const).map((f) => (
              <button
                key={f}
                className={`admin-filter-btn ${filter === f ? "admin-filter-active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : STATUS_LABELS[f]}
                <span className="admin-filter-count">{counts[f]}</span>
              </button>
            ))}
          </div>
          <div className="admin-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="admin-search"
              placeholder="Search by name, email, or ref ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Error ───────────────────────────────────── */}
        {error && (
          <div className="admin-error">{error}</div>
        )}

        {/* ── Table ───────────────────────────────────── */}
        {!error && (
          <div className="admin-table-wrap">
            {filtered.length === 0 ? (
              <div className="admin-empty">
                <p>No applications found.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Card</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <>
                      <tr
                        key={app.id}
                        className={`admin-row ${expanded === app.id ? "admin-row-expanded" : ""}`}
                        onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                      >
                        <td>
                          <span className="admin-ref">{app.reference_id}</span>
                        </td>
                        <td className="admin-name">{app.first_name} {app.last_name}</td>
                        <td className="admin-email">{app.email}</td>
                        <td>{CARD_TYPE_LABELS[app.card_type] ?? app.card_type}</td>
                        <td className="admin-date">
                          {new Date(app.submitted_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </td>
                        <td>
                          <span className={`admin-badge ${STATUS_COLORS[app.status]}`}>
                            {STATUS_LABELS[app.status]}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="admin-actions">
                            {STATUS_ACTIONS[app.status]?.map((action) => (
                              <button
                                key={action.next}
                                className={`admin-action-btn admin-action-${action.next}`}
                                disabled={updating === app.id + action.next}
                                onClick={() => updateStatus(app.id, action.next)}
                              >
                                {updating === app.id + action.next ? "…" : action.label}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded details row */}
                      {expanded === app.id && (
                        <tr key={`${app.id}-detail`} className="admin-detail-row">
                          <td colSpan={7}>
                            <div className="admin-detail">
                              {[
                                { label: "Phone", value: app.phone },
                                { label: "Date of Birth", value: app.dob },
                                { label: "Employment", value: app.employment },
                                { label: "Annual Income", value: app.income },
                                { label: "Address", value: [app.address, app.city, app.country].filter(Boolean).join(", ") || null },
                              ].filter((r) => r.value).map((r) => (
                                <div key={r.label} className="admin-detail-row-item">
                                  <span className="admin-detail-label">{r.label}</span>
                                  <span className="admin-detail-value">{r.value}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
}
