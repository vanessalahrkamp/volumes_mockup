"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { HeroVideo } from "./HeroVideo";
import { ChromeButton } from "@/components/ui/ChromeButton";
import type { InquiryRole } from "@/lib/buildMailto";

const ROLES: InquiryRole[] = ["Buyer", "Seller", "Investor"];
const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

export function Hero({
  videoPaused,
  onSelectRole,
}: {
  videoPaused: boolean;
  onSelectRole: (role: InquiryRole) => void;
}) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven reveal, measured against this section's own scroll range
  // so it completes on any viewport height (mobile included).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const reveal = useTransform(scrollYProgress, [0.08, 0.85], [0, 1]);
  const textOpacity = useTransform(reveal, [0, 1], [0, 1]);
  const textY = useTransform(reveal, [0, 1], reducedMotion ? [0, 0] : [24, 0]);
  // The logo group rises by half the revealed block's real height (plus its
  // top margin) so the combined center of mass stays in the vertical middle
  // of the viewport on any screen size.
  const revealBlockRef = useRef<HTMLDivElement>(null);
  const groupY = useTransform(reveal, (v) => {
    if (reducedMotion || typeof window === "undefined") return 0;
    const blockHeight = revealBlockRef.current?.offsetHeight ?? 96;
    const marginTop = window.innerWidth >= 640 ? 32 : 24;
    return v * -((blockHeight + marginTop) / 2);
  });
  // Nothing invisible should be clickable before the reveal.
  const textPointerEvents = useTransform(reveal, (v) =>
    v > 0.4 ? "auto" : "none",
  );

  return (
    <section ref={sectionRef} className="relative h-[150vh]">
      {/* Fixed background — completely still while content scrolls over it */}
      <div aria-hidden className="fixed inset-0">
        <HeroVideo paused={videoPaused} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 42% 38% at 50% 40%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.08) 60%, transparent 80%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 95% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0.42) 100%)",
          }}
        />
        <div className="film-grain pointer-events-none absolute inset-0 opacity-[0.05]" />
      </div>

      {/* First-load: the scene develops out of black instead of popping in. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2] bg-black"
        initial={{ opacity: reducedMotion ? 0 : 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      <div className="sticky top-0 flex h-dvh items-center justify-center px-6 text-center">
        {/*
          The wrapper's size is driven only by the logo — the reveal block
          below is `absolute` and out of flow — so groupY is the single
          source of vertical motion for the whole ensemble.
        */}
        <motion.div
          style={{ y: groupY }}
          className="relative z-10 flex flex-col items-center"
        >
          <motion.h1
            initial={
              reducedMotion
                ? false
                : { opacity: 0, scale: 1.05, filter: "blur(14px)" }
            }
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.3, delay: 0.15, ease: EASE_OUT_QUINT }}
            className="flex flex-col items-center"
          >
            <Image
              src="/volumes-mark-chrome.png"
              alt=""
              aria-hidden
              width={753}
              height={910}
              priority
              className="w-36 sm:w-44 md:w-52 [filter:drop-shadow(0_0_22px_rgba(228,233,240,0.28))]"
            />
            <span
              className="mt-6 bg-clip-text font-body text-[2rem] font-light uppercase leading-none text-transparent sm:mt-8 sm:text-[2.9rem] md:text-[3.5rem]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #fdfdfe 0%, #e9ecef 30%, #bdc4ca 55%, #8b939b 72%, #d6dbdf 90%, #f2f4f6 100%)",
                letterSpacing: "0.32em",
                marginRight: "-0.32em",
                filter: "drop-shadow(0 0 14px rgba(226,231,238,0.3))",
              }}
            >
              Volumes
            </span>
          </motion.h1>

          {/* Bottom text — hidden on load, revealed by scrolling */}
          <motion.div
            ref={revealBlockRef}
            style={{ opacity: textOpacity, y: textY, pointerEvents: textPointerEvents }}
            className="absolute top-full mt-6 flex w-[calc(100vw-3rem)] max-w-md flex-col items-center gap-5 sm:mt-8"
          >
            <p className="font-mono text-sm font-medium uppercase tracking-[0.25em] text-ink-primary sm:text-base">
              Data for Physical AI
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
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
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
