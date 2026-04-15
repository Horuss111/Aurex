import type { Metadata } from "next";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { GlassNavbar } from "@/components/ui/glass-navbar";
import { NavClient } from "@/components/ui/nav-client";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About Aurex — Our Mission",
  description:
    "Aurex is building the world's most accessible premium payment card. Zero fees, instant approvals, global acceptance.",
};

const values = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Security First",
    desc: "PCI-DSS Level 1 certified. Every transaction encrypted with 256-bit AES. Your money and data are always protected.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Truly Global",
    desc: "150+ currencies, zero foreign transaction fees, and real interbank exchange rates. No surprises at checkout.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Instant Everything",
    desc: "Apply in minutes, get approved in seconds, use your virtual card immediately. No waiting, no paperwork.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Zero Fees",
    desc: "No annual fee, no maintenance fee, no hidden charges. We earn when the network earns — not from you.",
  },
];

const stats = [
  { value: "500K+", label: "Cards Issued" },
  { value: "$2.4B+", label: "Payments Processed" },
  { value: "150+", label: "Countries" },
  { value: "99.99%", label: "Uptime" },
];

const team = [
  { name: "Alex Chen", role: "Co-founder & CEO", initials: "AC" },
  { name: "Sara Malik", role: "Co-founder & CTO", initials: "SM" },
  { name: "James Okoye", role: "Head of Product", initials: "JO" },
  { name: "Lena Vogel", role: "Head of Design", initials: "LV" },
];

export default function AboutPage() {
  return (
    <>
      <DottedSurface className="size-full fixed inset-0 -z-20 bg-[var(--bg)]" />
      <div className="admin-nav-wrap">
        <GlassNavbar><NavClient /></GlassNavbar>
      </div>

      <div className="about-page">

        {/* ── Hero ─────────────────────────────────────────── */}
        <ScrollReveal>
          <section className="about-hero">
            <p className="section-eyebrow">Our Mission</p>
            <h1 className="about-hero-title">
              Financial freedom<br />for everyone, everywhere.
            </h1>
            <p className="about-hero-sub">
              {siteConfig.name} was founded in {siteConfig.founded} with a simple belief: premium banking
              shouldn&apos;t be a privilege. We built a card with no fees, instant approvals, and real
              global reach — so anyone can pay anywhere without being penalised for it.
            </p>
          </section>
        </ScrollReveal>

        {/* ── Stats ────────────────────────────────────────── */}
        <ScrollReveal>
          <div className="about-stats">
            {stats.map((s) => (
              <div key={s.label} className="about-stat">
                <span className="about-stat-value">{s.value}</span>
                <span className="about-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Story ────────────────────────────────────────── */}
        <ScrollReveal>
          <section className="about-section">
            <div className="about-section-inner">
              <div className="about-section-text">
                <p className="section-eyebrow">The Story</p>
                <h2 className="about-section-title">Built out of frustration.</h2>
                <p className="about-body">
                  Our founders spent years paying unnecessary fees on international transactions,
                  waiting days for card approvals, and dealing with banks that treated customers
                  like a liability. So they decided to build something better.
                </p>
                <p className="about-body">
                  {siteConfig.name} launched in {siteConfig.founded} as a fully digital payment card — no branches,
                  no legacy overhead, no fees passed on to users. Just a fast, secure, beautiful
                  card that works everywhere.
                </p>
              </div>
              <div className="about-section-card">
                <div className="about-story-card">
                  <div className="about-story-card-inner">
                    <svg viewBox="0 0 24 24" width="28" height="28" style={{ marginBottom: "1rem", color: "rgba(255,255,255,0.6)" }}>
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                        stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
                    </svg>
                    <p style={{ fontSize: "1.1rem", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.5, margin: "0 0 0.5rem" }}>
                      &ldquo;Banking built for the world, not just the wealthy.&rdquo;
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                      — {siteConfig.name} founding principle
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Values ───────────────────────────────────────── */}
        <ScrollReveal>
          <section className="about-section">
            <p className="section-eyebrow" style={{ textAlign: "center" }}>Our Values</p>
            <h2 className="about-section-title" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              What we stand for
            </h2>
            <div className="about-values">
              {values.map((v, i) => (
                <ScrollReveal key={v.title} delay={i * 80}>
                  <div className="about-value-card">
                    <div className="about-value-icon">{v.icon}</div>
                    <h3 className="about-value-title">{v.title}</h3>
                    <p className="about-value-desc">{v.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ── Team ─────────────────────────────────────────── */}
        <ScrollReveal>
          <section className="about-section">
            <p className="section-eyebrow" style={{ textAlign: "center" }}>The Team</p>
            <h2 className="about-section-title" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              People behind the card
            </h2>
            <div className="about-team">
              {team.map((member, i) => (
                <ScrollReveal key={member.name} delay={i * 80}>
                  <div className="about-team-card">
                    <div className="about-team-avatar">{member.initials}</div>
                    <div className="about-team-name">{member.name}</div>
                    <div className="about-team-role">{member.role}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ── CTA ──────────────────────────────────────────── */}
        <ScrollReveal>
          <section className="about-cta">
            <h2 className="about-cta-title">Ready to get your card?</h2>
            <p className="about-cta-sub">Apply in minutes. Instant decision. Zero annual fee.</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/request-card" className="btn-primary-solid">Request a Card →</a>
              <a href="/contact" className="cta-btn-ghost">Get in touch</a>
            </div>
          </section>
        </ScrollReveal>

      </div>
    </>
  );
}
