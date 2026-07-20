"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RoleStep } from "./RoleStep";
import { DataInterestStep } from "./DataInterestStep";
import { InvestorStep } from "./InvestorStep";
import type { InquiryRole } from "@/lib/buildMailto";

type Step = "role" | "dataInterest" | "investor";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<InquiryRole | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => dialogRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    previousFocusRef.current?.focus();
    setStep("role");
    setRole(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

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
  }, [open, handleClose]);

  if (!open) return null;

  function chooseRole(nextRole: InquiryRole) {
    setRole(nextRole);
    setStep(nextRole === "Investor" ? "investor" : "dataInterest");
  }

  function backToRole() {
    setStep("role");
    setRole(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        aria-hidden
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        tabIndex={-1}
        className="relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-void p-6 shadow-2xl outline-none sm:p-8"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-ink-muted transition-colors hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
        >
          ✕
        </button>

        {step === "role" && <RoleStep onSelect={chooseRole} />}
        {step === "dataInterest" && role && role !== "Investor" && (
          <DataInterestStep
            role={role}
            onBack={backToRole}
            onClose={handleClose}
          />
        )}
        {step === "investor" && (
          <InvestorStep onBack={backToRole} onClose={handleClose} />
        )}
      </div>
    </div>
  );
}
