"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function AnimatedHero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Instant", "Borderless", "Secure", "Zero-fee", "Yours"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((n) => (n === titles.length - 1 ? 0 : n + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="w-full py-24 lg:py-36 flex flex-col items-center gap-8 text-center">

      {/* Badge */}
      <span className="eyebrow">
        <span className="eyebrow-line" />
        Trusted by 500K+ cardholders
        <span className="eyebrow-line" />
      </span>

      {/* Headline */}
      <div className="flex flex-col gap-4 items-center w-full">
        <h2 className="section-title" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.05 }}>
          <span className="block">Payments that are</span>
          <span className="relative flex w-full justify-center overflow-hidden text-center pb-2 pt-1 h-[1.2em]">
            &nbsp;
            {titles.map((title, index) => (
              <motion.span
                key={index}
                className="absolute font-semibold"
                style={{ color: "var(--text-primary)" }}
                initial={{ opacity: 0, y: 80 }}
                transition={{ type: "spring", stiffness: 60, damping: 18 }}
                animate={
                  titleNumber === index
                    ? { y: 0, opacity: 1 }
                    : { y: titleNumber > index ? -80 : 80, opacity: 0 }
                }
              >
                {title}
              </motion.span>
            ))}
          </span>
        </h2>

        <p className="hero-subtitle" style={{ textAlign: "center", maxWidth: 480 }}>
          One card. 150+ countries. Real exchange rates with zero markup.
          Approved in seconds — physical card at your door in 3–5 days.
        </p>
      </div>

      {/* CTAs */}
      <div className="hero-actions" style={{ justifyContent: "center" }}>
        <a href="/request-card" className="btn-primary-solid">Request a Card</a>
        <a href="#how-it-works" className="btn-secondary">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
          </svg>
          How it works
        </a>
      </div>

    </section>
  );
}

export { AnimatedHero };
