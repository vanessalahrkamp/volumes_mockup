"use client";

import { useState } from "react";
import { buildMailto } from "@/lib/buildMailto";

export function InvestorStep({
  onBack,
  onClose,
}: {
  onBack: () => void;
  onClose: () => void;
}) {
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
        className="font-display text-xl font-semibold text-ink-primary"
      >
        Investor access
      </h2>

      <button
        type="button"
        onClick={() => setShowComingSoon(true)}
        className="mt-6 w-full rounded-lg border border-white/10 px-4 py-3 text-left font-body text-ink-body transition-colors hover:border-accent-teal/50 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
      >
        Investor login
      </button>
      {showComingSoon && (
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
          Coming soon.
        </p>
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
            <a
              href={mailtoHref}
              className="inline-flex items-center gap-2 rounded-full border border-accent-teal/40 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-accent-teal transition-colors hover:border-accent-teal hover:bg-accent-teal/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
            >
              Open email
              <span aria-hidden>→</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 block text-sm text-ink-muted underline decoration-ink-muted/40 underline-offset-4 hover:text-ink-primary"
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
              className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:border-accent-teal/60 focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-ink-muted underline decoration-ink-muted/40 underline-offset-4 hover:text-ink-primary"
              >
                Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-accent-teal/40 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-accent-teal transition-colors hover:border-accent-teal hover:bg-accent-teal/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
              >
                Notify me
                <span aria-hidden>→</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
