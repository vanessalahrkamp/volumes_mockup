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
