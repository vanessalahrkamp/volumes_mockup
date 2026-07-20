"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ContactModal } from "@/components/contact/ContactModal";
import type { InquiryRole } from "@/lib/buildMailto";

export default function Home() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<InquiryRole | null>(null);

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <Hero
        infoOpen={infoOpen}
        onSelectRole={setActiveRole}
        onGoHome={() => setInfoOpen(false)}
      />
      <Footer infoOpen={infoOpen} onToggleInfo={() => setInfoOpen(true)} />
      {activeRole && (
        <ContactModal role={activeRole} onClose={() => setActiveRole(null)} />
      )}
    </div>
  );
}
