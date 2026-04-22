import { DottedSurface } from "@/components/ui/dotted-surface";
import { siteConfig } from "@/lib/config";
import { LogoCloud } from "@/components/ui/logo-cloud-3";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { GlassNavbar } from "@/components/ui/glass-navbar";
import { ParticleField } from "@/components/ui/particle-field";
import { NavClient } from "@/components/ui/nav-client";
import { StatCounter } from "@/components/ui/stat-counter";
import { Testimonials } from "@/components/ui/testimonials";
import { FAQ } from "@/components/ui/faq";
import { AnimatedHeroGraphic } from "@/components/ui/animated-hero-graphic";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { TechStack } from "@/components/ui/tech-stack";

const logos = [
  { src: "https://cdn.simpleicons.org/visa", alt: "Visa" },
  { src: "https://cdn.simpleicons.org/mastercard", alt: "Mastercard" },
  { src: "https://cdn.simpleicons.org/paypal", alt: "PayPal" },
  { src: "https://cdn.simpleicons.org/stripe", alt: "Stripe" },
  { src: "https://cdn.simpleicons.org/applepay", alt: "Apple Pay" },
  { src: "https://cdn.simpleicons.org/googlepay", alt: "Google Pay" },
  { src: "https://cdn.simpleicons.org/shopify", alt: "Shopify" },
  { src: "https://cdn.simpleicons.org/ebay", alt: "eBay" },
  { src: "https://cdn.simpleicons.org/americanexpress", alt: "American Express" },
  { src: "https://cdn.simpleicons.org/samsung", alt: "Samsung Pay" },
];

const features = [
  {
    icon: "💳",
    title: "Aurex Card",
    description: "A premium physical and virtual card accepted worldwide — Visa & Mastercard networks, zero foreign transaction fees.",
  },
  {
    icon: "🔒",
    title: "256-bit Encryption",
    description: "Bank-grade security protecting every transaction and card detail with military-level encryption.",
  },
  {
    icon: "🧠",
    title: "AI Spend Insights",
    description: "Real-time categorisation and smart alerts so you always know where your money is going.",
  },
  {
    icon: "💱",
    title: "Multi-currency Payments",
    description: "Pay in 150+ currencies at interbank rates — no markup, no surprises at checkout.",
  },
  {
    icon: "✦",
    title: "Zero Hidden Fees",
    description: "No annual fee, no foreign transaction fee, no surprise charges. You keep what you earn.",
  },
  {
    icon: "◎",
    title: "24/7 Card Support",
    description: "Freeze, unfreeze, or dispute a charge instantly from the app — or reach a human any time.",
  },
];

const steps = [
  { number: "01", title: "Apply Online", description: "Fill out a quick application in under two minutes — no paperwork, no branch visit required." },
  { number: "02", title: "Get Approved", description: "Our AI-powered review process delivers a decision in seconds, not days." },
  { number: "03", title: "Use Anywhere", description: "Your virtual card is ready instantly. Your physical Aurex card ships within 3–5 business days." },
];

const services = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    title: "Card Management",
    description: "Freeze or unfreeze your card instantly from your dashboard. Full control of your card at any time, from anywhere.",
    badge: "Dashboard",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Live Application Tracking",
    description: "Track your card application in real time with a unique reference ID — from submission to approval to shipment.",
    badge: "Real-time",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Support Tickets",
    description: "Submit a support request directly from your dashboard. Our team is notified instantly and replies within hours.",
    badge: "Dashboard",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Secure Auth",
    description: "Every account is protected by Clerk — industry-standard JWT authentication with multi-factor support built in.",
    badge: "Always on",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Global Payments",
    description: "Pay in 150+ currencies at the real interbank rate. Zero foreign transaction fees on every purchase worldwide.",
    badge: "150+ countries",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Email Notifications",
    description: "Automated transactional emails for every key event — application received, status updates, and support replies.",
    badge: "Automated",
  },
];

const stats = [
  { value: "$2.4B+", label: "Payments Processed" },
  { value: "500K+", label: "Cards Issued" },
  { value: "150+", label: "Countries Accepted" },
  { value: "99.99%", label: "Uptime" },
];

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/contact" },
    { label: "Press", href: "/contact" },
  ],
  Products: [
    { label: "Aurex Card", href: "#features" },
    { label: "Virtual Card", href: "#features" },
    { label: "Global Payments", href: "#features" },
    { label: "AI Insights", href: "#features" },
  ],
  Resources: [
    { label: "FAQ", href: "#faq" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact us", href: "/contact" },
    { label: "Support", href: siteConfig.contact.whatsapp },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/privacy#cookies" },
    { label: "Compliance", href: "/privacy" },
  ],
};

