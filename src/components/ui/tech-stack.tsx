"use client";

const stack = [
  {
    name: "Supabase",
    role: "Database & Storage",
    desc: "PostgreSQL database with real-time capabilities. Stores all card applications, user data, and application state with row-level security.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.33 12.59.722 13.4 1.424 13.4h6.689l-.006 9.564c.015.986 1.26 1.41 1.874.637l9.262-11.652c.434-.54.042-1.35-.66-1.35H12.58z" />
      </svg>
    ),
    color: "#3ECF8E",
  },
  {
    name: "Clerk",
    role: "Authentication",
    desc: "Handles user sign-up, sign-in, and session management. Secure JWT-based auth that protects the dashboard and admin panel.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M21.47 20.829a.914.914 0 0 1-.458-.123l-2.439-1.426a.914.914 0 0 1-.152-1.455c.822-.73 1.29-1.754 1.29-2.825 0-2.12-1.732-3.85-3.849-3.85-.483 0-.952.09-1.394.254a.913.913 0 0 1-1.114-.42L11.77 8.53a.914.914 0 0 1 .308-1.24 8.614 8.614 0 0 1 4.335-1.166c4.775 0 8.657 3.882 8.657 8.657a8.633 8.633 0 0 1-2.735 6.337.915.915 0 0 1-.865.71zM2.53 20.83a.915.915 0 0 1-.864-.71 8.626 8.626 0 0 1-.542-3.04C1.124 12.305 5.006 8.423 9.78 8.423c.273 0 .548.01.82.032a.913.913 0 0 1 .825 1.042l-.413 2.895a.914.914 0 0 1-.967.786 3.877 3.877 0 0 0-.265-.009c-2.117 0-3.849 1.73-3.849 3.85 0 1.07.468 2.094 1.29 2.824a.913.913 0 0 1-.152 1.456L4.63 22.725a.913.913 0 0 1-.457.123h-.002c-.551 0-1-.448-1-1v-.018z" />
      </svg>
    ),
    color: "#7C3AED",
  },
  {
    name: "Resend",
    role: "Transactional Email",
    desc: "Sends application confirmation emails, admin notifications, and support ticket alerts. Reliable delivery with HTML email templates.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M3.75 0h16.5A3.75 3.75 0 0 1 24 3.75v16.5A3.75 3.75 0 0 1 20.25 24H3.75A3.75 3.75 0 0 1 0 20.25V3.75A3.75 3.75 0 0 1 3.75 0zm4.876 16.917H5.78V7.083h5.26c2.613 0 4.093 1.274 4.093 3.49 0 1.562-.808 2.7-2.195 3.21l2.634 3.134H12.6l-2.36-2.858h-1.62v2.858h.005zm0-4.874h2.237c1.462 0 2.213-.597 2.213-1.78 0-1.16-.75-1.7-2.213-1.7H8.626v3.48z" />
      </svg>
    ),
    color: "#000000",
  },
  {
    name: "Vercel",
    role: "Hosting & Edge Network",
    desc: "Deploys the Next.js application globally with edge functions, automatic CI/CD, and 99.99% uptime across Vercel's infrastructure.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M24 22.525H0l12-21.05z" />
      </svg>
    ),
    color: "#000000",
  },
  {
    name: "Next.js",
    role: "Application Framework",
    desc: "Full-stack React framework powering both the frontend UI and backend API routes — server-side rendering, routing, and middleware in one.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474.0001.9138.0118 1.085.1189 1.7834 1.0768 7.44 7.4800 13.0014 14.9858 13.0014 7.5142 0 13.9209-5.566 14.9907-13.0099.1069-.6976.1186-.8723.1186-1.7813 0-.9039-.0118-1.0791-.1186-1.7742C20.9178 2.5757 14.519-3.0000e-05 11.5725 0zm4.8044 5.1997l-4.8044 7.7006-4.9998-7.7006c.3285-.047.6716-.0756 1.0277-.0756h7.7487c.3628 0 .7136.0292 1.0278.0756z" />
      </svg>
    ),
    color: "#000000",
  },
];

export function TechStack() {
  return (
    <section className="tech-stack-section" id="tech-stack">
      <div className="section-header">
        <p className="section-eyebrow">Infrastructure</p>
        <h2 className="section-title">Powered by<br />industry-leading services</h2>
        <p className="tech-stack-subtitle">
          Aurex is built on a modern, battle-tested stack. Every layer is chosen for reliability, security, and scale.
        </p>
      </div>
      <div className="tech-stack-grid">
        {stack.map((item) => (
          <div className="tech-stack-card" key={item.name}>
            <div className="tech-stack-icon" style={{ color: item.color === "#000000" ? "var(--text-primary)" : item.color }}>
              {item.icon}
            </div>
            <div className="tech-stack-info">
              <div className="tech-stack-header">
                <span className="tech-stack-name">{item.name}</span>
                <span className="tech-stack-role">{item.role}</span>
              </div>
              <p className="tech-stack-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
