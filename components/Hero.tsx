"use client";

import Image from "next/image";
import { HeroVideo } from "./HeroVideo";
import type { InquiryRole } from "@/lib/buildMailto";

const ROLES: InquiryRole[] = ["Buyer", "Seller", "Investor"];

export function Hero({
  infoOpen,
  onSelectRole,
  onGoHome,
}: {
  infoOpen: boolean;
  onSelectRole: (role: InquiryRole) => void;
  onGoHome: () => void;
}) {
  return (
    <section className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      <HeroVideo />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 42% 38% at 50% 40%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.08) 60%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0.42) 100%)",
        }}
      />

      {/*
        This wrapper's size is driven only by the logo, since the info
        overlay below is `absolute` and removed from flow. That keeps the
        logo perfectly still when the overlay opens/closes.
      */}
      <div className="relative z-10 flex flex-col items-center">
        <h1>
          <Image
            src="/volumes-lockup.png"
            alt="Volumes"
            width={1600}
            height={847}
            priority
            className="w-72 sm:w-[420px] md:w-[520px]"
          />
        </h1>

        {infoOpen && (
          <div className="absolute top-full mt-6 flex w-[calc(100vw-3rem)] max-w-md flex-col items-center gap-5 sm:mt-8">
            <p className="font-mono text-sm uppercase tracking-[0.25em] text-ink-body sm:text-base">
              Data for Physical AI
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={(event) => {
                    // Clicking a button doesn't reliably focus it in every
                    // browser (notably Safari), and ContactModal restores
                    // focus here on close — force it so restore has a target.
                    event.currentTarget.focus();
                    onSelectRole(role);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:border-accent hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {role}
                </button>
              ))}
            </div>

            <p className="max-w-xs text-sm text-ink-muted">
              Volumes buys and sells data for physical AI.
            </p>

            <button
              type="button"
              onClick={onGoHome}
              className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted underline decoration-ink-muted/40 underline-offset-4 transition-colors hover:text-ink-primary hover:decoration-ink-primary"
            >
              Home
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
