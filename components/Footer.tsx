"use client";

import { AnimatePresence, motion } from "framer-motion";

export function Footer({
  infoOpen,
  onToggleInfo,
  onGoHome,
}: {
  infoOpen: boolean;
  onToggleInfo: () => void;
  onGoHome: () => void;
}) {
  const label = infoOpen ? "Home" : "Info";

  return (
    <footer className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-6 pb-8 sm:px-10 sm:pb-10">
      {/* p-3/-m-3 keeps the visual position but gives a 44px hit area */}
      <button
        type="button"
        onClick={infoOpen ? onGoHome : onToggleInfo}
        className="focus-ring -m-3 cursor-pointer p-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-body transition-colors hover:text-ink-primary"
      >
        <span className="chrome-underline block">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="block"
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    </footer>
  );
}
