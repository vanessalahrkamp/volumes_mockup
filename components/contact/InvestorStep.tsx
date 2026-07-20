"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { buildMailto } from "@/lib/buildMailto";
import { ChromeButton } from "@/components/ui/ChromeButton";
import { inputClass } from "./styles";

export function InvestorStep({ onClose }: { onClose: () => void }) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [email, setEmail] = useState("");
  const [mailtoHref, setMailtoHref] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const href = buildMailto({
      role: "Investor",
      name: "Investor lead",
      email,
      investorLead: true,
    });
    setMailtoHref(href);
    setSubmitted(true);
  }

  return (
    <div>
      <h2
        id="contact-modal-title"
        className="text-xl font-semibold text-ink-primary"
      >
        Investor access
      </h2>

      <button
        type="button"
        onClick={() => setShowComingSoon(true)}
        className="focus-ring group mt-6 flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3.5 text-left font-body text-ink-body transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.05] hover:text-ink-primary"
      >
        Investor login
        <span
          aria-hidden
          className="text-ink-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-ink-primary"
        >
          →
        </span>
      </button>
      {showComingSoon && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted"
        >
          Coming soon.
        </motion.p>
      )}

      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="text-sm text-ink-body">
          Not an investor yet? Contact Volumes to become one.
        </p>
        <p className="mt-2 text-xs text-warning">
          * Volumes, Inc. is not currently accepting new investors. Leave
          your email to be notified.
        </p>

        {submitted ? (
          <div className="mt-4">
            <ChromeButton href={mailtoHref}>
              Open email
              <span aria-hidden>→</span>
            </ChromeButton>
            <button
              type="button"
              onClick={onClose}
              className="chrome-underline focus-ring mt-4 block cursor-pointer text-sm text-ink-muted transition-colors hover:text-ink-primary"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <label htmlFor="investor-email" className="sr-only">
              Email
            </label>
            <input
              id="investor-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className={inputClass}
            />
            <div className="flex items-center justify-end">
              <ChromeButton type="submit">
                Notify me
                <span aria-hidden>→</span>
              </ChromeButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
