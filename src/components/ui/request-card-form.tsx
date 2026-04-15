"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

type CardType = "virtual" | "physical" | "both";

interface FormData {
  cardType: CardType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  employment: string;
  income: string;
  address: string;
  city: string;
  country: string;
}

type TouchedFields = Partial<Record<keyof FormData, boolean>>;

function validate(form: FormData): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  if (!form.dob) {
    errors.dob = "Date of birth is required.";
  } else {
    const age = (Date.now() - new Date(form.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18) errors.dob = "You must be at least 18 years old.";
  }
  if ((form.cardType === "physical" || form.cardType === "both") && !form.address.trim())
    errors.address = "Street address is required for physical card delivery.";
  if ((form.cardType === "physical" || form.cardType === "both") && !form.city.trim())
    errors.city = "City is required.";
  if ((form.cardType === "physical" || form.cardType === "both") && !form.country.trim())
    errors.country = "Country is required.";
  return errors;
}

const STEPS = ["Card Type", "Personal", "Financial", "Review"];

const cardTypes: { id: CardType; label: string; desc: string; badge?: string }[] = [
  { id: "virtual", label: "Virtual Card", desc: "Instant access, no shipping. Perfect for online payments.", badge: "Instant" },
  { id: "physical", label: "Physical Card", desc: "Premium metal card delivered in 3–5 business days.", badge: "Popular" },
  { id: "both", label: "Both Cards", desc: "Get a virtual card now and a physical card shipped to you.", badge: "Best Value" },
];

const employmentOptions = ["Employed", "Self-Employed", "Student", "Retired", "Other"];
const incomeOptions = ["Under $25K", "$25K – $50K", "$50K – $100K", "$100K – $200K", "$200K+"];

interface RequestCardFormProps {
  onNameChange?: (name: string) => void;
}

