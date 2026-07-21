import type { Metadata } from "next";
import { InvestorPortal } from "@/components/investor/InvestorPortal";

export const metadata: Metadata = {
  title: "Investor Access — Volumes",
  description: "Private investor access for Volumes.",
  robots: { index: false },
};

export default function InvestorsPage() {
  return <InvestorPortal />;
}
