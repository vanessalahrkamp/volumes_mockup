"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ContactModal } from "@/components/contact/ContactModal";

export default function Home() {
  const [isContactOpen, setContactOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <Hero onOpenContact={() => setContactOpen(true)} />
      <Footer />
      <ContactModal
        open={isContactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}