export default function Home() {
  return (
    <>
      <DottedSurface className="size-full absolute inset-0 -z-20 bg-[var(--bg)]" />

      <div className="page-wrapper">
        <div className="center-col">

          {/* ─── Navbar ─────────────────────────────────────── */}
          <GlassNavbar>
            <NavClient />
          </GlassNavbar>

          {/* ─── Hero ───────────────────────────────────────── */}
          <main className="hero-split" id="hero">
            <ParticleField />
            <Spotlight size={500} />

            {/* Left — text */}
            <div className="hero-split-left">
              <div className="eyebrow">
                <span className="eyebrow-line" />
                Premium Payment Card
                <span className="eyebrow-line" />
              </div>
              <h1 className="hero-title" style={{ textAlign: "left", maxWidth: 560 }}>
                One Card for<br />Every Payment
              </h1>
              <p className="hero-subtitle" style={{ textAlign: "left" }}>
                Apply in minutes. Pay anywhere in the world. Zero foreign fees, instant approvals.
              </p>
              <div className="hero-actions" style={{ justifyContent: "flex-start" }}>
                <a href="/request-card" className="btn-primary-solid">Request a Card</a>
                <a href="#how-it-works" className="btn-secondary">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                  </svg>
                  How it works
                </a>
              </div>
              <p className="hero-trust" style={{ textAlign: "left" }}>
                No credit check&nbsp;&nbsp;·&nbsp;&nbsp;Free to apply&nbsp;&nbsp;·&nbsp;&nbsp;Instant decision
              </p>
            </div>

            {/* Right — 3D scene */}
            <div className="hero-split-right">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </main>

          {/* ─── Card Showcase ──────────────────────────────── */}
          <ScrollReveal>
            <section className="card-showcase" id="card-showcase">
              <div className="section-header">
                <p className="section-eyebrow">The Aurex Card</p>
                <h2 className="section-title">Designed for<br />the world stage</h2>
              </div>
              <AnimatedHeroGraphic />
            </section>
          </ScrollReveal>

          {/* ─── Stats ──────────────────────────────────────── */}
          <ScrollReveal>
            <section className="stats-section" id="stats">
              {stats.map((stat) => (
                <StatCounter key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </section>
          </ScrollReveal>

          {/* ─── Logo Cloud ─────────────────────────────────── */}
          <ScrollReveal>
            <section className="logo-section">
              <p className="section-eyebrow">Accepted Everywhere</p>
              <LogoCloud logos={logos} className="logo-cloud" />
            </section>
          </ScrollReveal>

          {/* ─── Animated Tagline ───────────────────────────── */}
          <ScrollReveal>
            <AnimatedHero />
          </ScrollReveal>

          {/* ─── Features ───────────────────────────────────── */}
          <ScrollReveal>
            <section className="features-section" id="features">
              <div className="section-header">
                <p className="section-eyebrow">Why Aurex</p>
                <h2 className="section-title">Everything you need<br />in one card</h2>
              </div>
              <div className="features-grid">
                {features.map((f, i) => (
                  <ScrollReveal key={f.title} delay={i * 80}>
                    <div className="feature-card" style={{ height: "100%" }}>
                      <span className="feature-icon">{f.icon}</span>
                      <h3 className="feature-title">{f.title}</h3>
                      <p className="feature-desc">{f.description}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* ─── How it works ───────────────────────────────── */}
          <ScrollReveal>
            <section className="steps-section" id="how-it-works">
              <div className="section-header">
                <p className="section-eyebrow">How it Works</p>
                <h2 className="section-title">Your card,<br />in three steps</h2>
              </div>
              <div className="steps-row">
                {steps.map((step, i) => (
                  <ScrollReveal key={step.number} delay={i * 120}>
                    <div className="step-card">
                      <span className="step-number">{step.number}</span>
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-desc">{step.description}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* ─── Services ───────────────────────────────────── */}
          <ScrollReveal>
            <section className="services-section" id="services">
              <div className="section-header">
                <p className="section-eyebrow">Services</p>
                <h2 className="section-title">More than a card.<br />A full suite of services.</h2>
                <p className="services-subtitle">
                  From the moment you apply to the day-to-day management of your account, every service runs on a modern, secure backend.
                </p>
              </div>
              <div className="services-grid">
                {services.map((s, i) => (
                  <ScrollReveal key={s.title} delay={i * 60}>
                    <div className="service-card">
                      <div className="service-icon">{s.icon}</div>
                      <div className="service-body">
                        <div className="service-header">
                          <h3 className="service-title">{s.title}</h3>
                          <span className="service-badge">{s.badge}</span>
                        </div>
                        <p className="service-desc">{s.description}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* ─── Testimonials ───────────────────────────────── */}
          <ScrollReveal>
            <Testimonials />
          </ScrollReveal>

          {/* ─── Pricing ────────────────────────────────────── */}
          <ScrollReveal>
            <section className="pricing-section" id="pricing">
              <div className="section-header">
                <p className="section-eyebrow">Pricing</p>
                <h2 className="section-title">Simple pricing.<br />No surprises.</h2>
              </div>
              <div className="pricing-card">
                <div className="pricing-left">
                  <span className="pricing-badge">✦ Always free</span>
                  <div className="pricing-price">
                    <span className="pricing-amount">$0</span>
                    <span className="pricing-period">/ forever</span>
                  </div>
                  <p className="pricing-desc">
                    No annual fee, no maintenance fee, no foreign transaction fee.
                    You only ever pay for what you spend — at the real exchange rate.
                  </p>
                  <div className="pricing-cta">
                    <a href="/request-card" className="btn-primary-solid">Request your card</a>
                    <span className="pricing-note">No credit check to apply.</span>
                  </div>
                </div>
                <div className="pricing-right">
                  {[
                    { label: "Annual fee", value: "Free" },
                    { label: "Foreign transaction fee", value: "0%" },
                    { label: "Card issuance", value: "Free" },
                    { label: "Virtual card", value: "Instant" },
                    { label: "Physical card delivery", value: "3–5 days" },
                    { label: "Currencies supported", value: "150+" },
                    { label: "ATM withdrawals", value: "3 free / mo" },
                    { label: "24/7 support", value: "Included" },
                  ].map((row) => (
                    <div className="pricing-feature-row" key={row.label}>
                      <div className="pricing-check">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="pricing-feature-label">{row.label}</span>
                      <span className="pricing-feature-value">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* ─── Security Badges ────────────────────────────── */}
          <ScrollReveal>
            <section className="security-section">
              <p className="section-eyebrow">Security &amp; Compliance</p>
              <div className="security-badges">
                {[
                  {
                    title: "PCI-DSS Level 1",
                    sub: "Highest payment security standard",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                  },
                  {
                    title: "256-bit AES",
                    sub: "Military-grade encryption",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    ),
                  },
                  {
                    title: "SOC 2 Type II",
                    sub: "Independently audited annually",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    ),
                  },
                  {
                    title: "Visa &amp; Mastercard",
                    sub: "Global network acceptance",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    ),
                  },
                  {
                    title: "99.99% Uptime",
                    sub: "Redundant global infrastructure",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    ),
                  },
                ].map((b) => (
                  <div className="security-badge" key={b.title}>
                    <div className="security-badge-icon">{b.icon}</div>
                    <div className="security-badge-text">
                      <div className="security-badge-title" dangerouslySetInnerHTML={{ __html: b.title }} />
                      <div className="security-badge-sub">{b.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* ─── Tech Stack ─────────────────────────────────── */}
          <ScrollReveal>
            <TechStack />
          </ScrollReveal>

          {/* ─── FAQ ────────────────────────────────────────── */}
          <ScrollReveal>
            <FAQ />
          </ScrollReveal>

          {/* ─── CTA Banner ─────────────────────────────────── */}
          <ScrollReveal>
            <section className="cta-banner">
              <div className="cta-banner-inner">
                <p className="section-eyebrow cta-eyebrow">Get started today</p>
                <h2 className="cta-banner-title">Your card is<br />two minutes away.</h2>
                <p className="cta-banner-sub">
                  Apply online, get approved in seconds. Virtual card ready instantly.<br />
                  Physical card ships in 3–5 business days. Zero annual fee.
                </p>
                <div className="cta-banner-actions">
                  <a href="/request-card" className="cta-btn-primary">Request a Card →</a>
                  <a href="#how-it-works" className="cta-btn-ghost">See how it works</a>
                </div>
              </div>
              <div className="cta-banner-glow" />
            </section>
          </ScrollReveal>

          {/* ─── Footer ─────────────────────────────────────── */}
          <footer className="footer">
            <div className="footer-top">
              <div className="footer-brand">
                <div className="footer-logo">
                  <svg viewBox="0 0 24 24" width="22" height="22">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
                  </svg>
                  <span>Aurex</span>
                </div>
                <p className="footer-tagline">The premium payment card built for the world.<br />Apply in minutes, pay anywhere, zero fees.</p>
                <div className="footer-social">
                  <a href={siteConfig.social.twitter.url} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="footer-social-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href={siteConfig.social.linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href={siteConfig.social.github.url} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="footer-social-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="footer-links">
                {Object.entries(footerLinks).map(([col, links]) => (
                  <div className="footer-col" key={col}>
                    <h4 className="footer-col-title">{col}</h4>
                    <ul className="footer-col-list">
                      {links.map((link) => (
                        <li key={link.label}>
                          <a href={link.href} className="footer-link">{link.label}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="footer-bottom">
              <span>{siteConfig.copyright}</span>
              <div className="footer-bottom-links">
                <a href="/privacy">Privacy</a>
                <a href="/terms">Terms</a>
                <a href="/privacy#cookies">Cookies</a>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}
