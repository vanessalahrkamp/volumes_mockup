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
        <p className="mt-2 max-w-2xl font-display text-2xl font-medium tracking-tight text-ink-body sm:text-3xl md:text-4xl">
          Data for Physical AI
        </p>
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
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-accent/40 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:border-accent hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Contact Volumes
        </button>
      </div>
    </section>
  );
}
