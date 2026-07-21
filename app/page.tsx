"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { Hero } from "@/components/Hero";
import { ContactModal } from "@/components/contact/ContactModal";
import type { InquiryRole } from "@/lib/buildMailto";

export default function Home() {
  const [activeRole, setActiveRole] = useState<InquiryRole | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative w-full">
        <Hero
          videoPaused={activeRole !== null}
          onSelectRole={setActiveRole}
        />
        <AnimatePresence>
          {activeRole && (
            <ContactModal
              key="contact-modal"
              role={activeRole}
              onClose={() => setActiveRole(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
