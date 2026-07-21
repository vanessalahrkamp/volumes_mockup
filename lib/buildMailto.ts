// Contact submissions are sent via /api/contact (Resend). This module now
// only carries the shared role type; the old mailto builder is gone.
export type InquiryRole = "Buyer" | "Seller" | "Investor";
