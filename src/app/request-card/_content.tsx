"use client";

import { useState } from "react";
import { RequestCardForm } from "@/components/ui/request-card-form";
import { GlassNavbar } from "@/components/ui/glass-navbar";
import { NavClient } from "@/components/ui/nav-client";

export function RequestCardContent() {
  const [cardName, setCardName] = useState("");
  const displayName = cardName.trim() || "Your Name";

  return (
    <>
      <div className="rc-nav-wrap">
        <GlassNavbar><NavClient /></GlassNavbar>
      </div>

      <div className="rc-page">
        {/* ── Left — card showcase ───────────────────────────── */}
        <div className="rc-left">
          <div className="rc-left-inner">
            <p className="rc-left-eyebrow">
              <span className="eyebrow-line" />
              Premium Payment Card
              <span className="eyebrow-line" />
            </p>
            <h1 className="rc-left-title">Your card.<br />Your world.</h1>
            <p className="rc-left-sub">
              Apply in minutes. Approved in seconds.<br />
              Pay anywhere with zero foreign fees.
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
                    <div
                      className="rc-card-meta-value"
                      style={{
                        transition: "opacity 0.2s ease",
                        opacity: cardName.trim() ? 1 : 0.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {displayName}
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

            <div className="rc-left-perks">
              {[
                { icon: "⚡", text: "Instant virtual card on approval" },
                { icon: "🌍", text: "Accepted in 150+ countries" },
                { icon: "✦",  text: "Zero annual & foreign fees" },
              ].map((p) => (
                <div key={p.text} className="rc-perk">
                  <span className="rc-perk-icon">{p.icon}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right — form ──────────────────────────────────── */}
        <div className="rc-right">
          <RequestCardForm onNameChange={setCardName} />
        </div>
      </div>
    </>
  );
}
