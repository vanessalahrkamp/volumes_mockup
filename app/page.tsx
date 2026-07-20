"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ContactModal } from "@/components/contact/ContactModal";
import type { InquiryRole } from "@/lib/buildMailto";

export default function Home() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<InquiryRole | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative h-dvh w-full overflow-hidden">
        <Hero
          infoOpen={infoOpen}
          videoPaused={activeRole !== null}
          onSelectRole={setActiveRole}
        />
        <Footer
          infoOpen={infoOpen}
          onToggleInfo={() => setInfoOpen(true)}
          onGoHome={() => setInfoOpen(false)}
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
      </div>
    </MotionConfig>
  );
}
