"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ChromeButton } from "@/components/ui/ChromeButton";
import { inputClass } from "@/components/contact/styles";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InvestorPortal() {
  // Sign-in (existing investors)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Notify-me (prospective investors)
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(loginEmail.trim())) {
      setLoginError("Please enter a valid email address.");
      return;
    }
    // One neutral message for every failure — never distinguishes an
    // unknown email from a wrong password (no investor-list enumeration).
    setLoginError("Those credentials don't match our records.");
  }

  async function handleNotifySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "investor",
          email: trimmed,
          note: "Interested in joining Volumes as an investor",
          company_website: honeypot,
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
        {/* Vault backdrop — still, near-black, filmic */}
        <div
          aria-hidden
          className="film-grain pointer-events-none absolute inset-0 opacity-[0.05]"
        />

        <Link
          href="/"
          className="focus-ring absolute left-6 top-6 z-10 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-ink-primary sm:left-10 sm:top-8"
        >
          <span className="chrome-underline">← Volumes</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex w-full max-w-sm flex-col items-center text-center"
        >
          <Image
            src="/volumes-mark-clean.png"
            alt=""
            aria-hidden
            width={416}
            height={504}
            priority
            unoptimized
            className="w-24 [filter:drop-shadow(0_0_24px_rgba(228,233,240,0.3))]"
          />

          <h1 className="mt-8 text-xl font-semibold text-ink-primary">
            Investor Access
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Welcome back. Sign in to your Volumes investor portal.
          </p>

          {/* ——— Sign-in for existing investors ——— */}
          <form onSubmit={handleSignIn} noValidate className="mt-8 w-full">
            <label htmlFor="investor-login-email" className="sr-only">
              Email
            </label>
            <input
              id="investor-login-email"
              type="email"
              autoComplete="email"
              value={loginEmail}
              onChange={(event) => {
                setLoginEmail(event.target.value);
                if (loginError) setLoginError("");
              }}
              placeholder="Email"
              aria-invalid={loginError ? true : undefined}
              aria-describedby={
                loginError ? "investor-login-error" : undefined
              }
              className={inputClass}
            />
            <label htmlFor="investor-login-password" className="sr-only">
              Password
            </label>
            <input
              id="investor-login-password"
              type="password"
              autoComplete="current-password"
              value={loginPassword}
              onChange={(event) => {
                setLoginPassword(event.target.value);
                if (loginError) setLoginError("");
              }}
              placeholder="Password"
              className={`${inputClass} mt-3`}
            />
            {loginError && (
              <p
                id="investor-login-error"
                aria-live="polite"
                className="mt-2 text-left text-xs text-warning"
              >
                {loginError}
              </p>
            )}
            <ChromeButton type="submit" className="mt-5 w-full py-3.5">
              Sign In
            </ChromeButton>
          </form>

          {/* ——— Prospective investors — deliberately understated ——— */}
          <div className="mt-10 w-full border-t border-white/10 pt-6">
            <p className="text-sm text-ink-body">
              Volumes is not currently accepting new investors. Leave your
              email to be notified when that changes.
            </p>

            {done ? (
              <p role="status" className="mt-6 text-sm text-ink-body">
                You&apos;re on the list. We&apos;ll be in touch when that
                changes.
              </p>
            ) : (
              <form
                onSubmit={handleNotifySubmit}
                noValidate
                className="mt-5 w-full"
              >
                <label htmlFor="investor-notify-email" className="sr-only">
                  Your email
                </label>
                <input
                  id="investor-notify-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Your email"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={
                    error ? "investor-notify-error" : undefined
                  }
                  className={inputClass}
                />

                {/* Honeypot — hidden from real users; bots that fill it are dropped */}
                <input
                  type="text"
                  name="company_website"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                  className="sr-only"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {error && (
                  <p
                    id="investor-notify-error"
                    aria-live="polite"
                    className="mt-2 text-left text-xs text-warning"
                  >
                    {error}
                  </p>
                )}

                <div className="mt-4 flex justify-end">
                  <ChromeButton type="submit" disabled={busy}>
                    {busy ? "Sending…" : "Notify me"}
                  </ChromeButton>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </main>
    </MotionConfig>
  );
}
