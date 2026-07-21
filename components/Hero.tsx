"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { HeroVideo } from "./HeroVideo";
import { ChromeButton } from "@/components/ui/ChromeButton";
import { GradualSpacing } from "@/components/ui/gradual-spacing";

type ContactRole = "Buyer" | "Seller";

const PILL_ROLES: ContactRole[] = ["Buyer", "Seller"];
const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

export function Hero({
  videoPaused,
  onSelectRole,
}: {
  videoPaused: boolean;
  onSelectRole: (role: ContactRole) => void;
}) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll trigger, measured against this section's own scroll range so it
  // fires on any viewport height (mobile included). Crossing the threshold
  // plays the staged reveal: tagline letters, then the buttons together.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const [revealed, setRevealed] = useState(false);
  const [groupShift, setGroupShift] = useState(-60);
  const revealBlockRef = useRef<HTMLDivElement>(null);
  // The logo group rises by half the revealed block's real height (plus its
  // top margin) so the combined center of mass stays in the vertical middle
  // of the viewport on any screen size.
  function measureGroupShift() {
    const block = revealBlockRef.current;
    if (!block) return;
    const marginTop = window.innerWidth >= 640 ? 32 : 24;
    setGroupShift(-((block.offsetHeight + marginTop) / 2));
  }

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    // hysteresis so the reveal doesn't flicker right at the threshold
    const on = revealed ? progress > 0.28 : progress > 0.38;
    if (on && !revealed) measureGroupShift();
    if (on !== revealed) setRevealed(on);
  });

  // Re-measure when the window changes size (e.g. entering macOS fullscreen)
  // — the revealed block's height shifts across breakpoints and button
  // wrapping, and a stale shift leaves the ensemble off-center.
  useEffect(() => {
    if (!revealed) return;
    const onResize = () => measureGroupShift();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [revealed]);

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
        {/*
          The shift always applies when revealed — MotionConfig's
          reducedMotion handling makes it instant rather than animated for
          reduced-motion users, so the layout stays centered for everyone.
        */}
        <motion.div
          animate={{ y: revealed ? groupShift : 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_QUINT }}
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
            {/*
              unoptimized: ship the lossless PNG as-is. The optimizer's lossy
              WebP re-encode + downscale was softening the chrome edges; the
              asset is already exactly 2x the largest rendered size.
            */}
            <Image
              src="/volumes-mark-clean.png"
              alt=""
              aria-hidden
              width={416}
              height={504}
              priority
              unoptimized
              className="w-36 sm:w-44 md:w-52 [filter:drop-shadow(0_0_24px_rgba(228,233,240,0.3))]"
            />
            <span
              className="mt-6 bg-clip-text font-body text-[2rem] font-normal uppercase leading-none text-transparent sm:mt-8 sm:text-[2.9rem] md:text-[3.5rem]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #fdfdfe 0%, #e9ecef 30%, #bdc4ca 55%, #8b939b 72%, #d6dbdf 90%, #f2f4f6 100%)",
                letterSpacing: "0.32em",
                marginRight: "-0.32em",
                filter: "drop-shadow(0 0 17px rgba(226,231,238,0.35))",
              }}
            >
              Volumes
            </span>
          </motion.h1>

          {/*
            Bottom text — hidden on load, revealed by scrolling. The block
            stays mounted (invisible) so its height can be measured for the
            center-of-mass shift; the tagline slot reserves one line so the
            measurement doesn't change when the letters mount.
          */}
          <div
            ref={revealBlockRef}
            className="absolute top-full mt-6 flex w-[calc(100vw-3rem)] max-w-md flex-col items-center gap-5 sm:mt-8"
          >
            {/* Step 1 — tagline letters spread in one by one */}
            <div className="flex h-5 items-center justify-center sm:h-6">
              {revealed && (
                <GradualSpacing
                  text="Data for Physical AI"
                  className="font-mono text-sm font-medium uppercase text-ink-primary sm:text-base"
                />
              )}
            </div>

            {/* Step 2 — Buyer/Seller pills pop in together once the tagline lands */}
            <motion.div
              initial={false}
              animate={
                revealed
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.85 }
              }
              transition={
                revealed
                  ? { duration: 0.35, delay: 1.1, ease: "easeOut" }
                  : { duration: 0.2 }
              }
              className={`flex flex-wrap items-center justify-center gap-3 ${
                revealed ? "" : "pointer-events-none"
              }`}
            >
              {PILL_ROLES.map((role) => (
                <ChromeButton
                  key={role}
                  tabIndex={revealed ? undefined : -1}
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

            {/* Step 3 — the Investor link rises in on its own, a beat later */}
            <motion.div
              initial={false}
              animate={
                revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
              }
              transition={
                revealed
                  ? { duration: 0.45, delay: 1.5, ease: "easeOut" }
                  : { duration: 0.2 }
              }
              className={revealed ? "" : "pointer-events-none"}
            >
              <Link
                href="/investors"
                tabIndex={revealed ? undefined : -1}
                className="focus-ring cursor-pointer font-mono text-xs uppercase tracking-[0.2em] text-ink-primary underline decoration-ink-primary/60 underline-offset-4 transition-colors hover:decoration-ink-primary"
              >
                Investor
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