export function RequestCardForm({ onNameChange }: RequestCardFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [form, setForm] = useState<FormData>({
    cardType: "physical",
    firstName: "", lastName: "", email: "", phone: "", dob: "",
    employment: "", income: "", address: "", city: "", country: "",
  });

  const set = (key: keyof FormData, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    if ((key === "firstName" || key === "lastName") && onNameChange) {
      const first = key === "firstName" ? val : form.firstName;
      const last = key === "lastName" ? val : form.lastName;
      onNameChange(`${first} ${last}`.trim());
    }
  };

  const touch = (key: keyof FormData) =>
    setTouched((t) => ({ ...t, [key]: true }));

  const errors = validate(form);
  const fieldError = (key: keyof FormData) => touched[key] ? errors[key] : undefined;

  const canAdvance = () => {
    if (step === 0) return !!form.cardType;
    if (step === 1) return !!(form.firstName && form.lastName && form.email && form.phone && form.dob) && !errors.firstName && !errors.lastName && !errors.email && !errors.phone && !errors.dob && !errors.address && !errors.city && !errors.country;
    if (step === 2) return !!(form.employment && form.income);
    return true;
  };

  const touchStep1Fields = () => {
    const fields: (keyof FormData)[] = ["firstName", "lastName", "email", "phone", "dob"];
    if (form.cardType === "physical" || form.cardType === "both")
      fields.push("address", "city", "country");
    setTouched((t) => Object.fromEntries([...Object.entries(t), ...fields.map((f) => [f, true])]));
  };

  return (
    <div className="rc-form-wrap">
      {/* Step indicators */}
      <div className="rc-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`rc-step ${i === step ? "rc-step-active" : ""} ${i < step ? "rc-step-done" : ""}`}>
            <div className="rc-step-dot">
              {i < step ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className="rc-step-label">{s}</span>
          </div>
        ))}
      </div>

      {/* Step 0: Card Type */}
      {step === 0 && (
        <div className="rc-section">
          <h2 className="rc-section-title">Choose your card</h2>
          <p className="rc-section-sub">Select the card type that fits your lifestyle.</p>
          <div className="rc-card-options">
            {cardTypes.map((c) => (
              <button
                key={c.id}
                className={`rc-card-option ${form.cardType === c.id ? "rc-card-option-active" : ""}`}
                onClick={() => set("cardType", c.id)}
              >
                {c.badge && <span className="rc-card-badge">{c.badge}</span>}
                <div className="rc-card-icon">
                  {c.id === "virtual" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                      <path d="M6 15h4" />
                    </svg>
                  )}
                  {c.id === "physical" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                      <circle cx="17" cy="14" r="1.5" fill="currentColor" />
                      <path d="M6 15h4" />
                    </svg>
                  )}
                  {c.id === "both" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="1" y="7" width="18" height="12" rx="2" />
                      <rect x="5" y="4" width="18" height="12" rx="2" strokeDasharray="3 2" />
                      <path d="M1 12h18" />
                    </svg>
                  )}
                </div>
                <div className="rc-card-option-label">{c.label}</div>
                <div className="rc-card-option-desc">{c.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Personal */}
      {step === 1 && (
        <div className="rc-section">
          <h2 className="rc-section-title">Personal details</h2>
          <p className="rc-section-sub">We need this to verify your identity.</p>
          <div className="rc-fields">
            <div className="rc-row">
              <div className="rc-field">
                <label className="rc-label">First Name</label>
                <input className={`rc-input ${fieldError("firstName") ? "rc-input-error" : ""}`} placeholder="John" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} onBlur={() => touch("firstName")} />
                {fieldError("firstName") && <span className="rc-field-error">{fieldError("firstName")}</span>}
              </div>
              <div className="rc-field">
                <label className="rc-label">Last Name</label>
                <input className={`rc-input ${fieldError("lastName") ? "rc-input-error" : ""}`} placeholder="Doe" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} onBlur={() => touch("lastName")} />
                {fieldError("lastName") && <span className="rc-field-error">{fieldError("lastName")}</span>}
              </div>
            </div>
            <div className="rc-field">
              <label className="rc-label">Email Address</label>
              <input className={`rc-input ${fieldError("email") ? "rc-input-error" : ""}`} type="email" placeholder="john@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} onBlur={() => touch("email")} />
              {fieldError("email") && <span className="rc-field-error">{fieldError("email")}</span>}
            </div>
            <div className="rc-row">
              <div className="rc-field">
                <label className="rc-label">Phone Number</label>
                <input className={`rc-input ${fieldError("phone") ? "rc-input-error" : ""}`} type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => touch("phone")} />
                {fieldError("phone") && <span className="rc-field-error">{fieldError("phone")}</span>}
              </div>
              <div className="rc-field">
                <label className="rc-label">Date of Birth</label>
                <input className={`rc-input ${fieldError("dob") ? "rc-input-error" : ""}`} type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} onBlur={() => touch("dob")} />
                {fieldError("dob") && <span className="rc-field-error">{fieldError("dob")}</span>}
              </div>
            </div>
            {(form.cardType === "physical" || form.cardType === "both") && (
              <>
                <div className="rc-field">
                  <label className="rc-label">Street Address</label>
                  <input className={`rc-input ${fieldError("address") ? "rc-input-error" : ""}`} placeholder="123 Main St" value={form.address} onChange={(e) => set("address", e.target.value)} onBlur={() => touch("address")} />
                  {fieldError("address") && <span className="rc-field-error">{fieldError("address")}</span>}
                </div>
                <div className="rc-row">
                  <div className="rc-field">
                    <label className="rc-label">City</label>
                    <input className={`rc-input ${fieldError("city") ? "rc-input-error" : ""}`} placeholder="New York" value={form.city} onChange={(e) => set("city", e.target.value)} onBlur={() => touch("city")} />
                    {fieldError("city") && <span className="rc-field-error">{fieldError("city")}</span>}
                  </div>
                  <div className="rc-field">
                    <label className="rc-label">Country</label>
                    <input className={`rc-input ${fieldError("country") ? "rc-input-error" : ""}`} placeholder="United States" value={form.country} onChange={(e) => set("country", e.target.value)} onBlur={() => touch("country")} />
                    {fieldError("country") && <span className="rc-field-error">{fieldError("country")}</span>}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Financial */}
      {step === 2 && (
        <div className="rc-section">
          <h2 className="rc-section-title">Financial details</h2>
          <p className="rc-section-sub">Used only for credit assessment. Your data is encrypted and never sold.</p>
          <div className="rc-fields">
            <div className="rc-field">
              <label className="rc-label">Employment Status</label>
              <div className="rc-chip-group">
                {employmentOptions.map((o) => (
                  <button key={o} className={`rc-chip ${form.employment === o ? "rc-chip-active" : ""}`} onClick={() => set("employment", o)}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div className="rc-field">
              <label className="rc-label">Annual Income</label>
              <div className="rc-chip-group">
                {incomeOptions.map((o) => (
                  <button key={o} className={`rc-chip ${form.income === o ? "rc-chip-active" : ""}`} onClick={() => set("income", o)}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="rc-section">
          <h2 className="rc-section-title">Review your application</h2>
          <p className="rc-section-sub">Everything look good? Submit to get an instant decision.</p>
          <div className="rc-review">
            <div className="rc-review-group">
              <div className="rc-review-row"><span>Card Type</span><strong>{cardTypes.find(c => c.id === form.cardType)?.label}</strong></div>
            </div>
            <div className="rc-review-group">
              <div className="rc-review-row"><span>Name</span><strong>{form.firstName} {form.lastName}</strong></div>
              <div className="rc-review-row"><span>Email</span><strong>{form.email}</strong></div>
              <div className="rc-review-row"><span>Phone</span><strong>{form.phone}</strong></div>
              <div className="rc-review-row"><span>Date of Birth</span><strong>{form.dob}</strong></div>
              {form.address && <div className="rc-review-row"><span>Address</span><strong>{form.address}, {form.city}, {form.country}</strong></div>}
            </div>
            <div className="rc-review-group">
              <div className="rc-review-row"><span>Employment</span><strong>{form.employment}</strong></div>
              <div className="rc-review-row"><span>Annual Income</span><strong>{form.income}</strong></div>
            </div>
          </div>
          <p className="rc-disclaimer">
            By submitting, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. A soft credit check may be performed.
          </p>
        </div>
      )}

      {error && (
        <p style={{ fontSize: "0.85rem", color: "var(--ui-accent)", background: "rgba(99,102,241,0.08)", padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid rgba(99,102,241,0.2)" }}>
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="rc-nav">
        {step > 0 && (
          <button className="rc-btn-back" onClick={() => setStep(step - 1)}>← Back</button>
        )}
        {step < 3 ? (
          <button
            className={`btn-primary-solid rc-btn-next ${!canAdvance() ? "rc-btn-disabled" : ""}`}
            onClick={() => {
              if (step === 1) touchStep1Fields();
              if (canAdvance()) setStep(step + 1);
            }}
            disabled={false}
          >
            Continue →
          </button>
        ) : (
          <button
            className={`btn-primary-solid rc-btn-next ${loading ? "rc-btn-disabled" : ""}`}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                const res = await fetch("/api/request-card", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(form),
                });
                if (!res.ok) {
                  const data = await res.json().catch(() => ({}));
                  if (res.status === 429) {
                    const msg = "Too many applications. Please wait a minute and try again.";
                    setError(msg);
                    toast(msg, "error");
                  } else {
                    const msg = data.error ?? "Something went wrong. Please try again.";
                    setError(msg);
                    toast(msg, "error");
                  }
                  return;
                }
                const data = await res.json();
                const refId = data.referenceId;
                localStorage.setItem("aurex_application", JSON.stringify({
                  referenceId: refId,
                  submittedAt: new Date().toISOString(),
                  firstName: form.firstName,
                  lastName: form.lastName,
                  email: form.email,
                  cardType: form.cardType,
                }));
                toast("Application submitted! Redirecting…", "success");
                router.push("/status");
              } catch {
                const msg = "Something went wrong. Please try again.";
                setError(msg);
                toast(msg, "error");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        )}
      </div>
    </div>
  );
}
