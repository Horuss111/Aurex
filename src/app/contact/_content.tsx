"use client";

import { useState } from "react";
import { GlassNavbar } from "@/components/ui/glass-navbar";
import { NavClient } from "@/components/ui/nav-client";
import { useToast } from "@/components/ui/toast";
import { siteConfig } from "@/lib/config";

const contactInfo = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: "Live Support",
    value: "WhatsApp",
    href: siteConfig.contact.whatsapp,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Phone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
  },
];

export function ContactContent() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast("Please fill in all required fields.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "Failed to send. Please try again.", "error");
      } else {
        setSent(true);
        toast("Message sent! We'll get back to you soon.", "success");
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-nav-wrap">
        <GlassNavbar><NavClient /></GlassNavbar>
      </div>

      <div className="contact-page">
        {/* ── Left — info ──────────────────────────────── */}
        <div className="contact-left">
          <p className="admin-eyebrow">Get in Touch</p>
          <h1 className="contact-title">We&apos;d love<br />to hear from you.</h1>
          <p className="contact-sub">
            Questions about your card, feedback, press enquiries — whatever it is,
            drop us a message and we&apos;ll respond within one business day.
          </p>

          <div className="contact-info-list">
            {contactInfo.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="contact-info-item"
              >
                <div className="contact-info-icon">{item.icon}</div>
                <div>
                  <div className="contact-info-label">{item.label}</div>
                  <div className="contact-info-value">{item.value}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="contact-hours">
            <p className="contact-hours-title">Support hours</p>
            <p className="contact-hours-text">Monday – Friday, 9am – 6pm GMT</p>
            <p className="contact-hours-text">Weekend support via WhatsApp</p>
          </div>
        </div>

        {/* ── Right — form ─────────────────────────────── */}
        <div className="contact-right">
          {sent ? (
            <div className="contact-sent">
              <div className="contact-sent-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="contact-sent-title">Message sent!</h2>
              <p className="contact-sent-desc">
                We&apos;ll get back to you within one business day.
              </p>
              <button
                className="btn-primary-solid"
                style={{ marginTop: "1.5rem" }}
                onClick={() => setSent(false)}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-form-row">
                <div className="rc-field">
                  <label className="rc-label">Name <span className="contact-required">*</span></label>
                  <input
                    className="rc-input"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </div>
                <div className="rc-field">
                  <label className="rc-label">Email <span className="contact-required">*</span></label>
                  <input
                    className="rc-input"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>
              </div>
              <div className="rc-field">
                <label className="rc-label">Subject</label>
                <input
                  className="rc-input"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                />
              </div>
              <div className="rc-field">
                <label className="rc-label">Message <span className="contact-required">*</span></label>
                <textarea
                  className="rc-input contact-textarea"
                  placeholder="Tell us how we can help…"
                  rows={6}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                />
              </div>
              <button
                type="submit"
                className={`btn-primary-solid contact-submit ${loading ? "rc-btn-disabled" : ""}`}
                disabled={loading}
              >
                {loading ? "Sending…" : "Send Message →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
