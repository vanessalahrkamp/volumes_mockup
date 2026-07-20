export type InquiryRole = "Buyer" | "Seller" | "Investor";

export type MailtoInput = {
  role: InquiryRole;
  name: string;
  email: string;
  company?: string;
  message?: string;
  dataTypes?: string[];
  investorLead?: boolean;
};

const RECIPIENT = "Hello@volumes.cloud";

export function buildMailto({
  role,
  name,
  email,
  company,
  message,
  dataTypes,
  investorLead,
}: MailtoInput): string {
  const subject = `New ${role} inquiry — ${name}`;

  const lines = [
    `Role: ${role}`,
    ...(dataTypes && dataTypes.length > 0
      ? [`Data types: ${dataTypes.join(", ")}`]
      : []),
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "—"}`,
    `Message: ${message || "—"}`,
    ...(investorLead ? ["Notes: Investor-interest lead (not yet an investor)"] : []),
  ];

  const body = lines.join("\n");

  return `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
