"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserButton, useUser } from "@clerk/nextjs";

const WHATSAPP_URL = "https://wa.me/201006741810";

const services = [
  { icon: "⚡", label: "Instant Transfers", desc: "Send globally in seconds", href: "#features" },
  { icon: "💱", label: "Currency Exchange", desc: "150+ currencies at interbank rates", href: "#features" },
  { icon: "🧠", label: "AI Insights", desc: "Smart spending predictions", href: "#features" },
  { icon: "🔒", label: "Secure Vault", desc: "Bank-grade encryption", href: "#features" },
];

// ─── Searchable content ──────────────────────────────────────────────────────
const SEARCH_ITEMS = [
  // Sections
  { type: "Section", label: "Home", desc: "Back to the top", href: "#hero" },
  { type: "Section", label: "Features", desc: "Everything in one card", href: "#features" },
  { type: "Section", label: "How it Works", desc: "Three steps to your card", href: "#how-it-works" },
  { type: "Section", label: "Pricing", desc: "Zero fees, always", href: "#pricing" },
  { type: "Section", label: "Testimonials", desc: "What cardholders say", href: "#testimonials" },
  { type: "Section", label: "FAQ", desc: "Common questions answered", href: "#faq" },
  { type: "Section", label: "Request a Card", desc: "Apply in minutes", href: "/request-card" },
  // FAQ
  { type: "FAQ", label: "Is there an annual fee?", desc: "Zero annual fees, always.", href: "#faq" },
  { type: "FAQ", label: "Will applying affect my credit score?", desc: "Soft check only — no impact.", href: "#faq" },
  { type: "FAQ", label: "How quickly will I get a decision?", desc: "Seconds, not days.", href: "#faq" },
  { type: "FAQ", label: "Can I use Aurex internationally?", desc: "150+ countries, real exchange rate.", href: "#faq" },
  { type: "FAQ", label: "How is my card secured?", desc: "PCI-DSS Level 1, 256-bit AES.", href: "#faq" },
  { type: "FAQ", label: "When does my physical card arrive?", desc: "3–5 business days.", href: "#faq" },
  // Features
  { type: "Feature", label: "Aurex Card", desc: "Physical and virtual, worldwide.", href: "#features" },
  { type: "Feature", label: "256-bit Encryption", desc: "Bank-grade security.", href: "#features" },
  { type: "Feature", label: "AI Spend Insights", desc: "Real-time smart alerts.", href: "#features" },
  { type: "Feature", label: "Multi-currency Payments", desc: "150+ currencies at interbank rates.", href: "#features" },
  { type: "Feature", label: "Zero Hidden Fees", desc: "No surprises, ever.", href: "#features" },
  { type: "Feature", label: "24/7 Card Support", desc: "Freeze or dispute instantly.", href: "#features" },
  // Contact
  { type: "Contact", label: "Contact us on WhatsApp", desc: "+20 100 674 1810", href: WHATSAPP_URL },
];

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_ITEMS.slice(0, 8);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setCursor(0); }, [query]);

  const navigate = useCallback(
    (href: string) => {
      onClose();
      if (href.startsWith("http") || href.startsWith("/")) {
        window.location.href = href;
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [onClose]
  );

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    if (e.key === "Enter" && results[cursor]) navigate(results[cursor].href);
    if (e.key === "Escape") onClose();
  };

  const typeColors: Record<string, string> = {
    Section: "search-tag-section",
    FAQ: "search-tag-faq",
    Feature: "search-tag-feature",
    Contact: "search-tag-contact",
  };

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Search">
        <div className="search-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search pages, features, FAQ…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            autoComplete="off"
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery("")} aria-label="Clear">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="search-results">
          {results.length === 0 ? (
            <div className="search-empty">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            <>
              {!query && <p className="search-hint">Suggestions</p>}
              {results.map((item, i) => (
                <button
                  key={`${item.type}-${item.label}`}
                  className={`search-result ${i === cursor ? "search-result-active" : ""}`}
                  onClick={() => navigate(item.href)}
                  onMouseEnter={() => setCursor(i)}
                >
                  <span className={`search-tag ${typeColors[item.type] ?? ""}`}>{item.type}</span>
                  <div className="search-result-text">
                    <span className="search-result-label">{item.label}</span>
                    <span className="search-result-desc">{item.desc}</span>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-result-arrow">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              ))}
            </>
          )}
        </div>

        <div className="search-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

export function NavClient() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hasApplication, setHasApplication] = useState(false);
  const { isSignedIn } = useUser();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasApplication(!!localStorage.getItem("aurex_application"));
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = () => { if (window.innerWidth > 1024) setMobileOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen]);

  return (
    <>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

      <nav className="navbar">
        {/* Left — nav links */}
        <div className="nav-links">
          <a href="/">Home</a>

          <div ref={dropdownRef} className="nav-dropdown-wrap">
            <button
              className="nav-dropdown-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
            >
              Service
              <svg className={`dropdown-chevron ${dropdownOpen ? "open" : ""}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="nav-dropdown">
                {services.map((s) => (
                  <a href={s.href} key={s.label} className="nav-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="nav-dropdown-icon">{s.icon}</span>
                    <div>
                      <div className="nav-dropdown-label">{s.label}</div>
                      <div className="nav-dropdown-desc">{s.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="#features">Exchange</a>
          <a href="#testimonials">Community</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>

        {/* Center — logo */}
        <div className="nav-logo">
          <svg viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
          </svg>
          <a href="/" style={{ color: "inherit" }}>Aurex</a>
        </div>

        {/* Right — actions */}
        <div className="nav-actions">
          <div
            className="search-area"
            role="button"
            tabIndex={0}
            onClick={() => setSearchOpen(true)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSearchOpen(true); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Search</span>
            <kbd className="search-kbd">⌘K</kbd>
          </div>

          {!isSignedIn ? (
            <a href="/sign-in" className="nav-sign-in">Sign in</a>
          ) : (
            <a href="/dashboard" className="nav-dashboard-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              Dashboard
              {hasApplication && <span className="nav-dashboard-dot" />}
            </a>
          )}

          <a href="/request-card" className="btn-get">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            Request a Card
          </a>

          {isSignedIn && <UserButton />}

          <ThemeToggle />

          <button
            className={`hamburger ${mobileOpen ? "hamburger-open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
      <div className={`mobile-menu ${mobileOpen ? "mobile-menu-open" : ""}`}>
        <div className="mobile-menu-inner">
          <a href="/" className="mobile-link" onClick={() => setMobileOpen(false)}>Home</a>
          <div className="mobile-divider" />
          <p className="mobile-section-label">Services</p>
          {services.map((s) => (
            <a href={s.href} key={s.label} className="mobile-link mobile-service-link" onClick={() => setMobileOpen(false)}>
              <span className="mobile-service-icon">{s.icon}</span>
              <div>
                <div>{s.label}</div>
                <div className="mobile-service-desc">{s.desc}</div>
              </div>
            </a>
          ))}
          <div className="mobile-divider" />
          <a href="#features" className="mobile-link" onClick={() => setMobileOpen(false)}>Exchange</a>
          <a href="#testimonials" className="mobile-link" onClick={() => setMobileOpen(false)}>Community</a>
          <a href="/about" className="mobile-link" onClick={() => setMobileOpen(false)}>About</a>
          <a href="/contact" className="mobile-link" onClick={() => setMobileOpen(false)}>Contact</a>
          {isSignedIn && (
            <a href="/dashboard" className="mobile-link" onClick={() => setMobileOpen(false)}>
              Dashboard
            </a>
          )}
          {hasApplication && (
            <a href="/status" className="mobile-link" onClick={() => setMobileOpen(false)}>
              My Application
            </a>
          )}
          <div className="mobile-divider" />
          <button
            className="mobile-link"
            style={{ background: "none", border: "none", fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit", cursor: "pointer", textAlign: "left", padding: "0.85rem 0.5rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}
            onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search
          </button>
          <div className="mobile-divider" />
          <div className="mobile-cta-row">
            {isSignedIn ? (
              <UserButton />
            ) : (
              <a href="/sign-in" className="btn-primary-solid mobile-cta-btn" onClick={() => setMobileOpen(false)}>Sign in</a>
            )}
            <a href="/request-card" className="btn-primary-solid mobile-cta-btn" onClick={() => setMobileOpen(false)}>Request a Card</a>
          </div>
        </div>
      </div>
    </>
  );
}
