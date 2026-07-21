"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChromeButton } from "@/components/ui/ChromeButton";
import { inputClass } from "./styles";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InvestorStep() {
  // Sign-in flow
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");

  // Request-access disclosure
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestEmail, setRequestEmail] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requestDone, setRequestDone] = useState(false);
  const [requestBusy, setRequestBusy] = useState(false);

  function handleSignInSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");

    // One neutral message for every failure — never distinguishes an
    // unknown email from a wrong password (no investor-list enumeration).
    setSignInError("Those credentials don't match our records.");
  }

  async function handleRequestSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = requestEmail.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setRequestError("Please enter a valid email address.");
      return;
    }
    setRequestError("");
    setRequestBusy(true);
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) throw new Error();
      setRequestDone(true);
    } catch {
      setRequestError("Something went wrong. Please try again.");
    } finally {
      setRequestBusy(false);
    }
  }

  return (
    <div>
      {/* ——— Investor Access ——— */}
      <h2
        id="contact-modal-title"
        className="text-xl font-semibold text-ink-primary"
      >
        Investor Access
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Welcome back. Sign in to your Volumes investor portal.
      </p>

      <form onSubmit={handleSignInSubmit} noValidate className="mt-8">
        <label htmlFor="investor-email" className="sr-only">
          Email
        </label>
        <input
          id="investor-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (emailError) setEmailError("");
          }}
          placeholder="Email"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "investor-email-error" : undefined}
          className={inputClass}
        />
        {emailError && (
          <p
            id="investor-email-error"
            aria-live="polite"
            className="mt-2 text-xs text-warning"
          >
            {emailError}
          </p>
        )}

        <div className="pt-4">
          <label htmlFor="investor-password" className="sr-only">
            Password
          </label>
          <input
            id="investor-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (signInError) setSignInError("");
            }}
            placeholder="Password"
            aria-invalid={signInError ? true : undefined}
            aria-describedby={
              signInError ? "investor-signin-error" : undefined
            }
            className={inputClass}
          />
          {signInError && (
            <p
              id="investor-signin-error"
              aria-live="polite"
              className="mt-2 text-xs text-warning"
            >
              {signInError}
            </p>
          )}
        </div>

        <ChromeButton type="submit" className="mt-6 w-full py-3.5">
          Sign In
        </ChromeButton>
      </form>

      {/* ——— Prospective investors — deliberately understated ——— */}
      <div className="mt-10 border-t border-white/10 pt-5">
        <p className="text-xs text-ink-muted">
          Not an investor yet?{" "}
          <button
            type="button"
            onClick={() => setRequestOpen((open) => !open)}
            aria-expanded={requestOpen}
            aria-controls="request-access-panel"
            className="chrome-underline focus-ring cursor-pointer text-ink-body transition-colors hover:text-ink-primary"
          >
            Request access
          </button>
        </p>

        <AnimatePresence initial={false}>
          {requestOpen && (
            <motion.div
              key="request"
              id="request-access-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              {requestDone ? (
                <div className="pt-5" role="status">
                  <p className="text-sm text-ink-body">
                    Volumes isn&apos;t accepting new investors at this time.
                    We&apos;ll be in touch if that changes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} noValidate className="pt-5">
                  <label htmlFor="request-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="request-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={requestEmail}
                    onChange={(event) => {
                      setRequestEmail(event.target.value);
                      if (requestError) setRequestError("");
                    }}
                    placeholder="Your email"
                    aria-invalid={requestError ? true : undefined}
                    aria-describedby={
                      requestError ? "request-email-error" : undefined
                    }
                    className={inputClass}
                  />
                  {requestEmail.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="mt-2 text-xs text-warning"
                    >
                      * Volumes is not currently accepting new investors,
                      but you can leave your email to be notified.
                    </motion.p>
                  )}
                  {requestError && (
                    <p
                      id="request-email-error"
                      aria-live="polite"
                      className="mt-2 text-xs text-warning"
                    >
                      {requestError}
                    </p>
                  )}
                  <div className="mt-3 flex justify-end">
                    <ChromeButton type="submit" disabled={requestBusy}>
                      Request access
                    </ChromeButton>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
