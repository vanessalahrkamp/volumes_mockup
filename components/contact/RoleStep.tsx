import type { InquiryRole } from "@/lib/buildMailto";

const ROLES: InquiryRole[] = ["Buyer", "Seller", "Investor"];

export function RoleStep({
  onSelect,
}: {
  onSelect: (role: InquiryRole) => void;
}) {
  return (
    <div>
      <h2
        id="contact-modal-title"
        className="font-display text-xl font-semibold text-ink-primary"
      >
        Who are you?
      </h2>
      <div className="mt-6 flex flex-col gap-3">
        {ROLES.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => onSelect(role)}
            className="rounded-lg border border-white/10 px-4 py-3 text-left font-body text-ink-body transition-colors hover:border-accent-teal/50 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
