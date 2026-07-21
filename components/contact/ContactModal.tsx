"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DataInterestStep } from "./DataInterestStep";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

export function ContactModal({
  role,
  onClose,
}: {
  role: "Buyer" | "Seller";
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => dialogRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = useCallback(() => {
    previousFocusRef.current?.focus();
    onClose();
  }, [onClose]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={handleClose}
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.96, y: 12, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        exit={{
          opacity: 0,
          scale: 0.97,
          y: 8,
          filter: "blur(4px)",
          transition: { duration: 0.18 },
        }}
        transition={{ duration: 0.3, ease: EASE_OUT_QUINT }}
        className="glass-panel shadow-glass relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl p-6 outline-none sm:p-8"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="focus-ring absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white/5 hover:text-ink-primary"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M3 3l10 10M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <DataInterestStep role={role} onClose={handleClose} />
      </motion.div>
    </div>
  );
}
