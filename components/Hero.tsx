"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { HeroVideo } from "./HeroVideo";
import { GradualSpacing } from "@/components/ui/gradual-spacing";
import { ChromeButton } from "@/components/ui/ChromeButton";
import type { InquiryRole } from "@/lib/buildMailto";

const ROLES: InquiryRole[] = ["Buyer", "Seller", "Investor"];
const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

const COARSE_POINTER_QUERY = "(pointer: coarse)";

function subscribeCoarsePointer(callback: () => void) {
  const query = window.matchMedia(COARSE_POINTER_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function Hero({
  infoOpen,
  videoPaused,
  onSelectRole,
}: {
  infoOpen: boolean;
  videoPaused: boolean;
  onSelectRole: (role: InquiryRole) => void;
}) {
  const reducedMotion = useReducedMotion();

  // Mouse parallax: video drifts with the pointer, content counters it.
  // Skipped entirely on touch devices and under reduced motion.
  const coarsePointer = useSyncExternalStore(
    subscribeCoarsePointer,
    () => window.matchMedia(COARSE_POINTER_QUERY).matches,
    () => true,
  );
  const parallaxOn = !reducedMotion && !coarsePointer;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const videoX = useTransform(sx, (v) => v * 16);
  const videoY = useTransform(sy, (v) => v * 16);
  const contentX = useTransform(sx, (v) => v * -6);
  const contentY = useTransform(sy, (v) => v * -6);

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set(event.clientX / rect.width - 0.5);
    my.set(event.clientY / rect.height - 0.5);
  }

  return (
    <section
      onPointerMove={parallaxOn ? handlePointerMove : undefined}
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 will-change-transform"
        style={
          parallaxOn ? { x: videoX, y: videoY, scale: 1.04 } : undefined
        }
      >
        <HeroVideo paused={videoPaused} />
      </motion.div>
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
      <div
        aria-hidden
        className="film-grain pointer-events-none absolute inset-0 z-[1] opacity-[0.05]"
      />

      {/* First-load: the scene develops out of black instead of popping in. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-black"
        initial={{ opacity: reducedMotion ? 0 : 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      {/*
        This wrapper's size is driven only by the logo, since the info
        overlay below is `absolute` and removed from flow. That keeps the
        logo perfectly still when the overlay opens/closes.
      */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        style={parallaxOn ? { x: contentX, y: contentY } : undefined}
      >
        <motion.h1
          initial={
            reducedMotion
              ? false
              : { opacity: 0, scale: 1.05, filter: "blur(14px)" }
          }
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.3, delay: 0.15, ease: EASE_OUT_QUINT }}
        >
          <Image
            src="/volumes-lockup.png"
            alt="Volumes"
            width={1600}
            height={847}
            priority
            className="w-72 sm:w-[420px] md:w-[520px]"
          />
        </motion.h1>

        {infoOpen && (
          <div className="absolute top-full mt-6 flex w-[calc(100vw-3rem)] max-w-md flex-col items-center gap-5 sm:mt-8">
            {/* Step 1 — tagline letters spread in one by one */}
            <GradualSpacing
              text="Data for Physical AI"
              className="font-mono text-sm font-medium uppercase text-ink-primary sm:text-base"
            />

            {/* Step 2 — role buttons pop in together once the tagline lands */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 1.15, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              {ROLES.map((role) => (
                <ChromeButton
                  key={role}
                  onClick={(event) => {
                    // Clicking a button doesn't reliably focus it in every
                    // browser (notably Safari), and ContactModal restores
                    // focus here on close — force it so restore has a target.
                    event.currentTarget.focus();
                    onSelectRole(role);
                  }}
                >
                  {role}
                </ChromeButton>
              ))}
            </motion.div>

            {/* Step 3 — blurb fades in last */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.6, ease: "easeOut" }}
              className="max-w-xs text-sm text-ink-body"
            >
              Volumes buys and sells data for physical AI.
            </motion.p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
