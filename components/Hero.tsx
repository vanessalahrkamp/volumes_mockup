"use client";

import Image from "next/image";
import { HeroVideo } from "./HeroVideo";

export function Hero({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <section className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center">
      <HeroVideo />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 42%, var(--color-glow-inner) 0%, var(--color-glow-outer) 45%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 45%, transparent 55%, var(--color-ground) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/volumes-mark.png"
          alt="Volumes"
          width={88}
          height={88}
          priority
          className="h-16 w-16 sm:h-20 sm:w-20"
        />
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-accent-teal">
          Volumes
        </p>

        <h1 className="mt-8 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink-primary sm:text-5xl md:text-6xl">
          Data for Physical AI
        </h1>
        <p className="mt-5 max-w-xl text-base text-ink-body sm:text-lg">
          Volumes buys and sells data for physical AI.
        </p>

        <button
          type="button"
          onClick={(event) => {
            // Clicking a button doesn't reliably focus it in every browser
            // (notably Safari), and ContactModal restores focus here on
            // close — force it so that restore always has something to land on.
            event.currentTarget.focus();
            onOpenContact();
          }}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-accent-teal/40 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-teal transition-colors hover:border-accent-teal hover:bg-accent-teal/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
        >
          Contact Volumes
          <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}
